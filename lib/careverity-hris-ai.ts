export type HrisCommunicationSensitivity = "positive" | "routine" | "concern" | "formal";
export type HrisDeliveryMethod = "email" | "SMS" | "letter" | "internal message";
export type HrisDraftStatus = "Draft" | "Awaiting Review" | "Approved" | "Rejected" | "Sent" | "Archived";

export type HrisCommunicationTemplate = {
  id: string;
  label: string;
  subject: string;
  category: string;
  sensitivity: HrisCommunicationSensitivity;
  defaultTone: "supportive" | "formal" | "neutral" | "appreciative";
  approvalRequired: boolean;
  hrReviewRequired: boolean;
  allowedSms: boolean;
};

export type HrisAiDraftRequest = {
  companyId: string;
  userId: string;
  userRole?: string;
  staffId: string;
  staffName?: string;
  staffRole?: string;
  communicationType: string;
  communicationSensitivity: HrisCommunicationSensitivity;
  selectedSourceRecordIds: string[];
  userProvidedFacts: {
    managerName?: string;
    senderName?: string;
    senderJobTitle?: string;
    reasonForMessage?: string;
    keyFacts?: string;
    relevantDates?: string;
    meetingDate?: string;
    meetingTime?: string;
    meetingLocation?: string;
    attendanceRequired?: string;
    companionAllowed?: string;
    tone?: string;
    deliveryMethod?: HrisDeliveryMethod;
    urgency?: string;
    attachmentsRequired?: string;
    policyReference?: string;
    requestedActionByStaff?: string;
    dueDate?: string;
    approvedBy?: string;
    approvedAt?: string;
    concernCategory?: string;
    factsOnlySummary?: string;
    previousSupportOffered?: string;
    evidenceReferences?: string;
    meetingPurpose?: string;
    noDecisionMadeYet?: string;
    investigationRequired?: string;
    HRReviewRequired?: string;
  };
  templateRules: string[];
  outputFormat: HrisDeliveryMethod;
};

export type HrisAiDraftResponse = {
  draftId: string;
  title: string;
  subject: string;
  body: string;
  smsBody: string;
  riskWarnings: string[];
  missingInformation: string[];
  suggestedAttachments: string[];
  approvalRequired: boolean;
  legalProcessReminder: string;
  generatedAt: string;
  status: HrisDraftStatus;
  auditFields: {
    aiDraftGenerated: true;
    aiProvider: string;
    aiModel: string;
    promptTemplateId: string;
    sourceRecordIds: string[];
    generatedBy: string;
    generatedAt: string;
    reviewedBy: string;
    reviewedAt: string;
    approvedBy: string;
    approvedAt: string;
    sentBy: string;
    sentAt: string;
    finalVersionText: string;
    previousVersionText: string;
    rejectionReason: string;
    status: HrisDraftStatus;
  };
};

export const hrisFormalTemplateWarning =
  "AI-assisted draft only. This message does not make any employment decision. Please check facts, follow your HR policy and the Acas Code, and obtain HR/legal advice where needed before sending.";

export const hrisAiGovernanceWarning =
  "AI supports drafting only. It must not make employment decisions, decide misconduct, determine outcomes, dismiss, demote, suspend or issue warnings. Human review and approval are mandatory before sending.";

export const hrisTemplateRules = [
  "Use professional UK English.",
  "Use respectful, neutral and factual wording only.",
  "Do not say a concern is proven and do not make final employment decisions.",
  "Do not invent dates, witnesses, allegations, outcomes, warnings or decisions.",
  "Use minimum necessary personal data and avoid unnecessary medical detail.",
  "Formal or sensitive drafts require manager/HR approval before sending.",
  "Concern and investigation wording must explain that no decision has been made."
];

export const hrisCoreSections = [
  "Staff Register",
  "Staff Documents",
  "Training and Compliance",
  "DBS / Right to Work / Visa / Certificate Tracking",
  "Supervision and Appraisal",
  "Probation Reviews",
  "Absence and Return to Work",
  "Performance Support",
  "Conduct and Concern Records",
  "Investigation / Meeting Invitations",
  "HR Letters and Emails",
  "SMS Notifications",
  "Policy Updates",
  "HR Audit Trail",
  "HR AI Drafts Awaiting Approval"
];

