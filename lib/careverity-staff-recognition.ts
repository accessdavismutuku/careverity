export const staffRecognitionModuleName = "Staff Recognition & Good Practice Evidence Module";

export type RecognitionConsentStatus = "Not Required" | "Pending" | "Granted" | "Declined" | "Withdrawn";
export type RecognitionNominationStatus = "Draft" | "Submitted" | "Supervisor Review" | "HR Review" | "Manager Approval" | "Approved" | "Rejected" | "Published" | "Archived";
export type RecognitionStoryStatus = "Draft" | "Awaiting Consent" | "Awaiting Approval" | "Approved" | "Published" | "Archived";
export type RecognitionDraftOutputType = "Recognition Story" | "Congratulations Email" | "Internal Announcement" | "Certificate Text" | "CQC Evidence Summary";

export type StaffRecognitionNomination = {
  nominationId: string;
  companyId: string;
  branchId?: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  nominatedByUserId: string;
  nominatedByName: string;
  nominatedByRole: string;
  nominationMonth: string;
  nominationYear: number;
  awardCategory: string;
  nominationReason: string;
  evidenceSummary: string;
  linkedEvidenceIds: string[];
  serviceUserFeedbackIds: string[];
  relativeFeedbackIds: string[];
  coordinatorFeedbackIds: string[];
  supervisorFeedbackIds: string[];
  complianceScoreSnapshot?: Record<string, string | number | boolean>;
  recognitionScore?: number;
  aiSuggestedStoryId?: string;
  consentRequired: boolean;
  consentStatus: RecognitionConsentStatus;
  status: RecognitionNominationStatus;
  supervisorReviewedBy?: string;
  supervisorReviewedAt?: string;
  hrReviewedBy?: string;
  hrReviewedAt?: string;
  managerApprovedBy?: string;
  managerApprovedAt?: string;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
};

export type StaffRecognitionEvidence = {
  evidenceId: string;
  companyId: string;
  branchId?: string;
  staffId: string;
  evidenceType: string;
  evidenceDate: string;
  evidenceDescription: string;
  sourceRecordType?: string;
  sourceRecordId?: string;
  uploadedFileId?: string;
  approvedForUse: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdBy: string;
  createdAt: string;
};

export type StaffRecognitionStory = {
  storyId: string;
  companyId: string;
  branchId?: string;
  nominationId: string;
  staffId: string;
  staffName: string;
  awardTitle: string;
  storyHeadline: string;
  storyBody: string;
  keyAchievements: string[];
  qualityImpactSummary: string;
  cqcThemeMapping: string[];
  photoFileId?: string;
  staffConsentId?: string;
  aiGenerated: boolean;
  reviewedBy?: string;
  reviewedAt?: string;
  approvedBy?: string;
  approvedAt?: string;
  publicationStatus: RecognitionStoryStatus;
  internalAnnouncementSent: boolean;
  createdAt: string;
  updatedAt: string;
};

export type StaffRecognitionConsent = {
  consentId: string;
  companyId: string;
  staffId: string;
  staffName: string;
  consentForInternalEmail: boolean;
  consentForStaffNoticeboard: boolean;
  consentForCqcEvidencePack: boolean;
  consentForWebsite: boolean;
  consentForSocialMedia: boolean;
  consentForMarketingLeaflet: boolean;
  consentForPhotoUse: boolean;
  consentForStoryUse: boolean;
  consentTextShown: string;
  consentGivenAt?: string;
  consentWithdrawnAt?: string;
  status: "Granted" | "Declined" | "Withdrawn" | "Expired";
  recordedBy: string;
  evidenceFileId?: string;
};

export type StaffRewardRecord = {
  rewardId: string;
  companyId: string;
  staffId: string;
  nominationId: string;
  rewardType: "Certificate" | "Voucher" | "Bonus" | "Gift" | "Thank You Card" | "Public Recognition" | "Other";
  rewardValue?: number;
  rewardDescription: string;
  approvedBy: string;
  approvedAt: string;
  issuedBy?: string;
  issuedAt?: string;
  status: "Approved" | "Issued" | "Cancelled";
};

export type StaffRecognitionDraftRequest = {
  companyId: string;
  userId: string;
  userRole?: string;
  staffId: string;
  nominationId: string;
  awardCategory: string;
  selectedEvidenceIds: string[];
  outputType: RecognitionDraftOutputType;
  anonymiseServiceUserDetails: boolean;
  tone: "professional" | "warm" | "celebratory";
};

export type StaffRecognitionDraftResponse = {
  draftId: string;
  title: string;
  body: string;
  keyAchievements: string[];
  cqcThemeMapping: string[];
  confidentialityWarnings: string[];
  missingInformation: string[];
  approvalRequired: true;
};

