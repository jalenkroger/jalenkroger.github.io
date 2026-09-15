# Per my Last Request

A static tool that builds a Nebraska public-records request tailored to the body you're asking,
tracks the four-business-day response clock, and drafts the follow-up and Attorney General
petition when that clock runs out.

Published at `jalenkroger.github.io/foia-maker/` — the directory name is the URL and is
deliberately unchanged by the rename.

Vanilla HTML/CSS/JS. No build step, no dependencies, no backend — open `index.html` and it works.

## What it does

1. **Builds the request.** Pick a public body, describe the records, and the tool writes a letter
   citing the statutes that entitle you to them — including § 84-712.01(1), which is the basis for
   demanding native electronic files rather than a scan of a printout.
2. **Computes the deadline.** Neb. Rev. Stat. § 84-712(4) gives a custodian four business days from
   receipt. The tool excludes the day you send, weekends, and Nebraska's legal holidays, and shows
   its work.
3. **Tracks the clock.** Saved requests get a live countdown — a ring that depletes across the
   response window and a ticking readout — plus a due/overdue badge. When one goes overdue it
   unlocks a follow-up letter; a denial or an ignored follow-up unlocks the AG petition.

## The clock

The statute counts whole business days, so the deadline is a date, not a timestamp. The countdown
therefore targets **the end of the deadline date**. That follows the same tie-break the holiday
math uses — where a boundary is ambiguous, resolve it later, never earlier — and it means the
clock reaching zero happens at exactly the moment the request flips to overdue.

The badge and the countdown both read from `overdueParts()` so they can never show two different
numbers for the same request.

One interval drives every card. Ticks mutate only the clock's own nodes, never the card's markup,
so a follow-up letter you have open mid-read survives the seconds going by.

## What it deliberately does not do

**It never sends anything.** Every output is text for you to read and send yourself. A letter to a
government official goes out under your name, so a human reads it first.

**It never invents a contact.** If an address or email couldn't be confirmed on the body's own
website, it ships blank and the UI says "look this up" with a link to the source. A plausible wrong
address sends your request into a void and you don't find out for weeks.

## Files

| File | Contents |
|---|---|
| `index.html` | Page structure |
| `style.css` | Styling |
| `script.js` | Form handling, tracker, live clock, localStorage |
| `statutes.js` | Citations, § 84-712.05 exemptions, § 62-301 holiday math |
| `agencies.js` | The public bodies |
| `templates.js` | The three letters |

## Adding a public body

Add an entry to `AGENCIES` in `agencies.js`:

```js
{
  id: "short-slug",
  name: "Village of Example",
  type: "city",
  contactRole: "Village Clerk",   // durable — roles outlive people
  contactName: null,              // a person; shown as "as of <verifiedOn>"
  address: null,                  // null if you could not confirm it
  email: null,
  phone: null,
  portalUrl: null,                // if the body runs its own request system
  notes: null,                    // fees, quirks, what speeds a request up
  caution: null,                  // a warning about a wrong-turn (see the LPS entry)
  likelyExemptions: [5, 8],       // § 84-712.05 subsection numbers
  sourceUrl: "https://…",         // where you confirmed this
  verifiedOn: "2026-09-08",
}
```

**Look every value up on the body's own site and record `sourceUrl`.** Leave anything you cannot
confirm as `null` — the UI handles blanks gracefully and prompts the user to check. Guessing is
worse than leaving it empty.

## Holidays

`nebraskaHolidays(year)` in `statutes.js` computes Nebraska's legal holidays from the rules in
§ 62-301 rather than storing a list of dates, so it does not silently rot at a year boundary. It
includes two that generic US-holiday libraries miss: **Arbor Day** (last Friday in April — Nebraska
is the only state observing it as a paid state holiday) and **the day after Thanksgiving**.

Where a closure is genuinely ambiguous, the calculator counts the day as closed, pushing the
deadline later. That's the safe direction: a deadline computed too early would have the tool
telling a reporter an agency broke the law when it hadn't.

Deadlines are labeled estimates throughout, because § 84-712(4) excludes any day the custodian's
office is closed and no static list knows every local closure.

## Local development

Because the page loads its data via `<script src>`, opening it over `file://` works in a normal
browser. To serve it over HTTP:

```bash
python3 -m http.server 8765
```

## Caveats

- Tracking is stored in `localStorage` — this browser, this device. It is not synced, and clearing
  site data erases it. Use **Export JSON** to keep a backup.
- Contact details and statute citations were verified on the date in each `verifiedOn` field.
  Staff change and statutes get renumbered. Check before you send.
- This is not legal advice.
