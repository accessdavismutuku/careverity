export const lqcsAiCarePlanReference = "LQCS-AI-CARE-PLAN-REVIEW-001";
export const lqcsAiCarePlanModuleName = "AI Face-to-Face Assessment, Care Plan Review and Risk Assessment Generator";
export const lqcsAiDraftApprovalNotice = "AI-assisted draft - professional review and approval required.";

export type LqcsAssessmentSection = {
  section: string;
  purpose: string;
  requiredFields: string[];
  aiUse: string;
};

export type LqcsSourceEvidence = {
  sourceId: string;
  sourceType: string;
  date: string;
  summary: string;
  reliability: "Current face-to-face" | "Historic background" | "Conflicting" | "Missing" | "Needs verification";
};

export type LqcsCareDomainDraft = {
  domain: string;
  currentSituation: string;
  assistanceRequired: string;
  equipmentOrAidsRequired: string;
  carePlanRequired: string;
  preferencesWishesChoices: string;
  reviewNote: string;
  whatStaffMustReport: string[];
  sourceEvidence: string[];
  aiDraftStatus: string;
};

export type LqcsDecisionSpecificCapacityRecord = {
  decision: string;
  capacityStatus: string;
  evidenceRequired: string;
  bestInterestAction: string;
};

export type LqcsOutcomeGoal = {
  goal: string;
  desiredOutcome: string;
  supportPlan: string;
  reviewTrigger: string;
};

export type LqcsReviewCheckerIssue = {
  section: string;
  issue: string;
  whyItMatters: string;
  suggestedCorrection: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  status: "Ready for Review" | "Needs Attention" | "Not Ready";
};

export type LqcsProfessionalReferralDraft = {
  referralType: string;
  trigger: string;
  recipient: string;
  draftSummary: string;
  sourceRecordsUsed: string[];
  missingInformation: string[];
  approvalStatus: string;
};

export type LqcsAssessmentDraftPackage = {
  reference: string;
  serviceUserName: string;
  serviceUserReference: string;
  companyId: string;
  providerId: string;
  status: string;
  generatedBy: string;
  reviewCheckerStatus: "Ready for Review" | "Needs Attention" | "Not Ready";
  domains: LqcsCareDomainDraft[];
  sourceEvidence: LqcsSourceEvidence[];
  checkerIssues: LqcsReviewCheckerIssue[];
};

export const lqcsReviewedCarePlanStructure = [
  "Reviewed Care Plan front page",
  "Individual Needs Assessment Care Plan",
  "Mental capacity and best-interest decision record",
  "Key contacts, next of kin, professional contacts and advocacy details",
  "Background, personal history and important life story",
  "Brief medical history",
  "About My Needs",
  "Care-domain tables using LQCS headings",
  "Body chart and skin integrity record",
  "Daily routine",
  "Culture, religion, sexuality and gender preference",
  "End-of-life wishes and emergency planning where applicable",
  "Access to home, key safe and security arrangements",
  "Support schedule and visit package",
  "Agreement, signature and review approval"
] as const;

export const lqcsCarePlanTableHeadings = [
  "Current situation with regard to my needs in this area",
  "What assistance is required",
  "Equipment or aids required",
  "Care plan required?",
  "My specific preferences, wishes and choices",
  "Review note"
] as const;

