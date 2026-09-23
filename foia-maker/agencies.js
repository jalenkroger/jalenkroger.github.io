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

  /* ---------- Nebraska state departments and agencies ----------
     Added 2026-09-22. Scope: major cabinet-level departments, constitutional offices, and
     independent commissions — not every board, examiner panel, or judicial-branch office
     Nebraska runs (there are 100+ of those). Each entry below was checked against that
     body's own official site; the same "never invent, leave it null" rule applies. */

  {
    id: "revenue",
    name: "Nebraska Department of Revenue",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "PO Box 94818\nLincoln, NE 68509-4818",
    email: null,
    phone: "(402) 471-5729",
    portalUrl: null,
    notes:
      "No dedicated public-records page exists on the department's own site, unlike several " +
      "peer agencies. Address the request to the department generally and say plainly that " +
      "it's a public-records request, not a tax question.",
    caution:
      "Searching for Revenue records surfaces the Nebraska Lottery's own dedicated public-" +
      "records page instead (nelottery.com, lottery@nelottery.com). The Lottery is a " +
      "division of Revenue, but that contact only covers lottery and charitable-gaming " +
      "records, not general department (tax) records.",
    likelyExemptions: [20, 3, 8, 4, 11, 7],
    sourceUrl: "https://revenue.nebraska.gov/about/contact-us",
    verifiedOn: "2026-09-22",
  },

  {
    id: "corrections",
    name: "Nebraska Department of Correctional Services",
    type: "state-agency",
    contactRole: "Public Records Manager",
    contactName: "Kathleen Kokensparger",
    address: "Public Disclosure Unit\nNebraska Department of Correctional Services\nP.O. Box 94661\nLincoln, NE 68509",
    email: "DCS.PublicRecords@nebraska.gov",
    phone: null,
    portalUrl: null,
    notes:
      "Put the request in writing, state it's made under the Nebraska Public Records " +
      "Statutes, and describe the records specifically (name a date range if you can). No " +
      "fee to submit; a cost estimate follows only if fulfilling it takes significant work. " +
      "Response due within 4 business days.",
    caution:
      "The site's \"Incarceration Records\" database is a separate tool for looking up an " +
      "individual inmate — it is not the public-records process for department records " +
      "generally.",
    likelyExemptions: [9, 5, 2, 8, 6, 4],
    sourceUrl: "https://corrections.nebraska.gov/news-information/public-records-request",
    verifiedOn: "2026-09-22",
  },

  {
    id: "education",
    name: "Nebraska Department of Education",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "P.O. Box 94987\nLincoln, NE 68509-4987",
    email: null,
    phone: "(402) 471-2295",
    portalUrl: "https://education.ne.gov/contact-us/",
    notes:
      "Route the request through the general contact form and pick \"Public Records " +
      "Requests\" from the subject dropdown — there's no separate records desk. Department " +
      "policy targets a 4-business-day response.",
    caution:
      "A request for an individual student's own records (transcripts, discipline file) " +
      "goes to that student's local school district, not NDE — NDE is the wrong desk for " +
      "FERPA-protected student records.",
    likelyExemptions: [1, 8, 2, 4],
    sourceUrl: "https://education.ne.gov/contact-us/",
    verifiedOn: "2026-09-22",
  },

  {
    id: "transportation",
    name: "Nebraska Department of Transportation",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "Nebraska Department of Transportation\n1500 Nebraska Parkway\nP.O. Box 94759\nLincoln, NE 68502",
    email: "NDOT.PublicRecords@Nebraska.gov",
    phone: null,
    portalUrl: "https://dot.nebraska.gov/request-public-records/",
    notes:
      "Use the online form or email — the department states phone and text requests do not " +
      "count as open-records requests, and it no longer accepts them by fax. First 8 hours " +
      "of search/redaction time are free for Nebraska residents; a deposit may be required " +
      "above $50. An unanswered second notice closes the request after 5 business days.",
    caution:
      "Vehicle registration and driving records are handled by the separate Department of " +
      "Motor Vehicles, not NDOT.",
    likelyExemptions: [9, 7, 3, 8, 4],
    sourceUrl: "https://dot.nebraska.gov/request-public-records/",
    verifiedOn: "2026-09-22",
  },

  {
    id: "labor",
    name: "Nebraska Department of Labor",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "No dedicated public-records contact, address, or portal is published anywhere on the " +
      "department's own site. Its privacy statement acknowledges the data it holds is " +
      "subject to the Public Records Law but gives no request procedure — address a request " +
      "to the department generally and expect to have to ask who the custodian is.",
    caution:
      "The published Labor Standards inquiry line (wage/hour and workplace-safety questions) " +
      "is not a records-request channel.",
    likelyExemptions: [20, 3, 8, 4, 2],
    sourceUrl: "https://dol.nebraska.gov/ContactUs",
    verifiedOn: "2026-09-22",
  },

  {
    id: "dmv",
    name: "Nebraska Department of Motor Vehicles",
    type: "state-agency",
    contactRole: "Legal Division",
    contactName: null,
    address: "P.O. Box 94877\nLincoln, NE 68509-4877",
    email: null,
    phone: "(402) 471-9593",
    portalUrl: null,
    notes:
      "No dedicated public-records/FOIA page; Legal Division is the closest confirmed " +
      "contact for general department records. Individual driver and vehicle history " +
      "records go through a separate notarized-request process (§ 60-483 / § 60-3,161), " +
      "not this one.",
    caution:
      "The Driver and Vehicle Records (DVR) division handles individual driving/vehicle " +
      "history lookups — a different process from a general records request about " +
      "department operations.",
    likelyExemptions: [8, 9, 20],
    sourceUrl: "https://dmv.nebraska.gov/legal/contact",
    verifiedOn: "2026-09-22",
  },

  {
    id: "agriculture",
    name: "Nebraska Department of Agriculture",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "PO Box 94947\nLincoln, NE 68509-4947",
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "Submit via the department's Records Request Form (a downloadable PDF, not an online " +
      "portal). Nebraska residents and media are billed only once search/redaction time " +
      "exceeds 8 cumulative hours; non-residents can be billed from the start, with a $50 " +
      "minimum.",
    caution: null,
    likelyExemptions: [3, 8, 20],
    sourceUrl: "https://nda.nebraska.gov/records",
    verifiedOn: "2026-09-22",
  },

  {
    id: "dwee",
    name: "Nebraska Department of Water, Energy, and Environment",
    type: "state-agency",
    contactRole: "Records Management Section",
    contactName: null,
    /* Formed 2025-07-01 when LB317 merged the former Department of Environment and Energy
       and Department of Natural Resources into one agency. Both old sites now redirect
       here; this one contact covers what used to be two separate entries. */
    address: "DWEE Records Management Section\n245 Fallbrook Blvd, Suite 100\nLincoln, NE 68521",
    email: null,
    phone: "(402) 471-2186",
    portalUrl: "https://dwee.justfoia.com/publicportal/home/newrequest",
    notes:
      "Requests must be in writing: fax to (402) 471-2909, submit via the portal, or mail. " +
      "Facility records scanned since April 2011 are searchable online first (call to get " +
      "the facility number); older records need a formal request or an in-person file " +
      "review. Answered within 4 business days; first 20 pages free, then $0.25/page, $10 " +
      "for a CD/flash drive, $25/hr for work past 4 cumulative hours, deposit required above " +
      "$50.",
    caution:
      "If you find an old bookmark or citation for \"Department of Environment and Energy\" " +
      "or \"Department of Natural Resources,\" it's this agency now — both were merged into " +
      "DWEE.",
    likelyExemptions: [3, 9, 10, 7],
    sourceUrl: "https://dwee.nebraska.gov/about/request-public-records",
    verifiedOn: "2026-09-22",
  },

  {
    id: "insurance",
    name: "Nebraska Department of Insurance",
    type: "state-agency",
    contactRole: "Office Services Section",
    contactName: "Robin Edwards",
    address: "PO Box 95087\nLincoln, NE 68509-5087",
    email: "Robin.Edwards@nebraska.gov",
    phone: "(402) 471-2201",
    portalUrl: null,
    notes:
      "Office Services Section is described on the department's own site as responsible for " +
      "providing copies of public documents. No fee or turnaround policy is published for " +
      "records requests specifically.",
    caution:
      "The department's online filing portal and the SERFF system are for insurer/producer " +
      "regulatory filings, not public-records requests — they'll surface first in a search " +
      "but aren't the right channel.",
    likelyExemptions: [3, 2, 20],
    sourceUrl: "https://doi.nebraska.gov/contact",
    verifiedOn: "2026-09-22",
  },

  {
    id: "banking",
    name: "Nebraska Department of Banking and Finance",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "PO Box 95006\n1526 K St #300\nLincoln, NE 68508",
    email: null,
    phone: "(402) 471-2171",
    portalUrl: null,
    notes:
      "No general public-records process is published; the phone number reaches the " +
      "Financial Institutions Division. Examination and investigation reports are " +
      "separately confidential under Neb. Rev. Stat. § 8-112 and generally aren't available " +
      "through a records request at all.",
    caution: null,
    likelyExemptions: [3, 20, 8],
    sourceUrl: "https://ndbf.nebraska.gov/about/contact-us",
    verifiedOn: "2026-09-22",
  },

  {
    id: "econ-dev",
    name: "Nebraska Department of Economic Development",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "245 Fallbrook Blvd, Suite 002\nLincoln, NE 68521",
    email: null,
    phone: "(800) 426-6505",
    portalUrl: null,
    notes:
      "No dedicated public-records contact or process is published; use the general " +
      "\"Contact DED\" form. The department does publish a Non-Disclosure Request form for " +
      "applicants seeking to shield their own incentive-application materials, which " +
      "confirms those records are otherwise subject to the Public Records Act.",
    caution: null,
    likelyExemptions: [3, 20, 8],
    sourceUrl: "https://opportunity.nebraska.gov/contact/",
    verifiedOn: "2026-09-22",
  },

  {
    id: "game-parks",
    name: "Nebraska Game and Parks Commission",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: null,
    email: null,
    phone: null,
    portalUrl: null,
    notes:
      "This agency's own contact page could not be directly verified during this pass (the " +
      "site blocked automated access) — confirm current contact details at " +
      "outdoornebraska.gov before relying on them.",
    caution: null,
    likelyExemptions: [5, 9, 8],
    sourceUrl: "https://outdoornebraska.gov/about/contact-us/",
    verifiedOn: "2026-09-22",
  },

  {
    id: "das",
    name: "Nebraska Department of Administrative Services",
    type: "state-agency",
    contactRole: "General Counsel",
    contactName: "Michelle Potts",
    address: "1526 K Street\nLincoln, NE 68508",
    email: "michelle.potts@nebraska.gov",
    phone: "(402) 432-0121",
    portalUrl: null,
    notes:
      "DAS is an umbrella agency — Budget, Personnel, Risk Management, Fleet, and Materiel/" +
      "Purchasing each keep their own records. General Counsel is the best broad contact " +
      "for anything outside procurement; a dedicated records-request form and email " +
      "(as.recordsmaterielpurchasing@nebraska.gov, (402) 471-6500) also exists but covers " +
      "State Purchasing Bureau/Materiel records only.",
    caution:
      "The one contact clearly labeled for \"records requests\" on the site is scoped to " +
      "the State Purchasing Bureau. A request for unrelated DAS records (HR, budget, " +
      "leases) sent there will likely land on the wrong desk — start with General Counsel " +
      "instead.",
    likelyExemptions: [3, 8, 20, 9],
    sourceUrl: "https://das.nebraska.gov/contact/",
    verifiedOn: "2026-09-22",
  },

  {
    id: "veterans",
    name: "Nebraska Department of Veterans' Affairs",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "301 Centennial Mall South, 4th Floor\nPO Box 95083\nLincoln, NE 68509-5083",
    email: "ndva@nebraska.gov",
    phone: "(402) 471-2458",
    portalUrl: "https://veterans.nebraska.gov/dd-214-online-request",
    notes:
      "The online portal only covers DD-214/discharge-document requests, restricted to the " +
      "veteran, their legal representative, or the family of a deceased veteran. General " +
      "department records (budget, policy, correspondence) go through the Central Office " +
      "contact instead — no separate general-records process is published.",
    caution:
      "Don't confuse the DD-214 portal with a general public-records system — it releases " +
      "individual discharge documents only, under its own eligibility rules.",
    likelyExemptions: [2, 8, 20],
    sourceUrl: "https://veterans.nebraska.gov/contact-us",
    verifiedOn: "2026-09-22",
  },

  {
    id: "crime-commission",
    name: "Nebraska Crime Commission",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "301 Centennial Mall South\nPO Box 94946\nLincoln, NE 68509-4946",
    email: null,
    phone: "(402) 471-2194",
    portalUrl: null,
    notes:
      "No formal public-records intake process, form, or named contact is published. The " +
      "commission does publish statistical crime-data reports directly on its site, which " +
      "may cover what you're after without a formal request.",
    caution:
      "Searching for this commission's records repeatedly surfaces Nebraska State Patrol's " +
      "criminal-history/background-check pages instead. The Crime Commission (policy, " +
      "grants, statistics) is a different agency from the State Patrol (individual " +
      "criminal-history records).",
    likelyExemptions: [5, 9, 6, 8],
    sourceUrl: "https://ncc.nebraska.gov/contact-us",
    verifiedOn: "2026-09-22",
  },

  {
    id: "psc",
    name: "Nebraska Public Service Commission",
    type: "state-agency",
    contactRole: "Records Officer",
    contactName: null,
    address: "Records Officer Public Records Request\n300 The Atrium, 1200 N Street\nP.O. Box 94927\nLincoln, NE 68709-4927",
    email: "psc.records@nebraska.gov",
    phone: null,
    portalUrl: null,
    notes:
      "Submit by email, fax ((402) 471-0254), or mail. By the commission's own stated " +
      "practice, requests are processed within 4 business days; fees apply past 4 hours of " +
      "staff time, with a deposit required above $50.",
    caution: null,
    likelyExemptions: [3, 4, 12, 9],
    sourceUrl: "https://psc.nebraska.gov/administration/public-information",
    verifiedOn: "2026-09-22",
  },

  {
    id: "sos",
    name: "Nebraska Secretary of State",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "P.O. Box 94608\nLincoln, NE 68509-4608",
    email: null,
    phone: "(402) 471-2554",
    portalUrl: null,
    notes: "No dedicated contact for records requests to the Secretary of State's own agency files was found.",
    caution:
      "The Secretary of State's \"Records Management\" office runs the statewide records-" +
      "retention program for OTHER agencies — it is not a request channel for the " +
      "Secretary of State's own records, though it's the first thing a search for \"SOS " +
      "records\" turns up.",
    likelyExemptions: [3, 20, 9],
    sourceUrl: "https://sos.nebraska.gov/contact",
    verifiedOn: "2026-09-22",
  },

  {
    id: "treasurer",
    name: "Nebraska State Treasurer",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "State Capitol, Room 2005\nPO Box 94788\nLincoln, NE 68509-4788",
    email: null,
    phone: "(402) 471-2455",
    portalUrl: null,
    notes: "No dedicated records-request contact or procedure is published.",
    caution:
      "The Unclaimed Property Division is far more prominently advertised (877-572-9688) " +
      "and is likely what a search surfaces first — it's a property-lookup tool, not a " +
      "records-request channel.",
    likelyExemptions: [20, 12],
    sourceUrl: "https://treasurer.nebraska.gov/contact.aspx",
    verifiedOn: "2026-09-22",
  },

  {
    id: "auditor",
    name: "Nebraska Auditor of Public Accounts",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "State Capitol, Suite 2303\nP.O. Box 98917\nLincoln, NE 68509-8917",
    email: null,
    phone: "(402) 471-2111",
    portalUrl: null,
    notes:
      "Completed audit reports are already published and searchable on the office's own " +
      "site — worth checking there before filing a request. No dedicated records contact " +
      "is published for anything else (correspondence, workpapers).",
    caution:
      "The office's \"Report Fraud, Waste, and Abuse\" portal is prominent on the site and " +
      "easy to mistake for a records-request channel — it isn't one.",
    likelyExemptions: [4, 3, 8, 9],
    sourceUrl: "https://auditors.nebraska.gov/About_Us/staff.html",
    verifiedOn: "2026-09-22",
  },

  {
    id: "ag-office",
    name: "Nebraska Attorney General's Office",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "1445 K Street, Room 2115\nLincoln, NE 68508",
    email: "ago.info.help@nebraska.gov",
    phone: "(402) 471-2683",
    portalUrl: null,
    notes:
      "For the AG's OWN records (case files, contracts, correspondence) — a different thing " +
      "from the Attorney General petition this tool can draft after a denial, which is the " +
      "same office acting in its review role for OTHER agencies' denials, not as records " +
      "custodian of its own files.",
    caution:
      "Nearly everything the AG's site publishes about \"public records\" concerns its role " +
      "deciding petitions when other agencies deny a request. Don't route a request for the " +
      "AG's own files into the petition process.",
    likelyExemptions: [4, 5, 3, 8, 20],
    sourceUrl: "https://ago.nebraska.gov/contact-us",
    verifiedOn: "2026-09-22",
  },

  {
    id: "workers-comp-court",
    name: "Nebraska Workers' Compensation Court",
    type: "state-court",
    contactRole: "Court Clerk",
    contactName: null,
    address: null,
    email: null,
    phone: "(402) 471-6468, or (800) 599-5155 toll-free",
    portalUrl: "https://www.newcc.gov/resources/record-request",
    notes:
      "Use the online record-request form; call if you can't complete it online. The court " +
      "explicitly warns not to email Social Security numbers or dates of birth, since email " +
      "isn't secure.",
    caution:
      "The court's own site had an active relocation notice for its Lincoln offices at the " +
      "time of this research — confirm the current mailing address directly with the court " +
      "before mailing anything.",
    likelyExemptions: [2, 8, 20],
    sourceUrl: "https://www.newcc.gov/resources/record-request",
    verifiedOn: "2026-09-22",
  },

  {
    id: "liquor-control",
    name: "Nebraska Liquor Control Commission",
    type: "state-agency",
    contactRole: null,
    contactName: null,
    address: "301 Centennial Mall South, 1st Floor\nPO Box 95046\nLincoln, NE 68509-5046",
    email: "lcc.frontdesk@nebraska.gov",
    phone: "(402) 471-2571",
    portalUrl: null,
    notes: "No dedicated records-request contact or procedure is published; the front desk is the best available contact.",
    caution:
      "The commission's most visible online tools are for license lookup/verification (the " +
      "POSSE portal and Active License Roster) — neither is a records-request channel.",
    likelyExemptions: [5, 9, 3],
    sourceUrl: "https://lcc.nebraska.gov/",
    verifiedOn: "2026-09-22",
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
