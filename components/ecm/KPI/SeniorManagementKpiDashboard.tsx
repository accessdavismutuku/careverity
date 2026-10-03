"use client";

import { useMemo, useState, type ReactNode } from "react";
import {
  calculateCareDeliveryRates,
  calculateExecutiveKpiCards,
  canAccessSeniorManagementKpi,
  careCoordinatorPerformanceRows,
  careDeliveryKpiOutputs,
  controlledDrugKpiRows,
  coordinatorActionTrackingRows,
  createKpiReportExportAudit,
  cqcThemeMappingRows,
  generateKpiManagementInsightDraft,
  getKpiDrillDownRecords,
  incidentsComplaintsKpiRows,
  kpiBackendReadinessMappingRows,
  kpiEscalationRules,
  kpiExportAuditRows,
  kpiReportRows,
  loginActivityRows,
  medicationKpiRows,
  qualityGovernanceKpiRows,
  regularCarerContinuityRows,
  seniorManagementKpiAccessScope,
  seniorManagementKpiAllowedRoles,
  seniorManagementKpiCorePrinciple,
  seniorManagementKpiDemoBanner,
  seniorManagementKpiDemoCompanyId,
  seniorManagementKpiLimitedRoles,
  seniorManagementKpiLinkedModules,
  seniorManagementKpiModuleName,
  seniorManagementKpiPrivacyRules,
  seniorManagementKpiRouteLinks,
  seniorManagementKpiSafetyStatement,
  seniorManagementKpiSnapshot,
  seniorManagementKpiTestData,
  staffPerformanceRows,
  taskActionRows,
  trackCoordinatorActionStatus,
  type KpiCard,
  type KpiManagementInsightResponse,
  type KpiRagStatus
} from "@/lib/careverity-kpi-dashboard";

type KpiSection =
  | "executive-dashboard"
  | "company-performance"
  | "care-delivery"
  | "rota-performance"
  | "staff-performance"
  | "care-coordinator-performance"
  | "medication"
  | "controlled-drugs"
  | "incidents-complaints"
  | "quality-governance"
  | "tasks-actions"
  | "login-activity"
  | "cqc-evidence"
  | "ai-insights"
  | "reports";

const kpiSections: Array<{ id: KpiSection; label: string }> = [
  { id: "executive-dashboard", label: "Executive Dashboard" },
  { id: "company-performance", label: "Company Performance" },
  { id: "care-delivery", label: "Care Delivery" },
  { id: "rota-performance", label: "Rota Performance" },
  { id: "staff-performance", label: "Staff Performance" },
  { id: "care-coordinator-performance", label: "Coordinator Performance" },
  { id: "medication", label: "Medication" },
  { id: "controlled-drugs", label: "Controlled Drugs" },
  { id: "incidents-complaints", label: "Incidents / Complaints" },
  { id: "quality-governance", label: "Quality Governance" },
  { id: "tasks-actions", label: "Tasks / Actions" },
  { id: "login-activity", label: "Login Activity" },
  { id: "cqc-evidence", label: "CQC Evidence" },
  { id: "ai-insights", label: "AI Insights" },
  { id: "reports", label: "Reports" }
];

const demoRoleOptions = [
  ...seniorManagementKpiAllowedRoles,
  ...seniorManagementKpiLimitedRoles,
  "Care Worker",
  "Auditor / Read Only"
];

const linkedModuleHrefs: Record<string, string> = {
  Dashboard: "/careverity-ecm",
  "Quality Intelligence Hub": "/careverity-ecm/quality-intelligence",
  "CQC Evidence Hub": "/careverity-ecm/quality-intelligence",
  "Staff Support & Recognition": "/hr/staff-support-recognition",
  HRIS: "/careverity-ecm/hris-ai-assistant",
  "Inspection Evidence Portal": "/careverity-ecm/reports"
};

const ragClasses: Record<KpiRagStatus, string> = {
  Green: "bg-emerald-50 text-emerald-800 ring-emerald-200",
  Amber: "bg-amber-50 text-amber-900 ring-amber-200",
  Red: "bg-rose-50 text-rose-800 ring-rose-200"
};

