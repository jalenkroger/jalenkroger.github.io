# Per my Last Request (Nebraska FOIA Request Maker)

## The original goal

> The end goal of this project is to have a Nebraska FOIA request maker that tailors specifically
> for the agency/body requested and also tracks the request from when it was put out to when the
> four day period pass. The hope is to have people put in what they request and then recieve a full
> FOIA request form. After the four days, if a request is not recieved, it will draft a follow-up
> request and a letter to the attorney general.
>
> The API this will serve is for a website that allows citizens and reporters to make requests
> easier. The website will help journalists to spend more time reporting than worrying about records
> requests.
>
> Someone would be able to go to this website, put in the body they're requesting from and what
> they're requesting. The output should have the laws and statutes that the request is coming from.

---

## The constraint that shapes everything

This repo is served by GitHub Pages, which hosts **static files only**. Every sibling project here
(`salary-search`, `title_ix`, `dn-games`, `jeffery-gold`) is vanilla HTML/CSS/JS with no build step,
no framework, no `package.json`, and no backend.

That collides with two things the goal asks for: tracking a request across four days, and drafting a
follow-up when the window closes. There is no server to hold that state or to wake up on day five.

**Resolution:** tracking lives in the browser's `localStorage`, and the tool *drafts* letters rather
than sending them. "The API this will serve" is read as the site's public interface, not an HTTP
service — there is no server component.

**Decisions:**
- Static site; tracking in `localStorage`, with JSON export/import as the stand-in for sync.
- The tool never sends anything. It drafts; the journalist reviews and sends under their own name.
- A small curated agency list, expandable.

## Legal foundation

Verified against nebraskalegislature.gov. These are the backbone of every generated letter.

| Citation | What it gives the requester |
|---|---|
| § 84-712(1) | Right of any Nebraska citizen to examine public records |
| § 84-712.01(1) | "Data which is a public record in its original form shall remain a public record when maintained in computer files" — the lever for demanding native electronic files instead of a scan of a printout |
| § 84-712(4) | Response within **four business days** of actual receipt; day of receipt excluded; weekends and days the office is closed don't count. The response must be the records, a written denial, a cost estimate, or a written explanation of delay |
| § 84-712(3) | Special service charge only where work exceeds four cumulative hours, and an estimate must come first |
| § 84-712.04(1) | A denial must describe the contents withheld, cite the **particular statute and subsection** for each withheld portion, name the official responsible, and give notice of review rights |
| § 84-712.03(1) | Remedies: (a) writ of mandamus in district court, or (b) petition the Attorney General, who must decide within 15 calendar days |
| § 84-712.05 | Exemptions — the statute says records **"may"** be withheld, not "must" |
| § 84-712.05(5) | Law enforcement investigatory records — the exemption most often cited against reporters |
| § 84-712.05(8) | Personnel records — **expressly does not cover salaries and routine directory information** |

Two of these are rhetorical levers built into the letters: the exemptions are permissive, so a body
*choosing* to withhold can be asked to reconsider; and § 84-712.04 lets a requester pre-empt a vague
denial by quoting what a lawful denial must contain.

**Accuracy rule:** § 84-712.05 subsections have been renumbered across revisions. Every citation was
read off the current statute text with its source URL recorded in `statutes.js`. No citation goes in
from memory.

## Nebraska holidays — computed, not hardcoded

§ 84-712(4) excludes any "day during which the offices of the custodian of the public records are
closed." Nebraska's legal holidays are enumerated in **§ 62-301**:

| Holiday | Rule |
|---|---|
| New Year's Day | January 1 |
| Birthday of Martin Luther King, Jr. | 3rd Monday in January |
| President's Day | 3rd Monday in February |
| **Arbor Day** | **last Friday in April** |
| Memorial Day | last Monday in May |
| Juneteenth | June 19 |
| Independence Day | July 4 |
| Labor Day | 1st Monday in September |
| Indigenous Peoples' Day / Columbus Day | 2nd Monday in October |
| Veterans Day | November 11 |
| Thanksgiving Day | 4th Thursday in November |
| **Day after Thanksgiving** | Friday after the 4th Thursday in November |
| Christmas Day | December 25 |

§ 62-301 also provides that a holiday falling on a Sunday is observed the following Monday.

Two entries are exactly what a generic US-holiday library gets wrong: **Arbor Day**, which Nebraska
alone observes as a paid state holiday, and **the day after Thanksgiving**. Missing either produces a
deadline one day too early — which would have the tool telling a reporter an agency broke the law
when it hadn't.

`nebraskaHolidays(year)` computes the set from these rules rather than storing dates, because a
hardcoded list rots silently the moment it runs past its final year.

**Tie-breaking rule.** § 62-301 addresses only the Sunday shift, and § 84-712(4)'s "offices are
closed" is broader than the state list — a city or school district may close on days the state does
not. Where a day is genuinely ambiguous the calculator counts it as closed, pushing the deadline
*later*. That is the safe direction: an over-early deadline damages the reporter's credibility and
the tool's. Every date is labeled an estimate for the same reason.

## Files

```
foia-maker/
  index.html      builder form, letter output, tracker dashboard
  style.css       styling
  script.js       form handling, deadline math, localStorage tracker
  statutes.js     citations, § 84-712.05 exemptions, § 62-301 holiday math
  agencies.js     curated public bodies
  templates.js    the three letters
  README.md       what it is, how to add an agency
```

### `agencies.js`

Covers Lincoln Police Department, Nebraska State Patrol, University of Nebraska, Lincoln Public
Schools, City of Lincoln, Lancaster County, Nebraska DHHS, and a generic "other" fallback.

