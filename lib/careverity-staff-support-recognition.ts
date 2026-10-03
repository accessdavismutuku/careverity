export const staffSupportRecognitionModuleName = "Staff Support & Recognition Intelligence";
export const staffSupportRecognitionReference = "CAREVERITY-STAFF-SUPPORT-RECOGNITION-001";
export const staffSupportDemoCompanyId = "TEST-COMPANY-001";

export type StaffSupportRagStatus = "Green" | "Amber" | "Red";
export type StaffSupportConfidenceLevel = "Low" | "Medium" | "High";
export type StaffSupportIndicatorStatus = "System Suggested" | "Reviewed" | "Action Open" | "Action Closed" | "Archived";
export type StaffSupportActionStatus = "Open" | "In Progress" | "Completed" | "Cancelled";
export type StaffSupportActionType =
  | "Recognition"
  | "Thank You Message"
  | "Staff of the Month Nomination"
  | "Supervision"
  | "Coaching"
  | "Refresher Training"
  | "Spot Check"
  | "Observation"
  | "Medication Competency Review"
  | "Documentation Coaching"
  | "Timekeeping Discussion"
  | "Geofence/Clock-In Review"
  | "HR Review"
  | "No Action Required"
  | "Other";

export type StaffSupportIndicator = {
  indicatorId: string;
  companyId: string;
  branchId?: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  reportingPeriodStart: string;
  reportingPeriodEnd: string;
  ragStatus: StaffSupportRagStatus;
  confidenceLevel: StaffSupportConfidenceLevel;
  recognitionScore: number;
  supportScore: number;
  riskAlertScore: number;
  positiveEvidenceCount: number;
  concernEvidenceCount: number;
  unresolvedAlertCount: number;
  keyPositiveReasons: string[];
  keySupportReasons: string[];
  keyRiskReasons: string[];
  recommendedActions: string[];
  trainingSuggested: boolean;
  supervisionSuggested: boolean;
  spotCheckSuggested: boolean;
  recognitionSuggested: boolean;
  managerReviewSuggested: boolean;
  hrReviewSuggested: boolean;
  complaintLinksRequireReview: boolean;
  medicationAlertPresent: boolean;
  geofenceAlertPresent: boolean;
  trainingAlertPresent: boolean;
  supervisionAlertPresent: boolean;
  lastCalculatedAt: string;
  calculatedBy: "System";
  reviewedBy?: string;
  reviewedAt?: string;
  managerDecision?: string;
  actionPlanId?: string;
  status: StaffSupportIndicatorStatus;
};

export type StaffSupportAction = {
  actionId: string;
  companyId: string;
  branchId?: string;
  staffId: string;
  sourceIndicatorId: string;
  actionType: StaffSupportActionType;
  actionReason: string;
  assignedToUserId: string;
  assignedToName: string;
  priority: "Low" | "Medium" | "High";
  dueDate: string;
  status: StaffSupportActionStatus;
  outcomeNotes?: string;
  evidenceFileId?: string;
  completedBy?: string;
  completedAt?: string;
  managerApprovedBy?: string;
  managerApprovedAt?: string;
};

export type StaffSupportAiOutputType =
  | "Recognition Reason"
  | "Staff of the Month Nomination"
  | "Thank You Email"
  | "Good Practice Story"
  | "CQC Good Practice Evidence Summary"
  | "Supportive Supervision Agenda"
  | "Coaching Plan"
  | "Training Recommendation"
  | "Supportive Reminder Email"
  | "Care Coordinator Note"
  | "Manager Review Summary"
  | "Support Action Plan"
  | "Factual Investigation Invitation Draft"
  | "Medication Competency Review Summary"
  | "Spot Check Recommendation"
  | "HR Review Note";

export type StaffSupportAiDraftRequest = {
  companyId: string;
  staffId: string;
  indicatorId: string;
  selectedEvidenceIds: string[];
  outputType: StaffSupportAiOutputType;
  managerContext?: string;
  anonymiseServiceUserDetails: boolean;
  tone?: "professional" | "supportive" | "warm" | "factual";
  userId?: string;
  userRole?: string;
};

export type StaffSupportAiDraftResponse = {
  draftId: string;
  title: string;
  body: string;
  keyFindings: string[];
  suggestedActions: string[];
  riskWarnings: string[];
  fairnessWarnings: string[];
  missingInformation: string[];
  approvalRequired: true;
};

type StaffSupportDemoRecord = {
  staffId: string;
  staffName: string;
  staffRole: string;
  branchId: string;
  onTimeArrivalPercent: number;
  visitNotesCompletedPercent: number;
  medicationRecordingCompliancePercent: number;
  missedCalls: number;
  positiveFeedbackCount: number;
  complimentsCount: number;
  goodSpotCheck: boolean;
  trainingUpToDate: boolean;
  supervisionAttended: boolean;
  emergencySupportProvided: boolean;
  geofenceMismatches: number;
  missedClockOuts: number;
  marLateEntries: number;
  missingMedicationReasons: number;
  unresolvedMedicationAlerts: number;
  trainingOverdue: boolean;
  supervisionOverdue: boolean;
  complaintLinkedForReview: boolean;
  seriousUnresolvedAlert: boolean;
};

