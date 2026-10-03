"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { certificates, getLearnerAssignments, policies, staffUsers, webinarSessions } from "@/lib/demo-data";
import { cx, formatDate } from "@/lib/format";

const tabs = ["Incomplete Courses", "Completed Courses", "Webinar Meetings", "Policies to Read", "Certificates"] as const;

export default function LearnerDashboardPage() {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Incomplete Courses");
  const learner = staffUsers[0];
  const assignments = getLearnerAssignments(learner.id);
  const incomplete = assignments.filter((assignment) => assignment.status !== "Completed");
  const completed = assignments.filter((assignment) => assignment.status === "Completed");

  const rows = useMemo(() => {
    if (activeTab === "Completed Courses") return completed;
    return incomplete;
  }, [activeTab, completed, incomplete]);

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton href="/course-player/safeguarding-adults">Launch course</ActionButton>
            <ActionButton href="/certificates" variant="secondary">
              My certificates
            </ActionButton>
          </>
        }
        description="Learner mode limits the view to the logged-in staff member's own courses, certificates, policies and webinar records."
        eyebrow="Staff dashboard"
        title={`Welcome, ${learner.firstName}`}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard detail="Courses still requiring action" icon="IC" label="Incomplete" tone="amber" value={`${incomplete.length}`} />
        <StatCard detail="Successfully finished courses" icon="CP" label="Completed" tone="green" value={`${completed.length}`} />
        <StatCard detail="Policies awaiting declaration" icon="PA" label="Policies" tone="violet" value={`${policies[0].pendingCount}`} />
        <StatCard detail="Demo certificates available" icon="CT" label="Certificates" tone="blue" value={`${certificates.length}`} />
      </section>
      <section className="mt-6 rounded-lg border border-lqcs-line bg-white shadow-soft">
        <div className="border-b border-lqcs-line p-3">
          <div className="flex gap-2 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                className={cx(
                  "focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-semibold",
                  activeTab === tab ? "bg-navy text-white" : "bg-slate-100 text-slate-700"
                )}
                key={tab}
                onClick={() => setActiveTab(tab)}
                type="button"
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        {activeTab === "Webinar Meetings" ? (
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Webinar ID</th>
                  <th className="px-3 py-3">Subject</th>
                  <th className="px-3 py-3">Date</th>
                  <th className="px-3 py-3">Time</th>
                  <th className="px-3 py-3">Attendance</th>
                  <th className="px-3 py-3">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lqcs-line">
                {webinarSessions.map((webinar) => (
                  <tr key={webinar.id}>
                    <td className="px-3 py-3 font-semibold">{webinar.id}</td>
                    <td className="px-3 py-3">{webinar.subject}</td>
                    <td className="px-3 py-3">{formatDate(webinar.date)}</td>
                    <td className="px-3 py-3">{webinar.time}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={webinar.attendanceStatus} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={webinar.certificateStatus} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : activeTab === "Policies to Read" ? (
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {policies.map((policy) => (
              <article className="rounded-lg border border-lqcs-line p-4" key={policy.id}>
                <p className="text-sm font-bold text-ink">{policy.title}</p>
                <p className="mt-1 text-sm text-slate-600">
                  Version {policy.version} - Review {formatDate(policy.reviewDate)}
                </p>
                <label className="mt-4 flex items-start gap-3 text-sm text-slate-600">
                  <input className="mt-1 h-4 w-4 rounded border-lqcs-line" type="checkbox" />
                  I confirm I have read and understood this policy.
                </label>
                <button className="focus-ring mt-4 rounded-md bg-lqcs-blue px-3 py-2 text-sm font-semibold text-white" type="button">
                  Acknowledge
                </button>
              </article>
            ))}
          </div>
        ) : activeTab === "Certificates" ? (
          <div className="grid gap-3 p-4 md:grid-cols-2">
            {certificates.slice(0, 3).map((certificate) => (
              <article className="rounded-lg border border-lqcs-line p-4" key={certificate.id}>
                <p className="text-sm font-bold text-ink">{certificate.courseTitle}</p>
                <p className="mt-1 text-sm text-slate-600">{certificate.certificateNumber}</p>
                <p className="mt-3 text-sm text-slate-600">
                  Issued {formatDate(certificate.issueDate)} - Score {certificate.score}%
                </p>
              </article>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Course number</th>
                  <th className="px-3 py-3">Course name</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Enrolled date</th>
                  <th className="px-3 py-3">Due date</th>
                  <th className="px-3 py-3">Launch</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lqcs-line">
                {rows.map((assignment, index) => (
                  <tr key={assignment.id}>
                    <td className="px-3 py-3 font-semibold">C-{String(index + 1).padStart(3, "0")}</td>
                    <td className="px-3 py-3 font-semibold text-ink">{assignment.course.title}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={assignment.status} />
                    </td>
                    <td className="px-3 py-3 text-slate-600">{formatDate(assignment.enrolledDate)}</td>
                    <td className="px-3 py-3 text-slate-600">{formatDate(assignment.dueDate)}</td>
                    <td className="px-3 py-3">
                      <ActionButton href={`/course-player/${assignment.course.slug}`} variant="quiet">
                        Launch
                      </ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
