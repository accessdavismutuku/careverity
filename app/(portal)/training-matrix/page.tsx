"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { courseAssignments, courses, staffUsers } from "@/lib/demo-data";
import { cx, formatDate } from "@/lib/format";
import type { Course } from "@/lib/types";

const statusFilters = ["All", "Completed", "Due Soon", "Expired", "Not Started", "In Progress", "Awaiting Manager Approval", "Not Applicable"];
const dueFilters = ["Any due date", "30 days", "60 days", "90 days"];
const allCoursesFilter = "All courses";
const demoToday = new Date("2026-05-12T00:00:00.000Z");

function isAssignmentDueWithin(dueDate: string, dueWindow: string) {
  if (dueWindow === "Any due date") {
    return true;
  }

  const days = Number.parseInt(dueWindow, 10);
  const due = new Date(`${dueDate}T00:00:00.000Z`);
  const end = new Date(demoToday);
  end.setUTCDate(end.getUTCDate() + days);

  return due >= demoToday && due <= end;
}

export default function TrainingMatrixPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("All");
  const [branch, setBranch] = useState("All");
  const [courseSlug, setCourseSlug] = useState(allCoursesFilter);
  const [status, setStatus] = useState("All");
  const [dueWindow, setDueWindow] = useState("Any due date");
  const matrixCourses = useMemo(() => {
    const assignmentCourseSlugs = Array.from(new Set(courseAssignments.map((assignment) => assignment.courseSlug)));
    return assignmentCourseSlugs.map((slug) => courses.find((course) => course.slug === slug)).filter((course): course is Course => Boolean(course));
  }, []);
  const visibleMatrixCourses = useMemo(() => {
    if (courseSlug === allCoursesFilter) {
      return matrixCourses;
    }

    return matrixCourses.filter((course) => course.slug === courseSlug);
  }, [courseSlug, matrixCourses]);
  const assignmentLookup = useMemo(() => {
    return new Map(courseAssignments.map((assignment) => [`${assignment.staffId}:${assignment.courseSlug}`, assignment]));
  }, []);
  const matrixGridStyle = {
    gridTemplateColumns: `220px repeat(${visibleMatrixCourses.length}, minmax(128px, 1fr))`
  };
  const roles = ["All", ...Array.from(new Set(staffUsers.map((staff) => staff.jobTitle)))];
  const branches = ["All", ...Array.from(new Set(staffUsers.map((staff) => staff.branch)))];

  const filteredStaff = useMemo(() => {
    return staffUsers.filter((staff) => {
      const staffAssignments = courseAssignments.filter(
        (assignment) => assignment.staffId === staff.id && (courseSlug === allCoursesFilter || assignment.courseSlug === courseSlug)
      );
      const matchesSearch = staff.fullName.toLowerCase().includes(search.toLowerCase());
      const matchesRole = role === "All" || staff.jobTitle === role;
      const matchesBranch = branch === "All" || staff.branch === branch;
      const matchesCourse = courseSlug === allCoursesFilter || staffAssignments.length > 0;
      const matchesStatus = status === "All" || staffAssignments.some((assignment) => assignment.status === status);
      const matchesDueWindow = staffAssignments.some((assignment) => isAssignmentDueWithin(assignment.dueDate, dueWindow));

      return matchesSearch && matchesRole && matchesBranch && matchesCourse && matchesStatus && matchesDueWindow;
    });
  }, [branch, courseSlug, dueWindow, role, search, status]);

  const visibleAssignments = filteredStaff.flatMap((staff) =>
    courseAssignments.filter((assignment) => assignment.staffId === staff.id && (courseSlug === allCoursesFilter || assignment.courseSlug === courseSlug))
  );
  const completedCount = visibleAssignments.filter((assignment) => assignment.status === "Completed").length;
  const riskCount = visibleAssignments.filter((assignment) => assignment.status === "Expired" || assignment.status === "Due Soon").length;

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton variant="secondary">Export CSV</ActionButton>
            <ActionButton variant="secondary">Export Excel</ActionButton>
            <ActionButton variant="secondary">Export PDF</ActionButton>
          </>
        }
        description="Rows and columns are generated from the demo course assignment records, mirroring the Supabase course_assignments table shape."
        eyebrow="Compliance management"
        title="Live training matrix"
      />
      <section className="mb-4 grid gap-3 md:grid-cols-3">
        <div className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase text-slate-500">Visible assignments</p>
          <p className="mt-2 text-2xl font-black text-navy">{visibleAssignments.length}</p>
        </div>
        <div className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase text-slate-500">Completed</p>
          <p className="mt-2 text-2xl font-black text-care-green">{completedCount}</p>
        </div>
        <div className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <p className="text-xs font-bold uppercase text-slate-500">Due soon / expired</p>
          <p className="mt-2 text-2xl font-black text-care-amber">{riskCount}</p>
        </div>
      </section>
      <section className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-6">
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Staff name</span>
            <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setSearch(event.target.value)} placeholder="Search staff" value={search} />
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Role</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setRole(event.target.value)} value={role}>
              {roles.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Branch/site</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setBranch(event.target.value)} value={branch}>
              {branches.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Course</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setCourseSlug(event.target.value)} value={courseSlug}>
              <option>{allCoursesFilter}</option>
              {matrixCourses.map((course) => (
                <option key={course.slug} value={course.slug}>
                  {course.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Status</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setStatus(event.target.value)} value={status}>
              {statusFilters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label>
            <span className="text-xs font-bold uppercase text-slate-500">Due window</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setDueWindow(event.target.value)} value={dueWindow}>
              {dueFilters.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
        </div>
      </section>
      <section className="mt-6 grid gap-4 lg:hidden">
        {filteredStaff.map((staff) => (
          <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft" key={staff.id}>
            <div>
              <h2 className="text-base font-bold text-ink">{staff.fullName}</h2>
              <p className="mt-1 text-sm text-slate-500">
                {staff.jobTitle} - {staff.branch}
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {visibleMatrixCourses.map((course) => {
                const assignment = assignmentLookup.get(`${staff.id}:${course.slug}`);

                return (
                  <div className={cx("rounded-md border border-lqcs-line p-3", assignment?.status === "Expired" && "bg-red-50/50")} key={`${staff.id}-${course.slug}`}>
                    <p className="text-sm font-bold text-ink">{course.title}</p>
                    <div className="mt-2">
                      <StatusPill compact status={assignment?.status ?? "Not Applicable"} />
                    </div>
                    {assignment?.dueDate ? <p className="mt-2 text-xs text-slate-500">Due {formatDate(assignment.dueDate)}</p> : null}
                    {assignment?.expiryDate ? <p className="mt-1 text-xs text-slate-500">Expires {formatDate(assignment.expiryDate)}</p> : null}
                  </div>
                );
              })}
            </div>
          </article>
        ))}
        {filteredStaff.length === 0 ? (
          <div className="rounded-lg border border-dashed border-lqcs-line bg-white p-6 text-sm font-semibold text-slate-600">
            No demo assignment records match these filters.
          </div>
        ) : null}
      </section>
      <section className="mt-6 hidden overflow-x-auto rounded-lg border border-lqcs-line bg-white shadow-soft lg:block">
        <div className="grid min-w-[980px] border-b border-lqcs-line bg-slate-50 text-xs font-bold uppercase text-slate-500" style={matrixGridStyle}>
          <div className="sticky left-0 z-[1] border-r border-lqcs-line bg-slate-50 px-3 py-3">Staff member</div>
          {visibleMatrixCourses.map((course) => (
            <div className="border-r border-lqcs-line px-3 py-3" key={course.id}>
              {course.title}
            </div>
          ))}
        </div>
        <div className="min-w-[980px] divide-y divide-lqcs-line">
          {filteredStaff.map((staff) => (
            <div className="grid" key={staff.id} style={matrixGridStyle}>
              <div className="sticky left-0 z-[1] border-r border-lqcs-line bg-white px-3 py-3">
                <p className="text-sm font-bold text-ink">{staff.fullName}</p>
                <p className="mt-1 text-xs text-slate-500">
                  {staff.jobTitle} - {staff.branch}
                </p>
              </div>
              {visibleMatrixCourses.map((course) => {
                const assignment = assignmentLookup.get(`${staff.id}:${course.slug}`);

                return (
                  <div className={cx("border-r border-lqcs-line px-3 py-3", assignment?.status === "Expired" && "bg-red-50/40")} key={`${staff.id}-${course.slug}`}>
                    <StatusPill compact status={assignment?.status ?? "Not Applicable"} />
                    {assignment?.dueDate ? <p className="mt-2 text-xs text-slate-500">Due {formatDate(assignment.dueDate)}</p> : null}
                    {assignment?.expiryDate ? <p className="mt-1 text-xs text-slate-500">Expires {formatDate(assignment.expiryDate)}</p> : null}
                  </div>
                );
              })}
            </div>
          ))}
          {filteredStaff.length === 0 ? (
            <div className="px-3 py-6 text-sm font-semibold text-slate-600">No demo assignment records match these filters.</div>
          ) : null}
        </div>
      </section>
    </>
  );
}
