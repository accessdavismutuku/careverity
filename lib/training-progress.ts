export const VIDEO_DECLARATION_TEXT = "I confirm I have watched this training video and understood the content.";

export function getVideoDeclarationStorageKey(courseSlug: string) {
  return `lqcs:${courseSlug}:video-declaration-complete`;
}

export function getLessonCompletionStorageKey(courseSlug: string) {
  return `lqcs:${courseSlug}:all-lessons-complete`;
}

export function getQuizPassStorageKey(courseSlug: string) {
  return `lqcs:${courseSlug}:quiz-passed`;
}

export function getQuizScoreStorageKey(courseSlug: string) {
  return `lqcs:${courseSlug}:quiz-score`;
}

export function getQuizAttemptCountStorageKey(courseSlug: string) {
  return `lqcs:${courseSlug}:quiz-attempt-count`;
}

export function getQuizAttemptHistoryStorageKey(courseSlug: string) {
  return `lqcs:${courseSlug}:quiz-attempt-history`;
}

export function calculateQuizScore({
  answers,
  questions
}: {
  answers: Record<string, number>;
  questions: Array<{ id: string; answerIndex: number }>;
}) {
  if (questions.length === 0) {
    return 0;
  }

  const correct = questions.filter((question) => answers[question.id] === question.answerIndex).length;
  return Math.round((correct / questions.length) * 100);
}

export function isCertificateEligible({
  lessonsComplete,
  quizPassed,
  requiresVideoDeclaration,
  videoDeclarationComplete
}: {
  lessonsComplete: boolean;
  quizPassed: boolean;
  requiresVideoDeclaration: boolean;
  videoDeclarationComplete: boolean;
}) {
  return lessonsComplete && quizPassed && (!requiresVideoDeclaration || videoDeclarationComplete);
}
