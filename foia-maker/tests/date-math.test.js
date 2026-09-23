/* Regression tests for the § 84-712(4)/§ 62-301 date math in statutes.js.
   Run with: node tests/date-math.test.js

   Loads statutes.js in a vm sandbox rather than importing it, since the app files are
   plain <script>-tag globals with no module.exports (and must stay that way — this repo
   has no build step). This keeps the browser file untouched while testing the real
   implementation instead of a reimplementation of it. */

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const src = fs.readFileSync(path.join(__dirname, "..", "statutes.js"), "utf8");
const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(src, sandbox);
const { businessDaysFrom, ymd, holidayName, isWeekend } = sandbox;

let pass = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    pass += 1;
  } catch (err) {
    failures.push({ name, err });
  }
}

function deadlineFor(y, m, d, count = 4) {
  return businessDaysFrom(new Date(y, m - 1, d), count);
}

/* 1. Day of receipt is excluded, and a Thursday send crosses the following weekend. */
test("Thursday send excludes receipt day and skips the weekend", () => {
  const { deadline, skipped } = deadlineFor(2026, 9, 10); // confirmed Thursday
  assert.equal(ymd(deadline), "2026-09-16");
  /* `skipped` is an array from the vm sandbox's own realm, so .map()'s result is too —
     spread it into a plain array of this realm before a structural comparison. */
  assert.deepEqual([...skipped].map((s) => s.date), ["2026-09-12", "2026-09-13"]);
});

/* 2. A Friday send also crosses the same weekend once. */
test("Friday send skips the weekend once, not twice", () => {
  const { deadline, skipped } = deadlineFor(2026, 9, 11); // confirmed Friday
  assert.equal(ymd(deadline), "2026-09-17");
  assert.equal(skipped.length, 2);
});

/* 3. Arbor Day (last Friday in April) is Nebraska-specific and must count as closed. */
test("Arbor Day (Fri 2026-04-24) pushes the deadline into the following week", () => {
  const { deadline, skipped } = deadlineFor(2026, 4, 20);
  assert.equal(ymd(deadline), "2026-04-27");
  assert.ok(skipped.some((s) => s.reason === "Arbor Day"));
});

/* 4. Thanksgiving week loses both Thursday and the day after. */
test("Thanksgiving week loses both Thursday and Friday", () => {
  const { deadline, skipped } = deadlineFor(2026, 11, 23);
  assert.equal(ymd(deadline), "2026-12-01");
  assert.ok(skipped.some((s) => s.reason === "Thanksgiving Day"));
  assert.ok(skipped.some((s) => s.reason === "Day after Thanksgiving"));
});

/* 5. § 62-301: a holiday landing on Sunday is observed the following Monday. */
test("Sunday July 4 (2027) consumes the observed Monday", () => {
  const { deadline, skipped } = deadlineFor(2027, 6, 30);
  assert.equal(ymd(deadline), "2027-07-07");
  assert.ok(skipped.some((s) => s.reason === "Independence Day (observed)"));
});

/* 6. A late-December send must span the year boundary correctly. */
test("A late-December send spans the year boundary into next year", () => {
  const { deadline, skipped } = deadlineFor(2026, 12, 28);
  assert.equal(ymd(deadline), "2027-01-04");
  assert.ok(skipped.some((s) => s.reason === "New Year's Day"));
});

/* 7. A week with no holidays nearby is a plain 4-business-day count. */
test("A holiday-free Monday send lands exactly 4 weekdays later", () => {
  const { deadline, skipped } = deadlineFor(2026, 8, 3); // confirmed Monday
  assert.equal(ymd(deadline), "2026-08-07");
  assert.equal(skipped.length, 0);
});

/* 8. Weekend and holiday name lookups, used directly by the tracker UI. */
test("isWeekend and holidayName agree with the calendar", () => {
  assert.equal(isWeekend(new Date(2026, 8, 12)), true); // Sat
  assert.equal(isWeekend(new Date(2026, 8, 10)), false); // Thu
  assert.equal(holidayName(new Date(2026, 0, 1)), "New Year's Day");
  assert.equal(holidayName(new Date(2026, 8, 10)), null);
});

for (const { name, err } of failures) {
  console.error(`FAIL: ${name}\n  ${err.message}`);
}
console.log(`${pass}/${pass + failures.length} passing`);
process.exitCode = failures.length ? 1 : 0;