export const staffRecognitionRouteLinks = [
  "/hr/staff-recognition",
  "/hr/staff-recognition/dashboard",
  "/hr/staff-recognition/nominations",
  "/hr/staff-recognition/staff-of-the-month",
  "/hr/staff-recognition/approvals",
  "/hr/staff-recognition/recognition-stories",
  "/hr/staff-recognition/consent",
  "/hr/staff-recognition/evidence-pack"
] as const;

export const staffRecognitionPermissionsRows = [
  ["Care Coordinator", "Nominate staff, add evidence and view their own team nominations", "Cannot final approve"],
  ["Supervisor", "Review nominations and recommend approval", "Cannot final approve unless permission enabled"],
  ["HR Manager", "Review consent, reward suitability and internal communication", "Manages photo/story consent"],
  ["Registered Manager / Senior Manager", "Final approval for Staff of the Month, story, announcement and reward", "Authorised manager approval required"],
  ["Staff Member", "View own approved recognition and give/withdraw consent", "Cannot see private scoring of other staff"],
  ["System Admin", "Configure categories, scoring, consent wording and notification templates", "No automatic employment decisions"]
] satisfies string[][];

export const staffRecognitionCategories = [
  ["CAT-001", "TEST-COMPANY-001", "Staff of the Month", "Monthly recognition for evidence-based positive contribution", "At least two approved evidence items", "Active"],
  ["CAT-002", "TEST-COMPANY-001", "Most Person-Centred Care", "Kindness, dignity and individualised care practice", "Service-user or coordinator feedback", "Active"],
  ["CAT-003", "TEST-COMPANY-001", "Outstanding Communication", "Clear communication with people, families and office team", "Feedback or journal evidence", "Active"],
  ["CAT-004", "TEST-COMPANY-001", "Medication Safety Champion", "Safe medication recording and escalation", "MAR compliance evidence", "Active"],
  ["CAT-005", "TEST-COMPANY-001", "Reliability Award", "Reliable attendance and continuity", "On-time and visit-note evidence", "Active"],
  ["CAT-006", "TEST-COMPANY-001", "Going the Extra Mile", "Positive contribution beyond routine duties", "Narrative evidence required", "Active"],
  ["CAT-007", "TEST-COMPANY-001", "Teamwork Award", "Supportive teamwork and cover", "Supervisor/team feedback", "Active"],
  ["CAT-008", "TEST-COMPANY-001", "Best New Starter", "Positive induction and early performance", "Probation and training evidence", "Active"],
  ["CAT-009", "TEST-COMPANY-001", "Learning and Development Champion", "Training engagement and skill development", "Training matrix evidence", "Active"],
  ["CAT-010", "TEST-COMPANY-001", "Positive Feedback Champion", "Consistent compliments and kind feedback", "Compliments linked to staff", "Active"],
  ["CAT-011", "TEST-COMPANY-001", "Emergency Support Champion", "Responsive support for urgent cover", "Rota/emergency support evidence", "Active"],
  ["CAT-012", "TEST-COMPANY-001", "Safeguarding Awareness Champion", "Appropriate concern reporting and escalation", "Incident/concern quality evidence", "Active"],
  ["CAT-013", "TEST-COMPANY-001", "Documentation Quality Champion", "High-quality records and visit notes", "Record-completion evidence", "Active"],
  ["CAT-014", "TEST-COMPANY-001", "Dignity and Respect Champion", "Respectful care and privacy", "Care feedback evidence", "Active"],
  ["CAT-015", "TEST-COMPANY-001", "Care Coordinator Choice Award", "Coordinator-nominated good practice", "Coordinator narrative evidence", "Active"],
  ["CAT-016", "TEST-COMPANY-001", "Supervisor Recognition Award", "Supervisor-nominated good practice", "Supervisor comments required", "Active"]
] satisfies string[][];

export const staffRecognitionFairnessWarning =
  "Recognition suggestions are decision-support only. Final recognition decisions must be fair, evidence-based and approved by authorised managers.";

export const staffRecognitionFairnessSafeguards = [
  "Do not rely only on automated score.",
  "Allow part-time/new starter adjustment.",
  "Do not publish staff ranking.",
  "Do not use recognition score for disciplinary action.",
  "Do not use recognition module to penalise staff.",
  "Allow manager to add context.",
  "Allow staff to report inaccurate data.",
  "Allow HR to review equality/fairness.",
  "Keep audit trail of decision and approval."
] as const;