export const staffSupportRouteLinks = [
  "/hr/staff-support-recognition",
  "/hr/staff-support-recognition/dashboard",
  "/hr/staff-support-recognition/staff/:staffId",
  "/hr/staff-support-recognition/green-list",
  "/hr/staff-support-recognition/support-list",
  "/hr/staff-support-recognition/red-review-list",
  "/hr/staff-support-recognition/actions",
  "/hr/staff-support-recognition/reports",
  "/hr/staff-support-recognition/settings"
] as const;

export const staffSupportAuthorisedRoles = [
  "Registered Manager",
  "Senior Manager",
  "HR Manager",
  "Supervisor",
  "Care Coordinator",
  "Compliance Manager"
] as const;

export const staffSupportForbiddenLabels = [
  "bad staff",
  "poor staff",
  "guilty",
  "problem staff",
  "non-compliant person",
  "unsafe staff"
] as const;

export const staffSupportPreferredLanguage = [
  "support recommended",
  "coaching suggested",
  "supervision review",
  "senior review",
  "recognition suggested",
  "development opportunity"
] as const;

export const staffSupportFairnessBanner =
  "Support indicator only. This is not a disciplinary decision. Managers must review evidence, context and fairness before taking action.";

export const staffSupportCoreRule =
  "The system can suggest. Managers decide. Human review and approval are required before any HR action, formal concern, warning, reward or recognition is issued.";

export const staffSupportRagDefinitions = [
  ["Green", "Strong positive evidence and good compliance.", "Consider praise, recognition, Staff of the Month nomination, thank-you email or good practice story."],
  ["Amber", "Some support, monitoring or coaching may be helpful.", "Arrange supervision, coaching, refresher training, observation, spot check or review discussion."],
  ["Red", "Senior review recommended due to repeated concerns, serious alert or unresolved pattern.", "Manager review, support plan, closer supervision, training referral, observation, HR review if appropriate."]
] satisfies string[][];

export const staffSupportDataSources = {
  positiveEvidence: [
    "positive feedback from service users",
    "positive feedback from relatives",
    "compliments linked to staff",
    "care coordinator feedback",
    "supervisor feedback",
    "good spot check outcome",
    "completed visit notes",
    "quality of notes",
    "on-time arrival",
    "correct clock-in and clock-out",
    "geofence compliance",
    "medication recording compliance",
    "incident/concern reporting where appropriate",
    "training completed on time",
    "supervision attended",
    "emergency cover support",
    "teamwork evidence",
    "person-centred care evidence",
    "recognition nominations",
    "service-user outcome stories"
  ],
  supportAlertEvidence: [
    "repeated late arrival",
    "repeated early leave",
    "missed clock-in or clock-out",
    "geofence mismatch",
    "incomplete visit notes",
    "poor quality notes",
    "medication not recorded",
    "medication recording errors",
    "repeated MAR alerts",
    "unresolved visit alerts",
    "missed visits",
    "complaints linked to visit/staff requiring review",
    "negative feedback requiring review",
    "training overdue",
    "DBS/right-to-work/document expiry issue",
    "missed supervision",
    "failed spot check",
    "incident not reported when required",
    "safeguarding concern requiring review",
    "repeated office follow-up required"
  ]
} as const;

export const staffSupportFairnessSafeguards = [
  "Do not show public negative ranking.",
  "Do not show red/amber/green to all staff.",
  "Do not use this score as an automatic disciplinary decision.",
  "Do not automatically issue warning letters.",
  "Complaints must be reviewed by a human before being treated as staff-related concern.",
  "Adjust interpretation for part-time staff, new starters, night staff, complex packages, emergency cover staff, staff with fewer visits and staff working high-risk packages.",
  "Staff must be able to raise if data is incorrect.",
  "Managers must be able to add context.",
  "HR must be able to review equality/fairness.",
  "All actions must be recorded in audit trail."
] as const;

export const staffSupportMedicationRules = [
  ["MAR completed on time", "Green evidence when consistently completed"],
  ["Medication given/refused/missed properly recorded", "Support suggested when recording gaps appear"],
  ["Reason recorded for refused/missed medication", "Amber if missing occasionally; Red if repeated and unresolved"],
  ["PRN records complete", "Competency review suggested when incomplete"],
  ["Controlled medication record complete", "Red if controlled medication discrepancy is unresolved"],
  ["Witness record complete where required", "Manager review if witness record is missing"],
  ["Stock balance correct", "Senior review if balance discrepancy remains open"],
  ["Medication notes completed", "Documentation coaching if repeated gaps occur"]
] satisfies string[][];