function normaliseSection(section?: string): KpiSection {
  return kpiSections.some((item) => item.id === section) ? (section as KpiSection) : "executive-dashboard";
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`rounded-lg border border-slate-200 bg-white p-5 shadow-sm ${className}`}>{children}</section>;
}

function Pill({ children, rag }: { children: ReactNode; rag: KpiRagStatus }) {
  return <span className={`inline-flex rounded-md px-2.5 py-1 text-xs font-black ring-1 ${ragClasses[rag]}`}>{children}</span>;
}

function SectionTitle({ title, subtitle, action }: { title: string; subtitle: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 className="text-xl font-black text-slate-950">{title}</h2>
        <p className="mt-1 max-w-4xl text-sm leading-6 text-slate-600">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

function SimpleTable({ headings, rows, title }: { headings: string[]; rows: string[][]; title: string }) {
  return (
    <div>
      <div className="mb-3 text-sm font-black text-slate-900">{title}</div>
      <div className="overflow-x-auto rounded-lg border border-slate-200">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>{headings.map((heading) => <th className="p-3" key={heading}>{heading}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((row, rowIndex) => (
              <tr className="bg-white" key={`${title}-${rowIndex}`}>
                {row.map((cell, index) => <td className="p-3 align-top text-slate-700" key={`${title}-${rowIndex}-${index}`}>{cell}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function MiniBarChart({ labels, values, title }: { labels: string[]; values: number[]; title: string }) {
  const max = Math.max(...values, 1);
  return (
    <Card>
      <div className="mb-4 text-sm font-black text-slate-900">{title}</div>
      <div className="space-y-3">
        {labels.map((label, index) => (
          <div className="grid grid-cols-[110px_1fr_48px] items-center gap-3 text-xs font-bold text-slate-600" key={label}>
            <span>{label}</span>
            <div className="h-3 rounded-full bg-slate-100">
              <div className="h-3 rounded-full bg-teal-500" style={{ width: `${Math.max(8, (values[index] / max) * 100)}%` }} />
            </div>
            <span className="text-right text-slate-900">{values[index]}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function KpiMetricCard({ card, onOpen }: { card: KpiCard; onOpen: (metricId: string) => void }) {
  return (
    <button className="rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-teal-300 hover:shadow-md" onClick={() => onOpen(card.metricId)} type="button">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-black uppercase text-slate-500">{card.category}</div>
          <div className="mt-1 text-sm font-black text-slate-950">{card.label}</div>
        </div>
        <Pill rag={card.ragStatus}>{card.ragStatus}</Pill>
      </div>
      <div className="mt-4 text-3xl font-black text-slate-950">{card.value}</div>
      <div className="mt-2 text-xs font-semibold text-slate-500">Target: {card.target} | Trend: {card.trendDirection}</div>
      <p className="mt-3 text-sm leading-6 text-slate-600">{card.detail}</p>
    </button>
  );
}

function ExecutiveDashboard({ onOpenMetric }: { onOpenMetric: (metricId: string) => void }) {
  const cards = calculateExecutiveKpiCards();
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => <KpiMetricCard card={card} key={card.metricId} onOpen={onOpenMetric} />)}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <MiniBarChart labels={["Completed", "Late", "Missed", "Unallocated"]} title="Visits trend" values={[99, 5, 1, 2]} />
        <MiniBarChart labels={["Incidents", "Complaints", "Compliments", "Safeguarding"]} title="Incidents, complaints and compliments trend" values={[5, 3, 8, 1]} />
        <MiniBarChart labels={["Medication alerts", "Controlled drugs", "MAR incomplete", "Reviews due"]} title="Medication trend" values={[2, 1, 4, 3]} />
        <MiniBarChart labels={["Open", "Overdue", "High-risk", "AI drafts"]} title="Overdue actions and AI approval queue" values={[20, 6, 3, 5]} />
      </div>
    </div>
  );
}

function CareDeliveryPanel({ onOpenMetric }: { onOpenMetric: (metricId: string) => void }) {
  const rates = calculateCareDeliveryRates();
  const rows = [
    ["Total scheduled visits", String(careDeliveryKpiOutputs.totalScheduledVisits), "Measured", "Green"],
    ["Completed visits", String(careDeliveryKpiOutputs.completedVisits), rates.visitCompletionRate, "Green"],
    ["Missed visits", String(careDeliveryKpiOutputs.missedVisits), rates.missedVisitRate, "Red"],
    ["Late visits", String(careDeliveryKpiOutputs.lateVisits), rates.lateVisitRate, "Amber"],
    ["Early arrivals", String(careDeliveryKpiOutputs.earlyArrivals), "Tracked", "Amber"],
    ["Geofence compliance", rates.geofenceComplianceRate, ">= 95%", "Green"],
    ["Care notes missing", String(careDeliveryKpiOutputs.careNotesMissing), "Care note completion " + rates.careNoteCompletionPercentage, "Amber"],
    ["Uncompleted tasks", String(careDeliveryKpiOutputs.uncompletedTasks), "Task completion " + rates.taskCompletionPercentage, "Red"]
  ];
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle subtitle="Visit completion, missed calls, late visits, clock-in/out, geofence, care notes and task completion." title="Care Delivery KPIs" />
        <SimpleTable headings={["KPI", "Value", "Output", "RAG"]} rows={rows} title="Care delivery calculation outputs" />
      </Card>
      <Card>
        <SectionTitle action={<button className="rounded-md bg-[#0B1F3A] px-3 py-2 text-xs font-black text-white" onClick={() => onOpenMetric("late-visits")} type="button">Open late visit drill-down</button>} subtitle="Click the drill-down to see source records behind the number." title="Late visit example" />
        <p className="text-sm leading-6 text-slate-600">Example: Click Late visits: 5 to show date/time, service user, staff, planned visit time, actual clock-in, reason, coordinator notified, follow-up status and audit trail.</p>
      </Card>
    </div>
  );
}

function RotaPerformancePanel({ onOpenMetric }: { onOpenMetric: (metricId: string) => void }) {
  const rows = [
    ["Unallocated visits", "2", "Red", "Repeated unallocated visits require senior rota review"],
    ["Regular carer continuity", "82%", "Amber", "Two service users have poor continuity"],
    ["Rota changes requested", "26", "Amber", "One overdue high-impact coordinator rota action"],
    ["Rota changes completed", "23", "Amber", "Completion rate visible by coordinator"],
    ["Emergency calls created/completed", "3 / 3", "Green", "Emergency cover completed"],
    ["Double-up calls completed", "18", "Green", "Double-up calls included in visit completion"],
    ["Calls cancelled", "4", "Amber", "Cancellation reasons require review"],
    ["Care coordinator notified", "Yes", "Amber", "Overdue action visible in CoordinatorActionTracking"]
  ];
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle action={<button className="rounded-md bg-[#0B1F3A] px-3 py-2 text-xs font-black text-white" onClick={() => onOpenMetric("overdue-coordinator-action")} type="button">Open overdue rota action</button>} subtitle="Rota KPIs cover unallocated visits, rota changes, regular carer continuity, emergency cover, double-up completion and overdue coordinator actions." title="Rota Performance KPIs" />
        <SimpleTable headings={["KPI", "Value", "RAG", "Evidence"]} rows={rows} title="Rota KPI tracker" />
      </Card>
    </div>
  );
}

function StaffPerformancePanel({ onOpenMetric }: { onOpenMetric: (metricId: string) => void }) {
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          action={<button className="rounded-md bg-teal-600 px-3 py-2 text-xs font-black text-white" onClick={() => onOpenMetric("staff-performance")} type="button">Open staff drill-down</button>}
          subtitle="Management-only staff support indicators. No public negative rankings and no automatic HR disciplinary decision."
          title="Staff Performance and Support KPIs"
        />
        <div className="mb-4 rounded-lg bg-amber-50 p-3 text-sm font-black text-amber-900 ring-1 ring-amber-200">{seniorManagementKpiSafetyStatement}</div>
        <SimpleTable headings={["Staff", "Visits", "Punctuality", "Notes", "Geofence", "Compliments", "Outstanding tasks", "RAG", "Suggested action"]} rows={staffPerformanceRows} title="Management-only staff support indicators" />
      </Card>
    </div>
  );
}

function CoordinatorPanel({ onOpenMetric }: { onOpenMetric: (metricId: string) => void }) {
  const trackedRows = coordinatorActionTrackingRows.map((action) => trackCoordinatorActionStatus(action));
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle action={<button className="rounded-md bg-[#0B1F3A] px-3 py-2 text-xs font-black text-white" onClick={() => onOpenMetric("overdue-coordinator-action")} type="button">Open overdue coordinator action</button>} subtitle="If a coordinator is notified to change a visit and does not action it within the required timescale, managers can see the overdue RAG status." title="Care Coordinator Performance KPIs" />
        <SimpleTable headings={["Coordinator", "Service users", "Visits", "Changes requested", "Changes completed", "Uncompleted", "Alert response", "RAG", "Notes"]} rows={careCoordinatorPerformanceRows} title="Coordinator performance summary" />
      </Card>
      <Card>
        <SimpleTable
          headings={["Action ID", "Source", "Source record", "Due", "Status", "Priority", "Impact", "RAG", "Escalation"]}
          rows={trackedRows.map((action) => [action.actionId, action.sourceType, action.sourceRecordId, action.dueAt, action.status, action.priority, action.impactLevel, action.ragStatus, action.escalationRequired ? "Yes" : "No"])}
          title="CoordinatorActionTracking"
        />
      </Card>
    </div>
  );
}

function SectionPanel({ activeSection, onOpenMetric }: { activeSection: KpiSection; onOpenMetric: (metricId: string) => void }) {
  if (activeSection === "executive-dashboard" || activeSection === "company-performance") return <ExecutiveDashboard onOpenMetric={onOpenMetric} />;
  if (activeSection === "care-delivery") return <CareDeliveryPanel onOpenMetric={onOpenMetric} />;
  if (activeSection === "rota-performance") return <RotaPerformancePanel onOpenMetric={onOpenMetric} />;
  if (activeSection === "staff-performance") return <StaffPerformancePanel onOpenMetric={onOpenMetric} />;
  if (activeSection === "care-coordinator-performance") return <CoordinatorPanel onOpenMetric={onOpenMetric} />;
  if (activeSection === "medication") return <Card><SectionTitle subtitle="MAR, medication alerts, refused/missed medicines and staff competency compliance." title="Medication KPI Dashboard" /><SimpleTable headings={["KPI", "Value", "RAG", "Insight"]} rows={medicationKpiRows} title="Medication KPIs" /></Card>;
  if (activeSection === "controlled-drugs") return <Card><SectionTitle subtitle="Controlled drug stock, witness records, balance changes, sign-off and audits." title="Controlled Drugs KPI Dashboard" /><SimpleTable headings={["KPI", "Value", "RAG", "Action"]} rows={controlledDrugKpiRows} title="Controlled drug alerts" /></Card>;
  if (activeSection === "incidents-complaints") return <Card><SectionTitle subtitle="Incidents, complaints, safeguarding, compliments, response times and lessons learned actions." title="Incidents, Complaints and Safeguarding KPIs" /><SimpleTable headings={["KPI", "Value", "RAG", "AI-supported insight"]} rows={incidentsComplaintsKpiRows} title="Incidents and complaints trend" /></Card>;
  if (activeSection === "quality-governance") return <Card><SectionTitle subtitle="Care plan reviews, risk reviews, audits, spot checks, supervision, training and inspection readiness." title="Quality and Governance KPIs" /><SimpleTable headings={["KPI", "Value", "RAG", "Evidence"]} rows={qualityGovernanceKpiRows} title="Quality governance tracker" /></Card>;
  if (activeSection === "tasks-actions") return <Card><SectionTitle subtitle="Open, overdue, high-risk and owner-assigned actions are visible to managers." title="Tasks, Messages and Action Tracking" /><SimpleTable headings={["Task", "Action", "Owner", "Priority", "Status", "RAG", "Source"]} rows={taskActionRows} title="Overdue high-risk actions" /></Card>;
  if (activeSection === "login-activity") return <Card><SectionTitle subtitle="Last login, inactive users, failed attempts, MFA compliance and unusual login patterns." title="Login Activity KPIs" /><SimpleTable headings={["User", "Role", "Last login", "Monthly logins", "Failed attempts", "Exception", "RAG"]} rows={loginActivityRows} title="Login exceptions" /></Card>;
  if (activeSection === "cqc-evidence") return <Card><SectionTitle subtitle="KPI evidence mapped to Safe, Effective, Caring, Responsive and Well-led." title="CQC Evidence Mapping" /><SimpleTable headings={["Theme", "Sources", "Evidence use"]} rows={cqcThemeMappingRows} title="CQC evidence summary" /></Card>;
  if (activeSection === "reports") return <Card><SectionTitle subtitle="All reports include summary, KPI table, RAG, trend, evidence, actions, responsible person, target date, status, manager comments and approval section." title="Director and CQC Reports" /><SimpleTable headings={["Report", "Scope", "Status", "Owner", "Approval"]} rows={kpiReportRows} title="Report catalogue" /></Card>;
  return <AiInsightsPanel />;
}

function DrillDownPanel({ metricId }: { metricId: string }) {
  const rows = getKpiDrillDownRecords(metricId).map((record) => [
    record.dateTime,
    record.serviceUser,
    record.staff,
    record.responsiblePerson,
    record.status,
    record.sourceEvidence,
    record.actionTaken,
    record.auditTrail
  ]);
  return (
    <Card>
      <SectionTitle subtitle="Every KPI card can show source records, responsible person, status, source evidence, action taken, overdue actions and audit trail." title={`KPI drill-down: ${metricId}`} />
      <SimpleTable headings={["Date/time", "Service user", "Staff", "Responsible person", "Status", "Source evidence", "Action taken", "Audit trail"]} rows={rows} title="Source records behind KPI" />
    </Card>
  );
}

function AiInsightsPanel() {
  const [draft, setDraft] = useState<KpiManagementInsightResponse | null>(null);
  return (
    <div className="space-y-6">
      <Card>
        <SectionTitle
          action={<button className="rounded-md bg-teal-600 px-3 py-2 text-xs font-black text-white" onClick={() => setDraft(generateKpiManagementInsightDraft({ companyId: seniorManagementKpiDemoCompanyId, dateFrom: "2026-05-01", dateTo: "2026-05-31", includedModules: ["care-delivery", "medication", "quality-governance"], outputType: "Executive Summary", sourceRecordIds: ["KPI-SNAP-TEST-001", "COORD-ACT-001", "TASK-001"], anonymiseServiceUserDetails: true, humanApprovalRequired: true, userRole: "Registered Manager" }))} type="button">Generate AI insight draft</button>}
          subtitle="AI can draft executive summaries, KPI commentary, risks, improvements, repeated themes, action plans and CQC evidence summaries."
          title="AI Management Insight Assistant"
        />
        <div className="rounded-lg bg-amber-50 p-4 text-sm font-bold leading-6 text-amber-900 ring-1 ring-amber-200">
          AI reports are draft only, source-linked, editable, manager-approved and saved to Quality Intelligence Hub. AI must not make disciplinary decisions, declare staff guilty, hide negative evidence, invent facts, change records without approval or publish reports without review.
        </div>
      </Card>
      {draft ? (
        <Card>
          <SectionTitle subtitle="Approval required before saving or publishing." title={draft.title} />
          <p className="text-sm leading-6 text-slate-700">{draft.executiveSummary}</p>
          <SimpleTable headings={["Area", "Draft output"]} rows={[
            ["Key findings", draft.keyFindings.join("; ")],
            ["Positive performance", draft.positivePerformance.join("; ")],
            ["Risks", draft.risks.join("; ")],
            ["Overdue actions", draft.overdueActions.join("; ")],
            ["Recommended actions", draft.recommendedActions.join("; ")],
            ["Source records used", draft.sourceRecordsUsed.join(", ")],
            ["Approval required", String(draft.approvalRequired)]
          ]} title="Draft-only AI insight" />
        </Card>
      ) : null}
    </div>
  );
}

export function SeniorManagementKpiDashboard({ initialSection = "executive-dashboard" }: { initialSection?: string }) {
  const [activeSection, setActiveSection] = useState<KpiSection>(() => normaliseSection(initialSection));
  const [selectedRole, setSelectedRole] = useState("Registered Manager");
  const [selectedMetric, setSelectedMetric] = useState("late-visits");
  const [exportAudit, setExportAudit] = useState(kpiExportAuditRows);
  const accessAllowed = canAccessSeniorManagementKpi(selectedRole);
  const accessScope = seniorManagementKpiAccessScope(selectedRole);
  const rates = useMemo(() => calculateCareDeliveryRates(), []);

  const createExport = () => {
    const audit = createKpiReportExportAudit("Executive Director KPI Report", `Demo ${selectedRole}`);
    setExportAudit((rows) => [[audit.createdAt, audit.exportedBy, audit.reportName, audit.action, "Export requires permission", audit.auditId], ...rows]);
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 md:px-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-wide text-teal-700">CareVerity ECM</div>
              <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-950">{seniorManagementKpiModuleName}</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-600">{seniorManagementKpiCorePrinciple} This module supports management oversight, quality improvement, compliance monitoring and CQC evidence.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <label>
                <span className="text-xs font-bold uppercase text-slate-500">Demo senior role</span>
                <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold" onChange={(event) => setSelectedRole(event.target.value)} value={selectedRole}>
                  {demoRoleOptions.map((role) => <option key={role}>{role}</option>)}
                </select>
              </label>
              <button className="mt-6 rounded-md bg-[#0B1F3A] px-4 py-2 text-sm font-black text-white" onClick={createExport} type="button">Export report</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-4">
            <div className={`rounded-lg p-4 ring-1 ${ragClasses[seniorManagementKpiSnapshot.overallRag]}`}>
              <div className="text-xs font-black uppercase">Overall company RAG</div>
              <div className="mt-1 text-2xl font-black">{seniorManagementKpiSnapshot.overallRag}</div>
            </div>
            <label>
              <span className="text-xs font-bold uppercase text-slate-500">Date range</span>
              <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold">
                <option>May 2026</option>
                <option>This month</option>
                <option>Last 30 days</option>
                <option>Custom date range</option>
              </select>
            </label>
            <label>
              <span className="text-xs font-bold uppercase text-slate-500">Branch</span>
              <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-bold">
                <option>All branches</option>
                <option>Demo North Branch</option>
                <option>Demo Central Locality</option>
              </select>
            </label>
            <button className="mt-6 rounded-md bg-teal-600 px-4 py-2 text-sm font-black text-white" onClick={() => setActiveSection("ai-insights")} type="button">Generate AI insight</button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl space-y-6 px-4 py-6 md:px-6">
        <div className="rounded-lg bg-amber-50 p-4 text-sm font-black text-amber-900 ring-1 ring-amber-200">
          {seniorManagementKpiDemoBanner}
        </div>

        <Card>
          <SectionTitle subtitle={`Company: ${seniorManagementKpiDemoCompanyId}. ${accessScope}`} title="Access, filters and linked modules" />
          <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
            {["Care coordinator", "Supervisor", "Staff member", "Service user", "KPI category", "RAG status"].map((label) => (
              <label key={label}>
                <span className="text-xs font-bold uppercase text-slate-500">{label}</span>
                <select className="mt-2 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold">
                  <option>All authorised</option>
                  <option>Demo filtered view</option>
                  <option>Overdue actions</option>
                </select>
              </label>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {seniorManagementKpiLinkedModules.map((moduleName) => (
              <a className="rounded-md bg-slate-100 px-3 py-2 text-xs font-black text-slate-700 ring-1 ring-slate-200" href={linkedModuleHrefs[moduleName]} key={moduleName}>
                {moduleName}
              </a>
            ))}
          </div>
        </Card>

        {!accessAllowed ? (
          <Card>
            <SectionTitle subtitle="Care workers must not see company-wide KPI performance or staff comparison dashboards." title="Access denied for this demo role" />
            <p className="text-sm font-semibold text-slate-700">Select an authorised senior role to view the KPI dashboard. The denial is audit-ready and tenant-scoped by companyId.</p>
          </Card>
        ) : (
          <>
            <div className="flex flex-wrap gap-2">
              {kpiSections.map((section) => (
                <button className={`rounded-md px-3 py-2 text-xs font-black ${activeSection === section.id ? "bg-[#0B1F3A] text-white" : "bg-white text-slate-700 ring-1 ring-slate-200"}`} key={section.id} onClick={() => setActiveSection(section.id)} type="button">
                  {section.label}
                </button>
              ))}
            </div>

            <Card>
              <SectionTitle subtitle={seniorManagementKpiSnapshot.executiveSummary} title="Executive summary" />
              <div className="grid gap-3 md:grid-cols-4">
                <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100"><div className="text-xs font-bold uppercase text-slate-500">Visit completion</div><div className="mt-1 text-2xl font-black">{rates.visitCompletionRate}</div></div>
                <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100"><div className="text-xs font-bold uppercase text-slate-500">Missed visit rate</div><div className="mt-1 text-2xl font-black">{rates.missedVisitRate}</div></div>
                <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100"><div className="text-xs font-bold uppercase text-slate-500">Care coordinators</div><div className="mt-1 text-2xl font-black">{seniorManagementKpiTestData.careCoordinators}</div></div>
                <div className="rounded-lg bg-slate-50 p-4 ring-1 ring-slate-100"><div className="text-xs font-bold uppercase text-slate-500">AI drafts awaiting approval</div><div className="mt-1 text-2xl font-black">{seniorManagementKpiTestData.aiDraftsAwaitingApproval}</div></div>
              </div>
            </Card>

            <SectionPanel activeSection={activeSection} onOpenMetric={setSelectedMetric} />
            <DrillDownPanel metricId={selectedMetric} />

            <div className="grid gap-6 xl:grid-cols-2">
              <Card>
                <SectionTitle subtitle="Regular carer continuity by branch/coordinator and service user." title="Regular Carer / Continuity KPI" />
                <SimpleTable headings={["Service user", "Main carer(s)", "Carers used", "Continuity", "Reason", "RAG", "Suggested action"]} rows={regularCarerContinuityRows} title="Continuity analysis" />
              </Card>
              <Card>
                <SectionTitle subtitle="Automatic escalation examples create tasks, audit rows and report evidence." title="Alerts and escalation rules" />
                <SimpleTable headings={["Trigger", "RAG", "Escalation action"]} rows={kpiEscalationRules} title="Escalation rules" />
              </Card>
            </div>

            <Card>
              <SectionTitle subtitle="All exports and report generations are permission-controlled and audited." title="Export audit log" />
              <SimpleTable headings={["Date/time", "User", "Report", "Action", "Control", "Audit reference"]} rows={exportAudit} title="KPI export audit" />
            </Card>
          </>
        )}

        <Card>
          <SectionTitle subtitle="Management safeguards used by this sensitive performance dashboard." title="Permission and privacy safeguards" />
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {seniorManagementKpiPrivacyRules.map((rule) => <div className="rounded-md bg-slate-50 p-3 text-sm font-bold leading-6 text-slate-700 ring-1 ring-slate-100" key={rule}>{rule}</div>)}
          </div>
        </Card>

        <Card>
          <SectionTitle subtitle="Live KPI calculations must be fed from tenant-scoped database tables before staging UAT. The current route displays demo records only." title="Backend readiness mapping" />
          <SimpleTable headings={["KPI area", "Requested source name", "Database table/source", "Live readiness requirement"]} rows={kpiBackendReadinessMappingRows} title="Real backend feed map" />
        </Card>

        <Card>
          <SectionTitle subtitle="Route family served by the KPI dashboard." title="KPI routes" />
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">
            {seniorManagementKpiRouteLinks.map((href) => <a className="rounded-md bg-white px-3 py-2 text-xs font-black text-teal-800 ring-1 ring-teal-100" href={href} key={href}>{href}</a>)}
          </div>
        </Card>
      </div>
    </main>
  );
}
