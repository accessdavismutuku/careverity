"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import { getCourseBySlug, getCourseSlidesBySlug } from "@/lib/demo-data";
import { cx } from "@/lib/format";
import { getLessonCompletionStorageKey, getVideoDeclarationStorageKey, VIDEO_DECLARATION_TEXT } from "@/lib/training-progress";

interface CoursePlayerPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default function CoursePlayerPage({ params }: CoursePlayerPageProps) {
  const { slug } = use(params);
  const course = getCourseBySlug(slug);
  const slides = getCourseSlidesBySlug(slug);
  const requiresVideoDeclaration = useMemo(() => slides.some((slide) => Boolean(slide.videoUrl ?? slide.videoSrc)), [slides]);
  const declarationStorageKey = useMemo(() => getVideoDeclarationStorageKey(course.slug), [course.slug]);
  const lessonCompletionStorageKey = useMemo(() => getLessonCompletionStorageKey(course.slug), [course.slug]);
  const [started, setStarted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoDeclarationComplete, setVideoDeclarationComplete] = useState(false);
  const [visitedSlideIds, setVisitedSlideIds] = useState<Set<string>>(() => new Set(slides[0]?.id ? [slides[0].id] : []));
  const activeSlide = slides[activeIndex];
  const activeSlideVideoUrl = activeSlide.videoUrl ?? activeSlide.videoSrc;
  const progress = useMemo(() => Math.round(((activeIndex + 1) / slides.length) * 100), [activeIndex, slides.length]);
  const allLessonsComplete = visitedSlideIds.size === slides.length;
  const canContinueToQuiz = allLessonsComplete && (!requiresVideoDeclaration || videoDeclarationComplete);

  useEffect(() => {
    if (!requiresVideoDeclaration) {
      setVideoDeclarationComplete(true);
      return;
    }

    setVideoDeclarationComplete(window.localStorage.getItem(declarationStorageKey) === "true");
  }, [declarationStorageKey, requiresVideoDeclaration]);

  useEffect(() => {
    if (allLessonsComplete) {
      window.localStorage.setItem(lessonCompletionStorageKey, "true");
    }
  }, [allLessonsComplete, lessonCompletionStorageKey]);

  function handleVideoDeclarationChange(checked: boolean) {
    setVideoDeclarationComplete(checked);
    window.localStorage.setItem(declarationStorageKey, checked ? "true" : "false");
  }

  function goToSlide(index: number) {
    const nextIndex = Math.min(Math.max(index, 0), slides.length - 1);
    setActiveIndex(nextIndex);
    setVisitedSlideIds((current) => {
      const next = new Set(current);
      if (slides[nextIndex]) {
        next.add(slides[nextIndex].id);
      }
      return next;
    });
  }

