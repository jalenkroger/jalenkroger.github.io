/* App logic: build the letter, compute the deadline, track the clock. */

const STORAGE_KEY = "foia-maker.requests";
const el = (id) => document.getElementById(id);

/* ---------- storage ---------- */

function loadRequests() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveRequests(list) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    return false;
  }
}

/* ---------- status ---------- */

const TERMINAL = ["fulfilled", "denied", "estimate-received"];

function derivedStatus(req) {
  if (TERMINAL.includes(req.status)) return req.status;
  if (!isIsoDate(req.deadline)) return "undated";
  return ymd(new Date()) > req.deadline ? "overdue" : "awaiting";
}

function calendarDaysBetween(fromIso, toIso) {
  if (!isIsoDate(fromIso) || !isIsoDate(toIso)) return null;
  const [y1, m1, d1] = fromIso.split("-").map(Number);
  const [y2, m2, d2] = toIso.split("-").map(Number);
  const a = new Date(y1, m1 - 1, d1);
  const b = new Date(y2, m2 - 1, d2);
  return Math.round((b - a) / 86400000);
}

/* ---------- form ---------- */

function populateAgencies() {
  const sel = el("agency");
  for (const a of AGENCIES) {
    const opt = document.createElement("option");
    opt.value = a.id;
    opt.textContent = a.name;
    sel.appendChild(opt);
  }
}

function readForm() {
  const agencyId = el("agency").value;
  const dateSent = el("date-sent").value || ymd(new Date());
  const agency = agencyById(agencyId);
  const [y, m, d] = dateSent.split("-").map(Number);
  const { deadline, skipped } = businessDaysFrom(
    new Date(y, m - 1, d),
    4,
    (agency && agency.extraClosedDates) || [],
  );

  return {
    agencyId,
    agencyNameOverride: el("agency-name").value.trim() || null,
    agencyAddressOverride: el("agency-address").value.trim() || null,
    description: el("description").value.trim(),
    dateRange: el("date-range").value.trim() || null,
    formatPreference: el("format-pref").value.trim() || null,
    feeCeiling: el("fee-ceiling").value.trim() || null,
    feeWaiverRequested: el("fee-waiver").checked,
    requester: {
      name: el("req-name").value.trim(),
      org: el("req-org").value.trim(),
      email: el("req-email").value.trim(),
      phone: el("req-phone").value.trim(),
      address: el("req-address").value.trim(),
    },
    dateSent,
    deadline: ymd(deadline),
    skipped,
    status: "awaiting",
    history: [],
  };
}

function renderAgencyInfo(req) {
  const agency = agencyById(req.agencyId);
  const box = el("agency-info");
  el("agency-override").hidden = !(agency.id === "other" || !agency.address);

  const bits = [];

  if (agency.caution) {
    bits.push(`<p class="caution"><strong>Careful:</strong> ${agency.caution}</p>`);
  }

  const contact = [];
  if (agency.contactRole) contact.push(`<li>${agency.contactRole}</li>`);
  if (agency.contactName) {
    contact.push(`<li>${agency.contactName} <span class="asof">(as of ${agency.verifiedOn})</span></li>`);
  }
  if (agency.address) contact.push(`<li>${agency.address}</li>`);
  if (agency.email) contact.push(`<li>${agency.email}</li>`);
  if (agency.phone) contact.push(`<li>${agency.phone}</li>`);
  if (contact.length) bits.push(`<ul class="contact">${contact.join("")}</ul>`);

  const missing = missingContactFields(agency);
  if (missing.length && agency.id !== "other") {
    const src = agency.sourceUrl
      ? ` Start at <a href="${agency.sourceUrl}" target="_blank" rel="noopener">${agency.sourceUrl}</a>.`
      : "";
    bits.push(
      `<p class="missing"><strong>Look this up before sending:</strong> ` +
        `${missing.join(", ")} not confirmed from an official source.${src}</p>`,
    );
  }

  if (agency.portalUrl) {
    bits.push(
      `<p><a href="${agency.portalUrl}" target="_blank" rel="noopener">This body has its own ` +
        `request page or portal &rarr;</a> Using it may be faster than mailing a letter.</p>`,
    );
  }

  if (agency.notes) bits.push(`<p>${agency.notes}</p>`);

  if (agency.likelyExemptions.length) {
    const names = agency.likelyExemptions
      .map(exemptionBySub)
      .filter(Boolean)
      .map((e) => `<li><strong>&sect;&nbsp;84-712.05(${e.sub}) ${e.label}.</strong> ${e.plain}</li>`);
    bits.push(
      `<details><summary>Exemptions this body is most likely to cite (${names.length})</summary>` +
        `<ul>${names.join("")}</ul></details>`,
    );
  }

  box.innerHTML = bits.join("");
}