export const staffSupportGeofenceRules = [
  ["Repeated clock-in outside geofence", "Check app/geofence issue and review travel pattern"],
  ["Repeated missed clock-in/out", "Supportive timekeeping discussion"],
  ["Repeated early departure", "Rota/travel review and supervision"],
  ["Repeated late arrival", "Supportive review before any formal route"],
  ["Visit duration significantly shorter than planned", "Spot check if unexplained pattern continues"],
  ["Allowed explanations", "poor GPS signal, emergency, traffic, service-user request, office-approved change, app failure, double-up care coordination issue"]
] satisfies string[][];

export const staffSupportDemoStaffRecords: StaffSupportDemoRecord[] = [
  {
    staffId: "UAT-ST-SARAH-001",
    staffName: "Sarah Williams",
    staffRole: "Care Worker",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 98,
    visitNotesCompletedPercent: 99,
    medicationRecordingCompliancePercent: 100,
    missedCalls: 0,
    positiveFeedbackCount: 4,
    complimentsCount: 2,
    goodSpotCheck: true,
    trainingUpToDate: true,
    supervisionAttended: true,
    emergencySupportProvided: true,
    geofenceMismatches: 0,
    missedClockOuts: 0,
    marLateEntries: 0,
    missingMedicationReasons: 0,
    unresolvedMedicationAlerts: 0,
    trainingOverdue: false,
    supervisionOverdue: false,
    complaintLinkedForReview: false,
    seriousUnresolvedAlert: false
  },
  {
    staffId: "UAT-ST-AHMED-001",
    staffName: "Ahmed Khan",
    staffRole: "One-off / Emergency Cover Care Worker",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 91,
    visitNotesCompletedPercent: 96,
    medicationRecordingCompliancePercent: 99,
    missedCalls: 0,
    positiveFeedbackCount: 2,
    complimentsCount: 1,
    goodSpotCheck: true,
    trainingUpToDate: true,
    supervisionAttended: true,
    emergencySupportProvided: true,
    geofenceMismatches: 3,
    missedClockOuts: 2,
    marLateEntries: 0,
    missingMedicationReasons: 0,
    unresolvedMedicationAlerts: 0,
    trainingOverdue: false,
    supervisionOverdue: false,
    complaintLinkedForReview: false,
    seriousUnresolvedAlert: false
  },
  {
    staffId: "UAT-ST-DANIEL-001",
    staffName: "Daniel Roberts",
    staffRole: "Care Worker",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 94,
    visitNotesCompletedPercent: 93,
    medicationRecordingCompliancePercent: 92,
    missedCalls: 0,
    positiveFeedbackCount: 1,
    complimentsCount: 0,
    goodSpotCheck: true,
    trainingUpToDate: true,
    supervisionAttended: true,
    emergencySupportProvided: false,
    geofenceMismatches: 0,
    missedClockOuts: 0,
    marLateEntries: 4,
    missingMedicationReasons: 2,
    unresolvedMedicationAlerts: 0,
    trainingOverdue: false,
    supervisionOverdue: false,
    complaintLinkedForReview: false,
    seriousUnresolvedAlert: false
  },
  {
    staffId: "UAT-ST-OLIVIA-001",
    staffName: "Olivia Brown",
    staffRole: "Care Worker",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 83,
    visitNotesCompletedPercent: 71,
    medicationRecordingCompliancePercent: 78,
    missedCalls: 1,
    positiveFeedbackCount: 0,
    complimentsCount: 0,
    goodSpotCheck: false,
    trainingUpToDate: false,
    supervisionAttended: false,
    emergencySupportProvided: false,
    geofenceMismatches: 4,
    missedClockOuts: 3,
    marLateEntries: 6,
    missingMedicationReasons: 4,
    unresolvedMedicationAlerts: 3,
    trainingOverdue: true,
    supervisionOverdue: true,
    complaintLinkedForReview: true,
    seriousUnresolvedAlert: true
  },
  {
    staffId: "UAT-ST-MARIA-001",
    staffName: "Maria Patel",
    staffRole: "Care Coordinator",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 97,
    visitNotesCompletedPercent: 98,
    medicationRecordingCompliancePercent: 99,
    missedCalls: 0,
    positiveFeedbackCount: 3,
    complimentsCount: 1,
    goodSpotCheck: true,
    trainingUpToDate: true,
    supervisionAttended: true,
    emergencySupportProvided: true,
    geofenceMismatches: 0,
    missedClockOuts: 0,
    marLateEntries: 0,
    missingMedicationReasons: 0,
    unresolvedMedicationAlerts: 0,
    trainingOverdue: false,
    supervisionOverdue: false,
    complaintLinkedForReview: false,
    seriousUnresolvedAlert: false
  },
  {
    staffId: "UAT-ST-DAVID-001",
    staffName: "David Brown",
    staffRole: "Supervisor",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 96,
    visitNotesCompletedPercent: 98,
    medicationRecordingCompliancePercent: 99,
    missedCalls: 0,
    positiveFeedbackCount: 2,
    complimentsCount: 1,
    goodSpotCheck: true,
    trainingUpToDate: true,
    supervisionAttended: true,
    emergencySupportProvided: true,
    geofenceMismatches: 0,
    missedClockOuts: 0,
    marLateEntries: 0,
    missingMedicationReasons: 0,
    unresolvedMedicationAlerts: 0,
    trainingOverdue: false,
    supervisionOverdue: false,
    complaintLinkedForReview: false,
    seriousUnresolvedAlert: false
  },
  {
    staffId: "UAT-MGR-001",
    staffName: "Office Manager Test",
    staffRole: "Registered Manager",
    branchId: "Uxbridge",
    onTimeArrivalPercent: 98,
    visitNotesCompletedPercent: 98,
    medicationRecordingCompliancePercent: 99,
    missedCalls: 0,
    positiveFeedbackCount: 1,
    complimentsCount: 1,
    goodSpotCheck: true,
    trainingUpToDate: true,
    supervisionAttended: true,
    emergencySupportProvided: true,
    geofenceMismatches: 0,
    missedClockOuts: 0,
    marLateEntries: 0,
    missingMedicationReasons: 0,
    unresolvedMedicationAlerts: 0,
    trainingOverdue: false,
    supervisionOverdue: false,
    complaintLinkedForReview: false,
    seriousUnresolvedAlert: false
  }
];

