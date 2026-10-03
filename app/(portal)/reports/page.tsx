import { ActionButton } from "@/components/action-button";
import { LqcsLogo } from "@/components/lqcs-logo";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { dueSoonCount, overdueCount, quizAttempts, reportRows, staffUsers } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";

const reports = [
  "Individual Staff Training Record",
  "Expired Training Report",
  "Training Due Soon Report",
  "New Starter Induction Report",
  "Failed Quiz Report",
  "Policy Acknowledgement Report",
  "Manager Approval Pending Report",
  "Competency Assessment Report"
];

const cqcPackItems = [
  "Current training matrix",
  "List of mandatory training",
  "Individual staff training examples",
  "Sample certificates",
  "Overdue training action plan",
  "Competency records",
  "Policy acknowledgements",
  "Training audit history",
  "Management review notes"
];

export default function ReportsPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton>Export Excel</ActionButton>
            <ActionButton variant="secondary">Export PDF</ActionButton>
          </>
        }
        description="Management and inspection-ready reports for training compliance, course performance, policy evidence and CQC governance."
        eyebrow="Reports"
        logo={
          <div className="flex h-16 w-44 items-center justify-center rounded-lg border border-lqcs-line bg-white p-2 shadow-soft">
            <LqcsLogo className="max-h-12" priority />
          </div>
        }
        title="Audit evidence reports"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard detail="Active demo staff included" icon="US" label="Users in reports" tone="blue" value={`${staffUsers.filter((staff) => staff.status === "Active").length}`} />
        <StatCard detail="Expired records requiring action" icon="EX" label="Expired training" tone="red" value={`${overdueCount()}`} />
        <StatCard detail="Training due in 30 days" icon="DS" label="Due soon" tone="amber" value={`${dueSoonCount()}`} />
        <StatCard detail="Demo attempts for manager review" icon="QA" label="Failed quiz attempts" tone="violet" value={`${quizAttempts.filter((attempt) => attempt.outcome === "Failed").length}`} />
      </section>
      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Compliance by course</h2>
            <p className="mt-1 text-sm text-slate-600">Shows enrolment, access and completion rates so managers can target action.</p>
          </div>
          <div className="flex gap-2">
            <input className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm" placeholder="Search course" />
            <button className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm font-semibold text-ink" type="button">
              Active users only
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Course name</th>
                <th className="px-3 py-3">Enrolled</th>
                <th className="px-3 py-3">Accessed</th>
                <th className="px-3 py-3">Completed</th>
                <th className="px-3 py-3">Completion</th>
                <th className="px-3 py-3">Action required</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {reportRows.map((row) => (
                <tr key={row.courseName}>
                  <td className="px-3 py-3 font-semibold text-ink">{row.courseName}</td>
                  <td className="px-3 py-3">{row.enrolled}</td>
                  <td className="px-3 py-3">{row.accessed}</td>
                  <td className="px-3 py-3">{row.completed}</td>
                  <td className="px-3 py-3">
                    <StatusPill status={`${row.completionPercentage}%`} />
                  </td>
                  <td className="px-3 py-3 text-slate-600">{row.actionRequired}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Core report pages</h2>
          <div className="mt-4 grid gap-2">
            {reports.map((report) => (
              <div className="flex items-center justify-between gap-3 rounded-md bg-slate-50 px-3 py-3" key={report}>
                <p className="text-sm font-semibold text-ink">{report}</p>
                <ActionButton variant="quiet">Open</ActionButton>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft" id="cqc">
          <h2 className="text-lg font-bold text-ink">CQC evidence pack</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">A generated pack for audits, local authority monitoring, safeguarding reviews and CQC inspection preparation.</p>
          <div className="mt-4 grid gap-2 md:grid-cols-2">
            {cqcPackItems.map((item) => (
              <div className="rounded-md border border-lqcs-line bg-white p-3 text-sm font-semibold text-ink" key={item}>
                {item}
              </div>
            ))}
          </div>
          <button className="focus-ring mt-5 rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" type="button">
            Generate CQC pack placeholder
          </button>
        </article>
      </section>
      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Recent quiz attempt records</h2>
            <p className="mt-1 text-sm text-slate-600">Fake demo attempts for audit trail and failed-assessment reporting.</p>
          </div>
          <ActionButton variant="secondary">Export attempts</ActionButton>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Staff member</th>
                <th className="px-3 py-3">Course</th>
                <th className="px-3 py-3">Attempt</th>
                <th className="px-3 py-3">Completed</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Outcome</th>
                <th className="px-3 py-3">Certificate issued</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {quizAttempts.map((attempt) => (
                <tr key={attempt.id}>
                  <td className="px-3 py-3 font-semibold text-ink">{attempt.staffName}</td>
                  <td className="px-3 py-3">{attempt.courseTitle}</td>
                  <td className="px-3 py-3">{attempt.attemptNumber}</td>
                  <td className="px-3 py-3">{formatDate(attempt.completedAt.slice(0, 10))}</td>
                  <td className="px-3 py-3">{attempt.score}%</td>
                  <td className="px-3 py-3">
                    <StatusPill status={attempt.outcome} />
                  </td>
                  <td className="px-3 py-3">{attempt.certificateIssued ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
