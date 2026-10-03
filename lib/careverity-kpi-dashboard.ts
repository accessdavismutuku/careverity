export const seniorManagementKpiModuleName = "Senior Management KPI & Performance Intelligence Dashboard";
export const seniorManagementKpiDemoCompanyId = "TEST-COMPANY-001";
export const seniorManagementKpiReference = "CAREVERITY-SENIOR-KPI-001";
export const seniorManagementKpiAiEndpoint = "POST /api/ai/kpi/management-insight";

export const seniorManagementKpiCorePrinciple =
  "System analyses. Managers decide. Audit trail records action.";

export const seniorManagementKpiDemoBanner =
  "Demo KPI data only - not live company performance.";

export const seniorManagementKpiSafetyStatement =
  "Support indicator only. Not a disciplinary decision.";

export const seniorManagementKpiPrivacyRules = [
  "No public staff ranking.",
  "Care workers must not see company-wide KPI performance or staff comparison dashboards.",
  "Care coordinators only see own team unless permission expanded.",
  "HR-sensitive data must be permission-controlled.",
  "Complaints linked to staff must show pending review until confirmed.",
  "AI cannot decide disciplinary action.",
  "All views and exports are audited.",
  "Tenant separation by companyId is mandatory.",
  "Export requires permission."
] as const;

export const seniorManagementKpiRouteLinks = [
  "/kpi",
  "/kpi/executive-dashboard",
  "/kpi/company-performance",
  "/kpi/care-delivery",
  "/kpi/rota-performance",
  "/kpi/staff-performance",
  "/kpi/care-coordinator-performance",
  "/kpi/medication",
  "/kpi/controlled-drugs",
  "/kpi/incidents-complaints",
  "/kpi/quality-governance",
  "/kpi/tasks-actions",
  "/kpi/login-activity",
  "/kpi/cqc-evidence",
  "/kpi/ai-insights",
  "/kpi/reports"
] as const;

export const seniorManagementKpiLinkedModules = [
  "Dashboard",
  "Quality Intelligence Hub",
  "CQC Evidence Hub",
  "Staff Support & Recognition",
  "HRIS",
  "Inspection Evidence Portal"
] as const;

export const seniorManagementKpiAllowedRoles = [
  "Super Admin",
  "Company Admin",
  "Director",
  "Nominated Individual",
  "Registered Manager",
  "Senior Manager",
  "Compliance Manager",
  "Quality Manager"
] as const;

export const seniorManagementKpiLimitedRoles = [
  "Care Coordinator",
  "Supervisor"
] as const;

export type KpiRagStatus = "Green" | "Amber" | "Red";
export type KpiTrendDirection = "Up" | "Down" | "Stable";
export type KpiActionStatus = "Open" | "In Progress" | "Completed" | "Overdue" | "Escalated";
export type CoordinatorActionSourceType =
  | "Rota Change"
  | "Visit Alert"
  | "Medication Alert"
  | "Incident Follow-Up"
  | "Complaint Follow-Up"
  | "Care Plan Review"
  | "Risk Assessment Review"
  | "Staff Query"
  | "Service User Query"
  | "Other";

export type KpiSnapshot = {
  snapshotId: string;
  companyId: string;
  branchId?: string;
  periodStart: string;
  periodEnd: string;
  generatedAt: string;
  generatedBy: string;
  status: string;
  overallRag: KpiRagStatus;
  executiveSummary: string;
};

export type KpiMetric = {
  metricId: string;
  snapshotId: string;
  companyId: string;
  category: string;
  metricName: string;
  metricValue: string;
  metricTarget: string;
  ragStatus: KpiRagStatus;
  trendDirection: KpiTrendDirection;
  previousPeriodValue: string;
  notes: string;
};

export type KpiAction = {
  actionId: string;
  companyId: string;
  snapshotId: string;
  sourceMetricId: string;
  actionRequired: string;
  assignedToUserId: string;
  assignedToName: string;
  priority: "Low" | "Normal" | "High" | "Urgent";
  dueDate: string;
  status: KpiActionStatus;
  completedAt?: string;
  managerApproved: boolean;
};

export type KpiInsight = {
  insightId: string;
  companyId: string;
  snapshotId: string;
  insightType: string;
  insightTitle: string;
  insightBody: string;
  sourceRecordIds: string[];
  aiGenerated: boolean;
  reviewedBy?: string;
  approvedBy?: string;
  status: "Draft - approval required" | "Reviewed" | "Approved" | "Rejected";
};

export type CoordinatorActionTracking = {
  actionId: string;
  companyId: string;
  coordinatorId: string;
  sourceType: CoordinatorActionSourceType;
  sourceRecordId: string;
  assignedAt: string;
  dueAt: string;
  completedAt?: string;
  status: KpiActionStatus;
  priority: "Low" | "Normal" | "High" | "Urgent";
  impactLevel: "Low" | "Medium" | "High";
  ragStatus: KpiRagStatus;
  escalationRequired: boolean;
  managerReviewed: boolean;
};