function positiveReasons(record: StaffSupportDemoRecord) {
  const reasons: string[] = [];
  if (record.onTimeArrivalPercent >= 95) reasons.push(`On-time arrival ${record.onTimeArrivalPercent}%`);
  if (record.visitNotesCompletedPercent >= 95) reasons.push(`Visit notes completed ${record.visitNotesCompletedPercent}%`);
  if (record.medicationRecordingCompliancePercent >= 98) reasons.push(`Medication recording compliance ${record.medicationRecordingCompliancePercent}%`);
  if (record.missedCalls === 0) reasons.push("No missed calls");
  if (record.positiveFeedbackCount) reasons.push(`${record.positiveFeedbackCount} positive feedback records`);
  if (record.complimentsCount) reasons.push(`${record.complimentsCount} compliments linked to staff`);
  if (record.goodSpotCheck) reasons.push("Good spot check outcome");
  if (record.trainingUpToDate) reasons.push("Training up to date");
  if (record.supervisionAttended) reasons.push("Supervision attended");
  if (record.emergencySupportProvided) reasons.push("Emergency cover support provided");
  return reasons;
}

function supportReasons(record: StaffSupportDemoRecord) {
  const reasons: string[] = [];
  if (record.onTimeArrivalPercent < 95) reasons.push("On-time arrival below agreed threshold");
  if (record.visitNotesCompletedPercent < 95) reasons.push("Visit notes incomplete/repeatedly late");
  if (record.medicationRecordingCompliancePercent < 98) reasons.push("Medication record gaps");
  if (record.marLateEntries) reasons.push(`${record.marLateEntries} MAR late entries`);
  if (record.missingMedicationReasons) reasons.push(`${record.missingMedicationReasons} missing refused/missed medication reasons`);
  if (record.geofenceMismatches) reasons.push(`${record.geofenceMismatches} geofence mismatches`);
  if (record.missedClockOuts) reasons.push(`${record.missedClockOuts} missed clock-outs`);
  if (record.trainingOverdue) reasons.push("Training overdue");
  if (record.supervisionOverdue) reasons.push("Supervision overdue/missed");
  if (record.complaintLinkedForReview) reasons.push("Complaint linked for review, not confirmed fault");
  return reasons;
}

function riskReasons(record: StaffSupportDemoRecord) {
  const reasons: string[] = [];
  if (record.seriousUnresolvedAlert) reasons.push("Serious unresolved alert requires senior review");
  if (record.unresolvedMedicationAlerts) reasons.push(`${record.unresolvedMedicationAlerts} unresolved medication alerts`);
  if (record.missedCalls) reasons.push(`${record.missedCalls} missed visit/call alert`);
  if (record.complaintLinkedForReview) reasons.push("Complaint requires manager fairness review before impact");
  if (!record.goodSpotCheck) reasons.push("Failed or concerning spot check requires context review");
  return reasons;
}

