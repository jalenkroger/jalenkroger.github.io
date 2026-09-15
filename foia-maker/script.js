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
  return ymd(new Date()) > req.deadline ? "overdue" : "awaiting";
}

function calendarDaysBetween(fromIso, toIso) {
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
function deadlineInstant(iso) {
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
  const span = Math.max(0, now - deadlineInstant(deadlineIso));
  const secs = Math.floor(span / 1000);
  return {
    days: Math.floor(secs / 86400),
    hrs: Math.floor((secs % 86400) / 3600),
    mins: Math.floor((secs % 3600) / 60),
    secs: secs % 60,
  };
}

const RING_R = 58;
const RING_C = 2 * Math.PI * RING_R;

function clockMarkup(req, status) {
  /* data-state records what this card was RENDERED as. Only an "await" card that
     crosses its deadline mid-tick needs a re-render; an already-overdue card must
     not ask for one every second. */
  const state = TERMINAL.includes(status) ? "done" : status === "overdue" ? "over" : "await";
  return `
    <div class="clock" data-deadline="${req.deadline}" data-sent="${req.dateSent}"
         data-state="${state}" aria-hidden="true">
      <div class="clock-dial">
        <svg viewBox="0 0 132 132">
          <circle class="clock-track" cx="66" cy="66" r="${RING_R}"></circle>
          <circle class="clock-prog" cx="66" cy="66" r="${RING_R}"
                  stroke-dasharray="${RING_C.toFixed(1)}" stroke-dashoffset="0"></circle>
          <line class="clock-sweep" x1="66" y1="66" x2="118" y2="66"
                transform="rotate(0 66 66)"></line>
        </svg>
        <div class="clock-face">
          <span class="clock-num">&mdash;</span>
          <span class="clock-unit"></span>
        </div>
      </div>
      <div class="clock-time"></div>
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
        badge = `<span class="badge ok">Due in ${days} day${days === 1 ? "" : "s"}</span>`;
        cardClass = "is-await";
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
          <p class="meta">Sent ${longDate(req.dateSent)} &middot; due ${longDate(req.deadline)}</p>
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
    })
    .join("");

  startClocks();
}

/* ---------- the live clock ----------
   One module-level interval for every card. Ticks mutate only the clock's own
   nodes — never the card's innerHTML — so an open draft letter and the page
   scroll position survive each second. */

let clockTimer = null;
let flipping = false;

function stopClocks() {
  if (clockTimer !== null) {
    clearInterval(clockTimer);
    clockTimer = null;
  }
}

function startClocks() {
  stopClocks();
  if (!document.querySelectorAll(".clock:not([data-state='done'])").length) return;
  tickClocks();
  clockTimer = setInterval(tickClocks, 1000);
}

function pad(n) {
  return String(n).padStart(2, "0");
}

function tickClocks() {
  const nodes = document.querySelectorAll(".clock");
  if (!nodes.length) {
    stopClocks();
    return;
  }

  let needsFlip = false;
  const now = new Date();

  for (const node of nodes) {
    if (updateClock(node, now) === "expired") needsFlip = true;
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

function updateClock(node, now) {
  const numEl = node.querySelector(".clock-num");
  const unitEl = node.querySelector(".clock-unit");
  const timeEl = node.querySelector(".clock-time");
  const capEl = node.querySelector(".clock-cap");
  const prog = node.querySelector(".clock-prog");
  const sweep = node.querySelector(".clock-sweep");

  if (node.dataset.state === "done") {
    numEl.innerHTML = "&#10003;";
    unitEl.textContent = "closed";
    timeEl.textContent = "";
    capEl.textContent = "no clock running";
    prog.setAttribute("stroke-dashoffset", "0");
    sweep.style.display = "none";
    return "done";
  }

  const target = deadlineInstant(node.dataset.deadline);
  const windowStart = dayStart(node.dataset.sent);
  const ms = target - now;
  const overdue = ms <= 0;
  const span = Math.abs(ms);

  const secs = Math.floor(span / 1000);
  const days = Math.floor(secs / 86400);
  const hrs = Math.floor((secs % 86400) / 3600);
  const mins = Math.floor((secs % 3600) / 60);
  const rem = secs % 60;

  if (overdue) {
    if (days >= 1) {
      numEl.textContent = days;
      unitEl.textContent = days === 1 ? "day over" : "days over";
    } else {
      numEl.textContent = hrs;
      unitEl.textContent = hrs === 1 ? "hour over" : "hours over";
    }
    capEl.textContent = "since the deadline";
    prog.setAttribute("stroke-dashoffset", "0");
  } else {
    if (days >= 1) {
      numEl.textContent = days;
      unitEl.textContent = days === 1 ? "day left" : "days left";
    } else {
      numEl.textContent = hrs;
      unitEl.textContent = hrs === 1 ? "hour left" : "hours left";
    }
    capEl.textContent = "until the end of the due date";

    const total = target - windowStart;
    const fracLeft = total > 0 ? Math.max(0, Math.min(1, ms / total)) : 0;
    prog.setAttribute("stroke-dashoffset", (RING_C * (1 - fracLeft)).toFixed(1));
  }

  timeEl.innerHTML =
    `${pad(hrs)}:${pad(mins)}<span class="clock-sec">:${pad(rem)}</span>`;

  sweep.setAttribute("transform", `rotate(${rem * 6} 66 66)`);

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
