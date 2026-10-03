import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const kpiSource = await readFile(new URL("../lib/careverity-kpi-dashboard.ts", import.meta.url), "utf8");
const componentSource = await readFile(new URL("../components/ecm/KPI/SeniorManagementKpiDashboard.tsx", import.meta.url), "utf8");
const kpiRouteSource = await readFile(new URL("../app/kpi/page.tsx", import.meta.url), "utf8");
const kpiSectionRouteSource = await readFile(new URL("../app/kpi/[section]/page.tsx", import.meta.url), "utf8");
const apiSource = await readFile(new URL("../app/api/ai/kpi/management-insight/route.ts", import.meta.url), "utf8");
const legacyShellSource = await readFile(new URL("../components/ecm/legacy/CareVerityPrototypeLegacy.tsx", import.meta.url), "utf8");
const schemaSource = await readFile(new URL("../supabase/schema.sql", import.meta.url), "utf8");
const dbSource = await readFile(new URL("../lib/careverity-db.ts", import.meta.url), "utf8");

function assertContains(source, values) {
  values.forEach((value) => assert.match(source, new RegExp(value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))));
}

test("senior management KPI module defines requested routes, links, roles and demo company", () => {
  assertContains(kpiSource + kpiRouteSource + kpiSectionRouteSource + legacyShellSource, [
    "Senior Management KPI & Performance Intelligence Dashboard",
    "Senior Management KPI Dashboard",
    "Demo KPI data only - not live company performance.",
    "TEST-COMPANY-001",
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
    "/kpi/reports",
    "Dashboard",
    "Quality Intelligence Hub",
    "CQC Evidence Hub",
    "Staff Support & Recognition",
    "HRIS",
    "Inspection Evidence Portal",
    "Super Admin",
    "Company Admin",
    "Director",
    "Nominated Individual",
    "Registered Manager",
    "Senior Manager",
    "Compliance Manager",
    "Quality Manager",
    "Care Coordinator",
    "Supervisor"
  ]);
  assert.match(legacyShellSource, /href: "\/kpi"/);
});

test("KPI calculations and required demo data are represented", () => {
  assertContains(kpiSource + componentSource, [
    "totalVisits: 100",
    "completedVisits: 99",
    "missedVisits: 1",
    "lateVisits: 5",
    "earlyLogins: 12",
    "lateLogins: 8",
    "geofenceMismatches: 3",
    "regularCarers: 4",
    "poorContinuityServiceUsers: 2",
    "incidents: 5",
    "complaints: 3",
    "compliments: 8",
    "medicationAlerts: 2",
    "controlledDrugDiscrepancies: 1",
    "carePlanReviewsCompleted: 6",
    "carePlanReviewsOverdue: 2",
    "riskAssessmentsOverdue: 4",
    "staffMembers: 10",
    "careCoordinators: 3",
    "coordinatorWithOverdueRotaChangeAction: 1",
    "coordinatorWithAllActionsCompleted: 1",
    "adminUsersWithLowLoginActivity: 1",
    "managersWithoutMfa: 1",
    "totalTasks: 20",
    "overdueTasks: 6",
    "highRiskOverdueActions: 3",
    "aiDraftsAwaitingApproval: 5",
    "visitCompletionRate: \"99%\"",
    "missedVisitRate: \"1%\"",
    "lateVisitRate: \"5%\"",
    "clockInComplianceRate: \"96%\"",
    "geofenceComplianceRate: \"97%\"",
    "regularCarerContinuityPercentage: \"82%\"",
    "careNoteCompletionPercentage: \"94%\"",
    "taskCompletionPercentage: \"70%\""
  ]);
});

test("privacy, role permissions and no automatic disciplinary decision safeguards are enforced", () => {
  assertContains(kpiSource + componentSource + apiSource, [
    "System analyses. Managers decide. Audit trail records action.",
    "Support indicator only. Not a disciplinary decision.",
    "No public staff ranking.",
    "Care workers must not see company-wide KPI performance or staff comparison dashboards.",
    "Care coordinators only see own team unless permission expanded.",
    "HR-sensitive data must be permission-controlled.",
    "AI cannot decide disciplinary action.",
    "All views and exports are audited.",
    "Tenant separation by companyId is mandatory.",
    "Export requires permission.",
    "Access denied for this demo role",
    "No access to company-wide KPI performance.",
    "noAutomaticDisciplinaryDecision: true"
  ]);
  assert.match(apiSource, /canAccessSeniorManagementKpi/);
  assert.match(apiSource, /Role not permitted to generate senior management KPI insights/);
});