export type KpiCard = {
  metricId: string;
  category: string;
  label: string;
  value: string;
  target: string;
  ragStatus: KpiRagStatus;
  trendDirection: KpiTrendDirection;
  detail: string;
};

export type KpiDrillDownRecord = {
  metricId: string;
  dateTime: string;
  serviceUser: string;
  staff: string;
  responsiblePerson: string;
  status: string;
  sourceEvidence: string;
  actionTaken: string;
  auditTrail: string;
};

export type ManagementInsightOutputType =
  | "Executive Summary"
  | "Monthly KPI Report"
  | "CQC Evidence Summary"
  | "Director Report"
  | "Care Coordinator Performance Review"
  | "Risk and Action Plan";

export type KpiManagementInsightRequest = {
  companyId: string;
  branchId?: string;
  dateFrom: string;
  dateTo: string;
  includedModules: string[];
  outputType: ManagementInsightOutputType;
  sourceRecordIds: string[];
  anonymiseServiceUserDetails: boolean;
  humanApprovalRequired: true;
  userRole?: string;
};

export type KpiManagementInsightResponse = {
  draftId: string;
  title: string;
  executiveSummary: string;
  keyFindings: string[];
  positivePerformance: string[];
  risks: string[];
  overdueActions: string[];
  recommendedActions: string[];
  cqcThemeMapping: string[][];
  missingDataWarnings: string[];
  sourceRecordsUsed: string[];
  approvalRequired: true;
};

export const seniorManagementKpiSnapshot: KpiSnapshot = {
  snapshotId: "KPI-SNAP-TEST-001",
  companyId: seniorManagementKpiDemoCompanyId,
  branchId: "ALL",
  periodStart: "2026-05-01",
  periodEnd: "2026-05-31",
  generatedAt: "2026-06-06T09:30:00.000Z",
  generatedBy: "Demo Registered Manager",
  status: "Draft dashboard - manager review required",
  overallRag: "Amber",
  executiveSummary:
    "TEST-COMPANY-001 is performing well for visit completion, compliments and training, with urgent review required for one missed visit, one controlled drug discrepancy and three high-risk overdue actions."
};

export const seniorManagementKpiTestData = {
  companyId: seniorManagementKpiDemoCompanyId,
  totalVisits: 100,
  completedVisits: 99,
  missedVisits: 1,
  lateVisits: 5,
  earlyLogins: 12,
  lateLogins: 8,
  geofenceMismatches: 3,
  regularCarers: 4,
  poorContinuityServiceUsers: 2,
  incidents: 5,
  complaints: 3,
  compliments: 8,
  medicationAlerts: 2,
  controlledDrugDiscrepancies: 1,
  carePlanReviewsCompleted: 6,
  carePlanReviewsOverdue: 2,
  riskAssessmentsOverdue: 4,
  staffMembers: 10,
  careCoordinators: 3,
  coordinatorWithOverdueRotaChangeAction: 1,
  coordinatorWithAllActionsCompleted: 1,
  adminUsersWithLowLoginActivity: 1,
  managersWithoutMfa: 1,
  totalTasks: 20,
  overdueTasks: 6,
  highRiskOverdueActions: 3,
  aiDraftsAwaitingApproval: 5,
  activeServiceUsers: 42,
  activePackages: 39,
  activeStaff: 10,
  activeCareCoordinators: 3,
  inspectorPortalAccessSessions: 4,
  auditLogExceptions: 2
} as const;