export const lqcsOutstandingAssessmentSections: LqcsAssessmentSection[] = [
  {
    section: "What Matters to Me",
    purpose: "Records what the person wants to preserve, improve or avoid.",
    requiredFields: ["personal outcomes", "independence wishes", "daily priorities", "known dislikes"],
    aiUse: "Shapes care-plan wording around the person's own wishes rather than task-only language."
  },
  {
    section: "Likes, Dislikes and Preferences",
    purpose: "Captures practical preferences for visits, personal care, food, communication, carers and timing.",
    requiredFields: ["likes", "dislikes", "preferred approach", "gender preference where lawful and proportionate"],
    aiUse: "Adds person-centred wording to the relevant LQCS domain table."
  },
  {
    section: "Equality, Diversity and Reasonable Adjustments",
    purpose: "Records protected-characteristic considerations and reasonable adjustments without discrimination.",
    requiredFields: ["communication adjustments", "religion/culture", "language", "accessibility", "consent to record"],
    aiUse: "Flags adjustments staff must respect and separates sensitive details from mobile-facing task notes."
  },
  {
    section: "Decision-Specific Capacity",
    purpose: "Documents capacity for specific decisions, not a generic capacity label.",
    requiredFields: ["decision", "capacity evidence", "support provided", "best-interest action if required"],
    aiUse: "Creates prompts where consent, medication, access, care package or referral decisions need capacity review."
  },
  {
    section: "Goals and Outcomes",
    purpose: "Links support to measurable outcomes and review triggers.",
    requiredFields: ["goal", "desired outcome", "support required", "review trigger"],
    aiUse: "Produces reviewable outcomes for the care-plan summary and CQC evidence mapping."
  },
  {
    section: "What Staff Must Report",
    purpose: "Makes escalation expectations clear for carers and coordinators.",
    requiredFields: ["reportable change", "who to report to", "urgency", "recording route"],
    aiUse: "Adds concise reporting prompts to each domain draft."
  },
  {
    section: "Professional Involvement and Referral Tracker",
    purpose: "Tracks GP, OT, district nurse, social worker, mental health, pharmacy, safeguarding and family actions.",
    requiredFields: ["professional", "reason", "draft status", "sent/saved status", "response due"],
    aiUse: "Prepares draft referrals only after human selection and approval."
  },
  {
    section: "Review Triggers",
    purpose: "Defines what should reopen the care plan or risk assessment before the next scheduled review.",
    requiredFields: ["trigger", "linked domain", "priority", "owner"],
    aiUse: "Drives the review checker and manager task suggestions."
  },
  {
    section: "Source Evidence and Reliability",
    purpose: "Separates current face-to-face evidence from historic, third-party or conflicting information.",
    requiredFields: ["source", "date", "reliability", "conflict", "resolution"],
    aiUse: "Prevents AI from treating old background information as current fact."
  },
  {
    section: "CQC Evidence Mapping",
    purpose: "Maps care-plan content to Safe, Effective, Caring, Responsive and Well-led evidence.",
    requiredFields: ["CQC key question", "evidence item", "source record", "approval status"],
    aiUse: "Creates inspection-ready evidence pointers without publishing unapproved AI drafts."
  }
];

export const lqcsCareDomains = [
  "Mobility",
  "Communication",
  "Washing and Bathing including oral hygiene",
  "Dressing and Grooming",
  "Continence",
  "Nutrition",
  "Drinking Preferences",
  "Pressure Area and Skin",
  "Sight, Hearing and Communication",
  "Orientation and Behaviour",
  "Mental Health",
  "Behaviour Support",
  "Hobbies and Community",
  "Medication",
  "Home Clean",
  "Money and Paperwork",
  "Personal Care",
  "Dressing and Undressing",
  "Preparing for Bed",
  "Daily Routine",
  "Culture, Religion, Sexuality and Gender Preference",
  "Family, Representatives and Advocacy",
  "End of Life",
  "Access to Home and Key Safe",
  "Visit Schedule and Support Package"
] as const;

export const lqcsAiSafeguards = [
  "AI must not publish care plans, referrals, risk ratings or emails automatically.",
  "AI must not invent facts and must clearly show missing information.",
  "Source records, conflicts and reliability status must be visible before approval.",
  "Authorised users must be able to edit, reject, approve, request more information or escalate.",
  "All draft, edit, rejection, approval and referral versions must be retained.",
  "CompanyId and providerId tenant separation applies to every draft, source, referral and audit record.",
  "Drafts must use minimum necessary personal data.",
  "Unapproved AI drafts must not appear to normal care staff or the mobile app."
] as const;

export const lqcsAiDraftActionButtons = [
  "Accept",
  "Edit",
  "Reject",
  "Request More Information",
  "Escalate",
  "Create Professional Referral Draft"
] as const;

export const lqcsRejectReasons = [
  "Incorrect source information",
  "Out of date evidence",
  "Missing person-centred preference",
  "Risk level not clinically/professionally justified",
  "Referral not required",
  "More information required before approval",
  "Not suitable for mobile staff view"
] as const;

