"use client";

import { useMemo, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { CourseCard } from "@/components/course-card";
import { PageHeader } from "@/components/page-header";
import { courses } from "@/lib/demo-data";
import { cx } from "@/lib/format";

const categories = ["All", ...Array.from(new Set(courses.map((course) => course.category)))];
const levels = ["All", "Beginner", "Intermediate", "Advanced", "Mandatory", "Specialist", "Manager-only"];

export default function CourseLibraryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [level, setLevel] = useState("All");
  const [scope, setScope] = useState("All");
  const [activeOnly, setActiveOnly] = useState(true);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesSearch = course.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || course.category === category;
      const matchesLevel = level === "All" || course.accessLevel === level;
      const matchesScope = scope === "All" || (scope === "Mandatory" ? course.accessLevel === "Mandatory" : course.accessLevel === "Specialist");
      const matchesActive = !activeOnly || course.active;

      return matchesSearch && matchesCategory && matchesLevel && matchesScope && matchesActive;
    });
  }, [activeOnly, category, level, scope, search]);

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton href="/courses/safeguarding-adults">Course details</ActionButton>
            <ActionButton variant="secondary">Create course</ActionButton>
          </>
        }
        description="Search, filter and assign CareVerity Training Academy courses. Course cards show category, access level, duration, active status and certificate validity."
        eyebrow="Course library"
        title="E-learning course management"
      />
      <section className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="grid gap-3 lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]">
          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">Search course title</span>
            <input
              className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm"
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by course title"
              value={search}
            />
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">Category</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setCategory(event.target.value)} value={category}>
              {categories.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">Access level</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setLevel(event.target.value)} value={level}>
              {levels.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-bold uppercase text-slate-500">Mandatory / specialist</span>
            <select className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" onChange={(event) => setScope(event.target.value)} value={scope}>
              {["All", "Mandatory", "Specialist"].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="mt-6 flex items-center gap-2 text-sm font-semibold text-ink">
            <input checked={activeOnly} className="h-4 w-4 rounded border-lqcs-line" onChange={(event) => setActiveOnly(event.target.checked)} type="checkbox" />
            Active only
          </label>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {["Grid view", `${courses.length} demo courses`, "Original course catalogue", "No external course content"].map((badge, index) => (
            <span className={cx("rounded-md px-2.5 py-1 text-xs font-bold", index === 0 ? "bg-lqcs-sky text-lqcs-blue" : "bg-slate-100 text-slate-600")} key={badge}>
              {badge}
            </span>
          ))}
        </div>
      </section>
      <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <CourseCard course={course} key={course.id} />
        ))}
      </section>
    </>
  );
}