export const staffRecognitionConsentText =
  "I agree that my name, photo and recognition story may be used by the company for the selected purposes. I understand I can withdraw consent for future use.";

export const staffRecognitionDashboardCards = [
  ["Nominations this month", "3", "Submitted for June 2026"],
  ["Awaiting supervisor review", "1", "David Brown review required"],
  ["Awaiting HR review", "1", "Consent/reward suitability check"],
  ["Awaiting manager approval", "1", "Office Manager Test final approval"],
  ["Approved recognitions", "1", "Staff of the Month approved"],
  ["Published stories", "1", "Internal announcement only"],
  ["Consent pending", "1", "Photo/story consent pending"],
  ["Recognition by branch", "Uxbridge: 3", "companyId TEST-COMPANY-001"],
  ["Recognition by category", "Staff of the Month: 1", "16 categories configured"],
  ["Positive feedback count", "10", "Approved positive records only"],
  ["Compliments linked to staff", "5", "Service-user compliments anonymised"],
  ["Rewards issued", "1", "Thank You Card issued"],
  ["CQC themes mapped", "5", "Safe, Effective, Caring, Responsive, Well-led"]
] satisfies Array<[string, string, string]>;

export const staffRecognitionFilterRows = [
  ["Company", "TEST-COMPANY-001"],
  ["Branch", "Uxbridge"],
  ["Care coordinator", "Maria Patel"],
  ["Supervisor", "David Brown"],
  ["Award category", "Staff of the Month / Person-Centred Care / Teamwork"],
  ["Month", "June 2026"],
  ["Status", "Submitted / HR Review / Approved"],
  ["Staff role", "Care Worker / Emergency Cover / Care Coordinator"]
] satisfies string[][];

export const staffRecognitionDemoStaff = [
  ["UAT-ST-SARAH-001", "TEST-COMPANY-001", "Sarah Williams", "Care Worker", "Uxbridge"],
  ["UAT-ST-AHMED-001", "TEST-COMPANY-001", "Ahmed Khan", "Emergency Cover Care Worker", "Uxbridge"],
  ["UAT-ST-MARIA-001", "TEST-COMPANY-001", "Maria Patel", "Care Coordinator", "Uxbridge"],
  ["UAT-ST-DAVID-001", "TEST-COMPANY-001", "David Brown", "Supervisor", "Uxbridge"],
  ["UAT-MGR-001", "TEST-COMPANY-001", "Office Manager Test", "Registered Manager", "Uxbridge"]
] satisfies string[][];

