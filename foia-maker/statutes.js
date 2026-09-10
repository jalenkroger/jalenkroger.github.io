/* Nebraska public records law: citations, exemptions, and holiday math.
   Every citation here was checked against nebraskalegislature.gov on 2026-09-08.
   If you edit this file, re-check the statute and update `verifiedOn`. */

const VERIFIED_ON = "2026-09-08";

const STATUTES = {
  right: {
    cite: "Neb. Rev. Stat. § 84-712(1)",
    title: "Right to examine public records",
    text:
      "all citizens of this state and all other persons interested in the examination " +
      "of the public records, as defined in section 84-712.01, are hereby fully " +
      "empowered and authorized to examine such records, and to make memoranda, " +
      "copies, and abstracts therefrom",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712",
    verifiedOn: VERIFIED_ON,
  },

  definition: {
    cite: "Neb. Rev. Stat. § 84-712.01(1)",
    title: "Definition of public records; electronic records",
    text:
      "Data which is a public record in its original form shall remain a public " +
      "record when maintained in computer files.",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712.01",
    verifiedOn: VERIFIED_ON,
  },

  deadline: {
    cite: "Neb. Rev. Stat. § 84-712(4)",
    title: "Four business days to respond",
    text:
      "Upon receipt of a written request for access to or copies of a public record, " +
      "the custodian of such record shall provide to the requester as soon as is " +
      "practicable and without delay, but not more than four business days after " +
      "actual receipt of the request",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712",
    verifiedOn: VERIFIED_ON,
  },

  fees: {
    cite: "Neb. Rev. Stat. § 84-712(3)",
    title: "Fees and special service charges",
    text:
      "a special service charge may be assessed only where the request requires more " +
      "than four cumulative hours of work, and the custodian must first provide an " +
      "estimate of the expected cost",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712",
    verifiedOn: VERIFIED_ON,
  },

  denialContents: {
    cite: "Neb. Rev. Stat. § 84-712.04(1)",
    title: "What a written denial must contain",
    text:
      "a description of the contents of the records withheld and a statement of the " +
      "specific reasons for the denial, correlating specific portions of the records " +
      "to specific reasons for the denial, including citations to the particular " +
      "statute and subsection thereof expressly providing the exception",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712.04",
    verifiedOn: VERIFIED_ON,
  },

  remedies: {
    cite: "Neb. Rev. Stat. § 84-712.03(1)",
    title: "Remedies when a request is denied",
    text:
      "any person denied any rights granted by sections 84-712 to 84-712.03 may (a) " +
      "file for speedy relief by a writ of mandamus in the district court, or (b) " +
      "petition the Attorney General to review the matter to determine whether a " +
      "record may be withheld from public inspection",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712.03",
    verifiedOn: VERIFIED_ON,
  },

  exemptionsGeneral: {
    cite: "Neb. Rev. Stat. § 84-712.05",
    title: "Records which may be withheld (discretionary)",
    text:
      "The following records, unless publicly disclosed in an open court, open " +
      "administrative proceeding, or open meeting or disclosed by a public entity " +
      "pursuant to its duties, may be withheld from the public by the lawful " +
      "custodian of the records",
    url: "https://nebraskalegislature.gov/laws/statutes.php?statute=84-712.05",
    verifiedOn: VERIFIED_ON,
  },
};

/* § 84-712.05 exemptions. The operative word in the opening clause is "may" — these
   are permissive, not mandatory. A body that withholds under one of these is making a
   choice and can be asked to reconsider. Subsection numbers have shifted across
   revisions of the statute, so these were read off the current text rather than
   recalled. */