test("drill-down, coordinator action tracking, alerts and reports are included", () => {
  assertContains(kpiSource + componentSource, [
    "CoordinatorActionTracking",
    "Rota Change",
    "Visit Alert",
    "Medication Alert",
    "Incident Follow-Up",
    "Complaint Follow-Up",
    "Care Plan Review",
    "Risk Assessment Review",
    "Care coordinator did not complete assigned rota change",
    "Rota Performance KPIs",
    "Rota KPI tracker",
    "Open overdue rota action",
    "COORD-ACT-001",
    "Overdue",
    "Red",
    "KPI drill-down",
    "Source records behind KPI",
    "Missed visit",
    "Controlled drug discrepancy",
    "Admin user without MFA",
    "Backup failed",
    "Executive Director KPI Report",
    "Registered Manager Quality Report",
    "CQC Evidence Summary",
    "Care Delivery Performance Report",
    "Medication Safety Report",
    "Controlled Drugs Report",
    "Incidents and Complaints Trend Report",
    "Staff Performance and Support Report",
    "Care Coordinator Performance Report",
    "Governance and Audit Report",
    "Outstanding Actions Report",
    "Lessons Learned Report"
  ]);
});

test("AI management insight endpoint is draft-only, source-linked and approval-controlled", () => {
  assertContains(kpiSource + apiSource + componentSource, [
    "POST",
    "/api/ai/kpi/management-insight",
    "Executive Summary",
    "Monthly KPI Report",
    "CQC Evidence Summary",
    "Director Report",
    "Care Coordinator Performance Review",
    "Risk and Action Plan",
    "humanApprovalRequired: true",
    "approvalRequired: true",
    "Draft - manager approval required",
    "sourceRecordsUsed",
    "AI must not make disciplinary decisions",
    "AI must not make disciplinary decisions, declare staff guilty, hide negative evidence, invent facts",
    "Quality Intelligence Hub after manager approval"
  ]);
});

test("database model scaffold is tenant-scoped and database-ready", () => {
  assertContains(kpiSource, [
    "KpiSnapshot",
    "KpiMetric",
    "KpiAction",
    "KpiInsight",
    "CoordinatorActionTracking"
  ]);
  assertContains(schemaSource, [
    "kpi_snapshots",
    "kpi_metrics",
    "kpi_actions",
    "kpi_insights",
    "coordinator_action_tracking",
    "alter table public.kpi_snapshots enable row level security",
    "alter table public.kpi_metrics enable row level security",
    "alter table public.kpi_actions enable row level security",
    "alter table public.kpi_insights enable row level security",
    "alter table public.coordinator_action_tracking enable row level security",
    "idx_kpi_snapshots_tenant",
    "idx_kpi_metrics_tenant",
    "idx_kpi_actions_tenant",
    "idx_kpi_insights_tenant",
    "idx_coordinator_action_tracking_tenant",
    "no_automatic_disciplinary_decision boolean not null default true"
  ]);
  assertContains(dbSource, [
    "listKpiSnapshots",
    "createKpiSnapshot",
    "createKpiMetric",
    "createKpiAction",
    "recordKpiInsightDraft",
    "createCoordinatorActionTracking",
    "assertTenantScopeForDatabaseTable(\"kpi_snapshots\"",
    "coordinator_action_tracking"
  ]);
});

test("backend readiness mapping names every required KPI source feed", () => {
  assertContains(kpiSource + componentSource, [
    "Backend readiness mapping",
    "Real backend feed map",
    "visits",
    "clockInOutRecords",
    "geofenceLogs",
    "visitNotes",
    "medicationAdministration",
    "marRecords",
    "controlledMedicationRecords",
    "incidents",
    "complaints",
    "compliments",
    "staffProfiles",
    "users/loginActivity",
    "tasks",
    "messages",
    "carePlans",
    "riskAssessments",
    "auditLogs",
    "aiDrafts",
    "inspectionEvidencePacks",
    "visit_schedules",
    "clock_in_out_records",
    "geofence_logs",
    "visit_notes",
    "medication_administration",
    "mar_records",
    "controlled_medication_records",
    "controlled_drug_stock_balance",
    "incidents, accidents, near_misses, safeguarding_concerns",
    "complaints, lessons_learned, action_trackers",
    "compliments, good_news_stories, staff_recognition",
    "staff_profiles, staff_training, staff_supervision, staff_support_indicators",
    "users, audit_logs, performance_events",
    "tasks, action_trackers, coordinator_action_tracking",
    "messages, notifications, tagged_tasks",
    "care_plans, care_plan_versions, care_plan_approvals",
    "risk_assessments, risk_assessment_reviews, risk_assessment_versions",
    "audit_logs, ai_audit_logs, file_access_logs",
    "ai_drafts, ai_prompts, ai_source_records, ai_approvals, kpi_insights",
    "inspection_evidence_packs, inspector_access_sessions, inspector_activity_logs, cqc_evidence_items"
  ]);
});