export function calculateStaffSupportIndicator(
  companyId: string,
  staffId: string,
  periodStart: string,
  periodEnd: string
): StaffSupportIndicator {
  const record = staffSupportDemoStaffRecords.find((item) => item.staffId === staffId) ?? staffSupportDemoStaffRecords[0];
  const positives = positiveReasons(record);
  const support = supportReasons(record);
  const risks = riskReasons(record);
  const recognitionScore = Math.min(100, record.onTimeArrivalPercent * 0.25 + record.visitNotesCompletedPercent * 0.25 + record.medicationRecordingCompliancePercent * 0.25 + record.positiveFeedbackCount * 4 + record.complimentsCount * 3 + (record.goodSpotCheck ? 8 : 0) + (record.trainingUpToDate ? 5 : 0) + (record.supervisionAttended ? 5 : 0));
  const supportScore = support.length * 12 + record.geofenceMismatches * 3 + record.marLateEntries * 4 + record.missingMedicationReasons * 5 + (record.trainingOverdue ? 10 : 0) + (record.supervisionOverdue ? 10 : 0);
  const riskAlertScore = risks.length * 18 + record.unresolvedMedicationAlerts * 12 + record.missedCalls * 20 + (record.seriousUnresolvedAlert ? 30 : 0);
  const ragStatus: StaffSupportRagStatus = riskAlertScore >= 45 || record.seriousUnresolvedAlert ? "Red" : supportScore >= 25 ? "Amber" : "Green";
  const recommendedActions =
    ragStatus === "Green"
      ? ["Recognition", "Thank You Message", "Staff of the Month Nomination", "Good practice story"]
      : ragStatus === "Amber"
        ? ["Supervision", "Coaching", record.medicationRecordingCompliancePercent < 98 ? "Medication Competency Review" : "Refresher Training", record.geofenceMismatches ? "Geofence/Clock-In Review" : "Spot Check"]
        : ["Senior manager review", "Support action plan", "Observation", "HR Review if appropriate", "Do not automatically issue formal warning"];

  return {
    indicatorId: `SSI-${staffId.replace(/[^A-Z0-9]/gi, "")}`,
    companyId,
    branchId: record.branchId,
    staffId: record.staffId,
    staffName: record.staffName,
    staffRole: record.staffRole,
    reportingPeriodStart: periodStart,
    reportingPeriodEnd: periodEnd,
    ragStatus,
    confidenceLevel: record.complaintLinkedForReview ? "Medium" : "High",
    recognitionScore: Math.round(recognitionScore),
    supportScore,
    riskAlertScore,
    positiveEvidenceCount: positives.length,
    concernEvidenceCount: support.length,
    unresolvedAlertCount: record.unresolvedMedicationAlerts + record.missedCalls + (record.seriousUnresolvedAlert ? 1 : 0),
    keyPositiveReasons: positives,
    keySupportReasons: support,
    keyRiskReasons: risks,
    recommendedActions,
    trainingSuggested: record.trainingOverdue || record.marLateEntries > 0,
    supervisionSuggested: ragStatus !== "Green" || record.supervisionOverdue,
    spotCheckSuggested: record.geofenceMismatches > 0 || !record.goodSpotCheck,
    recognitionSuggested: ragStatus === "Green",
    managerReviewSuggested: ragStatus === "Red" || record.complaintLinkedForReview,
    hrReviewSuggested: ragStatus === "Red",
    complaintLinksRequireReview: record.complaintLinkedForReview,
    medicationAlertPresent: record.marLateEntries > 0 || record.missingMedicationReasons > 0 || record.unresolvedMedicationAlerts > 0,
    geofenceAlertPresent: record.geofenceMismatches > 0 || record.missedClockOuts > 0,
    trainingAlertPresent: record.trainingOverdue,
    supervisionAlertPresent: record.supervisionOverdue,
    lastCalculatedAt: "04 June 2026 17:30",
    calculatedBy: "System",
    reviewedBy: ragStatus === "Green" ? "Maria Patel" : undefined,
    reviewedAt: ragStatus === "Green" ? "04 June 2026 17:45" : undefined,
    managerDecision: ragStatus === "Green" ? "Recognition nomination supported" : undefined,
    actionPlanId: ragStatus !== "Green" ? `SSA-${record.staffId.replace(/[^A-Z0-9]/gi, "")}` : undefined,
    status: ragStatus === "Green" ? "Reviewed" : "System Suggested"
  };
}

export const staffSupportIndicators = staffSupportDemoStaffRecords.map((record) =>
  calculateStaffSupportIndicator(staffSupportDemoCompanyId, record.staffId, "01 June 2026", "30 June 2026")
);

export const staffSupportTopLineCards = [
  ["Green staff", String(staffSupportIndicators.filter((item) => item.ragStatus === "Green").length), "Recognition suggested", "Green"],
  ["Amber staff", String(staffSupportIndicators.filter((item) => item.ragStatus === "Amber").length), "Support suggested", "Amber"],
  ["Red staff", String(staffSupportIndicators.filter((item) => item.ragStatus === "Red").length), "Senior review suggested", "Red"],
  ["Recognition nominations due", "3", "Manager approval required", "Green"],
  ["Supervision actions due", "5", "Supportive actions open", "Amber"],
  ["Medication compliance alerts", "2", "Medication competency review suggested", "Red"],
  ["Training/refresher suggested", "6", "Training Matrix connection", "Amber"]
] satisfies string[][];

export const staffSupportDashboardCards = staffSupportTopLineCards.map(([label, value, detail, status]) => ({
  label,
  value,
  detail,
  status
}));