const EXEMPTIONS = [
  {
    sub: 1,
    label: "Student records",
    plain:
      "Personal information about a student, prospective student, or former student " +
      "of an educational institution.",
  },
  {
    sub: 2,
    label: "Medical records",
    plain: "Medical records, other than records of births and deaths.",
  },
  {
    sub: 3,
    label: "Trade secrets and proprietary information",
    plain:
      "Trade secrets, unpublished academic and scientific research in progress, and " +
      "other proprietary or commercial information.",
  },
  {
    sub: 4,
    label: "Attorney work product",
    plain:
      "An attorney's work product related to preparation for litigation involving " +
      "the public body.",
  },
  {
    sub: 5,
    label: "Law enforcement investigatory records",
    plain:
      "Records developed or received by law enforcement agencies as part of an " +
      "investigation or examination. This is the exemption most often cited against " +
      "reporters — note that it is discretionary, and that it has express exceptions.",
  },
  {
    sub: 6,
    label: "Identity of an alleged sexual assault victim",
    plain:
      "The identity and personal identifying information of an alleged victim of " +
      "sexual assault or sex trafficking.",
  },
  {
    sub: 7,
    label: "Real estate appraisals",
    plain:
      "Appraisals and negotiation records concerning a public body's purchase or " +
      "sale of property.",
  },
  {
    sub: 8,
    label: "Personnel records",
    plain:
      "Personal information about public employees — but expressly NOT salaries and " +
      "routine directory information, which remain public.",
  },
  {
    sub: 9,
    label: "Security of public property and persons",
    plain:
      "Information solely pertaining to the security of public property and the " +
      "people on it.",
  },
  {
    sub: 10,
    label: "Critical energy infrastructure",
    plain: "Details of physical and cyber assets of critical energy infrastructure.",
  },
  {
    sub: 11,
    label: "Lottery Division security records",
    plain: "Security standards, procedures, and related records of the Lottery Division.",
  },
  {
    sub: 12,
    label: "Utility customer account information",
    plain: "Personally identified private customer account information of public utilities.",
  },
  {
    sub: 13,
    label: "Library patron records",
    plain: "Records that would reveal the identity of a library patron.",
  },
  {
    sub: 20,
    label: "Social security and financial account numbers",
    plain:
      "Social security numbers, card numbers and expiration dates, and financial " +
      "account numbers supplied to government.",
  },
];

function exemptionBySub(sub) {
  return EXEMPTIONS.find((e) => e.sub === sub) || null;
}

/* ---------- Nebraska holidays (Neb. Rev. Stat. § 62-301) ----------

   § 84-712(4) excludes from the four-day count any "day during which the offices of
   the custodian of the public records are closed." Nebraska's legal holidays are
   enumerated in § 62-301.

   These are COMPUTED from the statutory rules rather than stored as a list of dates.
   A hardcoded list rots silently: the first day it runs past its final year it starts
   producing deadlines that are wrong with no error, and a wrong deadline in this tool
   means telling a reporter an agency broke the law when it hadn't.

   Two entries here are the ones a generic US-holiday library gets wrong: Arbor Day
   (Nebraska is the only state observing it as a paid state holiday) and the day after
   Thanksgiving. */

const AG_PETITION = {
  office: "Nebraska Attorney General",
  address: "1445 K Street, Room 2115, Lincoln, NE 68508",
  phone: "(402) 471-2683",
  formUrl: "https://ago.nebraska.gov/open-government",
  decisionDays: 15, // calendar days, § 84-712.03(1)(b)
  verifiedOn: VERIFIED_ON,
};

const WEEKDAY = { SUN: 0, MON: 1, TUE: 2, WED: 3, THU: 4, FRI: 5, SAT: 6 };