export const seniorManagementExecutiveCards: KpiCard[] = [
  { metricId: "active-service-users", category: "Company overview", label: "Active service users", value: "42", target: "Stable caseload", ragStatus: "Green", trendDirection: "Stable", detail: "Active packages and support records are visible in client files." },
  { metricId: "active-staff", category: "Company overview", label: "Active staff", value: "10", target: "Safe rota coverage", ragStatus: "Amber", trendDirection: "Stable", detail: "Training and supervision compliance remain linked to HR files." },
  { metricId: "active-care-coordinators", category: "Company overview", label: "Active care coordinators", value: "3", target: "All teams covered", ragStatus: "Green", trendDirection: "Stable", detail: "One coordinator has an overdue rota change action." },
  { metricId: "active-packages", category: "Company overview", label: "Active packages", value: "39", target: "All allocated", ragStatus: "Amber", trendDirection: "Up", detail: "Repeated unallocated visits are included in rota performance alerts." },
  { metricId: "total-visits-this-month", category: "Care delivery", label: "Total visits this month", value: "100", target: "Measured", ragStatus: "Green", trendDirection: "Stable", detail: "Demo month contains 100 scheduled visits." },
  { metricId: "completed-visits", category: "Care delivery", label: "Completed visits", value: "99", target: ">= 98%", ragStatus: "Green", trendDirection: "Stable", detail: "Visit completion rate is 99%." },
  { metricId: "missed-visits", category: "Care delivery", label: "Missed visits", value: "1", target: "0", ragStatus: "Red", trendDirection: "Up", detail: "Missed visit equals immediate red senior review." },
  { metricId: "late-visits", category: "Care delivery", label: "Late visits", value: "5", target: "<= 3", ragStatus: "Amber", trendDirection: "Up", detail: "Late visit rate is 5%." },
  { metricId: "early-late-login-events", category: "Login activity", label: "Early/late login events", value: "20", target: "Explained", ragStatus: "Amber", trendDirection: "Up", detail: "12 early login and 8 late login events." },
  { metricId: "unallocated-visits", category: "Rota", label: "Unallocated visits", value: "2", target: "0", ragStatus: "Red", trendDirection: "Up", detail: "Repeated unallocated visits require senior rota review." },
  { metricId: "regular-carer-continuity-score", category: "Regular carers", label: "Regular carer continuity score", value: "82%", target: ">= 90%", ragStatus: "Amber", trendDirection: "Down", detail: "Two service users have poor continuity." },
  { metricId: "complaints-received", category: "Incidents and complaints", label: "Complaints received", value: "3", target: "Trend reviewed", ragStatus: "Amber", trendDirection: "Stable", detail: "All complaints require acknowledgement and outcome tracking." },
  { metricId: "complaints-closed", category: "Incidents and complaints", label: "Complaints closed", value: "2", target: "Within policy", ragStatus: "Amber", trendDirection: "Stable", detail: "One complaint remains open." },
  { metricId: "compliments-received", category: "Incidents and complaints", label: "Compliments received", value: "8", target: "Celebrate good care", ragStatus: "Green", trendDirection: "Up", detail: "Positive feedback links to staff recognition." },
  { metricId: "incidents", category: "Incidents and complaints", label: "Incidents", value: "5", target: "Reviewed", ragStatus: "Amber", trendDirection: "Up", detail: "Incident themes feed lessons learned." },
  { metricId: "safeguarding-concerns", category: "Incidents and complaints", label: "Safeguarding concerns", value: "1", target: "Reviewed", ragStatus: "Amber", trendDirection: "Stable", detail: "Professional referral follow-up is tracked." },
  { metricId: "medication-errors", category: "Medication", label: "Medication errors", value: "1", target: "0", ragStatus: "Red", trendDirection: "Up", detail: "Medication error needs manager and medication lead review." },
  { metricId: "controlled-drug-discrepancies", category: "Controlled drugs", label: "Controlled drug discrepancies", value: "1", target: "0", ragStatus: "Red", trendDirection: "Up", detail: "Controlled drug discrepancy is immediate red alert." },
  { metricId: "care-plans-reviewed-on-time", category: "Quality governance", label: "Care plans reviewed on time", value: "6", target: "100%", ragStatus: "Amber", trendDirection: "Stable", detail: "Two care plan reviews are overdue." },
  { metricId: "risk-assessments-reviewed-on-time", category: "Quality governance", label: "Risk assessments reviewed on time", value: "4 overdue", target: "0 overdue", ragStatus: "Red", trendDirection: "Up", detail: "Risk assessment overdue after incident can become red." },
  { metricId: "open-actions", category: "Tasks and actions", label: "Open actions", value: "20", target: "Managed", ragStatus: "Amber", trendDirection: "Stable", detail: "Actions include tasks, alerts and KPI recommendations." },
  { metricId: "overdue-actions", category: "Tasks and actions", label: "Overdue actions", value: "6", target: "0", ragStatus: "Red", trendDirection: "Up", detail: "Three overdue actions are high-risk." },
  { metricId: "staff-training-compliance", category: "Staff performance", label: "Staff training compliance", value: "91%", target: ">= 95%", ragStatus: "Amber", trendDirection: "Down", detail: "Training refresher actions are linked to HR files." },
  { metricId: "supervision-compliance", category: "Staff performance", label: "Supervision compliance", value: "86%", target: ">= 95%", ragStatus: "Amber", trendDirection: "Stable", detail: "Supervision gaps are support indicators only." },
  { metricId: "ai-drafts-awaiting-approval", category: "AI insights", label: "AI drafts awaiting approval", value: "5", target: "Human approval", ragStatus: "Amber", trendDirection: "Up", detail: "AI reports remain draft only until manager-approved." },
  { metricId: "inspector-portal-access-sessions", category: "CQC evidence", label: "Inspector portal access sessions", value: "4", target: "Audited", ragStatus: "Green", trendDirection: "Stable", detail: "Inspector evidence views are logged." },
  { metricId: "audit-log-exceptions", category: "Quality governance", label: "Audit log exceptions", value: "2", target: "0", ragStatus: "Amber", trendDirection: "Up", detail: "Exceptions require compliance lead review." }
];

