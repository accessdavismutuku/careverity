import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { staffUsers } from "@/lib/demo-data";

export default function ProfilePage() {
  const user = staffUsers[4];

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton>Save profile</ActionButton>
            <ActionButton variant="secondary">Reset password</ActionButton>
          </>
        }
        description="Profile and account settings include access code, logo upload placeholders, notification preferences and administrator security indicators."
        eyebrow="My profile"
        title="Account settings"
      />
      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <div className="flex items-center gap-4">
            <div className="grid h-20 w-20 place-items-center rounded-lg bg-navy text-xl font-black text-white">MT</div>
            <div>
              <h2 className="text-xl font-bold text-ink">{user.fullName}</h2>
              <p className="mt-1 text-sm text-slate-600">{user.jobTitle}</p>
              <div className="mt-2 flex gap-2">
                <StatusPill status="Two-factor enabled" />
                <StatusPill status={user.status} />
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm">
            {[
              ["Staff ID", user.staffId],
              ["Access code", user.accessCode],
              ["Branch/location", user.branch],
              ["Role type", user.role],
              ["Last login", user.lastLogin]
            ].map(([label, value]) => (
              <div className="flex justify-between gap-4 rounded-md bg-slate-50 px-3 py-2" key={label}>
                <span className="font-semibold text-slate-500">{label}</span>
                <span className="font-bold text-ink">{value}</span>
              </div>
            ))}
          </div>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Profile fields</h2>
          <form className="mt-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-ink">Profile image upload</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" type="file" />
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">Company logo upload</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" type="file" />
              </label>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                ["Email address", user.email],
                ["First name", user.firstName],
                ["Last name", user.lastName],
                ["Phone number", user.phone],
                ["Job title", user.jobTitle],
                ["Site / branch", user.branch]
              ].map(([label, value]) => (
                <label key={label}>
                  <span className="text-sm font-semibold text-ink">{label}</span>
                  <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue={value} />
                </label>
              ))}
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                "Learner certificate access",
                "Email manager when learner completes course",
                "Allow course email",
                "Monthly reminder summary"
              ].map((setting) => (
                <label className="flex items-center gap-3 rounded-md bg-slate-50 p-3 text-sm font-semibold text-ink" key={setting}>
                  <input className="h-4 w-4 rounded border-lqcs-line" defaultChecked type="checkbox" />
                  {setting}
                </label>
              ))}
            </div>
            <label>
              <span className="text-sm font-semibold text-ink">Course reminder frequency</span>
              <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm">
                <option>Weekly</option>
                <option>Daily</option>
                <option>Monthly</option>
              </select>
            </label>
          </form>
        </article>
      </section>
    </>
  );
}