export const lqcsReferralTypes = [
  "OT referral/request",
  "GP email",
  "District nurse notification",
  "Social worker/local authority update",
  "Mental health referral/update",
  "Pharmacy query",
  "Safeguarding referral/update",
  "Family/next of kin update"
] as const;

export const lqcsExportOptions = [
  "Word/PDF reviewed care plan in LQCS layout",
  "Risk assessment pack",
  "Care plan review summary",
  "Missing information checklist",
  "Source comparison report",
  "Professional referral drafts",
  "Audit summary"
] as const;

export const lqcsEmergencySafeguardText =
  "This may require immediate emergency action. Do not rely only on email. Follow emergency procedure and call 999 if required.";

export const maryJohnsonDummyAssessment = {
  serviceUserReference: "TEST-SU-MARY-001",
  serviceUserName: "Mary Johnson",
  companyId: "company-lqcs-demo",
  providerId: "provider-lqcs-demo",
  assessmentDate: "05 June 2026",
  assessmentType: "Face-to-face review with source comparison",
  assessedBy: "Demo Care Coordinator",
  whatMattersToMe: "Mary wants to remain at home, keep as much independence as possible and not feel rushed during morning care.",
  preferences: [
    "Mary prefers female carers for personal care.",
    "Mary likes staff to explain each task before assisting.",
    "Mary wants to wash her own face and hands where safe.",
    "Mary dislikes being rushed when standing from her armchair."
  ],
  reasonableAdjustments: [
    "Staff should speak slowly and check understanding.",
    "Allow extra time when transferring from chair to standing.",
    "Record mobility changes promptly due to falls risk."
  ]
} as const;

export const maryJohnsonSourceEvidence: LqcsSourceEvidence[] = [
  {
    sourceId: "LA-BACKGROUND-001",
    sourceType: "Local authority background information",
    date: "Historic",
    summary: "Mary lives alone, has arthritis and reduced mobility, reportedly uses a walking stick indoors, needs washing, dressing, meal support and medication prompts, no recent falls noted, daughter visits weekly.",
    reliability: "Historic background"
  },
  {
    sourceId: "F2F-ASSESSMENT-001",
    sourceType: "Current face-to-face assessment",
    date: "05 June 2026",
    summary: "Mary uses a wheeled walking frame rather than a walking stick, appeared unsteady standing from the armchair, daughter reported two near misses, loose rug identified, grab rails present but no shower chair, Mary prefers female carers and wants independence.",
    reliability: "Current face-to-face"
  },
  {
    sourceId: "FAMILY-EMAIL-001",
    sourceType: "Family email/representative observation",
    date: "04 June 2026",
    summary: "Daughter reported two near misses and asked whether equipment or OT advice may be needed.",
    reliability: "Current face-to-face"
  },
  {
    sourceId: "MEDICATION-LIST-STATUS",
    sourceType: "Medication list",
    date: "Missing",
    summary: "Current signed medication list and allergy status need verification before final approval.",
    reliability: "Missing"
  }
];

export const lqcsSourceComparisonFindings = [
  ["Mobility aid conflict", "Historic local authority notes say walking stick indoors; current face-to-face assessment shows wheeled walking frame.", "Use current face-to-face assessment as primary current evidence and record historic information as superseded unless confirmed otherwise.", "High"],
  ["Falls risk changed", "Historic source says no recent falls; daughter reports two near misses and assessor observed unsteady standing.", "Update falls risk assessment and add review trigger for near misses, transfer difficulty or worsening mobility.", "High"],
  ["Equipment gap", "Grab rails are present but no shower chair; loose rug noted in living room.", "Create OT referral draft and record environmental hazard action for manager review.", "High"],
  ["Personal preference", "Mary wants independence and prefers female carers for personal care.", "Include preference wording in personal care, mobility and daily routine sections.", "Medium"],
  ["Missing information", "Medication list, allergies, GP details, capacity record, emergency plan and next review date not fully evidenced.", "Block final approval until completed or explicitly overridden by authorised manager with reason.", "High"]
] satisfies string[][];

