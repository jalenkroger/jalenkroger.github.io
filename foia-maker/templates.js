/* Letter templates. Each takes a request object and returns plain text.

   These letters are written to be sent as-is by someone who is not a lawyer, so they
   quote the statute rather than paraphrase it, and they ask for specific things the
   statute actually entitles the requester to. */

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function longDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

function todayIso() {
  return ymd(new Date());
}

function addressBlock(req) {
  const agency = agencyById(req.agencyId);
  const lines = [];
  lines.push(req.agencyNameOverride || (agency && agency.name) || "[Public body]");
  const role = (agency && agency.contactRole) || "Records Custodian";
  lines.unshift(role);
  const addr = req.agencyAddressOverride || (agency && agency.address);
  lines.push(addr || "[Mailing address — look this up before sending]");
  return lines.join("\n");
}

function signatureBlock(req) {
  const r = req.requester || {};
  const lines = ["Sincerely,", "", r.name || "[Your name]"];
  if (r.org) lines.push(r.org);
  if (r.address) lines.push(r.address);
  if (r.email) lines.push(r.email);
  if (r.phone) lines.push(r.phone);
  return lines.join("\n");
}

const TEMPLATES = {
  initial(req) {
    const agency = agencyById(req.agencyId);
    const parts = [];

    parts.push(longDate(req.dateSent || todayIso()));
    parts.push("");
    parts.push(addressBlock(req));
    parts.push("");
    parts.push("Re: Public records request under Neb. Rev. Stat. § 84-712");
    parts.push("");
    parts.push("Dear Records Custodian:");
    parts.push("");
    parts.push(
      "Under Nebraska's public records statutes, Neb. Rev. Stat. § 84-712 et seq., I " +
        "request access to and copies of the following records:",
    );
    parts.push("");
    parts.push(req.description || "[Describe the records you are seeking.]");

    if (req.dateRange) {
      parts.push("");
      parts.push(`This request is limited to records created or received during ${req.dateRange}.`);
    }

    parts.push("");
    parts.push("FORMAT");
    parts.push(
      'Neb. Rev. Stat. § 84-712.01(1) provides that "Data which is a public record in its ' +
        'original form shall remain a public record when maintained in computer files." ' +
        "Where responsive records are kept electronically, I ask that they be provided in " +
        "their native electronic format — a spreadsheet as a spreadsheet file, for example, " +
        "rather than as a printout or a scan of a printout. Native files are both cheaper " +
        "for your office to produce and more useful to me.",
    );
    if (req.formatPreference) {
      parts.push("");
      parts.push(`Preferred delivery: ${req.formatPreference}.`);
    }

    parts.push("");
    parts.push("FEES");
    const feeLines = [];
    if (req.feeCeiling) {
      feeLines.push(
        `Please do not incur costs above $${req.feeCeiling} without contacting me first. ` +
          "Under § 84-712(3), a special service charge may be assessed only where the request " +
          "requires more than four cumulative hours of work, and I am entitled to an estimate " +
          "of expected cost before that work is done.",
      );
    } else {
      feeLines.push(
        "Please provide an estimate of any expected cost before incurring it, as § 84-712(3) " +
          "requires.",
      );
    }
    if (req.feeWaiverRequested) {
      feeLines.push(
        "I request a waiver or reduction of fees. These records are sought to inform the " +
          "public about the conduct of government rather than for any commercial purpose.",
      );
    }
    if (agency && agency.id === "nu" && req.feeWaiverRequested) {
      feeLines.push(
        "University policy EM 22 provides that the cost of a public records request may be " +
          "discounted or waived where the request is deemed central to the public's right to " +
          "know. I ask that this request be considered on that basis.",
      );
    }
    parts.push(feeLines.join(" "));

    parts.push("");
    parts.push("TIMING");
    parts.push(
      "Neb. Rev. Stat. § 84-712(4) requires that you respond as soon as is practicable and " +
        "without delay, and not more than four business days after actual receipt of this " +
        `request. By my calculation that period ends on ${longDate(req.deadline)}. If any part ` +
        "of this request is unclear or broader than necessary, please contact me — I would " +
        "rather narrow it than have it denied.",
    );

    parts.push("");
    parts.push("IF ANY PART IS WITHHELD");
    parts.push(
      "Neb. Rev. Stat. § 84-712.05 provides that certain records may be withheld. It is " +
        "permissive, not mandatory, and I ask that you exercise it in favor of disclosure. " +
        "If you do withhold any portion, § 84-712.04 requires that the denial be in writing " +
        "and include a description of the contents withheld, the specific statute and " +
        "subsection relied on for each withheld portion, the name of the official responsible " +
        "for the decision, and notice of my rights of review. Please also release any " +
        "reasonably segregable portions of records that are otherwise exempt.",
    );

    parts.push("");
    parts.push(signatureBlock(req));

    return parts.join("\n");
  },

  followUp(req) {
    const parts = [];
    parts.push(longDate(todayIso()));
    parts.push("");
    parts.push(addressBlock(req));
    parts.push("");
    parts.push("Re: Overdue public records request — follow-up");
    parts.push("");
    parts.push("Dear Records Custodian:");
    parts.push("");
    parts.push(
      `On ${longDate(req.dateSent)} I submitted a written request for public records under ` +
        "Neb. Rev. Stat. § 84-712. The records sought were:",
    );
    parts.push("");
    parts.push(req.description || "[records described in the original request]");
    parts.push("");
    parts.push(
      "Neb. Rev. Stat. § 84-712(4) required a response not more than four business days " +
        `after actual receipt of that request — by my calculation, ${longDate(req.deadline)}. ` +
        "As of today I have not received the records, a written denial, an estimate of costs, " +
        "or a written explanation of why the request cannot be fulfilled within four business " +
        "days. The statute requires one of those four responses.",
    );
    parts.push("");
    parts.push(
      "I am asking you to provide the records now. If you are withholding any portion, " +
        "§ 84-712.04 requires a written denial that describes the contents withheld, cites the " +
        "particular statute and subsection for each withheld portion, names the official " +
        "responsible for the decision, and notifies me of my rights of review.",
    );
    parts.push("");
    parts.push(
      "If the volume or complexity of this request is the obstacle, please tell me so in " +
        "writing along with an estimate of when it can be fulfilled, and I will work with you " +
        "to narrow it.",
    );
    parts.push("");
    parts.push(
      "If I do not receive a response, Neb. Rev. Stat. § 84-712.03 allows me to petition the " +
        "Attorney General to review the matter or to seek relief in district court. I would " +
        "prefer to resolve this directly with your office.",
    );
    parts.push("");
    parts.push(signatureBlock(req));
    return parts.join("\n");
  },

  /* The AG does not take a freeform letter as the process — the office publishes a Public
     Records Petition Form. So this produces a cover letter plus a labeled facts block the
     user can transcribe onto that form, rather than pretending a letter alone starts the
     clock. */
  agPetition(req) {
    const agency = agencyById(req.agencyId);
    const bodyName = req.agencyNameOverride || (agency && agency.name) || "[Public body]";
    const parts = [];

    parts.push(
      "HOW TO USE THIS DRAFT\n" +
        "The Attorney General's office reviews public records disputes through its Public " +
        "Records Petition Form, not through a letter alone. Download the form at\n" +
        `  ${AG_PETITION.formUrl}\n` +
        "fill it out using the facts below, and send it to:\n" +
        `  ${AG_PETITION.office}, ${AG_PETITION.address}\n` +
        `  ${AG_PETITION.phone}\n` +
        "Attach a copy of your original request and any response you received. Under " +
        "§ 84-712.03(1)(b) the Attorney General must determine the matter within " +
        `${AG_PETITION.decisionDays} calendar days.\n` +
        "Delete this section before sending.",
    );
    parts.push("");
    parts.push("—".repeat(60));
    parts.push("");
    parts.push(longDate(todayIso()));
    parts.push("");
    parts.push(`${AG_PETITION.office}\n${AG_PETITION.address}`);
    parts.push("");
    parts.push("Re: Petition for review under Neb. Rev. Stat. § 84-712.03(1)(b)");
    parts.push("");
    parts.push("To the Attorney General:");
    parts.push("");
    parts.push(
      `I petition your office to review the handling of a public records request I made to ` +
        `${bodyName}. The facts are set out below.`,
    );
    parts.push("");
    parts.push("FACTS");
    parts.push(`Public body: ${bodyName}`);
    parts.push(`Date request submitted: ${longDate(req.dateSent)}`);
    parts.push(`Four-business-day deadline under § 84-712(4): ${longDate(req.deadline)}`);
    parts.push(
      `What happened: ${
        req.status === "denied"
          ? "The request was denied."
          : "No response was received within the statutory period."
      }`,
    );
    if (req.denialReason) parts.push(`Reason given for denial: ${req.denialReason}`);
    parts.push("");
    parts.push("Records requested:");
    parts.push(req.description || "[records described in the original request]");

    if (req.history && req.history.length) {
      parts.push("");
      parts.push("Chronology:");
      for (const h of req.history) {
        parts.push(`  ${longDate(h.date)} — ${h.event}`);
      }
    }

    parts.push("");
    parts.push(
      "Neb. Rev. Stat. § 84-712.05 makes the listed exemptions permissive rather than " +
        "mandatory, and § 84-712.04 requires that any denial identify the particular statute " +
        "and subsection relied on for each withheld portion. I ask your office to determine " +
        "whether these records may lawfully be withheld and, if not, to direct that they be " +
        "disclosed.",
    );
    parts.push("");
    parts.push(signatureBlock(req));
    return parts.join("\n");
  },
};
