import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatCard } from "@/components/stat-card";
import { StatusPill } from "@/components/status-pill";
import { getCourseBySlug, getCourseSlidesBySlug } from "@/lib/demo-data";

interface CourseDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CourseDetailsPage({ params }: CourseDetailsPageProps) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  const requiresVideoDeclaration = getCourseSlidesBySlug(course.slug).some((slide) => Boolean(slide.videoUrl ?? slide.videoSrc));

  return (
    <>
      <PageHeader
        actions={
          <>
            <ActionButton href={`/course-player/${course.slug}`}>Open player</ActionButton>
            <ActionButton href={`/quiz/${course.slug}`} variant="secondary">
              Preview quiz
            </ActionButton>
          </>
        }
        description="Course metadata, assignment counts, certificate rules and the first admin course-builder placeholder from the blueprint."
        eyebrow="Course details"
        title={course.title}
      />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard detail={course.category} icon="LV" label="Level" tone="blue" value={course.accessLevel} />
        <StatCard detail={`${course.lessons} lesson screens`} icon="TM" label="Duration" tone="teal" value={course.duration} />
        <StatCard detail={`${course.allowedAttempts} allowed attempts`} icon="PM" label="Pass mark" tone="green" value={`${course.passMark}%`} />
        <StatCard detail={`${course.assignedStaff} assigned learners`} icon="CP" label="Completion" tone="amber" value={`${course.completionPercentage}%`} />
      </section>
      <section className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Course settings</h2>
          <dl className="mt-4 grid gap-3 text-sm">
            {[
              ["Provider", course.provider],
              ["Certificate validity", course.certificateValidity],
              ["Number of lessons", String(course.lessons)],
              ["Number of quiz questions", String(course.quizQuestions)],
              ["Assigned staff count", String(course.assignedStaff)],
              ["Course status", course.active ? "Active" : "Inactive"]
            ].map(([label, value]) => (
              <div className="flex items-center justify-between gap-4 rounded-md bg-slate-50 px-3 py-2" key={label}>
                <dt className="font-semibold text-slate-600">{label}</dt>
                <dd className="font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4">
            <StatusPill status={requiresVideoDeclaration ? "Certificate locked until video, quiz and declaration complete" : "Certificate blocked until pass"} />
          </div>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Course builder placeholder</h2>
          <p className="mt-1 text-sm text-slate-600">Admin users will create lessons and quizzes here without needing a developer.</p>
          <form className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-sm font-semibold text-ink">Lesson title</span>
              <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="Learning outcomes" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-ink">Lesson content</span>
              <textarea
                className="focus-ring mt-2 min-h-28 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm"
                defaultValue="By the end of this lesson, the learner will understand their responsibilities and reporting route."
              />
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Quiz question</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue="What should you do first?" />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink">Pass mark</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-2 text-sm" defaultValue={`${course.passMark}%`} />
              </label>
            </div>
            <button className="focus-ring w-fit rounded-md bg-lqcs-blue px-3 py-2 text-sm font-semibold text-white" type="button">
              Save course placeholder
            </button>
          </form>
        </article>
      </section>
      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <h2 className="text-lg font-bold text-ink">Lesson structure</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {["Title slide", "Video lesson", "Learning outcomes", "Text lesson", "Checklist", "Scenario", "Quiz intro", "Declaration", "Certificate trigger"].map((item) => (
            <div className="rounded-md border border-lqcs-line bg-slate-50 p-3" key={item}>
              <p className="text-sm font-bold text-ink">{item}</p>
              <p className="mt-1 text-xs leading-5 text-slate-600">Supported in course player</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