Contacts are **looked up from each body's official site, never guessed.** Anything unconfirmed ships
as `null` and renders as "look this up" with a link to `sourceUrl`. A plausible wrong address sends a
reporter's request into a void and they don't find out for weeks — a blank is strictly more useful.

The schema splits `contactRole` (durable — roles outlive people) from `contactName` (shown as "as of
`verifiedOn`" so a stale name is visibly stale), and carries an optional `caution` field.

**Two findings from the lookups that changed the design:**

1. **The Attorney General does not take a freeform letter.** The office publishes an official Public
   Records Petition Form. The AG draft therefore produces a cover letter plus a labeled facts block
   to transcribe onto that form, and links to it — rather than implying a letter alone starts the
   15-day clock.
2. **Lincoln Public Schools is a trap.** Searching for LPS records surfaces the Student Services
   student-records contact. That is the wrong desk: student records are exempt under
   § 84-712.05(1), while the district records a reporter actually wants — budgets, board materials,
   administrator correspondence — go to the district's records custodian. The LPS entry carries a
   `caution` saying so instead of pointing users where the search sends them.

Unresolved and left blank: LPD's street address (official city pages show only the general "555
South 10th Street"; other listings say "575"), and the City of Lincoln and DHHS records contacts
(both pages 404'd).

### `templates.js`

Three functions taking one request object, so the same object feeds all three letters.

- **Initial request** — cites § 84-712(1), demands native electronic format under § 84-712.01(1),
  states the computed deadline, sets a fee ceiling and requests an estimate per § 84-712(3), and
  quotes § 84-712.04's denial requirements so any denial must be specific.
- **Follow-up** — recites the chronology, notes the § 84-712(4) violation, and demands either the
  records or a conforming written denial.
- **AG petition** — the form-plus-cover-letter approach described above, citing § 84-712.03(1)(b).

### `script.js`

`businessDaysFrom(start, 4)` excludes the send date, then skips weekends, computed holidays, and any
per-agency `extraClosedDates`. It handles windows that cross a year boundary, and returns the list of
skipped days so the UI can show its work rather than asking the user to trust a bare date.

Tracker state lives under `localStorage` key `foia-maker.requests`. Status runs
`awaiting` → `overdue` | `estimate-received` | `denied` | `fulfilled`. Going overdue unlocks the
follow-up; a denial or an ignored follow-up unlocks the AG petition. JSON export/import exists
because a cleared cache would otherwise silently destroy a reporter's tracking record.

## Verification

Date math, tested directly (8/8 passing):

- Day of receipt excluded; Thursday and Friday sends cross the weekend correctly.
- **Arbor Day** (Fri 2026-04-24) pushes a deadline into the following week.
- **Thanksgiving week** loses both Thursday and Friday.
- A Sunday July 4 (2027) correctly consumes the observed Monday.
- A late-December send spans the year boundary into 2027.

In the browser, over HTTP (the preview pane renders local `file://` pages as a static snapshot, so
linked `<script>` files never execute there — use `python3 -m http.server 8765`):

- Zero console errors; all 8 bodies populate; default deadline correct (Tue 2026-09-08 → Mon
  2026-09-14).
- Golden path with LPD produces a complete letter citing § 84-712, § 84-712.01(1), § 84-712(3),
  § 84-712(4), § 84-712.04, and § 84-712.05.
- LPD's unconfirmed address renders as "[Mailing address — look this up before sending]".
- Saving starts the clock; a past date flips the badge to overdue and unlocks both drafts, which
  carry accurate chronology.
- State survives a page reload; "mark denied" keeps the AG petition available.
- Export → clear → import round-trips intact.
- The freeform "other" path addresses the letter to a typed-in body.

Not exercised: the `FileReader` branch of JSON import (needs a real file picker); the parse/save
path it feeds was tested directly.

## Out of scope

Automated sending, email reminders, cross-device sync, accounts, and a backend — each needs
infrastructure this repo doesn't have. JSON export is the deliberate stand-in for sync.

---

## Addendum — 2026-09-15

Renamed to **Per my Last Request**. The `foia-maker/` directory and the `foia-maker.requests`
localStorage key are both unchanged: the first is the published URL, the second would orphan
every tracked request of anyone already using the tool.

Visual language reworked — the three bordered callouts (disclaimer, caution, deadline) had
identical treatment and so carried identical weight; they are now a quiet rule, an amber flag,
and an elevated result card respectively. Section headers became uppercase sans labels, which
freed the type scale for content. Tracker buttons went from five equal-weight controls to three
tiers, and the letter panel is sticky on desktop.

Added a live countdown to each tracked request: a ring that depletes across the response window,
a sweep hand, and a ticking readout. It targets the end of the deadline date — derived from the
same resolve-later tie-break as the holiday math, and verified to coincide exactly with the
`derivedStatus()` flip to overdue. `overdueParts()` is now the single source for "how overdue",
which fixed a real off-by-one where the badge said 39 days and the clock said 38.

## Addendum — 2026-09-15 (design)

Applied a newspaper visual language across the tool: Newsreader and Archivo, a masthead with a
dateline and one red rule, square corners throughout, and status carried by black-versus-red
instead of a traffic-light palette.

The tracker's ring clock became a split-flap board. It keeps every property the ring had — one
interval for all cards, ticks that mutate only the clock's own nodes so an open draft survives,
`aria-hidden` with the badge carrying the state in words, and the end-of-deadline-day target that
coincides with the flip to overdue. Flaps restart their animation via alternating keyframe names,
since a re-render never remounts the cells.

Webfonts are the one new network dependency and fall back to Georgia/Helvetica.
Artboards for the direction are in `design/`.
