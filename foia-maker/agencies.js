/* Nebraska public bodies, for tailoring a records request.

   RULE FOR THIS FILE: never invent a contact detail. A plausible-looking wrong address
   sends a reporter's request into a void and they don't find out for weeks — a blank is
   strictly more useful, because it prompts them to look. Anything not confirmed on the
   body's own website is `null`, and the UI turns that into a "look this up" prompt with a
   link to `sourceUrl`.

   `contactRole` is the durable half (roles outlive people); `contactName` is shown as
   "as of <verifiedOn>" so a stale name is visibly stale rather than quietly wrong. */

const AGENCIES = [
  {
    id: "lpd",
    name: "Lincoln Police Department",
    type: "law-enforcement",
    contactRole: "Records Unit",
    contactName: null,
    /* Unresolved: the city's own pages show only the general "555 South 10th Street"
       while other listings give "575 South 10th Street" for LPD headquarters. Left null
       rather than pick one. */
    address: null,
    email: "lpd@cjis.lincoln.ne.gov",
    phone: "(402) 441-7210",
    portalUrl:
      "https://www.lincoln.ne.gov/City/Departments/Police/Police-Records/Public-Records-Requests",
    notes:
      "The LPD email is documented as not monitored around the clock. For anything " +
      "time-sensitive, follow up by phone and keep a record of when you called.",
    caution: null,
    likelyExemptions: [5, 6, 20],
    sourceUrl: "https://www.lincoln.ne.gov/City/Departments/Police/Directory",
    verifiedOn: "2026-09-08",
  },

  {
    id: "nsp",
    name: "Nebraska State Patrol",
    type: "law-enforcement",
    contactRole: "Legal Division — Public Records Request",
    contactName: null,
    address: "Nebraska State Patrol, Legal Division — Public Records Request, PO Box 94907, Lincoln, NE 68509",
    email: null,
    phone: "(402) 479-4545",
    portalUrl: "https://nebraskastatepatrol.govqa.us/WEBAPP/_rs/supporthome.aspx",
    notes:
      "NSP publishes its fees: $96.00/hour for computer technician time, $35.00/hour for " +
      "clerk time, and $0.25 per page. A deposit may be required when the request exceeds " +
      "$50.00 — so a fee ceiling in your request matters here.",
    caution: null,
    likelyExemptions: [5, 6, 9, 20],
    sourceUrl: "https://statepatrol.nebraska.gov/services/public-records-requests",
    verifiedOn: "2026-09-08",
  },

  {
    id: "nu",
    name: "University of Nebraska (system, incl. UNL)",
    type: "university",
    contactRole: "Director of University Records, Office of the General Counsel",
    contactName: "Molly McCleery",
    address: null,
    email: "mollymccleery@nebraska.edu",
    phone: "(402) 472-1201",
    portalUrl: "https://nebraska.edu/offices-policies/policies/no-22-public-record-requests",
    notes:
      "Governed by university policy EM 22. The policy allows the cost of a request to be " +
      "discounted or waived where it is deemed central to the public's right to know — " +
      "worth citing directly if you are asking for a fee waiver.",
    caution: null,
    likelyExemptions: [1, 3, 4, 8],
    sourceUrl: "https://nebraska.edu/offices/general-counsel/practice-areas/university-records",
    verifiedOn: "2026-09-08",
  },

  {
    id: "lps",
    name: "Lincoln Public Schools",
    type: "school-district",
    contactRole: "District records custodian",
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes: null,
    caution:
      "Searching for LPS records tends to surface the Student Services student-records " +
      "contact. That is a different thing. Student records are exempt under § 84-712.05(1) " +
      "and that office does not handle district records. If you want budgets, board " +
      "materials, contracts, or administrator correspondence, address the district's " +
      "records custodian at the district office instead.",
    likelyExemptions: [1, 8],
    sourceUrl: "https://www.lps.org/",
    verifiedOn: "2026-09-08",
  },

  {
    id: "lincoln-city",
    name: "City of Lincoln",
    type: "city",
    contactRole: "City Clerk",
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "The City Clerk is generally the right destination for city records, but the clerk's " +
      "records page could not be confirmed at a stable URL — check lincoln.ne.gov before " +
      "sending. If the records sit with a specific department, addressing that department's " +
      "custodian directly is usually faster.",
    caution: null,
    likelyExemptions: [4, 7, 8, 9],
    sourceUrl: "https://www.lincoln.ne.gov/",
    verifiedOn: "2026-09-08",
  },

  {
    id: "lancaster-county",
    name: "Lancaster County",
    type: "county",
    contactRole: "County Clerk",
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "County records are often split across offices — the Clerk, the Sheriff, the " +
      "Assessor, and the Attorney each keep their own. Naming the office that holds the " +
      "record speeds things up considerably.",
    caution: null,
    likelyExemptions: [4, 5, 7, 8],
    sourceUrl: "https://www.lancaster.ne.gov/",
    verifiedOn: "2026-09-08",
  },

  {
    id: "dhhs",
    name: "Nebraska Department of Health and Human Services",
    type: "state-agency",
    contactRole: "Public records custodian",
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "Expect medical-records and personal-privacy exemptions to be raised. Asking for " +
      "aggregate or de-identified data, or for records with identifying fields redacted, " +
      "often gets you a usable answer where a request for raw files is refused outright.",
    caution: null,
    likelyExemptions: [2, 1, 20],
    sourceUrl: "https://dhhs.ne.gov/",
    verifiedOn: "2026-09-08",
  },

  {
    id: "other",
    name: "Another Nebraska public body (enter it yourself)",
    type: "generic",
    contactRole: "Records custodian",
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "The public records statutes apply to any Nebraska state agency, county, city, " +
      "village, political subdivision, or tax-supported district. If your body is not " +
      "listed, the generated request still works — fill in the name and address yourself.",
    caution: null,
    likelyExemptions: [],
    sourceUrl: null,
    verifiedOn: null,
  },
];

function agencyById(id) {
  return AGENCIES.find((a) => a.id === id) || null;
}

/* Which contact fields are missing, so the UI can prompt rather than silently omit. */
function missingContactFields(agency) {
  return ["address", "email", "phone"].filter((f) => !agency[f]);
}