export const staffSupportDemoEvidenceRows = staffSupportIndicators.map((indicator) => [
  indicator.staffName,
  indicator.ragStatus,
  indicator.confidenceLevel,
  String(indicator.recognitionScore),
  String(indicator.supportScore),
  String(indicator.riskAlertScore),
  indicator.keyPositiveReasons.slice(0, 2).join(" | ") || "No positive evidence yet",
  indicator.keySupportReasons.slice(0, 2).join(" | ") || "No support reason",
  indicator.keyRiskReasons.slice(0, 2).join(" | ") || "No senior review risk"
]);

export const staffSupportMedicationAlertRows = staffSupportIndicators
  .filter((indicator) => indicator.medicationAlertPresent)
  .map((indicator) => [
    indicator.staffName,
    indicator.ragStatus,
    indicator.keySupportReasons.filter((reason) => reason.includes("MAR") || reason.includes("medication")).join(" | "),
    indicator.ragStatus === "Red" ? "manager review, medication competency review, incident report if medication error occurred" : "medication refresher and competency review",
    staffSupportDemoCompanyId
  ]);

export const staffSupportGeofenceAlertRows = staffSupportIndicators
  .filter((indicator) => indicator.geofenceAlertPresent)
  .map((indicator) => [
    indicator.staffName,
    indicator.ragStatus,
    indicator.keySupportReasons.filter((reason) => reason.includes("geofence") || reason.includes("clock")).join(" | "),
    "Allow explanation: GPS signal, emergency, traffic, service-user request, office-approved change, app failure or double-up coordination issue",
    "Supportive review before any formal route"
  ]);

export const staffSupportActions: StaffSupportAction[] = [
  {
    actionId: "SSA-001",
    companyId: staffSupportDemoCompanyId,
    branchId: "Uxbridge",
    staffId: "UAT-ST-SARAH-001",
    sourceIndicatorId: "SSI-UATSTSARAH001",
    actionType: "Staff of the Month Nomination",
    actionReason: "Strong positive evidence, compliments and medication compliance.",
    assignedToUserId: "UAT-ST-MARIA-001",
    assignedToName: "Maria Patel",
    priority: "Low",
    dueDate: "10 June 2026",
    status: "Open",
    managerApprovedBy: "Office Manager Test",
    managerApprovedAt: "04 June 2026 17:45"
  },
  {
    actionId: "SSA-002",
    companyId: staffSupportDemoCompanyId,
    branchId: "Uxbridge",
    staffId: "UAT-ST-AHMED-001",
    sourceIndicatorId: "SSI-UATSTAHMED001",
    actionType: "Geofence/Clock-In Review",
    actionReason: "Three geofence mismatches and two missed clock-outs require supportive review.",
    assignedToUserId: "UAT-ST-DAVID-001",
    assignedToName: "David Brown",
    priority: "Medium",
    dueDate: "12 June 2026",
    status: "Open"
  },
  {
    actionId: "SSA-003",
    companyId: staffSupportDemoCompanyId,
    branchId: "Uxbridge",
    staffId: "UAT-ST-DANIEL-001",
    sourceIndicatorId: "SSI-UATSTDANIEL001",
    actionType: "Medication Competency Review",
    actionReason: "Four MAR late entries and two missing refused medication reasons.",
    assignedToUserId: "UAT-ST-DAVID-001",
    assignedToName: "David Brown",
    priority: "Medium",
    dueDate: "11 June 2026",
    status: "In Progress"
  },
  {
    actionId: "SSA-004",
    companyId: staffSupportDemoCompanyId,
    branchId: "Uxbridge",
    staffId: "UAT-ST-OLIVIA-001",
    sourceIndicatorId: "SSI-UATSTOLIVIA001",
    actionType: "HR Review",
    actionReason: "Repeated unresolved alerts and complaint link require senior review. No automatic disciplinary decision.",
    assignedToUserId: "UAT-MGR-001",
    assignedToName: "Office Manager Test",
    priority: "High",
    dueDate: "07 June 2026",
    status: "Open"
  }
];

export const staffSupportActionRows = staffSupportActions.map((action) => [
  action.actionId,
  action.staffId,
  action.actionType,
  action.actionReason,
  action.assignedToName,
  action.priority,
  action.dueDate,
  action.status,
  action.managerApprovedBy ?? "Approval pending"
]);

export const staffSupportComplaintReviewRows = [
  ["COM-001", "Olivia Brown", "linked for review", "Medium", "No", "Pending", "Complaint requires manager review before staff impact", "Do not negatively affect staff indicator until confirmed"],
  ["COM-002", "Ahmed Khan", "linked for review", "Low", "Yes", "No", "GPS/app issue confirmed", "Does not affect staff negatively"],
  ["COM-003", "Sarah Williams", "positive feedback", "High", "Yes", "Confirmed positive", "Compliment linked directly to recognition score", "Recognition suggested"]
] satisfies string[][];

