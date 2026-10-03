import { ActionButton } from "@/components/action-button";
import { LqcsLogo } from "@/components/lqcs-logo";
import { MiniChart } from "@/components/mini-chart";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import {
  auditEvents,
  certificates,
  compliancePercentage,
  courseAssignments,
  courses,
  dueSoonCount,
  notifications,
  overdueCount,
  staffUsers
} from "@/lib/demo-data";

export default function ManagerDashboardPage() {
  const activeLearners = staffUsers.filter((staff) => staff.status === "Active").length;
  const completedCourses = courseAssignments.filter((assignment) => assignment.status === "Completed").length;
  const assignedCourses = courseAssignments.filter((assignment) => assignment.status !== "Not Applicable").length;

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton href="/training-matrix">Open matrix</ActionButton>
            <ActionButton href="/reports#cqc" variant="secondary">
              CQC pack
            </ActionButton>
          </>
        }
        description="Live compliance overview for managers, HR and senior administrators. All numbers are demo data so the prototype can be safely shared."
        eyebrow="Admin dashboard"
        logo={
          <div className="flex h-16 w-44 items-center justify-center rounded-lg border border-lqcs-line bg-white p-2 shadow-soft">
            <LqcsLogo className="max-h-12" priority />
          </div>
        }
        title="Training compliance overview"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard detail="Across active demo assignments" icon="CP" label="Current compliance" tone="green" value={`${compliancePercentage()}%`} />
        <StatCard detail="Active staff profiles" icon="AL" label="Total learners" tone="blue" value={`${activeLearners}`} />
        <StatCard detail="Completed assignment records" icon="CC" label="Completed courses" tone="teal" value={`${completedCourses}`} />
        <StatCard detail="Training assignment records" icon="AS" label="Courses assigned" tone="violet" value={`${assignedCourses}`} />
        <StatCard detail="Expired mandatory records" icon="OT" label="Overdue training" tone="red" value={`${overdueCount()}`} />
        <StatCard detail="Due within 30 days" icon="DS" label="Training due soon" tone="amber" value={`${dueSoonCount()}`} />
        <StatCard detail="Issued in demo workspace" icon="CI" label="Certificates issued" tone="green" value={`${certificates.length}`} />
        <StatCard detail="Profiles created this week" icon="NL" label="New learners" tone="blue" value="4" />
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-3">
        <MiniChart labels={["Jan", "Feb", "Mar", "Apr", "May"]} title="Compliance trend" values={[62, 68, 71, 77, compliancePercentage()]} />
        <MiniChart labels={["Mon", "Tue", "Wed", "Thu", "Fri"]} title="Completed courses trend" values={[6, 9, 7, 12, 15]} />
        <MiniChart labels={["Safe", "Med", "H&S", "Gov", "Spec"]} title="Completion by category" values={[82, 58, 76, 79, 54]} />
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold text-ink">Action queue</h2>
            <StatusPill status="Manager review" />
          </div>
          <div className="mt-4 divide-y divide-lqcs-line">
            {notifications.map((notification) => (
              <div className="flex items-center justify-between gap-3 py-3" key={notification}>
                <p className="text-sm font-semibold text-ink">{notification}</p>
                <ActionButton variant="quiet">Review</ActionButton>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Recent audit activity</h2>
          <div className="mt-4 space-y-4">
            {auditEvents.map((event) => (
              <div className="rounded-md bg-slate-50 p-3" key={`${event.actor}-${event.time}`}>
                <p className="text-sm font-bold text-ink">{event.action}</p>
                <p className="mt-1 text-sm text-slate-600">{event.detail}</p>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {event.actor} - {event.time}
                </p>
              </div>
            ))}
          </div>
        </article>
      </section>
      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Mandatory courses below threshold</h2>
            <p className="mt-1 text-sm text-slate-600">Used for governance notes before inspection packs are exported.</p>
          </div>
          <ActionButton href="/reports" variant="secondary">
            View reports
          </ActionButton>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Course</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">Completion</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {courses
                .filter((course) => course.completionPercentage < 70)
                .slice(0, 5)
                .map((course) => (
                  <tr key={course.id}>
                    <td className="px-3 py-3 font-semibold text-ink">{course.title}</td>
                    <td className="px-3 py-3 text-slate-600">{course.category}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={`${course.completionPercentage}%`} />
                    </td>
                    <td className="px-3 py-3 text-slate-600">Reminder cycle and manager review</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