export const seniorManagementKpiMetrics: KpiMetric[] = seniorManagementExecutiveCards.map((card) => ({
  metricId: `MET-${card.metricId}`,
  snapshotId: seniorManagementKpiSnapshot.snapshotId,
  companyId: seniorManagementKpiDemoCompanyId,
  category: card.category,
  metricName: card.label,
  metricValue: card.value,
  metricTarget: card.target,
  ragStatus: card.ragStatus,
  trendDirection: card.trendDirection,
  previousPeriodValue: card.trendDirection === "Up" ? "Lower previous period" : card.trendDirection === "Down" ? "Higher previous period" : "Similar previous period",
  notes: card.detail
}));

export const careDeliveryKpiOutputs = {
  visitCompletionRate: "99%",
  missedVisitRate: "1%",
  lateVisitRate: "5%",
  clockInComplianceRate: "96%",
  geofenceComplianceRate: "97%",
  regularCarerContinuityPercentage: "82%",
  careNoteCompletionPercentage: "94%",
  taskCompletionPercentage: "70%",
  totalScheduledVisits: 100,
  completedVisits: 99,
  missedVisits: 1,
  lateVisits: 5,
  earlyArrivals: 12,
  earlyDepartures: 4,
  visitDurationShorterThanPlanned: 3,
  visitDurationLongerThanPlanned: 2,
  careNotesMissing: 6,
  poorQualityNotesFlagged: 3,
  uncompletedTasks: 6
} as const;

export const regularCarerContinuityRows = [
  ["Demo Service User 101", "Demo Care Worker A / Demo Care Worker B", "3", "91%", "Regular team stable", "Green", "Maintain regular carers"],
  ["Demo Service User 102", "Demo Care Worker C", "7", "58%", "Sickness cover and rota gaps", "Red", "Assign regular carer; review rota; contact family"],
  ["Demo Service User 103", "No named regular carer", "6", "61%", "Package recently changed", "Amber", "Assign regular carer; review package complexity"],
  ["Demo Service User 104", "Demo Care Worker D", "4", "84%", "Emergency cover recorded", "Amber", "Review staff availability"]
] satisfies string[][];

export const coordinatorActionTrackingRows: CoordinatorActionTracking[] = [
  {
    actionId: "COORD-ACT-001",
    companyId: seniorManagementKpiDemoCompanyId,
    coordinatorId: "COORD-001",
    sourceType: "Rota Change",
    sourceRecordId: "ROTA-CHANGE-778",
    assignedAt: "2026-05-16T09:00:00.000Z",
    dueAt: "2026-05-16T11:00:00.000Z",
    status: "Overdue",
    priority: "High",
    impactLevel: "High",
    ragStatus: "Red",
    escalationRequired: true,
    managerReviewed: false
  },
  {
    actionId: "COORD-ACT-002",
    companyId: seniorManagementKpiDemoCompanyId,
    coordinatorId: "COORD-002",
    sourceType: "Medication Alert",
    sourceRecordId: "MED-ALERT-211",
    assignedAt: "2026-05-16T10:15:00.000Z",
    dueAt: "2026-05-16T12:15:00.000Z",
    completedAt: "2026-05-16T11:20:00.000Z",
    status: "Completed",
    priority: "High",
    impactLevel: "Medium",
    ragStatus: "Green",
    escalationRequired: false,
    managerReviewed: true
  },
  {
    actionId: "COORD-ACT-003",
    companyId: seniorManagementKpiDemoCompanyId,
    coordinatorId: "COORD-003",
    sourceType: "Care Plan Review",
    sourceRecordId: "CAREPLAN-REVIEW-144",
    assignedAt: "2026-05-15T14:00:00.000Z",
    dueAt: "2026-05-17T14:00:00.000Z",
    status: "In Progress",
    priority: "Normal",
    impactLevel: "Low",
    ragStatus: "Amber",
    escalationRequired: false,
    managerReviewed: false
  }
];

export const careCoordinatorPerformanceRows = [
  ["Demo Care Coordinator A", "15", "38", "11", "10", "1", "1h 40m", "Red", "Rota change overdue and visit affected"],
  ["Demo Care Coordinator B", "13", "31", "8", "8", "0", "42m", "Green", "All actions completed"],
  ["Demo Care Coordinator C", "14", "31", "7", "5", "2", "2h 05m", "Amber", "Care plan review tasks still open"]
] satisfies string[][];

