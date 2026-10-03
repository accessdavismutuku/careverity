import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { policies, staffUsers } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";

export default function PoliciesPage() {
  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton>Upload policy</ActionButton>
            <ActionButton variant="secondary">Export acknowledgements</ActionButton>
          </>
        }
        description="Staff can read policies and sign a declaration. Records include policy version, date, declaration wording and audit evidence placeholders."
        eyebrow="Policy acknowledgements"
        title="Policies to read and acknowledge"
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {policies.map((policy) => (
          <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft" key={policy.id}>
            <p className="text-sm font-bold text-ink">{policy.title}</p>
            <p className="mt-1 text-sm text-slate-600">Version {policy.version}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Issue date</span>
                <span className="font-semibold">{formatDate(policy.issueDate)}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Review date</span>
                <span className="font-semibold">{formatDate(policy.reviewDate)}</span>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusPill status={`${policy.acknowledgedCount} acknowledged`} />
              <StatusPill status={`${policy.pendingCount} pending`} />
            </div>
            <div className="mt-4 flex gap-2">
              <ActionButton variant="quiet">Read</ActionButton>
              <ActionButton variant="secondary">Acknowledge</ActionButton>
            </div>
          </article>
        ))}
      </section>
      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Acknowledgement records</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Staff member</th>
                <th className="px-3 py-3">Policy title</th>
                <th className="px-3 py-3">Version</th>
                <th className="px-3 py-3">Date acknowledged</th>
                <th className="px-3 py-3">Declaration text</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {staffUsers.slice(0, 6).map((staff, index) => {
                const policy = policies[index % policies.length];

                return (
                  <tr key={`${staff.id}-${policy.id}`}>
                    <td className="px-3 py-3 font-semibold text-ink">{staff.fullName}</td>
                    <td className="px-3 py-3">{policy.title}</td>
                    <td className="px-3 py-3">{policy.version}</td>
                    <td className="px-3 py-3">{formatDate(`2026-05-${String(index + 1).padStart(2, "0")}`)}</td>
                    <td className="px-3 py-3 text-slate-600">I confirm I have read and understood this policy.</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