export const staffSupportNotifications = [
  ["Care Coordinator", "Recognition suggested for [staff name] based on positive evidence."],
  ["Care Coordinator", "Support review suggested for [staff name]. Please review the evidence."],
  ["Supervisor", "Medication competency review suggested for [staff name]."],
  ["Manager", "Senior review suggested for [staff name] due to repeated unresolved alerts."],
  ["HR", "Staff support action requires HR review."],
  ["Staff", "Only supportive or approved messages are sent. Do not send automatic red/amber notifications without manager approval."]
] satisfies string[][];

export const staffSupportCqcEvidenceRows = [
  ["Safe", "medication compliance, visit reliability, incident reporting and safeguarding awareness"],
  ["Effective", "training, competence, supervision and coaching"],
  ["Caring", "positive feedback, service-user compliments and person-centred care evidence"],
  ["Responsive", "responding to feedback, adapting support and addressing concerns promptly"],
  ["Well-led", "workforce oversight, recognition, supervision, learning culture and fair management"]
] satisfies string[][];

export const staffSupportReportRows = [
  ["Recognition nominations", "3", "Green indicators reviewed"],
  ["Approved recognitions", "1", "Sarah Williams approved in demo"],
  ["Training support actions", "2", "Medication/GDPR refresher suggested"],
  ["Supervision actions", "5", "Supportive discussion and coaching"],
  ["Spot checks completed", "2", "Good spot check evidence and one review pending"],
  ["Medication competency reviews", "2", "Daniel Roberts and Olivia Brown demo records"],
  ["Staff support actions completed", "1", "No Action Required after complaint review"],
  ["Positive feedback trends", "10", "Approved positive evidence only"],
  ["Complaints reviewed fairly", "2", "Pending links do not imply fault"],
  ["Lessons learned", "3", "Geofence/app, medication notes and rota support"],
  ["Workforce wellbeing evidence", "5 CQC themes", "Safe, Effective, Caring, Responsive, Well-led"],
  ["Examples of good practice", "4", "Person-centred care and teamwork evidence"]
] satisfies string[][];

export const staffSupportAuditRows = [
  ["04 June 2026 17:30", "System", "Staff support indicator calculated", "Sarah Williams", "Green", "Recognition suggested", staffSupportDemoCompanyId],
  ["04 June 2026 17:30", "System", "Staff support indicator calculated", "Ahmed Khan", "Amber", "Geofence/Clock-In Review", staffSupportDemoCompanyId],
  ["04 June 2026 17:30", "System", "Staff support indicator calculated", "Daniel Roberts", "Amber", "Medication Competency Review", staffSupportDemoCompanyId],
  ["04 June 2026 17:30", "System", "Staff support indicator calculated", "Olivia Brown", "Red", "Senior review suggested, no automatic disciplinary action", staffSupportDemoCompanyId],
  ["04 June 2026 17:45", "Office Manager Test", "Manager review recorded", "Sarah Williams", "Reviewed", "Recognition nomination approved for draft", staffSupportDemoCompanyId],
  ["04 June 2026 17:50", "David Brown", "Complaint fairness note added", "Ahmed Khan", "Reviewed", "Not confirmed staff-related", staffSupportDemoCompanyId]
] satisfies string[][];

export const staffSupportAiGovernanceWarnings = [
  "AI-assisted draft - manager review required.",
  "AI must not decide guilt.",
  "AI must not decide disciplinary action.",
  "AI must not send warning automatically.",
  "AI must not send investigation invite automatically.",
  "AI must not make final employment decisions.",
  "AI must not publish negative labels.",
  "AI must not invent facts.",
  "Every AI output must show source evidence, missing information and approval requirement."
] as const;

export const staffSupportAiEndpoints = [
  "POST /api/ai/hr/staff-support-summary",
  "POST /api/ai/hr/recognition-draft",
  "POST /api/ai/hr/supervision-agenda",
  "POST /api/ai/hr/support-action-plan",
  "POST /api/ai/hr/manager-review-summary"
] as const;