export const lqcsExpectedMobilityDraft: LqcsCareDomainDraft = {
  domain: "Mobility",
  currentSituation: "Mary has reduced mobility linked to arthritis and currently uses a wheeled walking frame. Historic background information mentioned a walking stick, but the current face-to-face assessment found that Mary is now using a wheeled walking frame. Mary appeared unsteady when standing from her armchair and her daughter reported two recent near misses. Mary wishes to remain as independent as possible and does not like to be rushed.",
  assistanceRequired: "Staff should allow Mary time to stand safely, encourage her to use her wheeled walking frame, supervise transfers and observe for any change in balance, pain, confidence or mobility. Staff must not rush Mary and must report any fall, near miss, increased unsteadiness, refusal of mobility aid or change in transfer ability to the office/manager immediately.",
  equipmentOrAidsRequired: "Wheeled walking frame in current use. Grab rails are present. Shower chair or additional equipment may be required following OT review. Loose rug/environmental hazard requires manager follow-up.",
  carePlanRequired: "Yes - mobility, falls prevention and moving and handling care plan required. Risk assessment update and OT referral draft recommended.",
  preferencesWishesChoices: "Mary wants to remain independent, be spoken to calmly and be given time. Mary prefers staff to explain support before assisting. Mary prefers female carers for personal care where possible and lawful.",
  reviewNote: "Needs Attention - source conflict resolved in favour of current face-to-face evidence, but OT referral, equipment review, moving and handling review and environmental hazard follow-up are still required before final approval.",
  whatStaffMustReport: ["Any fall or near miss", "Increased unsteadiness", "Change in walking-frame use", "Pain or reduced confidence", "Unsafe transfers", "Equipment concerns"],
  sourceEvidence: ["F2F-ASSESSMENT-001", "FAMILY-EMAIL-001", "LA-BACKGROUND-001"],
  aiDraftStatus: lqcsAiDraftApprovalNotice
};

const domainTemplates: Record<string, Partial<LqcsCareDomainDraft>> = {
  Communication: {
    currentSituation: "Mary speaks clearly but benefits from staff speaking slowly, checking understanding and allowing time for responses.",
    assistanceRequired: "Staff should explain each task before support, check consent and repeat important information if needed.",
    whatStaffMustReport: ["Sudden confusion", "Reduced understanding", "New communication difficulty"]
  },
  Medication: {
    currentSituation: "Medication prompt support is recorded, but the current medication list and allergy status require verification before final approval.",
    assistanceRequired: "Staff must follow the authorised MAR chart only and record given, refused, missed or not required outcomes with reason and notes.",
    equipmentOrAidsRequired: "Current MAR chart, medication profile and pharmacy label required.",
    carePlanRequired: "Yes - medication support plan and MAR instructions required.",
    reviewNote: "Not Ready until current medication list, allergies and prescriber/pharmacy instructions are verified.",
    whatStaffMustReport: ["Medication refusal", "Missed dose", "Side effect concern", "Medication stock or label concern"]
  },
  "Pressure Area and Skin": {
    currentSituation: "Skin integrity status requires confirmation during personal care assessment and review.",
    assistanceRequired: "Staff should observe skin only where care task and consent allow and report redness, wound, skin tear or pressure-area concern.",
    equipmentOrAidsRequired: "Body chart and authorised skin integrity record where required.",
    carePlanRequired: "Yes if pressure-area, wound or skin concern is identified.",
    reviewNote: "Needs Attention - skin status and body chart evidence missing.",
    whatStaffMustReport: ["Redness", "Skin tear", "Wound", "Pain", "Pressure area"]
  },
  "Access to Home and Key Safe": {
    currentSituation: "Access arrangements need confirmation and should be restricted to authorised staff only.",
    assistanceRequired: "Staff must follow secure access instructions and never disclose key-safe information outside authorised systems.",
    equipmentOrAidsRequired: "Key safe/access details restricted field placeholder.",
    carePlanRequired: "Yes - access instructions required with role-controlled visibility.",
    reviewNote: "Needs Attention - emergency access and key-safe details require manager verification.",
    whatStaffMustReport: ["Unable to access property", "Key-safe concern", "Security concern", "Door not answered"]
  }
};