function renderDeadline(req) {
  const skipped = req.skipped.length
    ? `<details><summary>Why that date &mdash; ${req.skipped.length} day(s) didn't count</summary><ul>` +
      req.skipped.map((s) => `<li>${s.date} &mdash; ${s.reason}</li>`).join("") +
      `</ul></details>`
    : "";
  el("deadline-box").innerHTML =
    `<span class="dl-label">Response due &mdash; estimate</span>` +
    `<strong class="dl-date">${longDate(req.deadline)}</strong>` +
    `<p class="hint">Four business days from receipt, per &sect;&nbsp;84-712(4). The day you ` +
    `send does not count.</p>` +
    skipped;
}

function render() {
  const req = readForm();
  renderAgencyInfo(req);
  renderDeadline(req);
  el("letter").value = TEMPLATES.initial(req);
  return req;
}

/* ---------- output actions ---------- */

function download(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function setHint(msg) {
  el("save-hint").textContent = msg;
}

/* ---------- tracker ---------- */

/* The deadline is a date, not a timestamp. § 84-712(4) counts whole business days,
   and statutes.js resolves genuine ambiguity toward "closed" — later, never earlier.
   Applied to time-of-day that puts the target at the very end of the deadline date,
   so the clock reaching zero coincides exactly with derivedStatus() flipping to
   overdue at midnight. Anything earlier (close of business, say) would resolve the
   other way and contradict the rule. */
function isIsoDate(v) {
  return typeof v === "string" && /^\d{4}-\d{2}-\d{2}$/.test(v);
}

function deadlineInstant(iso) {
  if (!isIsoDate(iso)) return null;
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d + 1, 0, 0, 0, 0); // midnight ending the deadline day
}

function dayStart(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d, 0, 0, 0, 0);
}

/* Single source of truth for "how overdue is this". Measured from the expiry
   instant the clock counts down to, so the badge and the clock can never
   disagree — two different numbers on one card would undermine both. */
function overdueParts(deadlineIso, now) {
  const target = deadlineInstant(deadlineIso);
  if (!target) return { days: 0, hrs: 0, mins: 0, secs: 0 };
  const span = Math.max(0, now - target);
  const secs = Math.floor(span / 1000);
  return {
    days: Math.floor(secs / 86400),
    hrs: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
  };
}

/* The board reads DD HH MM SS. Each cell is a split flap: two static halves
   plus two leaves that rotate on a change. Only a digit that actually turns
   animates, so the seconds tick alone for most of a minute. */
const FC_GROUPS = [
  { key: "days", label: "Days" },
  { key: "hrs", label: "Hrs" },
  { key: "mins", label: "Min" },
  { key: "secs", label: "Sec" },
];

function fcCell() {
  return `
          <div class="fc-d">
            <div class="fc-h fc-up"><div class="fc-g">0</div></div>
            <div class="fc-h fc-dn"><div class="fc-g">0</div></div>
            <div class="fc-l fc-lt"><div class="fc-g">0</div></div>
            <div class="fc-l fc-lb"><div class="fc-g">0</div></div>
          </div>`;
}

function clockMarkup(req, status) {
  /* data-state records what this card was RENDERED as. Only an "await" card that
     crosses its deadline mid-tick needs a re-render; an already-overdue card must
     not ask for one every second. */
  const state = TERMINAL.includes(status) ? "done" : status === "overdue" ? "over" : "await";
  const groups = FC_GROUPS.map(
    (g) => `
        <div class="fc-grp">
          <div class="fc-cells" data-unit="${g.key}">${fcCell()}${fcCell()}</div>
          <div class="fc-lbl">${g.label}</div>
        </div>`,
  ).join("");

  /* aria-hidden: the badge already states the same thing in words, so a screen
     reader gets the status without a per-second stream of digits. */
  return `
    <div class="clock-wrap">
      <div class="clock" data-deadline="${req.deadline}" data-sent="${req.dateSent}"
           data-state="${state}" aria-hidden="true">${groups}
      </div>
      <div class="clock-cap"></div>
    </div>`;
}