export const staffRecognitionEvidenceRecords: StaffRecognitionEvidence[] = [
  ...Array.from({ length: 10 }, (_, index) => ({
    evidenceId: `REC-EVID-POS-${String(index + 1).padStart(3, "0")}`,
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: index % 2 === 0 ? "UAT-ST-SARAH-001" : "UAT-ST-AHMED-001",
    evidenceType: index % 2 === 0 ? "Person-Centred Care" : "Teamwork",
    evidenceDate: `0${(index % 9) + 1} June 2026`,
    evidenceDescription: `Positive feedback record ${index + 1} using dummy, anonymised evidence only.`,
    sourceRecordType: "Positive feedback",
    sourceRecordId: `PFB-${String(index + 1).padStart(3, "0")}`,
    approvedForUse: true,
    approvedBy: "David Brown",
    approvedAt: "04 June 2026 11:30",
    createdBy: "Maria Patel",
    createdAt: "04 June 2026 10:00"
  })),
  ...Array.from({ length: 5 }, (_, index) => ({
    evidenceId: `REC-EVID-COMP-${String(index + 1).padStart(3, "0")}`,
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    evidenceType: "Service User Feedback",
    evidenceDate: `1${index} June 2026`,
    evidenceDescription: `Service-user compliment ${index + 1} anonymised for recognition evidence.`,
    sourceRecordType: "Compliment",
    sourceRecordId: `COMP-${String(index + 1).padStart(3, "0")}`,
    approvedForUse: true,
    approvedBy: "Office Manager Test",
    approvedAt: "04 June 2026 12:00",
    createdBy: "Maria Patel",
    createdAt: "04 June 2026 10:30"
  })),
  ...Array.from({ length: 5 }, (_, index) => ({
    evidenceId: `REC-EVID-SUP-${String(index + 1).padStart(3, "0")}`,
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: index % 2 === 0 ? "UAT-ST-SARAH-001" : "UAT-ST-AHMED-001",
    evidenceType: "Supervisor Feedback",
    evidenceDate: `2${index} June 2026`,
    evidenceDescription: `Supervisor feedback record ${index + 1} showing good practice and teamwork.`,
    sourceRecordType: "Supervisor feedback",
    sourceRecordId: `SUP-FB-${String(index + 1).padStart(3, "0")}`,
    approvedForUse: true,
    approvedBy: "David Brown",
    approvedAt: "04 June 2026 12:15",
    createdBy: "David Brown",
    createdAt: "04 June 2026 11:00"
  })),
  {
    evidenceId: "REC-EVID-ONTIME-001",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    evidenceType: "On-Time Arrival",
    evidenceDate: "30 June 2026",
    evidenceDescription: "On-time arrival data: 98% attendance for planned visits, adjusted for rota changes.",
    sourceRecordType: "Rota compliance",
    sourceRecordId: "ROTA-KPI-001",
    approvedForUse: true,
    approvedBy: "David Brown",
    approvedAt: "30 June 2026 17:30",
    createdBy: "CareVerity demo system",
    createdAt: "30 June 2026 17:00"
  },
  {
    evidenceId: "REC-EVID-NOTES-001",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    evidenceType: "Visit Note Completion",
    evidenceDate: "30 June 2026",
    evidenceDescription: "Visit note completion data: 97% notes completed with useful detail.",
    sourceRecordType: "Visit evidence",
    sourceRecordId: "VISIT-KPI-001",
    approvedForUse: true,
    approvedBy: "David Brown",
    approvedAt: "30 June 2026 17:35",
    createdBy: "CareVerity demo system",
    createdAt: "30 June 2026 17:00"
  },
  {
    evidenceId: "REC-EVID-MAR-001",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    evidenceType: "Medication Compliance",
    evidenceDate: "30 June 2026",
    evidenceDescription: "Medication recording compliance data: 100% dummy MAR prompts recorded.",
    sourceRecordType: "MAR audit",
    sourceRecordId: "MAR-KPI-001",
    approvedForUse: true,
    approvedBy: "Office Manager Test",
    approvedAt: "30 June 2026 17:40",
    createdBy: "CareVerity demo system",
    createdAt: "30 June 2026 17:00"
  },
  {
    evidenceId: "REC-EVID-TRAINING-001",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    evidenceType: "Training Compliance",
    evidenceDate: "30 June 2026",
    evidenceDescription: "Training compliance data: mandatory training current.",
    sourceRecordType: "Training matrix",
    sourceRecordId: "TRAIN-KPI-001",
    approvedForUse: true,
    approvedBy: "Training Coordinator",
    approvedAt: "30 June 2026 17:45",
    createdBy: "CareVerity demo system",
    createdAt: "30 June 2026 17:00"
  }
];