export const staffPerformanceRows = [
  ["Demo Care Worker A", "38", "95%", "98%", "96%", "2", "3", "Green", "recognition suggested"],
  ["Demo Care Worker B", "27", "88%", "91%", "90%", "1", "1", "Amber", "coaching suggested"],
  ["Demo Care Worker C", "19", "78%", "84%", "82%", "0", "4", "Red", "support suggested; senior review"]
] satisfies string[][];

export const loginActivityRows = [
  ["Demo Care Worker A", "Care Worker", "2026-05-16 08:02", "22", "0", "Mobile login active", "Green"],
  ["Demo Care Coordinator A", "Care Coordinator", "2026-05-16 09:05", "8", "1", "Coordinator login frequency acceptable", "Amber"],
  ["Demo Admin Low Activity", "Admin", "2026-05-01 09:00", "1", "0", "Admin user with low login activity", "Amber"],
  ["Demo Manager No MFA", "Registered Manager", "2026-05-16 08:50", "12", "0", "Admin account without MFA", "Red"]
] satisfies string[][];

export const medicationKpiRows = [
  ["Active medication profiles", "18", "Green", "Medication profiles linked to care plans"],
  ["MAR completion rate", "96%", "Amber", "MAR incomplete records require review"],
  ["Medication alerts unresolved", "2", "Amber", "Suggest medication care plan review and GP/pharmacy contact"],
  ["Medication errors", "1", "Red", "Medication lead review required"],
  ["Staff medication competency compliance", "91%", "Amber", "Suggest staff competency review"]
] satisfies string[][];

export const controlledDrugKpiRows = [
  ["Controlled drug records", "4", "Green", "Controlled MAR completeness visible"],
  ["Stock discrepancies", "1", "Red", "Immediate manager review and stock reconciliation"],
  ["Missing witness records", "1", "Red", "Controlled medication administered without required sign-off check"],
  ["Overdue stock checks", "2", "Amber", "Controlled drug audit due"],
  ["Staff sign-off completion", "92%", "Amber", "Medication lead review"]
] satisfies string[][];

export const incidentsComplaintsKpiRows = [
  ["Incidents by category", "5", "Amber", "Falls, medication, behaviour and near miss themes"],
  ["Complaints", "3", "Amber", "One complaint acknowledgement is near policy threshold"],
  ["Compliments", "8", "Green", "Positive feedback linked to recognition"],
  ["Overdue investigations", "1", "Red", "Lessons learned action overdue"],
  ["Care plan/risk update rate after incident", "72%", "Amber", "Review after incident required"]
] satisfies string[][];

export const qualityGovernanceKpiRows = [
  ["Care plan reviews overdue", "2", "Amber", "Create care plan review actions"],
  ["Risk assessment reviews overdue", "4", "Red", "Risk assessment overdue after incident is red"],
  ["Audits overdue", "1", "Amber", "Quality audit due"],
  ["DBS/right-to-work checks", "Current", "Green", "HR compliance evidence linked"],
  ["Inspection evidence readiness", "86%", "Amber", "CQC evidence summary draft available"]
] satisfies string[][];

export const taskActionRows = [
  ["TASK-001", "Missed visit follow-up", "Registered Manager", "Urgent", "Overdue", "Red", "Missed visit"],
  ["TASK-002", "Controlled drug discrepancy review", "Medication Lead", "Urgent", "Overdue", "Red", "Controlled drugs"],
  ["TASK-003", "Complaint acknowledgement", "Quality Manager", "High", "Overdue", "Red", "Complaint"],
  ["TASK-004", "Care plan review", "Care Coordinator", "Normal", "Open", "Amber", "Quality governance"],
  ["TASK-005", "Training refresher", "Training Coordinator", "Normal", "In Progress", "Amber", "Training"]
] satisfies string[][];

