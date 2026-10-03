import { ActionButton } from "@/components/action-button";
import { DataTable } from "@/components/data-table";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { competencyRecords } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";
import type { CompetencyRecord } from "@/lib/types";

const competencyAreas = [
  "Medication administration",
  "Moving and handling",
  "Infection control practice",
  "Safeguarding understanding",
  "Use of PPE",
  "Recording and reporting",
  "Pressure area prevention",
  "Autism/learning disability support"
];

const competencyColumns = [
  {
    header: "Staff member",
    className: "px-3 py-3 font-semibold text-ink",
    cell: (record: CompetencyRecord) => record.staffName
  },
  {
    header: "Competency area",
    cell: (record: CompetencyRecord) => record.area
  },
  {
    header: "Assessor",
    cell: (record: CompetencyRecord) => record.assessor
  },
  {
    header: "Date observed",
    cell: (record: CompetencyRecord) => formatDate(record.observedDate)
  },
  {
    header: "Outcome",
    cell: (record: CompetencyRecord) => <StatusPill status={record.outcome} />
  },
  {
    header: "Action required",
    className: "px-3 py-3 text-slate-600",
    cell: (record: CompetencyRecord) => record.actionRequired
  },
  {
    header: "Reassessment date",
    cell: (record: CompetencyRecord) => formatDate(record.reassessmentDate)
  }
];

export default function CompetencyRecordsPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton>Add observation</ActionButton>
            <ActionButton variant="secondary">Export records</ActionButton>
          </>
        }
        description="Practical care duties can be linked to manager observations, action plans, reassessment dates and supervision evidence."
        eyebrow="Competency checks"
        title="Competency and observation records"
      />
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">New competency record</h2>
          <form className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Staff member</span>
              <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="Amira Khan" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Competency area</span>
              <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm">
                {competencyAreas.map((area) => (
                  <option key={area}>{area}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Assessor</span>
              <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="Daniel Morgan" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Date observed</span>
              <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="2026-05-11" type="date" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Outcome</span>
              <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm">
                <option>Competent</option>
                <option>Needs Support</option>
                <option>Not Competent</option>
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Action required</span>
              <textarea className="focus-ring mt-2 min-h-24 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="No further action" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Reassessment date</span>
              <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="2027-05-11" type="date" />
            </label>
            <button className="focus-ring rounded-md bg-lqcs-blue px-3 py-2 text-sm font-bold text-white" type="button">
              Save placeholder
            </button>
          </form>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Existing records</h2>
          <div className="mt-4">
            <DataTable ariaLabel="Competency observation records" columns={competencyColumns} getRowKey={(record) => record.id} minWidth="860px" rows={competencyRecords} />
          </div>
        </article>
      </section>
    </>
  );
}