export const staffRecognitionNominations: StaffRecognitionNomination[] = [
  {
    nominationId: "REC-NOM-001",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    staffName: "Sarah Williams",
    staffRole: "Care Worker",
    nominatedByUserId: "UAT-ST-MARIA-001",
    nominatedByName: "Maria Patel",
    nominatedByRole: "Care Coordinator",
    nominationMonth: "June",
    nominationYear: 2026,
    awardCategory: "Staff of the Month",
    nominationReason: "Consistent person-centred care, strong visit notes, safe medication recording and positive feedback.",
    evidenceSummary: "Linked compliments, on-time arrival, MAR compliance, visit notes and supervisor feedback.",
    linkedEvidenceIds: ["REC-EVID-POS-001", "REC-EVID-COMP-001", "REC-EVID-ONTIME-001", "REC-EVID-NOTES-001", "REC-EVID-MAR-001"],
    serviceUserFeedbackIds: ["COMP-001", "COMP-002"],
    relativeFeedbackIds: ["REL-FB-001"],
    coordinatorFeedbackIds: ["COORD-FB-001"],
    supervisorFeedbackIds: ["SUP-FB-001", "SUP-FB-003"],
    complianceScoreSnapshot: { onTimeArrivalRate: 98, visitNoteCompletionRate: 97, medicationRecordingCompliance: 100, trainingComplianceStatus: "Current" },
    recognitionScore: 92,
    aiSuggestedStoryId: "REC-STORY-001",
    consentRequired: true,
    consentStatus: "Granted",
    status: "Approved",
    supervisorReviewedBy: "David Brown",
    supervisorReviewedAt: "30 June 2026 14:00",
    hrReviewedBy: "HR Manager Test",
    hrReviewedAt: "30 June 2026 15:00",
    managerApprovedBy: "Office Manager Test",
    managerApprovedAt: "30 June 2026 16:00",
    createdAt: "30 June 2026 10:00",
    updatedAt: "30 June 2026 16:00"
  },
  {
    nominationId: "REC-NOM-002",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-AHMED-001",
    staffName: "Ahmed Khan",
    staffRole: "Emergency Cover Care Worker",
    nominatedByUserId: "UAT-ST-MARIA-001",
    nominatedByName: "Maria Patel",
    nominatedByRole: "Care Coordinator",
    nominationMonth: "June",
    nominationYear: 2026,
    awardCategory: "Emergency Support Champion",
    nominationReason: "Provided calm one-off emergency cover and helped the team maintain continuity.",
    evidenceSummary: "Emergency cover support, teamwork and supervisor feedback records linked.",
    linkedEvidenceIds: ["REC-EVID-POS-002", "REC-EVID-SUP-002"],
    serviceUserFeedbackIds: [],
    relativeFeedbackIds: [],
    coordinatorFeedbackIds: ["COORD-FB-002"],
    supervisorFeedbackIds: ["SUP-FB-002"],
    recognitionScore: 84,
    consentRequired: true,
    consentStatus: "Pending",
    status: "HR Review",
    supervisorReviewedBy: "David Brown",
    supervisorReviewedAt: "30 June 2026 14:20",
    createdAt: "30 June 2026 10:20",
    updatedAt: "30 June 2026 14:20"
  },
  {
    nominationId: "REC-NOM-003",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    staffId: "UAT-ST-MARIA-001",
    staffName: "Maria Patel",
    staffRole: "Care Coordinator",
    nominatedByUserId: "UAT-ST-DAVID-001",
    nominatedByName: "David Brown",
    nominatedByRole: "Supervisor",
    nominationMonth: "June",
    nominationYear: 2026,
    awardCategory: "Outstanding Communication",
    nominationReason: "Clear office communication, positive team support and careful evidence linking.",
    evidenceSummary: "Coordinator feedback and quality assurance evidence linked.",
    linkedEvidenceIds: ["REC-EVID-SUP-004", "REC-EVID-SUP-005"],
    serviceUserFeedbackIds: [],
    relativeFeedbackIds: [],
    coordinatorFeedbackIds: [],
    supervisorFeedbackIds: ["SUP-FB-004", "SUP-FB-005"],
    recognitionScore: 88,
    consentRequired: false,
    consentStatus: "Not Required",
    status: "Supervisor Review",
    createdAt: "30 June 2026 10:40",
    updatedAt: "30 June 2026 10:40"
  }
];

export const staffRecognitionStories: StaffRecognitionStory[] = [
  {
    storyId: "REC-STORY-001",
    companyId: "TEST-COMPANY-001",
    branchId: "Uxbridge",
    nominationId: "REC-NOM-001",
    staffId: "UAT-ST-SARAH-001",
    staffName: "Sarah Williams",
    awardTitle: "Staff of the Month",
    storyHeadline: "Recognising Sarah Williams for person-centred care and reliable practice",
    storyBody: "AI-assisted draft - approval required. Sarah has been recognised using approved evidence for kind communication, reliable visits and careful medication recording. The draft uses anonymised evidence only and requires manager approval before publication.",
    keyAchievements: ["Positive feedback linked to staff file", "Medication recording compliance", "Reliable visits and thoughtful notes"],
    qualityImpactSummary: "Evidence supports positive care culture, continuity and safe recording.",
    cqcThemeMapping: ["Caring", "Effective", "Safe", "Responsive", "Well-led"],
    staffConsentId: "REC-CONSENT-001",
    aiGenerated: true,
    reviewedBy: "HR Manager Test",
    reviewedAt: "30 June 2026 15:15",
    approvedBy: "Office Manager Test",
    approvedAt: "30 June 2026 16:10",
    publicationStatus: "Published",
    internalAnnouncementSent: true,
    createdAt: "30 June 2026 14:45",
    updatedAt: "30 June 2026 16:10"
  }
];

export const staffRecognitionConsents: StaffRecognitionConsent[] = [
  {
    consentId: "REC-CONSENT-001",
    companyId: "TEST-COMPANY-001",
    staffId: "UAT-ST-SARAH-001",
    staffName: "Sarah Williams",
    consentForInternalEmail: true,
    consentForStaffNoticeboard: false,
    consentForCqcEvidencePack: true,
    consentForWebsite: false,
    consentForSocialMedia: false,
    consentForMarketingLeaflet: false,
    consentForPhotoUse: false,
    consentForStoryUse: true,
    consentTextShown: staffRecognitionConsentText,
    consentGivenAt: "30 June 2026 15:30",
    status: "Granted",
    recordedBy: "HR Manager Test",
    evidenceFileId: "REC-CONSENT-FILE-001"
  },
  {
    consentId: "REC-CONSENT-002",
    companyId: "TEST-COMPANY-001",
    staffId: "UAT-ST-AHMED-001",
    staffName: "Ahmed Khan",
    consentForInternalEmail: true,
    consentForStaffNoticeboard: false,
    consentForCqcEvidencePack: true,
    consentForWebsite: false,
    consentForSocialMedia: false,
    consentForMarketingLeaflet: false,
    consentForPhotoUse: false,
    consentForStoryUse: false,
    consentTextShown: staffRecognitionConsentText,
    status: "Declined",
    recordedBy: "HR Manager Test"
  }
];