function ymd(date) {
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${m}-${d}`;
}

function nthWeekdayOfMonth(year, month, weekday, n) {
  const first = new Date(year, month, 1);
  const offset = (weekday - first.getDay() + 7) % 7;
  return new Date(year, month, 1 + offset + (n - 1) * 7);
}

function lastWeekdayOfMonth(year, month, weekday) {
  const last = new Date(year, month + 1, 0);
  const offset = (last.getDay() - weekday + 7) % 7;
  return new Date(year, month, last.getDate() - offset);
}

const holidayCache = new Map();

/* Returns a Map of "YYYY-MM-DD" -> holiday name for the given year. */
function nebraskaHolidays(year) {
  if (holidayCache.has(year)) return holidayCache.get(year);

  const days = new Map();
  const add = (date, name) => {
    if (!days.has(ymd(date))) days.set(ymd(date), name);
  };

  const thanksgiving = nthWeekdayOfMonth(year, 10, WEEKDAY.THU, 4);
  const dayAfterThanksgiving = new Date(year, 10, thanksgiving.getDate() + 1);

  const fixed = [
    [new Date(year, 0, 1), "New Year's Day"],
    [nthWeekdayOfMonth(year, 0, WEEKDAY.MON, 3), "Birthday of Martin Luther King, Jr."],
    [nthWeekdayOfMonth(year, 1, WEEKDAY.MON, 3), "President's Day"],
    [lastWeekdayOfMonth(year, 3, WEEKDAY.FRI), "Arbor Day"],
    [lastWeekdayOfMonth(year, 4, WEEKDAY.MON), "Memorial Day"],
    [new Date(year, 5, 19), "Juneteenth"],
    [new Date(year, 6, 4), "Independence Day"],
    [nthWeekdayOfMonth(year, 8, WEEKDAY.MON, 1), "Labor Day"],
    [nthWeekdayOfMonth(year, 9, WEEKDAY.MON, 2), "Indigenous Peoples' Day / Columbus Day"],
    [new Date(year, 10, 11), "Veterans Day"],
    [thanksgiving, "Thanksgiving Day"],
    [dayAfterThanksgiving, "Day after Thanksgiving"],
    [new Date(year, 11, 25), "Christmas Day"],
  ];

  for (const [date, name] of fixed) {
    add(date, name);

    /* § 62-301: "If any such holiday falls on Sunday, the following Monday shall be a
       holiday." */
    if (date.getDay() === WEEKDAY.SUN) {
      add(new Date(year, date.getMonth(), date.getDate() + 1), `${name} (observed)`);
    }

    /* The statute is silent on holidays falling on Saturday, but many public offices
       close the preceding Friday. Where a closure is genuinely ambiguous this file
       resolves it toward "closed", which pushes the deadline later. That is the safe
       direction: a deadline computed too early would have this tool accusing an agency
       of missing a deadline it still had time to meet. A day late costs nothing. */
    if (date.getDay() === WEEKDAY.SAT) {
      add(new Date(year, date.getMonth(), date.getDate() - 1), `${name} (observed)`);
    }
  }

  holidayCache.set(year, days);
  return days;
}

function holidayName(date) {
  return nebraskaHolidays(date.getFullYear()).get(ymd(date)) || null;
}

function isWeekend(date) {
  return date.getDay() === WEEKDAY.SUN || date.getDay() === WEEKDAY.SAT;
}

/* Walks forward `count` business days from `start`, per § 84-712(4): the day the
   request is received is excluded, then Saturdays, Sundays, and days the office is
   closed are skipped. `extraClosed` is an array of "YYYY-MM-DD" strings for bodies
   with known local closures beyond the state list.

   Returns { deadline, skipped } where `skipped` explains each non-counting day, so the
   UI can show its work rather than asking the user to trust a bare date. */
function businessDaysFrom(start, count, extraClosed = []) {
  const closed = new Set(extraClosed);
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const skipped = [];
  let counted = 0;

  while (counted < count) {
    cursor.setDate(cursor.getDate() + 1);

    const name = holidayName(cursor);
    if (isWeekend(cursor)) {
      skipped.push({ date: ymd(cursor), reason: cursor.getDay() === 0 ? "Sunday" : "Saturday" });
    } else if (name) {
      skipped.push({ date: ymd(cursor), reason: name });
    } else if (closed.has(ymd(cursor))) {
      skipped.push({ date: ymd(cursor), reason: "Office closed" });
    } else {
      counted += 1;
    }
  }

  return { deadline: new Date(cursor), skipped };
}