export const kpiDrillDownRecords: KpiDrillDownRecord[] = [
  {
    metricId: "late-visits",
    dateTime: "2026-05-16 08:15",
    serviceUser: "Demo Service User 101",
    staff: "Demo Care Worker A",
    responsiblePerson: "Demo Care Coordinator A",
    status: "Follow-up open",
    sourceEvidence: "Visit VISIT-101 clock-in 08:31 for planned 08:15",
    actionTaken: "Coordinator notified; reason requested",
    auditTrail: "AUD-KPI-001 late visit viewed"
  },
  {
    metricId: "missed-visits",
    dateTime: "2026-05-15 19:00",
    serviceUser: "Demo Service User 102",
    staff: "Unallocated",
    responsiblePerson: "Demo Registered Manager",
    status: "Escalated",
    sourceEvidence: "Missed visit record MISS-001",
    actionTaken: "Immediate red alert and welfare check task created",
    auditTrail: "AUD-KPI-002 missed visit escalated"
  },
  {
    metricId: "controlled-drug-discrepancies",
    dateTime: "2026-05-14 21:10",
    serviceUser: "Demo Service User 103",
    staff: "Demo Medication-Authorised Care Worker",
    responsiblePerson: "Demo Medication Lead",
    status: "Overdue manager review",
    sourceEvidence: "Controlled drug stock balance CD-009",
    actionTaken: "Medication lead review and stock reconciliation required",
    auditTrail: "AUD-KPI-003 controlled drug discrepancy viewed"
  },
  {
    metricId: "overdue-coordinator-action",
    dateTime: "2026-05-16 11:10",
    serviceUser: "Demo Service User 104",
    staff: "Demo Cover Care Worker",
    responsiblePerson: "Demo Care Coordinator A",
    status: "Overdue and escalated",
    sourceEvidence: "CoordinatorActionTracking COORD-ACT-001 linked to ROTA-CHANGE-778",
    actionTaken: "Rota change exceeded 2 hour completion target; manager escalation required",
    auditTrail: "AUD-KPI-005 overdue coordinator action viewed"
  },
  {
    metricId: "complaints-received",
    dateTime: "2026-05-13 15:30",
    serviceUser: "Demo Service User 105",
    staff: "Pending review",
    responsiblePerson: "Demo Quality Manager",
    status: "Linked actions open",
    sourceEvidence: "Complaint COMP-003 with acknowledgement and lessons learned tasks",
    actionTaken: "Complaint acknowledgement, manager review and lessons learned action created",
    auditTrail: "AUD-KPI-006 complaint KPI linked actions viewed"
  },
  {
    metricId: "staff-performance",
    dateTime: "2026-05-16 12:00",
    serviceUser: "Team KPI",
    staff: "Demo Care Worker C",
    responsiblePerson: "Demo Senior Manager",
    status: "Support review suggested",
    sourceEvidence: "Geofence mismatches and missing notes trend",
    actionTaken: "Support indicator only. Not a disciplinary decision.",
    auditTrail: "AUD-KPI-004 staff support drill-down viewed"
  }
];

export const kpiBackendReadinessMappingRows = [
  ["Total visits / completed visits / missed visits / late visits", "visits", "visit_schedules, visit_allocations", "Requires persisted planned/actual visit records with companyId/providerId filters."],
  ["Clock-in/out completion, early login, late login, early departure", "clockInOutRecords", "clock_in_out_records", "Requires planned times, actual clock-in/out, exception reason and device metadata."],
  ["Geofence compliance and mismatches", "geofenceLogs", "geofence_logs", "Requires GPS/geofence event storage and authorised exception reasons."],
  ["Care notes completed, missing and poor-quality notes", "visitNotes", "visit_notes", "Requires note status, quality flag, author and visit linkage."],
  ["Medication given, refused, missed and reasons", "medicationAdministration", "medication_administration, medication_refusals, missed_medication_records", "Requires MAR linkage, staff competency linkage and reason capture."],
  ["MAR completion and medication review KPIs", "marRecords", "mar_records, emar_entries", "Requires MAR completion state, due windows, medication profile links and audit trail."],
  ["Controlled drug stock, witness and discrepancy KPIs", "controlledMedicationRecords", "controlled_medication_records, controlled_drug_stock_balance, controlled_drug_witness_records", "Requires stock balance, witness, adjustment approval and reconciliation records."],
  ["Incidents, falls, near misses and safeguarding KPIs", "incidents", "incidents, accidents, near_misses, safeguarding_concerns", "Requires category, branch, service user, staff link, review status and lessons learned."],
  ["Complaints, response times and linked actions", "complaints", "complaints, lessons_learned, action_trackers", "Requires acknowledgement dates, investigation status, closure dates and manager review."],
  ["Compliments and good news evidence", "compliments", "compliments, good_news_stories, staff_recognition", "Requires positive feedback linkage to service user/staff with consent controls."],
  ["Staff activity, training, supervision and support indicators", "staffProfiles", "staff_profiles, staff_training, staff_supervision, staff_support_indicators", "Requires HR-sensitive permission controls and no public ranking."],
  ["Login activity, failed attempts, inactive users and MFA", "users/loginActivity", "users, audit_logs, performance_events", "Requires last login, failed attempts, MFA status and unusual access event capture."],
  ["Open, completed, overdue and high-risk tasks", "tasks", "tasks, action_trackers, coordinator_action_tracking", "Requires owner, due date, source record, priority, status and escalation fields."],
  ["Tagged messages, unread actions and notifications", "messages", "messages, notifications, tagged_tasks", "Requires recipient, read status, source module and task linkage."],
  ["Care plan review due/overdue KPIs", "carePlans", "care_plans, care_plan_versions, care_plan_approvals", "Requires review due dates, approval status and source evidence links."],
  ["Risk assessment review due/overdue KPIs", "riskAssessments", "risk_assessments, risk_assessment_reviews, risk_assessment_versions", "Requires post-incident review trigger and completed review evidence."],
  ["Export, view, exception and governance audit KPIs", "auditLogs", "audit_logs, ai_audit_logs, file_access_logs", "Requires immutable tenant-scoped audit rows for views, exports and approvals."],
  ["AI drafts awaiting approval and AI insight reports", "aiDrafts", "ai_drafts, ai_prompts, ai_source_records, ai_approvals, kpi_insights", "Requires source-linked draft status and human approval before publication."],
  ["Inspector access sessions and CQC evidence readiness", "inspectionEvidencePacks", "inspection_evidence_packs, inspector_access_sessions, inspector_activity_logs, cqc_evidence_items", "Requires audited inspector access, evidence pack status and CQC theme mapping."]
] satisfies string[][];