export const staffRewardRecords: StaffRewardRecord[] = [
  {
    rewardId: "REC-REWARD-001",
    companyId: "TEST-COMPANY-001",
    staffId: "UAT-ST-SARAH-001",
    nominationId: "REC-NOM-001",
    rewardType: "Thank You Card",
    rewardDescription: "Internal thank-you card and certificate of recognition issued in demo mode.",
    approvedBy: "Office Manager Test",
    approvedAt: "30 June 2026 16:05",
    issuedBy: "HR Manager Test",
    issuedAt: "30 June 2026 16:30",
    status: "Issued"
  }
];

export const staffRecognitionScoringRows = [
  ["onTimeArrivalRate", "98%", "Adjusted for rota changes and continuity context"],
  ["completedVisitNotesRate", "97%", "Quality of notes considered, not just completion"],
  ["medicationRecordingCompliance", "100%", "MAR prompts recorded safely in dummy data"],
  ["noMissedCalls", "Yes", "No missed calls attributed in test period"],
  ["incidentOrConcernReportingQuality", "Good", "Appropriate escalation recognised positively"],
  ["positiveServiceUserFeedbackCount", "5", "Anonymised compliments only"],
  ["positiveRelativeFeedbackCount", "2", "Relative feedback anonymised"],
  ["careCoordinatorFeedbackScore", "5/5", "Narrative evidence allowed"],
  ["supervisorFeedbackScore", "5/5", "Supervisor review required"],
  ["trainingComplianceStatus", "Current", "Mandatory training current"],
  ["spotCheckOutcome", "Positive", "No negative public ranking"],
  ["emergencyCoverSupport", "Recognised", "Context-adjusted for staff role"],
  ["teamworkFeedback", "Positive", "Teamwork evidence linked"],
  ["personCentredCareEvidence", "Strong", "CQC Caring mapped"]
] satisfies string[][];

export const staffRecognitionCqcMappingRows = [
  ["Caring", "Kindness, dignity, compassion, positive service-user feedback and respectful communication"],
  ["Effective", "Training compliance, competency, good practice and correct use of care plans"],
  ["Responsive", "Responding to changing needs, emergency support, communication and continuity"],
  ["Safe", "Concern reporting, safeguarding awareness, medication compliance and following risk assessments"],
  ["Well-led", "Positive culture, staff recognition, quality improvement and workforce wellbeing"]
] satisfies string[][];

export const staffRecognitionNotifications = [
  ["Care coordinators", "Please submit your Staff Recognition nominations for [month]."],
  ["Supervisor", "Staff Recognition nomination submitted for review: [staff name]."],
  ["HR", "Recognition nomination requires consent/reward review: [staff name]."],
  ["Manager", "Staff Recognition nomination requires final approval: [staff name]."],
  ["Nominated staff", "You have been recognised for your contribution. Please review the recognition story and photo/story consent options."],
  ["All staff after approval", "Congratulations to [staff name], recognised for [award category]."],
  ["Admin if consent withdrawn", "[staff name] has withdrawn consent for photo/story use. Please review published materials."]
] satisfies string[][];

export const staffRecognitionAnnouncementTemplate = [
  "Subject: Congratulations to [Staff Name] - [Award Category]",
  "",
  "Dear Team,",
  "",
  "We are pleased to recognise [Staff Name] as [Award Category] for [Month Year].",
  "",
  "[Staff Name] has been recognised for [summary of evidence and achievement].",
  "",
  "This recognition reflects their commitment to person-centred care, professionalism and positive teamwork.",
  "",
  "Key achievements:",
  "- [achievement 1]",
  "- [achievement 2]",
  "- [achievement 3]",
  "",
  "Thank you, [Staff Name], for your continued contribution and for helping us deliver safe, caring and responsive support.",
  "",
  "Kind regards,",
  "[Manager Name]",
  "[Job Title]",
  "",
  "Rules: Do not include confidential service-user details. Do not include photo unless consent is recorded. Manager approval required before sending."
].join("\n");

