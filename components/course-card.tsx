import Link from "next/link";
import type { CSSProperties } from "react";
import type { Course } from "@/lib/types";
import { StatusPill } from "./status-pill";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const style = {
    "--course-from": course.colorFrom,
    "--course-to": course.colorTo
  } as CSSProperties;

  return (
    <article className="overflow-hidden rounded-lg border border-lqcs-line bg-white shadow-soft">
      <div className="course-art flex h-28 items-end justify-between p-4 text-white" style={style}>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/80">{course.category}</p>
          <p className="mt-1 max-w-[13rem] text-lg font-bold leading-6">{course.title}</p>
        </div>
        <div className="grid h-12 w-12 place-items-center rounded-md bg-white/20 text-sm font-bold ring-1 ring-white/30">
          {course.title
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </div>
      </div>
      <div className="space-y-4 p-4">
        <div className="flex flex-wrap gap-2">
          <StatusPill status={course.accessLevel} compact />
          <StatusPill status={course.active ? "Active" : "Inactive"} compact />
        </div>
        <p className="min-h-12 text-sm leading-6 text-slate-600">{course.summary}</p>
        <dl className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Duration</dt>
            <dd className="mt-1 font-semibold text-ink">{course.duration}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase text-slate-500">Validity</dt>
            <dd className="mt-1 font-semibold text-ink">{course.certificateValidity}</dd>
          </div>
        </dl>
        <div className="flex gap-2">
          <Link
            className="focus-ring inline-flex flex-1 items-center justify-center rounded-md bg-navy px-3 py-2 text-sm font-semibold text-white"
            href={`/courses/${course.slug}`}
          >
            View details
          </Link>
          <button className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm font-semibold text-ink" type="button">
            Assign
          </button>
        </div>
      </div>
    </article>
  );
}