export const kpiEscalationRules = [
  ["Missed visit", "Immediate red alert", "notify manager; create task; add to KPI action tracker; add to audit log; include in monthly report"],
  ["Controlled drug discrepancy", "Immediate red alert", "immediate manager review; medication lead review; stock reconciliation; incident record"],
  ["Medication error not reviewed within 24 hours", "Red", "manager and medication lead review"],
  ["Care coordinator did not complete assigned rota change", "Amber/Red", "escalate if visit affected or service user at risk"],
  ["Admin user without MFA", "Red", "security review and MFA task"],
  ["Backup failed", "Red", "director and system owner review"]
] satisfies string[][];

export const kpiReportRows = [
  ["Executive Director KPI Report", "Board/director report", "Draft", "Director", "Approval section included"],
  ["Registered Manager Quality Report", "Monthly quality report", "Draft", "Registered Manager", "Manager comments required"],
  ["CQC Evidence Summary", "CQC evidence summary", "Draft", "Quality Manager", "Safe/Effective/Caring/Responsive/Well-led mapping"],
  ["Care Delivery Performance Report", "Care delivery performance", "Ready", "Senior Manager", "Evidence and actions included"],
  ["Medication Safety Report", "Medication safety", "Draft", "Medication Lead", "Medication review actions included"],
  ["Controlled Drugs Report", "Controlled drugs", "Draft", "Medication Lead", "Stock discrepancy section included"],
  ["Incidents and Complaints Trend Report", "Incidents and complaints", "Draft", "Quality Manager", "Lessons learned included"],
  ["Staff Performance and Support Report", "Staff support indicators", "Draft", "HR Administrator", "No public ranking"],
  ["Care Coordinator Performance Report", "Coordinator action tracking", "Draft", "Registered Manager", "Own team/manager visibility"],
  ["Governance and Audit Report", "Audit and governance", "Draft", "Compliance Manager", "Export audited"],
  ["Outstanding Actions Report", "Tasks and actions", "Ready", "Senior Manager", "Overdue action tracker"],
  ["Lessons Learned Report", "Lessons learned", "Draft", "Quality Manager", "Human approval required"]
] satisfies string[][];

export const cqcThemeMappingRows = [
  ["Safe", "Missed visits, medication alerts, controlled drugs, safeguarding, risk assessments", "Red and amber actions feed Safe evidence"],
  ["Effective", "Care plan reviews, training compliance, medication care plans", "Evidence linked to outcomes and staff competency"],
  ["Caring", "Compliments, staff recognition suggestions, service-user continuity", "Positive evidence retained"],
  ["Responsive", "Complaints, rota changes, care coordinator response times", "Response times and actions visible"],
  ["Well-led", "Audit logs, KPI trends, governance reports, AI approval controls", "Director/manager oversight evidence"]
] satisfies string[][];

export const kpiExportAuditRows = [
  ["2026-06-06 09:40", "Demo Registered Manager", "Executive Director KPI Report", "Export requested", "Permission checked", "AUD-KPI-EXPORT-001"],
  ["2026-06-06 09:42", "Demo Quality Manager", "CQC Evidence Summary", "Draft generated", "Approval required", "AUD-KPI-EXPORT-002"]
] satisfies string[][];

export function canAccessSeniorManagementKpi(role = "") {
  return [...seniorManagementKpiAllowedRoles, ...seniorManagementKpiLimitedRoles].some((allowedRole) => role.toLowerCase().includes(allowedRole.toLowerCase()));
}

export function seniorManagementKpiAccessScope(role = "") {
  if (seniorManagementKpiAllowedRoles.some((allowedRole) => role.toLowerCase().includes(allowedRole.toLowerCase()))) {
    return "Company-wide KPI performance and senior management reports.";
  }
  if (role.toLowerCase().includes("care coordinator")) {
    return "Limited own team KPIs only. No company-wide staff comparison dashboard.";
  }
  if (role.toLowerCase().includes("supervisor")) {
    return "Limited own staff/team KPIs only. No company-wide staff comparison dashboard.";
  }
  return "No access to company-wide KPI performance.";
}