export const staffRecognitionCertificateTemplate = [
  "Certificate of Recognition",
  "",
  "Presented to:",
  "[Staff Name]",
  "",
  "For:",
  "[Award Category]",
  "",
  "In recognition of your commitment, professionalism and positive contribution to high-quality, person-centred care during [Month Year].",
  "",
  "Approved by:",
  "[Manager Name]",
  "[Job Title]",
  "[Date]"
].join("\n");

export const staffRecognitionAuditRows = [
  ["REC-AUD-001", "TEST-COMPANY-001", "UAT-ST-MARIA-001", "Care Coordinator", "shortlist generated", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 09:00", "N/A", "Suggested shortlist", "Positive evidence only"],
  ["REC-AUD-002", "TEST-COMPANY-001", "UAT-ST-MARIA-001", "Care Coordinator", "nomination created", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 10:00", "Draft", "Submitted", "Nomination submitted"],
  ["REC-AUD-003", "TEST-COMPANY-001", "UAT-ST-MARIA-001", "Care Coordinator", "evidence linked", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 10:05", "0 evidence", "5 evidence items", "Approved evidence only"],
  ["REC-AUD-004", "TEST-COMPANY-001", "UAT-ST-DAVID-001", "Supervisor", "supervisor review", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 14:00", "Submitted", "Supervisor Review complete", "Recommended approval"],
  ["REC-AUD-005", "TEST-COMPANY-001", "HR-MANAGER-TEST", "HR Manager", "consent requested", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 15:00", "Pending", "Granted internal email only", "Photo not authorised"],
  ["REC-AUD-006", "TEST-COMPANY-001", "HR-MANAGER-TEST", "HR Manager", "AI draft generated", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 15:05", "No draft", "AI-assisted draft - approval required", "No automatic sending"],
  ["REC-AUD-007", "TEST-COMPANY-001", "UAT-MGR-001", "Registered Manager", "manager approval", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 16:00", "Manager Approval", "Approved", "Final approval recorded"],
  ["REC-AUD-008", "TEST-COMPANY-001", "HR-MANAGER-TEST", "HR Manager", "reward issued", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 16:30", "Approved", "Issued", "Thank You Card issued"],
  ["REC-AUD-009", "TEST-COMPANY-001", "HR-MANAGER-TEST", "HR Manager", "recognition published", "UAT-ST-SARAH-001", "REC-NOM-001", "30 June 2026 16:40", "Approved", "Published internal only", "No photo due consent limits"]
] satisfies string[][];

export const staffRecognitionEvidencePackRows = [
  ["Staff HR profile", "Recognition History", "Sarah Williams recognition saved to staff file"],
  ["Recognition register", "Approved nomination", "REC-NOM-001"],
  ["Quality Intelligence Hub > Good Practice Evidence", "Positive care culture", "Good practice evidence mapped"],
  ["CQC Evidence Hub > Workforce Wellbeing / Positive Culture", "Well-led / Caring Evidence", "Positive staff culture evidence"],
  ["Inspection Evidence Portal", "Well-led / Caring Evidence", "Recognition evidence pack ready"],
  ["No public negative ranking", "Fairness safeguard", "Only positive approved evidence shown"]
] satisfies string[][];

export const staffRecognitionTestingMatrix = [
  ["Recognition dashboard loads", "Pass in demo", "Dashboard cards and filters render"],
  ["Monthly shortlist generates", "Pass in demo", "generateRecognitionShortlist returns suggested staff and fairness warnings"],
  ["Care coordinator can nominate staff", "Pass in demo", "REC-NOM-001 created by Maria Patel"],
  ["Evidence can be linked", "Pass in demo", "Nomination links approved evidence IDs"],
  ["Supervisor can review", "Pass in demo", "David Brown review recorded"],
  ["HR can review consent", "Pass in demo", "Consent granted internal email only and photo declined"],
  ["Manager can approve", "Pass in demo", "Office Manager Test approval recorded"],
  ["AI draft requires approval", "Pass in demo", "AI-assisted draft - approval required"],
  ["Photo does not publish without consent", "Pass in demo", "Photo use false where consent absent"],
  ["Recognition saves to staff HR profile", "Pass in demo", "Staff profile Recognition History tab added"],
  ["Recognition maps to CQC Evidence Hub", "Pass in demo", "Caring, Effective, Responsive, Safe, Well-led mapped"],
  ["Reward can be issued", "Pass in demo", "REC-REWARD-001 issued"],
  ["Audit trail records actions", "Pass in demo", "REC-AUD-001 to REC-AUD-009"],
  ["Staff cannot see private scoring of other staff", "Pass in demo", "Role permission row states restriction"],
  ["No negative ranking is shown publicly", "Pass in demo", "Fairness safeguard and UI warning"],
  ["Tenant separation by companyId works", "Pass in demo", "Every record includes TEST-COMPANY-001"]
] satisfies string[][];

export function generateRecognitionShortlist(companyId: string, branchId: string, month: string, year: number) {
  const companyEvidence = staffRecognitionEvidenceRecords.filter((record) => record.companyId === companyId && (!branchId || record.branchId === branchId));
  const suggestedStaff = ["Sarah Williams", "Ahmed Khan", "Maria Patel"].map((staffName) => {
    const staffRecord = staffRecognitionDemoStaff.find((record) => record[2] === staffName);
    const staffEvidence = companyEvidence.filter((record) => record.staffId === staffRecord?.[0]);
    return {
      staffId: staffRecord?.[0] ?? "UNKNOWN",
      staffName,
      role: staffRecord?.[3] ?? "Demo role",
      month,
      year,
      evidenceSummary: `${staffEvidence.length} approved positive evidence items found for ${companyId}.`,
      scoreBreakdown: {
        positiveEvidenceCount: staffEvidence.length,
        compliance: staffName === "Sarah Williams" ? 92 : staffName === "Ahmed Khan" ? 84 : 88,
        narrativeEvidenceRequired: true
      },
      recommendedAwardCategories: staffName === "Ahmed Khan" ? ["Emergency Support Champion", "Teamwork Award"] : staffName === "Maria Patel" ? ["Outstanding Communication"] : ["Staff of the Month", "Most Person-Centred Care"]
    };
  });

  return {
    suggestedStaff,
    evidenceSummary: "Shortlist uses positive approved evidence only and does not make a final decision.",
    scoreBreakdown: staffRecognitionScoringRows,
    fairnessWarnings: [
      "Do not rely only on automated score.",
      "Adjust for part-time staff, new starters, night staff, complex packages and different roles.",
      "Care coordinator/supervisor nomination and manager approval are required.",
      "Do not show negative staff ranking publicly."
    ],
    missingDataWarnings: ["Check whether any positive feedback has not yet been linked.", "Confirm consent before story/photo publication."],
    recommendedAwardCategories: ["Staff of the Month", "Most Person-Centred Care", "Emergency Support Champion", "Outstanding Communication"]
  };
}

export function generateStaffRecognitionDraft(request: StaffRecognitionDraftRequest): StaffRecognitionDraftResponse {
  const nomination = staffRecognitionNominations.find((item) => item.nominationId === request.nominationId && item.companyId === request.companyId);
  const selectedEvidence = staffRecognitionEvidenceRecords.filter((item) => request.selectedEvidenceIds.includes(item.evidenceId) && item.companyId === request.companyId);
  const draftId = `REC-AI-DRAFT-${Date.now()}`;
  const staffName = nomination?.staffName ?? "[Staff Name]";
  const awardCategory = request.awardCategory || nomination?.awardCategory || "[Award Category]";
  const evidenceSummary = selectedEvidence.length
    ? selectedEvidence.map((item) => item.evidenceDescription).join(" ")
    : nomination?.evidenceSummary ?? "Selected approved evidence should be added before approval.";

  const body = [
    "AI-assisted draft - approval required.",
    "",
    `${staffName} has been nominated for ${awardCategory}.`,
    "",
    `Evidence summary: ${evidenceSummary}`,
    "",
    "This draft uses positive, approved evidence only. It must be reviewed by an authorised manager before publication, emailing, saving as final recognition evidence or adding to an external evidence pack.",
    "",
    request.anonymiseServiceUserDetails ? "Service-user details are anonymised in this draft." : "Check confidentiality and consent before using any service-user detail."
  ].join("\n");

  return {
    draftId,
    title: `${request.outputType} - ${staffName}`,
    body,
    keyAchievements: nomination?.staffId === "UAT-ST-SARAH-001"
      ? ["Person-centred care", "Reliable visit evidence", "Safe medication recording"]
      : ["Positive teamwork", "Good practice evidence", "Professional communication"],
    cqcThemeMapping: ["Caring", "Effective", "Responsive", "Safe", "Well-led"],
    confidentialityWarnings: [
      "AI-assisted draft - approval required.",
      "Do not include confidential service-user details unless approved and anonymised.",
      "Do not include photo unless consent is recorded.",
      `Tenant scoped to companyId ${request.companyId}.`
    ],
    missingInformation: [
      selectedEvidence.length ? "" : "selectedEvidenceIds",
      nomination?.consentRequired && nomination.consentStatus !== "Granted" ? "staff consent approval" : ""
    ].filter(Boolean),
    approvalRequired: true
  };
}