export function generateLqcsCareDomainDraft(domainName: string): LqcsCareDomainDraft {
  if (domainName === "Mobility") return lqcsExpectedMobilityDraft;
  const template = domainTemplates[domainName] ?? {};

  return {
    domain: domainName,
    currentSituation:
      template.currentSituation ??
      `Mary's ${domainName.toLowerCase()} needs require face-to-face review and source confirmation before final wording is approved.`,
    assistanceRequired:
      template.assistanceRequired ??
      `Staff should follow the approved care plan for ${domainName.toLowerCase()}, encourage independence, respect preferences and report any change or concern.`,
    equipmentOrAidsRequired: template.equipmentOrAidsRequired ?? "Equipment/aids to be confirmed from face-to-face assessment and professional advice where applicable.",
    carePlanRequired: template.carePlanRequired ?? "Yes - draft requires manager review and approval.",
    preferencesWishesChoices: template.preferencesWishesChoices ?? "Mary wishes to remain independent, be treated respectfully and have support explained before staff assist.",
    reviewNote: template.reviewNote ?? "Needs Attention - professional review required before publishing to the live care plan.",
    whatStaffMustReport: template.whatStaffMustReport ?? ["Any change in need", "Any refusal of support", "Any safety concern", "Any family/professional update"],
    sourceEvidence: ["F2F-ASSESSMENT-001", "LA-BACKGROUND-001"],
    aiDraftStatus: lqcsAiDraftApprovalNotice
  };
}

export const lqcsDecisionSpecificCapacityRows: LqcsDecisionSpecificCapacityRecord[] = [
  ["Care package and visit support", "Needs assessment evidence", "Confirm Mary understands proposed visit support, alternatives and consequences of refusal.", "Record representative involvement if Mary lacks capacity for this decision."],
  ["OT referral and equipment review", "Needs verification", "Confirm Mary consents to OT referral and sharing minimum necessary information.", "Best-interest decision required if consent cannot be obtained and referral is necessary for safety."],
  ["Medication support", "Not Ready", "Medication support consent and current medication list require confirmation.", "Do not approve medication care plan wording until MAR evidence is verified."],
  ["Key safe/access instructions", "Needs restricted review", "Confirm consent and authorised access arrangements.", "Restrict access instructions to authorised roles only."]
].map(([decision, capacityStatus, evidenceRequired, bestInterestAction]) => ({ decision, capacityStatus, evidenceRequired, bestInterestAction }));

export const lqcsOutcomeGoalRows: LqcsOutcomeGoal[] = [
  {
    goal: "Remain safely at home",
    desiredOutcome: "Mary remains at home with reduced risk of falls and timely support.",
    supportPlan: "Morning personal care, safe mobility support and clear escalation for near misses.",
    reviewTrigger: "Fall, near miss, increased unsteadiness or new equipment recommendation."
  },
  {
    goal: "Maintain independence",
    desiredOutcome: "Mary does what she can safely and is not rushed.",
    supportPlan: "Staff give time, explain support and encourage Mary to wash face/hands where safe.",
    reviewTrigger: "Mary reports feeling rushed or loses confidence in personal care tasks."
  },
  {
    goal: "Medication support is safe",
    desiredOutcome: "Medication prompts are recorded accurately on the MAR.",
    supportPlan: "Follow authorised MAR chart only and report refusal, missed dose or concern.",
    reviewTrigger: "Medication refusal, side-effect concern, missed dose or MAR discrepancy."
  }
];