function renderTracker() {
  stopClocks();

  const list = loadRequests();
  el("track-count").textContent = list.length ? `(${list.length})` : "";
  const box = el("tracker-list");

  if (!list.length) {
    box.innerHTML = `<p class="hint">Nothing tracked yet. Build a request, then choose
      &ldquo;Save &amp; start the clock.&rdquo;</p>`;
    return;
  }

  box.innerHTML = list
    .map((req, i) => {
      try {
        return card(req, i);
      } catch (err) {
        /* One malformed record used to throw here and blank the entire tracker,
           leaving no way to reach the Delete button that would clear it. */
        return `
      <article class="tracked is-done" data-i="${i}">
        <div class="tracked-body">
          <h3>Unreadable request <span class="badge done">Damaged</span></h3>
          <p class="meta">This saved record could not be read. Deleting it will not
            affect the others.</p>
          <div class="actions">
            <button type="button" class="act-danger" data-act="delete" data-i="${i}">Delete</button>
          </div>
        </div>
      </article>`;
      }
    })
    .join("");

  startClocks();
}

function metaLine(req) {
  const sent = isIsoDate(req.dateSent) ? `Sent ${longDate(req.dateSent)}` : "Send date not recorded";
  const due = isIsoDate(req.deadline) ? `due ${longDate(req.deadline)}` : "no due date recorded";
  return `${sent} &middot; ${due}`;
}

function card(req, i) {
  {
      const status = derivedStatus(req);
      const agency = agencyById(req.agencyId);
      const name = req.agencyNameOverride || (agency && agency.name) || "Unknown body";
      const days = calendarDaysBetween(ymd(new Date()), req.deadline);

      let badge, cardClass;
      if (status === "overdue") {
        const over = overdueParts(req.deadline, new Date()).days;
        badge = over >= 1
          ? `<span class="badge over">Overdue by ${over} day${over === 1 ? "" : "s"}</span>`
          : `<span class="badge over">Overdue</span>`;
        cardClass = "is-over";
      } else if (status === "awaiting") {
        badge = days === null
          ? `<span class="badge done">No due date</span>`
          : `<span class="badge ok">Due in ${days} day${days === 1 ? "" : "s"}</span>`;
        cardClass = "is-await";
      } else if (status === "undated") {
        badge = `<span class="badge done">No due date</span>`;
        cardClass = "is-done";
      } else {
        badge = `<span class="badge done">${status.replace("-", " ")}</span>`;
        cardClass = "is-done";
      }

      const canFollowUp = status === "overdue";
      const canPetition = status === "overdue" || status === "denied";

      return `
      <article class="tracked ${cardClass}" data-i="${i}">
        ${clockMarkup(req, status)}
        <div class="tracked-body">
          <h3>${name} ${badge}</h3>
          <p class="meta">${metaLine(req)}</p>
          <p class="desc">${(req.description || "").slice(0, 240)}</p>
          <div class="actions">
            <button type="button" class="act-draft" data-act="followup" data-i="${i}" ${canFollowUp ? "" : "disabled"}>
              Draft follow-up</button>
            <button type="button" class="act-draft" data-act="petition" data-i="${i}" ${canPetition ? "" : "disabled"}>
              Draft AG petition</button>
            <button type="button" class="act-quiet" data-act="denied" data-i="${i}">Mark denied</button>
            <button type="button" class="act-quiet" data-act="fulfilled" data-i="${i}">Mark fulfilled</button>
            <button type="button" class="act-danger" data-act="delete" data-i="${i}">Delete</button>
          </div>
          <textarea class="draft" rows="18" hidden></textarea>
        </div>
      </article>`;
  }
}