export const hrisDashboardCards = [
  ["Staff active count", "8", "TEST-COMPANY-001 staff only"],
  ["New starters", "2", "Probation and onboarding monitored"],
  ["Probation reviews due", "1", "Review invitation template ready"],
  ["Training expiring soon", "4", "Reminder drafts available"],
  ["DBS expiring soon", "2", "Renewal reminder workflow"],
  ["Right-to-work checks due", "1", "Document follow-up required"],
  ["Supervisions due", "3", "Manager reminders available"],
  ["Return-to-work meetings due", "1", "Absence workflow monitored"],
  ["HR drafts awaiting approval", "0", "Generated drafts stay unsent"],
  ["HR messages sent this month", "12", "Demo communication register"],
  ["Performance support cases open", "1", "Supportive meeting workflow"],
  ["Conduct concern cases open", "1", "Formal process warning active"],
  ["Non-compliance reminders open", "2", "Training/document follow-up"],
  ["Documents expired", "3", "Role-restricted HR action"],
  ["Policy acknowledgements pending", "5", "Policy update notification ready"]
] satisfies Array<[string, string, string]>;

export const hrisDashboardFilterFields = [
  ["Company", "TEST-COMPANY-001 / London Quality Care Services demo"],
  ["Branch", "Uxbridge"],
  ["Role", "Care Worker / Emergency Cover / Care Coordinator"],
  ["Manager", "Office Manager Test"],
  ["Status", "Active / Inactive / Suspended / Leaver"],
  ["Due date", "Next 7 days / 30 days / overdue"],
  ["Communication type", "Positive / Routine / Concern / Formal"]
] satisfies Array<[string, string]>;

export const hrisTestStaff = [
  {
    staffId: "UAT-ST-SARAH-001",
    companyId: "TEST-COMPANY-001",
    staffCode: "UAT-ST-SARAH-001",
    firstName: "Sarah",
    lastName: "Williams",
    fullName: "Sarah Williams",
    role: "Care Worker",
    department: "Field care",
    branch: "Uxbridge",
    employmentType: "Permanent Care Worker",
    startDate: "04 June 2026",
    probationEndDate: "04 December 2026",
    lineManagerId: "UAT-MGR-001",
    lineManagerName: "Office Manager Test",
    email: "sarah.williams.uat@example.test",
    mobile: "07000000101",
    address: "Dummy staff address withheld",
    emergencyContact: "Dummy emergency contact",
    status: "Active",
    rightToWorkStatus: "Current",
    DBSStatus: "Current",
    trainingComplianceStatus: "Medication, moving and handling and safeguarding current",
    supervisionStatus: "Due this month",
    notes: "Dummy test data only",
    createdBy: "Demo HR Administrator A",
    createdAt: "04 June 2026 09:00",
    updatedBy: "Demo HR Administrator A",
    updatedAt: "04 June 2026 09:00",
    auditLogId: "HR-AUD-SARAH-001"
  },
  {
    staffId: "UAT-ST-AHMED-001",
    companyId: "TEST-COMPANY-001",
    staffCode: "UAT-ST-AHMED-001",
    firstName: "Ahmed",
    lastName: "Khan",
    fullName: "Ahmed Khan",
    role: "Emergency Cover Care Worker",
    department: "Field care",
    branch: "Uxbridge",
    employmentType: "One-off / Emergency Cover Care Worker",
    startDate: "04 June 2026",
    probationEndDate: "04 December 2026",
    lineManagerId: "UAT-MGR-001",
    lineManagerName: "Office Manager Test",
    email: "ahmed.khan.uat@example.test",
    mobile: "07000000102",
    address: "Dummy staff address withheld",
    emergencyContact: "Dummy emergency contact",
    status: "Active",
    rightToWorkStatus: "Current",
    DBSStatus: "Current",
    trainingComplianceStatus: "Emergency response current",
    supervisionStatus: "Up to date",
    notes: "Dummy test data only",
    createdBy: "Demo HR Administrator A",
    createdAt: "04 June 2026 09:05",
    updatedBy: "Demo HR Administrator A",
    updatedAt: "04 June 2026 09:05",
    auditLogId: "HR-AUD-AHMED-001"
  },
  {
    staffId: "UAT-ST-MARIA-001",
    companyId: "TEST-COMPANY-001",
    staffCode: "UAT-ST-MARIA-001",
    firstName: "Maria",
    lastName: "Patel",
    fullName: "Maria Patel",
    role: "Care Coordinator",
    department: "Office",
    branch: "Uxbridge",
    employmentType: "Full-time",
    startDate: "04 June 2026",
    probationEndDate: "04 December 2026",
    lineManagerId: "UAT-MGR-001",
    lineManagerName: "Office Manager Test",
    email: "maria.patel.uat@example.test",
    mobile: "07000000103",
    address: "Dummy staff address withheld",
    emergencyContact: "Dummy emergency contact",
    status: "Active",
    rightToWorkStatus: "Current",
    DBSStatus: "Current",
    trainingComplianceStatus: "Compliant",
    supervisionStatus: "Due next month",
    notes: "Dummy test data only",
    createdBy: "Demo HR Administrator A",
    createdAt: "04 June 2026 09:10",
    updatedBy: "Demo HR Administrator A",
    updatedAt: "04 June 2026 09:10",
    auditLogId: "HR-AUD-MARIA-001"
  }
] as const;