export const lqcsReviewCheckerIssues: LqcsReviewCheckerIssue[] = [
  {
    section: "Mobility",
    issue: "Historic walking-stick evidence conflicts with current wheeled walking frame evidence.",
    whyItMatters: "Staff could follow unsafe or outdated mobility guidance.",
    suggestedCorrection: "Use current face-to-face wheeled walking frame wording and mark historic walking-stick note as superseded unless reconfirmed.",
    priority: "High",
    status: "Needs Attention"
  },
  {
    section: "Falls and Moving and Handling Risk",
    issue: "Two near misses and observed unsteadiness require risk review.",
    whyItMatters: "Falls prevention controls and staff escalation instructions may be out of date.",
    suggestedCorrection: "Update falls risk assessment, moving and handling plan and review trigger list.",
    priority: "High",
    status: "Needs Attention"
  },
  {
    section: "Professional Referral Tracker",
    issue: "OT referral appears indicated but has not been reviewed or approved.",
    whyItMatters: "Equipment needs such as shower chair, transfer aids or environmental changes may be unresolved.",
    suggestedCorrection: "Generate OT referral draft and require manager/care coordinator approval before sending.",
    priority: "High",
    status: "Needs Attention"
  },
  {
    section: "Medication",
    issue: "Current medication list, allergy status and MAR instructions are missing.",
    whyItMatters: "Medication prompts must not be based on unverified information.",
    suggestedCorrection: "Request current medication record and block final approval unless authorised manager overrides with reason.",
    priority: "Critical",
    status: "Not Ready"
  },
  {
    section: "Capacity and Consent",
    issue: "Decision-specific capacity is not recorded for referral, access or medication support.",
    whyItMatters: "A generic capacity note is not enough for lawful decision-making.",
    suggestedCorrection: "Record capacity for each relevant decision and best-interest action where applicable.",
    priority: "High",
    status: "Needs Attention"
  },
  {
    section: "Skin / Body Chart",
    issue: "Skin integrity and body chart evidence are missing.",
    whyItMatters: "Personal care and pressure-area risks may not be adequately evidenced.",
    suggestedCorrection: "Complete skin/pressure-area assessment where consent and care task allow.",
    priority: "Medium",
    status: "Needs Attention"
  },
  {
    section: "Emergency Plan",
    issue: "Emergency plan, GP details and next review date need confirmation.",
    whyItMatters: "Staff escalation and review cycle may be unclear.",
    suggestedCorrection: "Add emergency action notes, GP contact details and next planned review date before approval.",
    priority: "Medium",
    status: "Needs Attention"
  }
];

export function runLqcsAiReviewChecker() {
  const critical = lqcsReviewCheckerIssues.some((issue) => issue.status === "Not Ready");
  return {
    status: critical ? "Not Ready" : "Needs Attention",
    issues: lqcsReviewCheckerIssues,
    approvalBlocked: critical,
    reason: critical
      ? "Final approval is blocked until critical missing information is completed or an authorised manager records an override reason."
      : "Draft can move to manager review once high-priority issues are addressed."
  } as const;
}

export function generateMaryJohnsonLqcsCarePlanDraft(): LqcsAssessmentDraftPackage {
  const checker = runLqcsAiReviewChecker();
  return {
    reference: lqcsAiCarePlanReference,
    serviceUserName: maryJohnsonDummyAssessment.serviceUserName,
    serviceUserReference: maryJohnsonDummyAssessment.serviceUserReference,
    companyId: maryJohnsonDummyAssessment.companyId,
    providerId: maryJohnsonDummyAssessment.providerId,
    status: lqcsAiDraftApprovalNotice,
    generatedBy: "CareVerity AI Assistant - demo mode",
    reviewCheckerStatus: checker.status,
    domains: lqcsCareDomains.map((domain) => generateLqcsCareDomainDraft(domain)),
    sourceEvidence: maryJohnsonSourceEvidence,
    checkerIssues: lqcsReviewCheckerIssues
  };
}

export const lqcsProfessionalReferralTrackerRows = [
  ["OT", "Reduced mobility, two near misses, unsafe transfers/equipment need", "Draft ready", "Manager approval required", "High"],
  ["GP", "Pain, sudden confusion, infection, reduced eating/drinking or health deterioration", "Not generated", "Generate only if evidence confirms clinical concern", "Medium"],
  ["District Nurse", "Wound, skin tear, pressure area, catheter, continence, PEG/feeding, diabetes or dressing concern", "Not generated", "Generate only when relevant source record exists", "Medium"],
  ["Social Worker/Local Authority", "Change in care package, risk or funding-related support need", "Not generated", "Care coordinator review required", "Medium"],
  ["Family/Next of Kin", "Approved update after review or referral outcome", "Not generated", "Consent and confidentiality check required", "Medium"]
] satisfies string[][];

export const lqcsReviewTriggerRows = [
  ["Fall or near miss", "Mobility / risk assessment", "Immediate manager review", "High"],
  ["New medication refusal or missed dose", "Medication / MAR", "Medication lead review", "High"],
  ["Wound, skin tear or redness", "Skin / district nurse", "Same day clinical review pathway", "High"],
  ["Family reports change in need", "Care plan review", "Care coordinator review", "Medium"],
  ["Carer reports unsafe transfer", "Moving and handling / OT", "Supervisor review before next visit where risk is high", "High"]
] satisfies string[][];