  return (
    <>
      <PageHeader
        description="Slide-based learner experience with begin, progress tracking, course menu, previous/next controls, exit and quiz handoff."
        eyebrow="Course player"
        title={course.title}
      />
      <section className="overflow-hidden rounded-lg border border-lqcs-line bg-white shadow-soft">
        <div className="border-b border-lqcs-line bg-navy p-4 text-white">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lqcs-mint">LQCS course view</p>
              <h1 className="mt-1 text-2xl font-bold">{course.title}</h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="focus-ring rounded-md border border-white/20 px-3 py-2 text-sm font-semibold text-white" type="button">
                Course menu
              </button>
              <Link className="focus-ring rounded-md bg-white px-3 py-2 text-sm font-semibold text-navy" href="/learner-dashboard">
                Exit
              </Link>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-white/70">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-white/20">
              <div className="h-2 rounded-full bg-lqcs-teal" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>
        {!started ? (
          <div className="grid gap-6 p-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-lg bg-lqcs-sky p-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lqcs-blue">Ready to begin</p>
              <h2 className="mt-3 text-3xl font-bold text-ink">{course.title}</h2>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">
                This demo player supports title slides, outcomes, text lessons, checklists, scenarios, quiz introductions and completion tracking.
              </p>
              <button
                className="focus-ring mt-6 rounded-md bg-lqcs-blue px-4 py-3 text-sm font-bold text-white"
                onClick={() => {
                  setStarted(true);
                  goToSlide(0);
                }}
                type="button"
              >
                Begin course
              </button>
            </div>
            <aside className="rounded-lg border border-lqcs-line p-4">
              <h3 className="text-base font-bold text-ink">Course rules</h3>
              <div className="mt-4 space-y-3">
                <StatusPill status={`${course.passMark}% pass mark`} />
                <StatusPill status={`${course.allowedAttempts} attempts`} />
                {requiresVideoDeclaration ? <StatusPill status="Video declaration required" /> : <StatusPill status="Declaration required" />}
                <StatusPill status="All lesson screens required" />
                <StatusPill status="Certificate locked" />
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid min-h-[520px] gap-0 lg:grid-cols-[260px_1fr]">
            <aside className="border-b border-lqcs-line bg-slate-50 p-4 lg:border-b-0 lg:border-r">
              <p className="text-xs font-bold uppercase text-slate-500">Lesson slides</p>
              <div className="mt-3 space-y-2">
                {slides.map((slide, index) => (
                  <button
                    className={cx(
                      "focus-ring w-full rounded-md px-3 py-2 text-left text-sm font-semibold",
                      activeIndex === index ? "bg-navy text-white" : "bg-white text-slate-700"
                    )}
                    key={slide.id}
                    onClick={() => goToSlide(index)}
                    type="button"
                  >
                    {index + 1}. {slide.type}
                  </button>
                ))}
              </div>
            </aside>
            <div className="flex flex-col">
              <article className="flex-1 p-5 md:p-8">
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  <StatusPill status={activeSlide.type} />
                  <StatusPill status={`Slide ${activeIndex + 1} of ${slides.length}`} />
                  <StatusPill status={`${visitedSlideIds.size}/${slides.length} lessons viewed`} />
                  {requiresVideoDeclaration ? <StatusPill status={videoDeclarationComplete ? "Declaration complete" : "Declaration required"} /> : null}
                </div>
                <div className="max-w-4xl">
                  <h2 className="text-3xl font-bold text-ink">{activeSlide.title}</h2>
                  <p className="mt-5 text-lg leading-8 text-slate-700">{activeSlide.body}</p>
                  {activeSlideVideoUrl ? (
                    <div className="mt-6 overflow-hidden rounded-lg border border-lqcs-line bg-slate-950 shadow-soft">
                      <video aria-label={activeSlide.title} className="aspect-video w-full bg-black object-contain" controls preload="metadata" src={activeSlideVideoUrl}>
                        <p>Your browser does not support embedded training videos.</p>
                      </video>
                      {activeSlide.videoCaption ? <p className="bg-white px-4 py-3 text-xs font-semibold text-slate-500">{activeSlide.videoCaption}</p> : null}
                    </div>
                  ) : null}
                  {activeSlideVideoUrl ? (
                    <div className="mt-4 rounded-lg border border-lqcs-teal/30 bg-lqcs-sky p-4">
                      <label className="flex cursor-pointer items-start gap-3 text-sm font-semibold leading-6 text-ink">
                        <input
                          checked={videoDeclarationComplete}
                          className="mt-1 h-4 w-4 shrink-0 rounded border-lqcs-line"
                          onChange={(event) => handleVideoDeclarationChange(event.target.checked)}
                          type="checkbox"
                        />
                        <span>{VIDEO_DECLARATION_TEXT}</span>
                      </label>
                      <p className="mt-2 pl-7 text-xs font-medium text-slate-600">
                        This declaration is required before the quiz and certificate trigger can be unlocked.
                      </p>
                    </div>
                  ) : null}
                  {activeSlide.bullets ? (
                    <ul className="mt-6 grid gap-3 md:grid-cols-2">
                      {activeSlide.bullets.map((bullet) => (
                        <li className="rounded-lg border border-lqcs-line bg-slate-50 p-4 text-sm font-semibold leading-6 text-ink" key={bullet}>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  <div className="mt-8 grid max-w-2xl gap-3 md:grid-cols-3">
                    {["Read", "Reflect", "Record"].map((item) => (
                      <div className="rounded-lg border border-lqcs-line bg-white p-4" key={item}>
                        <p className="text-sm font-bold text-ink">{item}</p>
                        <div className="mt-3 h-2 rounded-full bg-lqcs-mint">
                          <div className="h-2 rounded-full bg-lqcs-teal" style={{ width: item === "Read" ? "90%" : item === "Reflect" ? "65%" : "45%" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
              <footer className="flex flex-col gap-3 border-t border-lqcs-line p-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="focus-ring rounded-md border border-lqcs-line px-4 py-2 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={activeIndex === 0}
                  onClick={() => goToSlide(activeIndex - 1)}
                  type="button"
                >
                  Previous
                </button>
                {activeIndex === slides.length - 1 ? (
                  canContinueToQuiz ? (
                    <Link className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-center text-sm font-bold text-white" href={`/quiz/${course.slug}`}>
                      Continue to quiz
                    </Link>
                  ) : (
                    <div className="flex flex-col items-start gap-2 sm:items-end">
                      <p className="text-xs font-semibold text-care-amber">
                        {!allLessonsComplete ? "Visit every lesson screen before continuing to the quiz." : "Tick the video declaration before continuing to the quiz."}
                      </p>
                      <button className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white opacity-50" disabled type="button">
                        Continue to quiz
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white"
                    onClick={() => goToSlide(activeIndex + 1)}
                    type="button"
                  >
                    Next
                  </button>
                )}
              </footer>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