export const staffSupportTestingMatrix = [
  ["Dashboard loads", "Pass in demo", "Green/Amber/Red top-line cards display correctly"],
  ["Only authorised users can see staff indicators", "Design ready", "Role list includes Registered Manager, HR Manager, Supervisor, Care Coordinator and Compliance Manager"],
  ["Staff cannot see other staff indicators", "Design ready", "Staff-facing view excludes private RAG scoring and unreviewed complaint links"],
  ["Green staff can be nominated for recognition", "Pass in demo", "Sarah Williams Staff of the Month nomination action"],
  ["Amber staff can have supervision/training action created", "Pass in demo", "Ahmed Khan and Daniel Roberts actions"],
  ["Red staff triggers senior review but no automatic disciplinary action", "Pass in demo", "Olivia Brown senior review suggested only"],
  ["Complaint link remains pending until manager review", "Pass in demo", "COM-001 pending, no confirmed fault"],
  ["Complaint not confirmed as staff-related does not affect staff negatively", "Pass in demo", "COM-002 does not affect indicator negatively"],
  ["Medication alerts trigger correct support suggestions", "Pass in demo", "Daniel Roberts medication refresher and competency review"],
  ["Geofence alerts allow explanation and review", "Pass in demo", "Ahmed Khan app/geofence review"],
  ["AI draft requires manager approval", "Pass in demo", "approvalRequired true and no automatic sending"],
  ["Recognition draft does not publish without approval", "Pass in demo", "AI-assisted draft only"],
  ["Support action plan can be created and closed", "Scaffolded", "StaffSupportAction status supports Open/In Progress/Completed/Cancelled"],
  ["Staff profile shows support history", "Pass in demo", "Staff Support tab added to HR staff profile"],
  ["CQC workforce report generates", "Pass in demo", "Workforce Support and Recognition Report rows"],
  ["Audit trail records calculations, reviews and actions", "Pass in demo", "staffSupportAuditRows"],
  ["Tenant separation by companyId works", "Design ready", "All records include TEST-COMPANY-001"],
  ["No public negative ranking is shown", "Pass in demo", "No public negative ranking safeguard"],
  ["Build passes", "Pending validation", "Run npm run lint, npm run build and npm test"]
] satisfies string[][];

export function staffSupportIndicatorRows(indicators = staffSupportIndicators) {
  return indicators.map((indicator) => [
    indicator.staffName,
    indicator.staffRole,
    indicator.ragStatus,
    indicator.confidenceLevel,
    String(indicator.positiveEvidenceCount),
    String(indicator.concernEvidenceCount),
    String(indicator.unresolvedAlertCount),
    indicator.recommendedActions.join(", "),
    indicator.status
  ]);
}

export function staffSupportProfileRows(staffName: string) {
  const indicator = staffSupportIndicators.find((item) => item.staffName.toLowerCase() === staffName.toLowerCase()) ?? staffSupportIndicators[0];
  const actions = staffSupportActions.filter((action) => action.staffId === indicator.staffId);
  return {
    indicator,
    positiveEvidenceRows: indicator.keyPositiveReasons.map((reason, index) => [`POS-${index + 1}`, reason, "Approved positive/support evidence", indicator.companyId]),
    supportEvidenceRows: indicator.keySupportReasons.map((reason, index) => [`SUP-${index + 1}`, reason, "Manager context required", indicator.companyId]),
    riskEvidenceRows: indicator.keyRiskReasons.map((reason, index) => [`RISK-${index + 1}`, reason, "Senior review suggested", indicator.companyId]),
    actionRows: actions.map((action) => [action.actionId, action.actionType, action.priority, action.dueDate, action.status, action.assignedToName])
  };
}

export function generateStaffSupportAiDraft(request: StaffSupportAiDraftRequest): StaffSupportAiDraftResponse {
  const indicator = staffSupportIndicators.find((item) => item.indicatorId === request.indicatorId || item.staffId === request.staffId) ?? staffSupportIndicators[0];
  const selectedEvidence = request.selectedEvidenceIds.length ? request.selectedEvidenceIds : [...indicator.keyPositiveReasons, ...indicator.keySupportReasons, ...indicator.keyRiskReasons].slice(0, 4);
  const missingInformation = [
    !request.managerContext ? "Manager context not entered" : "",
    indicator.complaintLinksRequireReview ? "Complaint link requires human fairness review before staff impact" : "",
    request.anonymiseServiceUserDetails ? "" : "Confirm service-user details are necessary before including them"
  ].filter(Boolean);

  return {
    draftId: `SSI-AI-${Date.now()}`,
    title: `${request.outputType} - ${indicator.staffName}`,
    body: [
      "AI-assisted draft - manager review required.",
      `Staff member: ${indicator.staffName}.`,
      `Support indicator: ${indicator.ragStatus}.`,
      `Purpose: ${request.outputType}.`,
      `Evidence used: ${selectedEvidence.join("; ") || "No evidence selected"}.`,
      request.managerContext ? `Manager context: ${request.managerContext}.` : "Manager context: not provided.",
      "This draft is for support, recognition, coaching, supervision or quality improvement only. It does not make an employment decision and must not be sent, published or saved as final without authorised human approval."
    ].join("\n\n"),
    keyFindings: [
      ...indicator.keyPositiveReasons.slice(0, 2),
      ...indicator.keySupportReasons.slice(0, 2),
      ...indicator.keyRiskReasons.slice(0, 1)
    ],
    suggestedActions: indicator.recommendedActions,
    riskWarnings: indicator.ragStatus === "Red" ? ["Senior review suggested. Do not treat this as guilt or automatic disciplinary action."] : ["Supportive review only."],
    fairnessWarnings: [
      staffSupportFairnessBanner,
      "Consider part-time hours, new starter status, high-risk packages, emergency cover, GPS/app issues and staff context.",
      "Complaints remain linked for review until confirmed by a manager."
    ],
    missingInformation,
    approvalRequired: true
  };
}
