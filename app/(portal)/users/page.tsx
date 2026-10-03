"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { staffUsers } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");

  const filteredUsers = useMemo(
    () =>
      staffUsers.filter((staff) => {
        const matchesSearch = [staff.fullName, staff.staffId, staff.email, staff.accessCode].join(" ").toLowerCase().includes(search.toLowerCase());
        const matchesStatus = status === "All" || staff.status === status;
        return matchesSearch && matchesStatus;
      }),
    [search, status]
  );

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton>Create new user</ActionButton>
            <ActionButton variant="secondary">Bulk upload</ActionButton>
          </>
        }
        description="Administrator and HR area for adding staff, browsing users, resetting access and assigning courses."
        eyebrow="User management"
        title="Browse users"
      />
      <section className="grid gap-4 xl:grid-cols-[0.75fr_1.25fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft" id="add">
          <h2 className="text-lg font-bold text-ink">Add user</h2>
          <form className="mt-4 grid gap-3">
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-ink">First name</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="Grace" />
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">Last name</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="Taylor" />
              </label>
            </div>
            {[
              ["Email", "grace.taylor.demo@lqcs.local"],
              ["Phone number", "07000 100011"],
              ["Staff ID", "LQCS-1011"],
              ["Access code", "DEMO-GT11"],
              ["Job title", "Care Worker"],
              ["Branch/site", "North London"],
              ["Line manager", "Daniel Morgan"]
            ].map(([label, value]) => (
              <label key={label}>
                <span className="text-sm font-semibold text-ink">{label}</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue={value} />
              </label>
            ))}
            <div className="grid gap-3 md:grid-cols-2">
              <label>
                <span className="text-sm font-semibold text-ink">Role type</span>
                <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm">
                  <option>Staff / Learner</option>
                  <option>Manager</option>
                  <option>HR / Training Coordinator</option>
                  <option>Super Admin</option>
                </select>
              </label>
              <label>
                <span className="text-sm font-semibold text-ink">Active status</span>
                <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm">
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
              </label>
            </div>
            <button className="focus-ring rounded-md bg-lqcs-blue px-3 py-2 text-sm font-bold text-white" type="button">
              Save user placeholder
            </button>
          </form>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-bold text-ink">User table</h2>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setSearch(event.target.value)} placeholder="Search users" value={search} />
              <select className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setStatus(event.target.value)} value={status}>
                <option>All</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {["Export copy", "Export CSV", "Export Excel", "Export PDF", "Print"].map((action) => (
              <button className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-xs font-bold text-ink" key={action} type="button">
                {action}
              </button>
            ))}
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[1080px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Select</th>
                  <th className="px-3 py-3">Full name</th>
                  <th className="px-3 py-3">Staff ID</th>
                  <th className="px-3 py-3">Email / access code</th>
                  <th className="px-3 py-3">Role type</th>
                  <th className="px-3 py-3">Job title</th>
                  <th className="px-3 py-3">Branch/site</th>
                  <th className="px-3 py-3">Created date</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Edit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-lqcs-line">
                {filteredUsers.map((staff) => (
                  <tr key={staff.id}>
                    <td className="px-3 py-3">
                      <input className="h-4 w-4 rounded border-lqcs-line" type="checkbox" />
                    </td>
                    <td className="px-3 py-3 font-semibold text-ink">{staff.fullName}</td>
                    <td className="px-3 py-3">{staff.staffId}</td>
                    <td className="px-3 py-3">
                      <p>{staff.email}</p>
                      <p className="text-xs font-semibold text-slate-500">{staff.accessCode}</p>
                    </td>
                    <td className="px-3 py-3">{staff.role}</td>
                    <td className="px-3 py-3">{staff.jobTitle}</td>
                    <td className="px-3 py-3">{staff.branch}</td>
                    <td className="px-3 py-3">{formatDate(staff.createdDate)}</td>
                    <td className="px-3 py-3">
                      <StatusPill status={staff.status} />
                    </td>
                    <td className="px-3 py-3">
                      <ActionButton variant="quiet">Edit</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </>
  );
}
