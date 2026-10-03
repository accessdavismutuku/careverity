import { ActionButton } from "@/components/action-button";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { webinarSessions } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import type { WebinarSession } from "@/lib/types";

const webinarColumns = [
  {
    header: "Webinar ID",
    className: "px-3 py-3 font-semibold text-ink",
    cell: (webinar: WebinarSession) => webinar.id
  },
  {
    header: "Webinar course subject",
    cell: (webinar: WebinarSession) => webinar.subject
  },
  {
    header: "Webinar date",
    cell: (webinar: WebinarSession) => formatDate(webinar.date)
  },
  {
    header: "Webinar time",
    cell: (webinar: WebinarSession) => webinar.time
  },
  {
    header: "Attendance status",
    cell: (webinar: WebinarSession) => <StatusPill status={webinar.attendanceStatus} />
  },
  {
    header: "Certificate status",
    cell: (webinar: WebinarSession) => <StatusPill status={webinar.certificateStatus} />
  },
  {
    header: "Action",
    cell: () => <ActionButton variant="quiet">Register</ActionButton>
  }
];

export default function WebinarsPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton>Book webinar</ActionButton>
            <ActionButton variant="secondary">Add manually</ActionButton>
          </>
        }
        description="Future live training records, attendance registers, certificates and webinar reminder emails."
        eyebrow="Webinar management"
        title="Webinar sessions"
      />
      <section className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
          <input className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm" placeholder="Search webinar subject" />
          <div className="flex gap-2">
            <ActionButton variant="secondary">Export CSV</ActionButton>
            <ActionButton variant="secondary">Print</ActionButton>
          </div>
        </div>
        <div className="mt-4">
          <DataTable ariaLabel="Webinar management sessions" columns={webinarColumns} getRowKey={(webinar) => webinar.id} rows={webinarSessions} />
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-3">
        {["Zoom or Teams link field", "Attendance register", "Webinar certificate issue"].map((item) => (
          <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft" key={item}>
            <p className="text-sm font-bold text-ink">{item}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">Placeholder for Phase 2 live-session management.</p>
          </article>
        ))}
      </section>
    </>
  );
}