/* ---------- the live clock ----------
   One module-level interval for every card. Ticks mutate only the clock's own
   nodes — never the card's innerHTML — so an open draft letter and the page
   scroll position survive each second. */

let clockTimer = null;
let flipping = false;
let parity = 0;

function stopClocks() {
  if (clockTimer !== null) {
    clearInterval(clockTimer);
    clockTimer = null;
  }
}

function startClocks() {
  stopClocks();
  if (!document.querySelectorAll(".clock").length) return;
  tickClocks();   /* paint once — a board of closed requests still needs its zeros */
  if (!document.querySelectorAll(".clock:not([data-state='done'])").length) return;
  clockTimer = setInterval(tickClocks, 1000);
}

function tickClocks() {
  const nodes = document.querySelectorAll(".clock");
  if (!nodes.length) {
    stopClocks();
    return;
  }

  let needsFlip = false;
  const now = new Date();
  parity = parity ? 0 : 1;

  for (const node of nodes) {
    if (updateClock(node, now, parity) === "expired") needsFlip = true;
  }

  /* A request that runs out while the user is watching: re-render once so the
     badge and the follow-up button catch up. Guarded so it cannot loop. */
  if (needsFlip && !flipping) {
    flipping = true;
    setTimeout(() => {
      try {
        renderTracker();
      } finally {
        flipping = false;   /* never leave the flip latched if a render throws */
      }
    }, 0);
  }
}

function setCell(cell, ch, parity) {
  const shown = cell.dataset.v;
  const lt = cell.querySelector(".fc-lt");
  const lb = cell.querySelector(".fc-lb");

  if (shown === ch) {
    /* Settle: park both leaves on the current digit so nothing stale shows
       once the previous flip's fill-mode is released. */
    lt.style.animationName = "none";
    lb.style.animationName = "none";
    cell.querySelector(".fc-dn .fc-g").textContent = ch;
    lt.querySelector(".fc-g").textContent = ch;
    return;
  }

  const prev = shown === undefined ? ch : shown;
  cell.querySelector(".fc-up .fc-g").textContent = ch;    /* new top, revealed */
  cell.querySelector(".fc-dn .fc-g").textContent = prev;  /* old bottom, covered */
  lt.querySelector(".fc-g").textContent = prev;           /* old top, falls away */
  lb.querySelector(".fc-g").textContent = ch;             /* new bottom, drops in */

  /* Alternating names are what restarts the animation on every change. */
  lt.style.animationName = parity ? "fdA" : "fdB";
  lb.style.animationName = parity ? "fuA" : "fuB";
  cell.dataset.v = ch;
}

function setGroup(node, key, value, parity) {
  const cells = node.querySelector(`.fc-cells[data-unit="${key}"]`).children;
  const pair = String(Math.min(99, value)).padStart(2, "0");
  setCell(cells[0], pair[0], parity);
  setCell(cells[1], pair[1], parity);
}

function updateClock(node, now, parity) {
  const cap = node.parentElement.querySelector(".clock-cap");

  if (node.dataset.state === "done") {
    for (const g of FC_GROUPS) setGroup(node, g.key, 0, parity);
    cap.textContent = "Closed — no clock running";
    return "done";
  }

  const target = deadlineInstant(node.dataset.deadline);
  if (!target) {
    for (const g of FC_GROUPS) setGroup(node, g.key, 0, parity);
    cap.textContent = "No due date on this record";
    return "running";
  }

  const overdue = target - now <= 0;
  const secs = Math.floor(Math.abs(target - now) / 1000);

  setGroup(node, "days", Math.floor(secs / 86400), parity);
  setGroup(node, "hrs", Math.floor((secs % 86400) / 3600), parity);
  setGroup(node, "mins", Math.floor((secs % 3600) / 60), parity);
  setGroup(node, "secs", secs % 60, parity);

  cap.textContent = overdue ? "Since the deadline" : "Until the end of the due date";

  return overdue && node.dataset.state === "await" ? "expired" : "running";
}