export const hrisCommunicationTemplates: HrisCommunicationTemplate[] = [
  { id: "welcome-email", label: "Welcome Email", subject: "Welcome to [Company Name]", category: "Positive / onboarding", sensitivity: "positive", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: false, allowedSms: false },
  { id: "congratulations-recognition", label: "Congratulations / Recognition Email", subject: "Congratulations and Thank You", category: "Positive / onboarding", sensitivity: "positive", defaultTone: "appreciative", approvalRequired: true, hrReviewRequired: false, allowedSms: false },
  { id: "recognition-appreciation", label: "Recognition / Appreciation Message", subject: "Recognition and Appreciation", category: "Positive / onboarding", sensitivity: "positive", defaultTone: "appreciative", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "training-completion-congratulations", label: "Training Completion Congratulations", subject: "Training Completion Congratulations", category: "Positive / onboarding", sensitivity: "positive", defaultTone: "appreciative", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "promotion-role-change-congratulations", label: "Promotion / Role Change Congratulations", subject: "Promotion / Role Change Congratulations", category: "Positive / onboarding", sensitivity: "positive", defaultTone: "appreciative", approvalRequired: true, hrReviewRequired: false, allowedSms: false },
  { id: "training-reminder", label: "Training Reminder", subject: "Training Reminder - Action Required", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "supervision-reminder", label: "Supervision Reminder", subject: "Supervision Meeting Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "probation-review-invitation", label: "Probation Review Invitation", subject: "Probation Review Meeting Invitation", category: "Routine HR", sensitivity: "routine", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "return-to-work-meeting", label: "Return-to-Work Meeting Invitation", subject: "Return-to-Work Meeting Invitation", category: "Routine HR", sensitivity: "routine", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "meeting-reminder", label: "Meeting Reminder", subject: "Meeting Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "request-check-email", label: "Request to Check Email", subject: "Please Check Your Email", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "performance-concern", label: "Performance Concern Meeting Invitation", subject: "Invitation to Discuss Performance Support", category: "Concern / support", sensitivity: "concern", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "informal-performance-concern", label: "Informal Performance Concern Email", subject: "Informal Performance Support Discussion", category: "Concern / support", sensitivity: "concern", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "conduct-concern", label: "Conduct Concern Meeting Invitation", subject: "Invitation to Discuss Workplace Concern", category: "Concern / support", sensitivity: "concern", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "lateness-concern", label: "Lateness Concern Meeting Invitation", subject: "Invitation to Discuss Timekeeping", category: "Concern / support", sensitivity: "concern", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "absence-concern", label: "Absence Concern Meeting Invitation", subject: "Invitation to Discuss Attendance", category: "Concern / support", sensitivity: "concern", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "request-attend-office", label: "Request to Attend Office", subject: "Request to Attend Office Meeting", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "document-expiry", label: "Document Expiry Reminder", subject: "Document Expiry Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "dbs-renewal", label: "DBS Renewal Reminder", subject: "DBS Renewal Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: true, allowedSms: true },
  { id: "right-to-work-reminder", label: "Right-to-Work Documentation Reminder", subject: "Right-to-Work Documentation Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: true, allowedSms: true },
  { id: "training-certificate-expiry", label: "Training Certificate Expiry Reminder", subject: "Training Certificate Expiry Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "annual-leave-reminder", label: "Annual Leave Reminder", subject: "Annual Leave Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "timesheet-rota-compliance", label: "Timesheet / Rota Compliance Reminder", subject: "Timesheet / Rota Compliance Reminder", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "rota-shift-confirmation", label: "Rota / Shift Confirmation", subject: "Rota / Shift Confirmation", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "policy-update", label: "Policy Update Notification", subject: "Policy Update Notification", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "meeting-confirmation", label: "Meeting Confirmation", subject: "Meeting Confirmation", category: "Routine HR", sensitivity: "routine", defaultTone: "neutral", approvalRequired: true, hrReviewRequired: false, allowedSms: true },
  { id: "non-compliance", label: "Non-Compliance Reminder", subject: "Compliance Action Required", category: "Concern / support", sensitivity: "concern", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "failure-complete-training", label: "Failure to Complete Training Reminder", subject: "Training Completion Action Required", category: "Concern / support", sensitivity: "concern", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "failure-submit-documents", label: "Failure to Submit Documents Reminder", subject: "Document Submission Action Required", category: "Concern / support", sensitivity: "concern", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "request-discuss-concerns", label: "Request to Discuss Concerns", subject: "Request to Discuss Concerns", category: "Concern / support", sensitivity: "concern", defaultTone: "supportive", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "investigation-meeting", label: "Investigation Meeting Invitation", subject: "Investigation Meeting Invitation", category: "Formal / sensitive HR", sensitivity: "formal", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "disciplinary-meeting", label: "Disciplinary Meeting Invitation Draft", subject: "Disciplinary Meeting Invitation - Draft for HR Review", category: "Formal / sensitive HR", sensitivity: "formal", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "grievance-meeting", label: "Grievance Meeting Invitation Draft", subject: "Grievance Meeting Invitation - Draft for HR Review", category: "Formal / sensitive HR", sensitivity: "formal", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "outcome-letter-placeholder", label: "Outcome Letter Draft Placeholder", subject: "Outcome Letter Draft - HR Review Required", category: "Formal / sensitive HR", sensitivity: "formal", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false },
  { id: "written-warning-placeholder", label: "Written Warning Draft Placeholder", subject: "Written Warning Draft - HR Review Required", category: "Formal / sensitive HR", sensitivity: "formal", defaultTone: "formal", approvalRequired: true, hrReviewRequired: true, allowedSms: false }
];

const placeholder = (value: string | undefined, fallback: string) => value?.trim() || fallback;

export function getHrisCommunicationTemplate(idOrLabel: string) {
  return hrisCommunicationTemplates.find((template) => template.id === idOrLabel || template.label === idOrLabel) ?? hrisCommunicationTemplates[0];
}

export function generateSafeHrDraft(request: HrisAiDraftRequest): HrisAiDraftResponse {
  const template = getHrisCommunicationTemplate(request.communicationType);
  const facts = request.userProvidedFacts;
  const generatedAt = new Date().toISOString();
  const draftId = `HR-AI-DRAFT-${Date.now()}`;
  const staffName = placeholder(request.staffName, "[Staff Name]");
  const senderName = placeholder(facts.senderName, "[Sender Name]");
  const senderJobTitle = placeholder(facts.senderJobTitle, "[Job Title]");
  const managerName = placeholder(facts.managerName, "[manager name]");
  const meetingDate = placeholder(facts.meetingDate, "[insert date]");
  const meetingTime = placeholder(facts.meetingTime, "[insert meeting time]");
  const meetingLocation = placeholder(facts.meetingLocation, "[insert office location]");
  const reason = placeholder(facts.reasonForMessage, "[insert reason for message]");
  const keyFacts = placeholder(facts.keyFacts || facts.factsOnlySummary, "[insert factual details only]");
  const dueDate = placeholder(facts.dueDate, "[insert response deadline]");
  const requestedAction = placeholder(facts.requestedActionByStaff, "Please confirm receipt and complete the requested action by the due date.");
  const policyReference = placeholder(facts.policyReference, "[insert policy name]");
  const isSensitive = template.sensitivity === "concern" || template.sensitivity === "formal";
  const missingInformation = [
    !facts.reasonForMessage ? "reasonForMessage" : "",
    !facts.keyFacts && isSensitive ? "factsOnlySummary / keyFacts" : "",
    /invitation|meeting/i.test(template.label) && !facts.meetingDate ? "meetingDate" : "",
    /invitation|meeting/i.test(template.label) && !facts.meetingTime ? "meetingTime" : "",
    /invitation|meeting/i.test(template.label) && !facts.meetingLocation ? "meetingLocation" : ""
  ].filter(Boolean);

  const meetingParagraph = /invitation|meeting/i.test(template.label)
    ? `We are writing to invite you to attend a meeting on ${meetingDate} at ${meetingTime} at ${meetingLocation} to discuss ${reason}.`
    : `We are writing about ${reason}.`;

  const processParagraph = isSensitive
    ? "We would like to meet with you to discuss the matter and understand your response before any decision is made. No decision has been made at this stage."
    : "This message is intended to support clear communication and timely follow-up.";

  const companionParagraph = isSensitive
    ? `If applicable under our policy, you may be accompanied by ${placeholder(facts.companionAllowed, "[companion wording]")}.`
    : "";

  const body = [
    "AI-assisted draft - approval required.",
    "",
    `Dear ${staffName},`,
    "",
    meetingParagraph,
    "",
    `Key information provided for this draft: ${keyFacts}`,
    "",
    processParagraph,
    companionParagraph,
    facts.previousSupportOffered ? `Previous support offered: ${facts.previousSupportOffered}` : "",
    facts.evidenceReferences ? `Evidence/source references to check: ${facts.evidenceReferences}` : "",
    `Policy/reference: ${policyReference}.`,
    "",
    requestedAction,
    `Please respond by ${dueDate}. If you have any questions, please contact ${managerName}.`,
    "",
    isSensitive ? "This draft must be reviewed against the relevant HR policy, fair process requirements and the Acas Code before sending." : "Thank you for your cooperation.",
    "",
    "Kind regards,",
    senderName,
    senderJobTitle
  ].filter(Boolean).join("\n");

  const smsBody = template.allowedSms
    ? `${template.subject}: please check your CareVerity HR message or email. Action may be required by ${dueDate}.`
    : "Please check your email regarding an HR meeting invitation.";

  const riskWarnings = [
    "AI-assisted draft - approval required.",
    "No automatic sending has taken place.",
    isSensitive ? hrisFormalTemplateWarning : "",
    request.companyId ? `Tenant scoped to companyId ${request.companyId}.` : "Missing companyId - do not use in production."
  ].filter(Boolean);

  return {
    draftId,
    title: `${template.label} - ${staffName}`,
    subject: template.subject,
    body,
    smsBody,
    riskWarnings,
    missingInformation,
    suggestedAttachments: [
      facts.attachmentsRequired || "",
      isSensitive ? "Relevant HR policy" : "",
      isSensitive ? "Meeting invite details" : ""
    ].filter(Boolean),
    approvalRequired: true,
    legalProcessReminder: isSensitive ? hrisFormalTemplateWarning : "Human review and approval required before sending.",
    generatedAt,
    status: "Awaiting Review",
    auditFields: {
      aiDraftGenerated: true,
      aiProvider: "server-side-placeholder",
      aiModel: "configured-later",
      promptTemplateId: template.id,
      sourceRecordIds: request.selectedSourceRecordIds,
      generatedBy: request.userId,
      generatedAt,
      reviewedBy: "",
      reviewedAt: "",
      approvedBy: "",
      approvedAt: "",
      sentBy: "",
      sentAt: "",
      finalVersionText: "",
      previousVersionText: body,
      rejectionReason: "",
      status: "Awaiting Review"
    }
  };
}