export function ragForMetric(metricName: string, value: number): KpiRagStatus {
  if (/missed|controlled drug discrepancy|medication error|high-risk overdue|admin.*without mfa/i.test(metricName) && value > 0) return "Red";
  if (/visit completion/i.test(metricName)) return value >= 98 ? "Green" : value >= 95 ? "Amber" : "Red";
  if (/care notes|clock-in/i.test(metricName)) return value >= 95 ? "Green" : value >= 90 ? "Amber" : "Red";
  if (/late|overdue|geofence|complaint|incident/i.test(metricName) && value > 0) return value > 3 ? "Red" : "Amber";
  return "Green";
}

export function calculateCareDeliveryRates(data = seniorManagementKpiTestData) {
  const percent = (value: number) => `${Math.round(value)}%`;
  return {
    visitCompletionRate: percent((data.completedVisits / data.totalVisits) * 100),
    missedVisitRate: percent((data.missedVisits / data.totalVisits) * 100),
    lateVisitRate: percent((data.lateVisits / data.totalVisits) * 100),
    clockInComplianceRate: "96%",
    geofenceComplianceRate: percent(((data.totalVisits - data.geofenceMismatches) / data.totalVisits) * 100),
    regularCarerContinuityPercentage: "82%",
    careNoteCompletionPercentage: "94%",
    taskCompletionPercentage: percent(((data.totalTasks - data.overdueTasks) / data.totalTasks) * 100)
  };
}

export function calculateExecutiveKpiCards() {
  return seniorManagementExecutiveCards;
}

export function getKpiDrillDownRecords(metricId: string) {
  const rows = kpiDrillDownRecords.filter((record) => record.metricId === metricId);
  return rows.length ? rows : kpiDrillDownRecords;
}

export function trackCoordinatorActionStatus(action: CoordinatorActionTracking): CoordinatorActionTracking {
  if (action.status === "Completed" || action.completedAt) return { ...action, ragStatus: "Green", escalationRequired: false };
  const overdue = new Date(action.dueAt).getTime() < new Date("2026-05-16T13:00:00.000Z").getTime();
  if (overdue && action.impactLevel === "High") return { ...action, status: "Overdue", ragStatus: "Red", escalationRequired: true };
  if (overdue) return { ...action, status: "Overdue", ragStatus: "Amber", escalationRequired: false };
  return action;
}

export function createKpiReportExportAudit(reportName: string, exportedBy = "Demo Registered Manager") {
  return {
    auditId: `AUD-KPI-EXPORT-${Date.now()}`,
    companyId: seniorManagementKpiDemoCompanyId,
    reportName,
    exportedBy,
    action: "KPI report export created",
    exportRequiresPermission: true,
    auditRequired: true,
    createdAt: new Date().toISOString()
  };
}

export function generateKpiManagementInsightDraft(request: KpiManagementInsightRequest): KpiManagementInsightResponse {
  const sourceRecordsUsed = request.sourceRecordIds.length ? request.sourceRecordIds : ["KPI-SNAP-TEST-001", "TASK-001", "COORD-ACT-001"];
  return {
    draftId: `KPI-AI-DRAFT-${Date.now()}`,
    title: `CareVerity HR Notification: ${request.outputType} for ${request.companyId}`,
    executiveSummary:
      "AI-assisted draft only. Managers must review source-linked KPI evidence, edit the draft, approve actions and record decisions before publication.",
    keyFindings: [
      "Visit completion is 99% against a 98% target.",
      "One missed visit, one controlled drug discrepancy and three high-risk overdue actions require senior review.",
      "A care coordinator rota change request is overdue beyond the expected 2 hour timescale."
    ],
    positivePerformance: [
      "Eight compliments received this month.",
      "Regular staff recognition opportunities identified.",
      "Care delivery completion is above target."
    ],
    risks: [
      "Controlled drug discrepancy requires immediate manager and medication lead review.",
      "Risk assessment reviews are overdue after incident records.",
      "Admin account without MFA is red-rated."
    ],
    overdueActions: [
      "Missed visit follow-up",
      "Controlled drug discrepancy review",
      "Complaint acknowledgement",
      "Coordinator rota change action"
    ],
    recommendedActions: [
      "Assign owner and due date for each red action.",
      "Review regular carer continuity for high-churn service users.",
      "Create medication care plan and risk assessment review tasks.",
      "Record manager approval before saving report to Quality Intelligence Hub."
    ],
    cqcThemeMapping: cqcThemeMappingRows,
    missingDataWarnings: [
      "Demo mode uses synthetic TEST-COMPANY-001 records.",
      "Do not publish AI reports without manager approval.",
      "AI must not make disciplinary decisions, declare staff guilty, hide negative evidence or invent facts."
    ],
    sourceRecordsUsed,
    approvalRequired: true
  };
}