function handleTrackerClick(e) {
  const btn = e.target.closest("button[data-act]");
  if (!btn) return;
  const i = Number(btn.dataset.i);
  const list = loadRequests();
  const req = list[i];
  if (!req) return;

  const card = btn.closest(".tracked");
  const draft = card.querySelector(".draft");

  switch (btn.dataset.act) {
    case "followup":
      draft.value = TEMPLATES.followUp(req);
      draft.hidden = false;
      break;
    case "petition":
      draft.value = TEMPLATES.agPetition(req);
      draft.hidden = false;
      break;
    case "denied":
      req.status = "denied";
      req.history.push({ date: ymd(new Date()), event: "Request denied" });
      saveRequests(list);
      renderTracker();
      break;
    case "fulfilled":
      req.status = "fulfilled";
      req.history.push({ date: ymd(new Date()), event: "Records received" });
      saveRequests(list);
      renderTracker();
      break;
    case "delete":
      if (confirm("Delete this tracked request? This cannot be undone.")) {
        list.splice(i, 1);
        saveRequests(list);
        renderTracker();
      }
      break;
  }
}

/* ---------- wiring ---------- */

function showTab(which) {
  const build = which === "build";
  el("panel-build").hidden = !build;
  el("panel-track").hidden = build;
  el("tab-build").classList.toggle("active", build);
  el("tab-track").classList.toggle("active", !build);
  if (build) stopClocks();     /* nothing to animate while the panel is hidden */
  else renderTracker();        /* which restarts them */
}

function init() {
  populateAgencies();
  el("date-sent").value = ymd(new Date());

  el("dateline-today").textContent =
    "Lincoln, Nebraska \u00b7 " +
    new Date().toLocaleDateString("en-US", {
      weekday: "long", month: "long", day: "numeric", year: "numeric",
    });

  const inputs = [
    "agency", "agency-name", "agency-address", "description", "date-range",
    "format-pref", "fee-ceiling", "fee-waiver", "req-name", "req-org",
    "req-email", "req-phone", "req-address", "date-sent",
  ];
  for (const id of inputs) {
    el(id).addEventListener("input", render);
    el(id).addEventListener("change", render);
  }

  el("btn-copy").addEventListener("click", () => {
    navigator.clipboard.writeText(el("letter").value).then(
      () => setHint("Copied to clipboard."),
      () => setHint("Could not copy — select the text and copy manually."),
    );
  });

  el("btn-download").addEventListener("click", () => {
    download("records-request.txt", el("letter").value);
  });

  el("btn-mail").addEventListener("click", () => {
    const req = readForm();
    const agency = agencyById(req.agencyId);
    const to = (agency && agency.email) || "";
    const subject = "Public records request under Neb. Rev. Stat. § 84-712";
    const href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(el("letter").value)}`;
    window.location.href = href;
    setHint(
      to
        ? "Opening your email client. Check that the whole letter came through — some clients truncate long messages."
        : "No confirmed email for this body, so the To: field is blank. Look up the address before sending.",
    );
  });

  el("btn-save").addEventListener("click", () => {
    const req = render();
    if (!req.description) {
      setHint("Describe the records you want before saving.");
      return;
    }
    req.history.push({ date: req.dateSent, event: "Request sent" });
    const list = loadRequests();
    list.push(req);
    if (saveRequests(list)) {
      setHint(`Saved. Response due ${longDate(req.deadline)}.`);
      el("track-count").textContent = `(${list.length})`;
    } else {
      setHint("Could not save — your browser is blocking site storage.");
    }
  });

  el("btn-export").addEventListener("click", () => {
    download("foia-tracking.json", JSON.stringify(loadRequests(), null, 2));
  });

  el("btn-import").addEventListener("click", () => el("import-file").click());

  el("import-file").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const incoming = JSON.parse(reader.result);
        if (!Array.isArray(incoming)) throw new Error("not an array");
        saveRequests(loadRequests().concat(incoming));
        renderTracker();
      } catch (err) {
        alert("That file could not be read as exported tracking data.");
      }
    };
    reader.readAsText(file);
  });

  el("tab-build").addEventListener("click", () => showTab("build"));
  el("tab-track").addEventListener("click", () => showTab("track"));
  el("tracker-list").addEventListener("click", handleTrackerClick);

  render();
  el("track-count").textContent = loadRequests().length ? `(${loadRequests().length})` : "";
}

document.addEventListener("DOMContentLoaded", init);