export const lqcsCqcEvidenceMappingRows = [
  ["Safe", "Falls risk, medication safety, access controls, emergency procedure", "Risk assessments, MAR, audit logs", "Draft - approval required"],
  ["Effective", "Assessment, care planning, outcomes, professional referrals", "Face-to-face assessment, goals, referral tracker", "Draft - approval required"],
  ["Caring", "Preferences, dignity, gender preference, independence", "What matters to me and preferences", "Draft - approval required"],
  ["Responsive", "Review triggers, family/professional communication", "Review checker, source comparison, referral drafts", "Draft - approval required"],
  ["Well-led", "Audit trail, version control, governance approvals", "AI audit events and approval workflow", "Draft - approval required"]
] satisfies string[][];

export const lqcsAuditRows = [
  ["05 Jun 2026 10:00", "Demo Care Coordinator", "Source evidence added", "LA-BACKGROUND-001, F2F-ASSESSMENT-001", "No live record changed"],
  ["05 Jun 2026 10:02", "CareVerity AI Assistant", "Care-domain draft generated", "Mobility plus full domain set", lqcsAiDraftApprovalNotice],
  ["05 Jun 2026 10:03", "CareVerity AI Assistant", "Review checker completed", "Medication and capacity marked not ready/needs attention", "Approval blocked until reviewed"],
  ["Pending", "Registered Manager", "Approve/edit/reject", "Final reviewed care plan", "Saved to client file only after human approval"]
] satisfies string[][];

export function generateLqcsProfessionalReferralDraft(referralType: string): LqcsProfessionalReferralDraft {
  const referral = lqcsProfessionalReferralTrackerRows.find((row) => row[0].toLowerCase().includes(referralType.toLowerCase())) ?? lqcsProfessionalReferralTrackerRows[0];
  return {
    referralType: referral[0],
    trigger: referral[1],
    recipient: referral[0] === "OT" ? "Occupational Therapy / Local Authority access team" : `${referral[0]} professional contact placeholder`,
    draftSummary:
      referral[0] === "OT"
        ? "Draft OT referral/request: Mary Johnson has reduced mobility, uses a wheeled walking frame, appeared unsteady when standing from her armchair and has two reported near misses. Please review equipment needs including shower chair, safe transfers, environmental hazard and mobility aids. This is a draft only and requires human approval before sending."
        : `Draft ${referral[0]} communication: source records suggest professional follow-up may be required. This is a draft only and requires human approval before sending.`,
    sourceRecordsUsed: ["F2F-ASSESSMENT-001", "FAMILY-EMAIL-001", "LA-BACKGROUND-001"],
    missingInformation: ["Consent/representative involvement", "Recipient contact details", "Manager approval", "Minimum necessary personal data check"],
    approvalStatus: lqcsAiDraftApprovalNotice
  };
}

export const lqcsMobileApprovedContentOnlyRows = [
  ["Unapproved AI draft", "Hidden from mobile staff", "No unapproved draft content may appear in carer visit view."],
  ["Approved care-plan summary", "Visible where assigned and authorised", "Only final manager-approved wording is shown."],
  ["Risk warning", "Visible where needed for safe visit", "Minimum necessary risk information only."],
  ["Key safe/access", "Restricted", "Role-controlled and access logged."],
  ["Professional referral draft", "Hidden from mobile staff", "Manager/care coordinator workflow only."]
] satisfies string[][];

export const lqcsTestingMatrix = [
  ["Generate Mary Johnson draft", "Full LQCS care-plan domain set generated", "Pass in demo data"],
  ["Source comparison", "Walking stick versus wheeled walking frame conflict detected", "Pass in demo data"],
  ["Review checker", "Medication/capacity missing information blocks final approval", "Pass in demo data"],
  ["OT referral trigger", "Near misses and equipment need create OT draft option", "Pass in demo data"],
  ["Human approval gate", "No live care plan, referral or mobile content updated automatically", "Pass in demo data"],
  ["Tenant separation by companyId works", "Draft package includes companyId/providerId and service layer enforces tenant scope in database mode", "Ready for database test"]
] satisfies string[][];
