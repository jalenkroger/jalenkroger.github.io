/* The desk cat.
   A silhouette that idles by the Save button and, at a few deliberate moments,
   says one true thing.

   Everything it says is either read out of the verified corpus in statutes.js /
   agencies.js (with the citation attached, so it can be checked) or a mechanical
   observation about the form the user has in front of them. It never generates a
   legal claim, and it never writes into #letter, a .draft, or any template — a
   letter to a records custodian goes out under the user's name, and nothing on
   this page gets to be cute inside it.

   Loaded after script.js: this file only defines window.Cat at parse time, and
   script.js calls into it later from its own handlers. */

(function () {
  "use strict";

  /* ---------- the drawing ----------
     One SVG carrying both poses; CSS shows the one that matches data-pose, so a
     pose change never re-parses markup and never restarts the idle animations. */

  const SVG = `
<svg class="cat-svg" data-pose="sit" viewBox="0 0 120 150" aria-hidden="true" focusable="false">
  <g class="cat-pose cat-pose-sit">
    <path class="cat-tail" d="M88 130 C112 128, 120 104, 112 84"></path>
    <g class="cat-trunk">
      <path class="cat-body" d="M60 44 C40 44, 30 70, 28 100 C26 124, 32 138, 44 138 L76 138 C88 138, 94 124, 92 100 C90 70, 80 44, 60 44 Z"></path>
      <g class="cat-headg">
        <path class="cat-ear cat-ear-l" d="M40 28 L34 4 L58 20 Z"></path>
        <path class="cat-ear cat-ear-r" d="M80 28 L86 4 L62 20 Z"></path>
        <circle class="cat-head" cx="60" cy="42" r="26"></circle>
        <g class="cat-eyes">
          <g class="cat-gaze">
            <ellipse class="cat-eye" cx="50" cy="40" rx="4.5" ry="6"></ellipse>
            <ellipse class="cat-eye" cx="70" cy="40" rx="4.5" ry="6"></ellipse>
          </g>
        </g>
      </g>
    </g>
  </g>
  <g class="cat-pose cat-pose-sleep">
    <path class="cat-tail cat-tail-sleep" d="M92 124 C68 132, 44 130, 36 119"></path>
    <g class="cat-trunk">
      <path class="cat-ear" d="M30 92 L26 72 L45 85 Z"></path>
      <path class="cat-ear" d="M53 85 L61 68 L66 87 Z"></path>
      <path class="cat-body" d="M34 122 C18 122, 12 106, 18 92 C26 74, 48 66, 70 68 C96 70, 112 84, 112 102 C112 114, 104 122, 92 122 Z"></path>
      <circle class="cat-head" cx="43" cy="103" r="20"></circle>
    </g>
    <path class="cat-lid" d="M35 101 C39 106, 47 106, 51 101"></path>
  </g>
</svg>`;

  /* ---------- the corpus ----------
     Leads restate the statutory text they cite; the citation travels with the
     remark so a reporter can check it rather than take the cat's word. */

  const STATUTE_LEADS = {
    deadline:
      "Four business days, counted from actual receipt — not from the day you send it.",
    definition:
      "A record kept in a computer file is still a public record. That is the basis for asking for the native file instead of a scan of a printout.",
    fees:
      "A special service charge is only allowed where the work runs past four cumulative hours, and they owe you an estimate before they charge it.",
    denialContents:
      "A denial has to describe what is being withheld and tie each part to a specific statute and subsection. A one-line refusal does not meet that.",
    remedies:
      "If they refuse, there are two routes: a writ of mandamus in district court, or a petition to the Attorney General.",
    exemptionsGeneral:
      "The exemptions say records “may be withheld,” not “shall.” Withholding is a choice, which means it can be reconsidered.",
    right:
      "Anyone interested in examining public records may do so and make copies. You do not have to be a Nebraskan, or a reporter.",
  };

  function statuteRemarks() {
    const out = [];
    for (const key of Object.keys(STATUTE_LEADS)) {
      const s = typeof STATUTES !== "undefined" && STATUTES[key];
      if (!s) continue;
      out.push({ key: "statute:" + key, text: STATUTE_LEADS[key], cite: s.cite });
    }
    return out;
  }

  /* The exemptions carry their own plain-language gloss, so they are quoted
     rather than paraphrased. */
  function exemptionRemark(sub) {
    const e = typeof exemptionBySub === "function" ? exemptionBySub(sub) : null;
    if (!e || !e.plain) return null;
    return {
      key: "exemption:" + e.sub,
      text: e.label + ". " + e.plain,
      cite: "Neb. Rev. Stat. § 84-712.05(" + e.sub + ")",
    };
  }

  /* ---------- observations about the draft in front of you ---------- */

  function draftNudges(req) {
    const out = [];
    if (!req) return out;

    const desc = (req.description || "").trim();
    if (desc && desc.length < 60) {
      out.push({
        key: "nudge:thin",
        text: "That description is thin. Name the office that holds the records and the window you want — a request that looks cheap to fill is harder to refuse.",
      });
    }
    if (!req.dateRange) {
      out.push({
        key: "nudge:range",
        text: "No date range yet. It is the single easiest way to make a request look cheap to fill.",
      });
    }
    if (!req.formatPreference) {
      out.push({
        key: "nudge:format",
        text: "Name the format you want. Ask for CSV and you are less likely to be handed a PDF of a printout.",
        cite: "Neb. Rev. Stat. § 84-712.01(1)",
      });
    }
    if (!req.feeCeiling) {
      out.push({
        key: "nudge:fee",
        text: "No fee ceiling set. They owe you an estimate before charging for work past four hours; a stated ceiling makes that conversation concrete.",
        cite: "Neb. Rev. Stat. § 84-712(3)",
      });
    }
    if (req.requester && !req.requester.email) {
      out.push({
        key: "nudge:email",
        text: "No email on the request. That is usually the fastest way for a custodian to come back with a question instead of a denial.",
      });
    }
    return out;
  }

  /* ---------- what changed, and is it worth saying out loud ---------- */

  function agencyRemark(agencyId) {
    const agency = typeof agencyById === "function" ? agencyById(agencyId) : null;
    if (!agency) return null;

    if (agency.caution) {
      return { key: "agency:caution:" + agency.id, text: agency.caution };
    }

    if (agency.portalUrl) {
      return {
        key: "agency:portal:" + agency.id,
        text: "This body runs its own request system. Using it is usually faster than mailing a letter, and the statutory clock is the same either way.",
      };
    }

    /* Only worth raising when it would actually block you. A missing street address
       does not matter for a body you can reach by portal or email, and nagging about
       it there would bury the route you should be taking. */
    const missing =
      typeof missingContactFields === "function" ? missingContactFields(agency) : [];
    const blocking = missing.filter((f) => f !== "phone");
    if (blocking.length && !agency.email) {
      return {
        key: "agency:missing:" + agency.id,
        text:
          "No confirmed " +
          blocking.join(" or ") +
          " for this body. Look it up on their own site before you send — a plausible wrong address loses you weeks.",
      };
    }

    const subs = agency.likelyExemptions || [];
    if (subs.length) {
      const r = exemptionRemark(subs[Math.floor(Math.random() * subs.length)]);
      if (r) {
        return {
          key: r.key + ":" + agency.id,
          text: "Expect this one to come up here. " + r.text,
          cite: r.cite,
        };
      }
    }
    return null;
  }

  /* businessDaysFrom() hands back every day it refused to count, with a reason.
     Weekends are not interesting; a holiday is. */
  function holidayRemark(req) {
    if (!req || !Array.isArray(req.skipped)) return null;
    const named = req.skipped.filter(
      (s) => s && s.reason && s.reason !== "Saturday" && s.reason !== "Sunday",
    );
    if (!named.length) return null;

    const first = named[0];
    let text =
      "Your deadline slid — " +
      first.reason +
      " does not count against the four days.";
    if (/arbor/i.test(first.reason)) {
      text += " Nebraska is the only state that closes for it.";
    }
    return { key: "holiday:" + first.date, text: text, cite: "Neb. Rev. Stat. § 62-301" };
  }

  /* ---------- the cat itself ---------- */

  const SPEAK_MS = 12000;

  const Cat = {
    build: null, /* { root, button, bubble, svg } */
    track: null,

    said: new Set(),
    queue: [],
    timer: null,
    lastAgencyId: undefined,
    lastDeadline: undefined,
    lastReq: null,

    /* --- mounting --- */

    mount() {
      this.build = this.makeDock("cat-dock", "sit", true);
      this.track = this.makeDock("cat-dock cat-dock-track", "sleep", false);

      /* The cat perches on a section rule at the top of its panel, where it stays in
         view — the right column is sticky, so anything parked below the letter falls
         off the bottom on a short window. The heading keeps its rule; the cat just
         stands on it, and the bubble drops underneath so nothing reflows sideways. */
      this.perch(document.querySelector("#panel-build .grid .col:last-of-type"), this.build);

      /* Sibling of #tracker-list, never inside it: renderTracker() replaces that
         container's innerHTML wholesale and would take the cat with it. */
      this.perch(document.getElementById("panel-track"), this.track);

      this.refillQueue();
    },

    perch(container, dock) {
      if (!container || !dock) return;
      const heading = container.querySelector("h2");
      if (!heading) return;

      const rail = document.createElement("div");
      rail.className = "cat-rail";
      heading.parentNode.insertBefore(rail, heading);
      rail.appendChild(heading);
      rail.appendChild(dock.fig);

      /* Inside the rail, which is the positioning context: the bubble is taken out
         of flow so a remark never shoves the letter down the page. Only the cat you
         can click ever gets one — the tracker cat is ambient and says nothing. */
      if (dock.bubble) rail.appendChild(dock.bubble);
    },

    makeDock(cls, pose, clickable) {
      const holder = document.createElement(clickable ? "button" : "div");
      holder.className = "cat-fig " + cls;
      if (clickable) {
        holder.type = "button";
        holder.setAttribute("aria-label", "Ask the desk cat");
      } else {
        holder.setAttribute("aria-hidden", "true");
      }
      holder.innerHTML = SVG;

      const svg = holder.querySelector(".cat-svg");
      if (svg) svg.setAttribute("data-pose", pose);

      let bubble = null;
      if (clickable) {
        bubble = document.createElement("p");
        bubble.className = "cat-say";
        bubble.setAttribute("role", "status");
        bubble.setAttribute("aria-live", "polite");
        bubble.hidden = true;
        bubble.addEventListener("click", () => this.hush());
        holder.addEventListener("click", () => this.onClick());
      }
      return { fig: holder, bubble: bubble, svg: svg };
    },

    /* --- speaking --- */

    say(remark) {
      if (!remark || !this.build) return;
      const b = this.build.bubble;

      b.textContent = "";
      const line = document.createElement("span");
      line.className = "cat-say-text";
      line.textContent = remark.text;
      b.appendChild(line);

      if (remark.cite) {
        const cite = document.createElement("span");
        cite.className = "cat-cite";
        cite.textContent = remark.cite;
        b.appendChild(cite);
      }

      b.hidden = false;
      this.said.add(remark.key);

      /* One timer, always replaced, so repeated remarks cannot stack timeouts
         and blank the bubble out from under a later one. */
      if (this.timer) clearTimeout(this.timer);
      this.timer = setTimeout(() => this.hush(), SPEAK_MS);
    },

    hush() {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (this.build) {
        this.build.bubble.hidden = true;
        this.build.bubble.textContent = "";
      }
    },

    refillQueue() {
      const pool = statuteRemarks();
      for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const t = pool[i];
        pool[i] = pool[j];
        pool[j] = t;
      }
      this.queue = pool;
    },

    nextUnsaid(pool) {
      for (const r of pool) {
        if (!this.said.has(r.key)) return r;
      }
      return null;
    },

    /* --- hooks called from script.js --- */

    /* render() runs on every keystroke, so this reacts to transitions only:
       nothing the user types should make the cat talk. */
    onRender(req) {
      this.lastReq = req || null;
      if (!req) return;

      const firstRun = this.lastAgencyId === undefined;
      const agencyChanged = req.agencyId !== this.lastAgencyId;
      const deadlineChanged = req.deadline !== this.lastDeadline;

      this.lastAgencyId = req.agencyId;
      this.lastDeadline = req.deadline;

      if (firstRun) return;

      if (agencyChanged) {
        const r = agencyRemark(req.agencyId);
        if (r && !this.said.has(r.key)) {
          this.say(r);
          return;
        }
      }
      if (deadlineChanged) {
        const r = holidayRemark(req);
        if (r && !this.said.has(r.key)) this.say(r);
      }
    },

    onSave(req) {
      const nudge = this.nextUnsaid(draftNudges(req));
      if (nudge) {
        this.say(nudge);
        return;
      }
      this.say({
        key: "saved:" + Date.now(),
        text: "Saved, and the clock is running. It starts on receipt, not on send — if this goes by mail, the four days begin when it lands.",
        cite: "Neb. Rev. Stat. § 84-712(4)",
      });
    },

    onClick() {
      const nudge = this.nextUnsaid(draftNudges(this.lastReq));
      if (nudge) {
        this.say(nudge);
        return;
      }
      let fact = this.nextUnsaid(this.queue);
      if (!fact) {
        this.said.clear();
        this.refillQueue();
        fact = this.queue[0];
      }
      if (fact) this.say(fact);
    },

    onTab(which) {
      if (which !== "build") this.hush();
    },

    /* The clock tick is not a reliable heartbeat — startClocks() never sets an
       interval when every card is already closed — so the tracker cat reads the
       list here instead. renderTracker() runs on every path that can change it. */
    onTracker(list) {
      if (!this.track || !this.track.svg) return;
      const rows = Array.isArray(list) ? list : [];
      let overdue = 0;
      for (const r of rows) {
        try {
          if (derivedStatus(r) === "overdue") overdue++;
        } catch (e) {
          /* a damaged row is the tracker's problem, not the cat's */
        }
      }
      this.track.svg.setAttribute("data-pose", overdue > 0 ? "alert" : "sleep");
    },
  };

  /* An ornament must never be able to break the tool it sits beside. These are
     called from inside render(), the save handler and renderTracker(); if the
     cat throws, those carry on and the worst case is a cat that says nothing.
     Same instinct as the per-card try/catch in renderTracker(). */
  for (const name of ["onRender", "onSave", "onTab", "onTracker", "onClick", "mount"]) {
    const fn = Cat[name];
    Cat[name] = function () {
      try {
        return fn.apply(this, arguments);
      } catch (e) {
        return undefined;
      }
    };
  }

  window.Cat = Cat;

  document.addEventListener("DOMContentLoaded", () => Cat.mount());
})();
