"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { QuizQuestionCard, type QuizVoiceMode } from "@/components/quiz-question-card";
import { StatusPill } from "@/components/status-pill";
import { useSpeechSynthesis } from "@/hooks/use-speech-synthesis";
import { getCourseBySlug, getCourseSlidesBySlug, getQuizQuestionsBySlug, staffUsers } from "@/lib/demo-data";
import { cx } from "@/lib/format";
import {
  calculateQuizScore,
  getQuizAttemptCountStorageKey,
  getQuizAttemptHistoryStorageKey,
  getLessonCompletionStorageKey,
  getQuizPassStorageKey,
  getQuizScoreStorageKey,
  getVideoDeclarationStorageKey,
  isCertificateEligible
} from "@/lib/training-progress";

interface QuizPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const optionLabels = ["A", "B", "C", "D", "E", "F"];

export default function QuizPage({ params }: QuizPageProps) {
  const { slug } = use(params);
  const course = getCourseBySlug(slug);
  const questions = getQuizQuestionsBySlug(slug);
  const requiresVideoDeclaration = getCourseSlidesBySlug(slug).some((slide) => Boolean(slide.videoUrl ?? slide.videoSrc));
  const learner = staffUsers[0];
  const { speak, stop, isSpeaking, isSupported, voices } = useSpeechSynthesis();
  const [activeIndex, setActiveIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submittedScore, setSubmittedScore] = useState<number | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [videoDeclarationComplete, setVideoDeclarationComplete] = useState(false);
  const [lessonsComplete, setLessonsComplete] = useState(false);
  const [autoReadEnabled, setAutoReadEnabled] = useState(false);
  const [voiceMode, setVoiceMode] = useState<QuizVoiceMode>("browser");
  const [selectedVoiceURI, setSelectedVoiceURI] = useState("");
  const [voiceRate, setVoiceRate] = useState(0.92);
  const [voicePitch, setVoicePitch] = useState(1);
  const [voiceVolume, setVoiceVolume] = useState(1);
  const activeQuestion = questions[activeIndex];
  const answeredCount = Object.keys(answers).length;
  const readAloudText = useMemo(
    () =>
      [
        `Question ${activeIndex + 1}.`,
        activeQuestion.text,
        ...activeQuestion.options.map((option, index) => `Option ${optionLabels[index] ?? index + 1}. ${option}.`)
      ].join(" "),
    [activeIndex, activeQuestion]
  );
  const canUseBrowserVoice = voiceMode === "browser" && isSupported;
  const speechOptions = useMemo(
    () => ({
      pitch: voicePitch,
      rate: voiceRate,
      voiceURI: selectedVoiceURI,
      volume: voiceVolume
    }),
    [selectedVoiceURI, voicePitch, voiceRate, voiceVolume]
  );
  const liveScore = useMemo(() => calculateQuizScore({ answers, questions }), [answers, questions]);
  const resultScore = submittedScore ?? liveScore;
  const passed = submitted && resultScore >= course.passMark;
  const currentAttemptNumber = submitted ? Math.max(attemptCount, 1) : Math.min(attemptCount + 1, course.allowedAttempts);
  const attemptsRemaining = Math.max(course.allowedAttempts - attemptCount, 0);
  const attemptLimitReached = !submitted && attemptCount >= course.allowedAttempts;
  const retakeAvailable = submitted && !passed && attemptCount < course.allowedAttempts;
  const certificateUnlocked = isCertificateEligible({
    lessonsComplete,
    quizPassed: passed,
    requiresVideoDeclaration,
    videoDeclarationComplete
  });

  useEffect(() => {
    const storedAttemptCount = Number.parseInt(window.localStorage.getItem(getQuizAttemptCountStorageKey(course.slug)) ?? "0", 10);
    const safeAttemptCount = Number.isFinite(storedAttemptCount) ? Math.min(storedAttemptCount, course.allowedAttempts) : 0;
    const storedScore = window.localStorage.getItem(getQuizScoreStorageKey(course.slug));
    const storedPassed = window.localStorage.getItem(getQuizPassStorageKey(course.slug)) === "true";

    setAttemptCount(safeAttemptCount);
    if (storedPassed || (safeAttemptCount >= course.allowedAttempts && storedScore !== null)) {
      const parsedStoredScore = storedScore !== null ? Number.parseInt(storedScore, 10) : course.passMark;
      setSubmitted(true);
      setSubmittedScore(Number.isFinite(parsedStoredScore) ? parsedStoredScore : storedPassed ? course.passMark : 0);
    }

    setLessonsComplete(window.localStorage.getItem(getLessonCompletionStorageKey(course.slug)) === "true");

    if (!requiresVideoDeclaration) {
      setVideoDeclarationComplete(true);
      return;
    }

    setVideoDeclarationComplete(window.localStorage.getItem(getVideoDeclarationStorageKey(course.slug)) === "true");
  }, [course.allowedAttempts, course.passMark, course.slug, requiresVideoDeclaration]);

  useEffect(() => {
    stop();

    if (autoReadEnabled && canUseBrowserVoice && !submitted) {
      speak(readAloudText, speechOptions);
    }

    return () => stop();
  }, [activeIndex, autoReadEnabled, canUseBrowserVoice, readAloudText, speak, speechOptions, stop, submitted]);

  function handleVoiceModeChange(mode: QuizVoiceMode) {
    stop();
    setVoiceMode(mode);

    if (mode !== "browser") {
      setAutoReadEnabled(false);
    }
  }

  function handleSubmitAssessment() {
    stop();
    const assessmentScore = liveScore;
    const nextAttemptCount = Math.min(attemptCount + 1, course.allowedAttempts);
    const didPass = assessmentScore >= course.passMark;
    const certificateIssued = isCertificateEligible({
      lessonsComplete,
      quizPassed: didPass,
      requiresVideoDeclaration,
      videoDeclarationComplete
    });
    const historyKey = getQuizAttemptHistoryStorageKey(course.slug);
    let previousAttempts: unknown[] = [];

    try {
      previousAttempts = JSON.parse(window.localStorage.getItem(historyKey) ?? "[]");
      if (!Array.isArray(previousAttempts)) {
        previousAttempts = [];
      }
    } catch {
      previousAttempts = [];
    }

    window.localStorage.setItem(
      historyKey,
      JSON.stringify([
        ...previousAttempts,
        {
          answers,
          attemptNumber: nextAttemptCount,
          certificateIssued,
          completedAt: new Date().toISOString(),
          outcome: didPass ? "Passed" : "Failed",
          score: assessmentScore
        }
      ])
    );
    window.localStorage.setItem(getQuizAttemptCountStorageKey(course.slug), String(nextAttemptCount));
    window.localStorage.setItem(getQuizScoreStorageKey(course.slug), String(assessmentScore));
    window.localStorage.setItem(getQuizPassStorageKey(course.slug), didPass ? "true" : "false");
    setAttemptCount(nextAttemptCount);
    setSubmittedScore(assessmentScore);
    setSubmitted(true);
  }

  function handleRetakeQuiz() {
    stop();
    setActiveIndex(0);
    setAnswers({});
    setSubmitted(false);
    setSubmittedScore(null);
  }

  return (
    <>
      <PageHeader
        description="Multiple-choice quiz engine with progress, attempt record, pass mark calculation and certificate release rule."
        eyebrow="Quiz engine"
        title={`${course.title} assessment`}
      />
      <section className="rounded-lg border border-lqcs-line bg-white shadow-soft">
        <div className="border-b border-lqcs-line p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-bold text-ink">Demo learner: {learner.fullName}</p>
              <p className="mt-1 text-sm text-slate-600">
                Attempt {currentAttemptNumber} of {course.allowedAttempts} - {course.passMark}% pass mark - certificate blocked until video, declaration and quiz are complete
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill status={`${answeredCount}/${questions.length} answered`} />
              <StatusPill status={`${attemptsRemaining} attempts remaining`} />
              <StatusPill status={lessonsComplete ? "Lessons complete" : "Lessons incomplete"} />
              {requiresVideoDeclaration ? <StatusPill status={videoDeclarationComplete ? "Video declaration complete" : "Video declaration missing"} /> : null}
              <StatusPill status={submitted ? (passed ? "Passed" : "Failed") : attemptLimitReached ? "Attempts used" : "In Progress"} />
            </div>
          </div>
          <div className="mt-4 h-2 rounded-full bg-slate-100">
            <div className="h-2 rounded-full bg-lqcs-blue" style={{ width: `${Math.round((answeredCount / questions.length) * 100)}%` }} />
          </div>
        </div>
        {!submitted && attemptLimitReached ? (
          <div className="p-5 md:p-8">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <StatusPill status="Attempts used" />
              <h2 className="mt-4 text-2xl font-bold text-ink">Quiz attempts need manager review</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                This demo learner has used the allowed attempts for {course.title}. In the live system, this would create an audit trail and notify a manager before
                reassignment, supervision or a practical competency check.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Link className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" href="/reports">
                  View failed quiz report
                </Link>
                <Link className="focus-ring rounded-md border border-lqcs-line bg-white px-4 py-2 text-sm font-bold text-ink" href="/learner-dashboard">
                  Return to learner dashboard
                </Link>
              </div>
            </div>
          </div>
        ) : !submitted ? (
          <div className="grid gap-0 lg:grid-cols-[1fr_260px]">
            <article className="p-5 md:p-8">
              <QuizQuestionCard
                autoReadEnabled={autoReadEnabled}
                canUseBrowserVoice={canUseBrowserVoice}
                isSpeaking={isSpeaking}
                isSupported={isSupported}
                onAutoReadChange={setAutoReadEnabled}
                onPitchChange={setVoicePitch}
                onRateChange={setVoiceRate}
                onReadAloud={() => speak(readAloudText, speechOptions)}
                onSelectAnswer={(answerIndex) => setAnswers((current) => ({ ...current, [activeQuestion.id]: answerIndex }))}
                onStopReading={stop}
                onVoiceChange={setSelectedVoiceURI}
                onVoiceModeChange={handleVoiceModeChange}
                onVolumeChange={setVoiceVolume}
                pitch={voicePitch}
                question={activeQuestion}
                questionNumber={activeIndex + 1}
                rate={voiceRate}
                selectedAnswer={answers[activeQuestion.id]}
                selectedVoiceURI={selectedVoiceURI}
                voiceMode={voiceMode}
                voiceOptions={voices.map((voice) => ({ lang: voice.lang, name: voice.name, voiceURI: voice.voiceURI }))}
                volume={voiceVolume}
              />
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <button
                  className="focus-ring rounded-md border border-lqcs-line px-4 py-2 text-sm font-bold text-ink disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={activeIndex === 0}
                  onClick={() => setActiveIndex((index) => Math.max(index - 1, 0))}
                  type="button"
                >
                  Previous
                </button>
                {activeIndex === questions.length - 1 ? (
                  <button
                    className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    disabled={answeredCount < questions.length}
                    onClick={handleSubmitAssessment}
                    type="button"
                  >
                    Submit assessment
                  </button>
                ) : (
                  <button className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" onClick={() => setActiveIndex((index) => Math.min(index + 1, questions.length - 1))} type="button">
                    Next
                  </button>
                )}
              </div>
            </article>
            <aside className="border-t border-lqcs-line bg-slate-50 p-4 lg:border-l lg:border-t-0">
              <p className="text-xs font-bold uppercase text-slate-500">Question map</p>
              <div className="mt-3 grid grid-cols-5 gap-2 lg:grid-cols-3">
                {questions.map((question, index) => (
                  <button
                    className={cx(
                      "focus-ring grid h-10 place-items-center rounded-md text-sm font-bold",
                      activeIndex === index && "bg-navy text-white",
                      activeIndex !== index && answers[question.id] !== undefined && "bg-lqcs-mint text-lqcs-teal",
                      activeIndex !== index && answers[question.id] === undefined && "bg-white text-slate-600"
                    )}
                    key={question.id}
                    onClick={() => setActiveIndex(index)}
                    type="button"
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        ) : (
          <div className="p-5 md:p-8">
            <div className={cx("rounded-lg border p-6", passed ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50")}>
              <StatusPill status={passed ? "Passed" : "Failed"} />
              <h2 className="mt-4 text-3xl font-bold text-ink">Score: {resultScore}%</h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
                {certificateUnlocked
                  ? "The certificate trigger is now unlocked because all lesson screens, the video declaration and quiz pass are complete."
                  : passed
                    ? "The quiz has been passed, but the certificate remains locked until all lesson screens and the required video declaration are complete."
                    : "The learner can retake if attempts remain. A failed attempt record is saved for manager review and supervision planning."}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {certificateUnlocked ? (
                  <Link className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" href="/certificates">
                    Generate certificate
                  </Link>
                ) : passed ? (
                  <Link className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" href={`/course-player/${course.slug}`}>
                    Complete video declaration
                  </Link>
                ) : retakeAvailable ? (
                  <button className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" onClick={handleRetakeQuiz} type="button">
                    Retake quiz
                  </button>
                ) : (
                  <Link className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" href="/reports">
                    Manager review required
                  </Link>
                )}
                <Link className="focus-ring rounded-md border border-lqcs-line bg-white px-4 py-2 text-sm font-bold text-ink" href="/learner-dashboard">
                  Return to learner dashboard
                </Link>
              </div>
            </div>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Staff member</th>
                    <th className="px-3 py-3">Course</th>
                    <th className="px-3 py-3">Attempt</th>
                    <th className="px-3 py-3">Score</th>
                    <th className="px-3 py-3">Outcome</th>
                    <th className="px-3 py-3">Certificate issued</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-3 py-3 font-semibold text-ink">{learner.fullName}</td>
                    <td className="px-3 py-3">{course.title}</td>
                    <td className="px-3 py-3">{currentAttemptNumber}</td>
                    <td className="px-3 py-3">{resultScore}%</td>
                    <td className="px-3 py-3">
                      <StatusPill status={passed ? "Passed" : "Failed"} />
                    </td>
                    <td className="px-3 py-3">{certificateUnlocked ? "Yes" : "No"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 overflow-x-auto rounded-lg border border-lqcs-line">
              <table className="w-full min-w-[980px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-3">Question</th>
                    <th className="px-3 py-3">Selected answer</th>
                    <th className="px-3 py-3">Correct answer</th>
                    <th className="px-3 py-3">Explanation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-lqcs-line">
                  {questions.map((question, index) => {
                    const selectedAnswerIndex = answers[question.id];
                    const selectedAnswer =
                      selectedAnswerIndex === undefined ? "Not answered in this session" : `${optionLabels[selectedAnswerIndex]}. ${question.options[selectedAnswerIndex]}`;
                    const correctAnswer = `${optionLabels[question.answerIndex]}. ${question.options[question.answerIndex]}`;

                    return (
                      <tr key={question.id}>
                        <td className="px-3 py-3 font-semibold text-ink">
                          {index + 1}. {question.text}
                        </td>
                        <td className="px-3 py-3 text-slate-600">{selectedAnswer}</td>
                        <td className="px-3 py-3 font-semibold text-lqcs-blue">{correctAnswer}</td>
                        <td className="px-3 py-3 text-slate-600">{question.explanation ?? "Explanation will be added when the question bank is approved."}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
