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
    /* Was left null over a 555-vs-575 conflict. Resolved: the department's own page
       gives "Headquarters, 575 S 10th St" — 555 South 10th is the City-County
       Building, which is the site-wide footer address and the City Clerk's office. */
    address: "575 S 10th St\nLincoln, NE 68508",
    email: "lpd@cjis.lincoln.ne.gov",
    phone: "(402) 441-7210",
    portalUrl:
      "https://www.lincoln.ne.gov/City/Departments/Police/Police-Records/Public-Records-Requests",
    notes:
      "Email is the fastest route, but the LPD address is documented as not monitored " +
      "around the clock. For anything time-sensitive, follow up on (402) 441-7210 and " +
      "keep a record of when you called. The records counter at headquarters is open " +
      "weekdays 8 a.m. to 4 p.m.",
    caution: null,
    likelyExemptions: [5, 6, 20],
    sourceUrl: "https://www.lincoln.ne.gov/City/Departments/Police",
    verifiedOn: "2026-09-17",
  },

  {
    id: "nsp",
    name: "Nebraska State Patrol",
    type: "law-enforcement",
    contactRole: "Legal Division — Public Records Request",
    contactName: null,
    address: "PO Box 94907\nLincoln, NE 68509",
    email: null,
    phone: "(402) 479-4545",
    portalUrl: "https://nebraskastatepatrol.govqa.us/WEBAPP/_rs/supporthome.aspx",
    notes:
      "Use the portal — NSP publishes no records email, and the fax line is for agencies " +
      "with subpoena powers. NSP publishes its fees: $96.00/hour for computer technician " +
      "time, $35.00/hour for clerk time, and $0.25 per page, charged only once research " +
      "time exceeds eight hours. A deposit may be required when the request exceeds " +
      "$50.00 — so a fee ceiling in your request matters here.",
    caution: null,
    likelyExemptions: [5, 6, 9, 20],
    sourceUrl: "https://statepatrol.nebraska.gov/services/public-records-requests",
    verifiedOn: "2026-09-17",
  },

  {
    id: "nu",
    name: "University of Nebraska (system, incl. UNL)",
    type: "university",
    contactRole: "Associate General Counsel and University Records Director",
    contactName: "Molly McCleery",
    address: null,
    /* The general counsel's office publishes a dedicated records address; prefer it over
       any individual's inbox, which routes around whoever is actually on duty. */
    email: "publicrecords@nebraska.edu",
    phone: "(402) 472-1201",
    portalUrl: "https://universityofnebraska.nextrequest.com/requests/new",
    notes:
      "The NextRequest portal is the university's own system and asks which campus you " +
      "want, so name it. It also asks whether you are a Nebraska resident and whether you " +
      "are media, and that matters: under § 84-712(3)(c) a Nebraska resident — news media " +
      "included — cannot be charged unless the request takes more than eight hours. A " +
      "deposit may be required above $50.00 under § 84-712(3)(g). For email requests the " +
      "portal asks for custodians, keywords and a date range; supplying them up front is " +
      "the single biggest thing that speeds a request here. Policy EM 22 also allows cost " +
      "to be discounted or waived where a request is central to the public's right to " +
      "know — worth citing if you are asking for a waiver.",
    caution: null,
    likelyExemptions: [1, 3, 4, 8],
    sourceUrl: "https://nebraska.edu/offices/general-counsel/practice-areas/university-records",
    verifiedOn: "2026-09-17",
  },

  {
    id: "lps",
    name: "Lincoln Public Schools",
    type: "school-district",
    contactRole: "District records custodian",
    contactName: null,
    address: "Steve Joel District Leadership Center\n5905 O St\nLincoln, NE 68510",
    /* LPS publishes no general records email. Left null rather than route a district
       request to a departmental inbox that will not handle it. */
    email: null,
    phone: "(402) 436-1000",
    portalUrl: null,
    notes:
      "No published records email, so this one goes by letter or by phone. Call the " +
      "district office first and ask who the custodian is for the records you want — " +
      "naming them on the envelope is what keeps it out of the wrong in-tray. Mail can " +
      "also go to P.O. Box 82889, Lincoln, NE 68501.",
    caution:
      "Searching for LPS records tends to surface the Student Services student-records " +
      "contact. That is a different thing. Student records are exempt under § 84-712.05(1) " +
      "and that office does not handle district records. Both sit at 5905 O St, so the " +
      "street address will not save you — address the district records custodian by role. " +
      "If you want budgets, board materials, contracts, or administrator correspondence, " +
      "that is who you want.",
    likelyExemptions: [1, 8],
    sourceUrl: "https://www.lps.org/",
    verifiedOn: "2026-09-17",
  },

  {
    id: "lincoln-city",
    name: "City of Lincoln",
    type: "city",
    contactRole: "City Clerk",
    contactName: "Soulinnee Phan",
    address: "555 S. 10th St., Ste. 103\nLincoln, NE 68508",
    email: "cityclerk@lincoln.ne.gov",
    phone: "(402) 441-7436",
    portalUrl: null,
    notes:
      "Email the clerk rather than mailing — the office publishes a direct address and " +
      "keeps weekday hours of 8 a.m. to 4:30 p.m. The Clerk is the right destination for " +
      "council and city-wide records, but if what you want sits with one department, " +
      "addressing that department's custodian directly is usually faster.",
    caution: null,
    likelyExemptions: [4, 7, 8, 9],
    sourceUrl: "https://www.lincoln.ne.gov/City/Departments/Finance/City-Clerk",
    verifiedOn: "2026-09-17",
  },

  {
    id: "lancaster-county",
    name: "Lancaster County",
    type: "county",
    contactRole: "County Clerk",
    contactName: null,
    address: "555 S 10th St, Room 108\nLincoln, NE 68508",
    email: "coclerk@lancaster.ne.gov",
    phone: "(402) 441-7484",
    portalUrl: "https://www.lancaster.ne.gov/516/Public-Records-Request",
    notes:
      "The county takes requests by email, which is the fastest route. Its published fees " +
      "are the cost of the device for records delivered on a flash drive, plus staff " +
      "hourly rates for research running over eight hours and for IT extraction work. " +
      "County records are split across offices — the Clerk, the Sheriff, the Assessor and " +
      "the Attorney each keep their own — so naming the office that holds the record " +
      "speeds things up considerably.",
    caution: null,
    likelyExemptions: [4, 5, 7, 8],
    sourceUrl: "https://www.lancaster.ne.gov/516/Public-Records-Request",
    verifiedOn: "2026-09-17",
  },

  {
    id: "dhhs",
    name: "Nebraska Department of Health and Human Services",
    type: "state-agency",
    contactRole: "DHHS Public Records Office",
    contactName: null,
    address:
      "Nebraska State Office Building, 3rd Floor\n301 Centennial Mall South\n" +
      "P.O. Box 95026\nLincoln, NE 68509",
    email: "DHHS.PublicRecords@nebraska.gov",
    phone: "(402) 471-3121",
    portalUrl: null,
    notes:
      "DHHS runs a dedicated public records office with its own address — send it there " +
      "rather than to a program area. The department states that any data not already on " +
      "its public site has to come through a records request. Expect medical-records and " +
      "personal-privacy exemptions to be raised; asking for aggregate or de-identified " +
      "data, or for records with identifying fields redacted, often gets you a usable " +
      "answer where a request for raw files is refused outright.",
    caution: null,
    likelyExemptions: [2, 1, 20],
    sourceUrl: "https://dhhs.ne.gov/Pages/Newsroom-Contacts.aspx",
    verifiedOn: "2026-09-17",
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
