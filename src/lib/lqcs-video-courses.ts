import type { Course, CourseSlide, QuizQuestion } from "@/lib/types";
import { lqcsQuestionBankBatch1 } from "./lqcs-question-bank-batch-1";

type LqcsVideoCourseImport = {
  courseId: string;
  courseTitle: string;
  lessonTitle: string;
  originalFile: string;
  targetFile: string;
  videoUrl: string;
  category: "Mandatory Care Training" | "Specialist Care Training" | "Induction Training";
  level: "Beginner" | "Intermediate";
  mandatory: boolean;
  passMark: 80;
  allowedAttempts: 2;
  certificateValidityMonths: 12;
  description: string;
  declarationText: string;
  certificateRule: string;
};

const optionOrder = ["A", "B", "C", "D"] as const;

type QuestionBankReviewStatus = "Draft" | "Reviewed" | "Approved";

function normalizeReviewStatus(status: string): QuestionBankReviewStatus {
  const value = status.toLowerCase();

  if (value.includes("approved")) {
    return "Approved";
  }

  if (value.startsWith("reviewed")) {
    return "Reviewed";
  }

  return "Draft";
}

export const lqcsVideoCourseImports = [
  {
    courseId: "dementia-awareness",
    courseTitle: "Dementia Awareness",
    lessonTitle: "Understanding Dementia",
    originalFile: "Dementia Care- Understaing.mp4",
    targetFile: "dementia-awareness-understanding-dementia.mp4",
    videoUrl: "/videos/dementia-awareness-understanding-dementia.mp4",
    category: "Specialist Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "A training video supporting staff understanding of dementia care and person-centred support.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "dignity-and-respect",
    courseTitle: "Dignity and Respect",
    lessonTitle: "Promoting Dignity and Respect",
    originalFile: "Dignity & Respect.m4v",
    targetFile: "dignity-and-respect-promoting-dignity-and-respect.mp4",
    videoUrl: "/videos/dignity-and-respect-promoting-dignity-and-respect.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Mandatory care training on dignity, respect and person-centred care.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "effective-communication",
    courseTitle: "Effective Communication",
    lessonTitle: "Communication in Care",
    originalFile: "Effective Communication-1.mp4",
    targetFile: "effective-communication-communication-in-care.mp4",
    videoUrl: "/videos/effective-communication-communication-in-care.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on effective communication with service users, families, colleagues and professionals.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "equality-diversity-inclusion",
    courseTitle: "Equality, Diversity and Inclusion",
    lessonTitle: "Equality, Diversity, Inclusion and Human Rights",
    originalFile: "Equality, Diversity & Inclusion.mp4",
    targetFile: "equality-diversity-inclusion-human-rights.mp4",
    videoUrl: "/videos/equality-diversity-inclusion-human-rights.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on equality, diversity, inclusion, human rights and fair treatment in care.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "person-centred-care",
    courseTitle: "Person-Centred Care",
    lessonTitle: "Principles of Person-Centred Care",
    originalFile: "HC1 Principles of Person Centered Care-1-1.mP4",
    targetFile: "person-centred-care-principles.mp4",
    videoUrl: "/videos/person-centred-care-principles.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on the principles of person-centred care and individualised support.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "health-and-safety",
    courseTitle: "Health and Safety",
    lessonTitle: "Health and Safety in Care",
    originalFile: "HC5 Health And Safety-1.mp4",
    targetFile: "health-and-safety-in-care.mp4",
    videoUrl: "/videos/health-and-safety-in-care.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Mandatory training covering health and safety responsibilities in care settings.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "safeguarding-adults-awareness",
    courseTitle: "Safeguarding Adults",
    lessonTitle: "Safeguarding Adults Awareness",
    originalFile: "HC9-Safeguarding Adults1.mp4",
    targetFile: "safeguarding-adults-awareness.mp4",
    videoUrl: "/videos/safeguarding-adults-awareness.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on recognising, responding to and reporting adult safeguarding concerns.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "diabetes-awareness",
    courseTitle: "Diabetes Awareness",
    lessonTitle: "Understanding Diabetes",
    originalFile: "Understanding Diabetes.mp4",
    targetFile: "diabetes-awareness-understanding-diabetes.mp4",
    videoUrl: "/videos/diabetes-awareness-understanding-diabetes.mp4",
    category: "Specialist Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Awareness training on diabetes and care staff responsibilities when supporting service users.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "safeguarding-children-child-protection",
    courseTitle: "Safeguarding Children",
    lessonTitle: "Understanding Child Protection",
    originalFile: "Understanding Child Protection .mp4",
    targetFile: "safeguarding-children-understanding-child-protection.mp4",
    videoUrl: "/videos/safeguarding-children-understanding-child-protection.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on child protection awareness and staff responsibilities.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "safeguarding-children-social-care",
    courseTitle: "Safeguarding Children in Social Care",
    lessonTitle: "Safeguarding Children in Social Care",
    originalFile: "Safeguarding Children in Social Care.mp4",
    targetFile: "safeguarding-children-in-social-care.mp4",
    videoUrl: "/videos/safeguarding-children-in-social-care.mp4",
    category: "Mandatory Care Training",
    level: "Intermediate",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on safeguarding children in social care contexts.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "safeguarding-adults-refresher",
    courseTitle: "Safeguarding Adults Refresher",
    lessonTitle: "Safeguarding Adults Refresher / Main Module",
    originalFile: "Safeguarding Adults.mp4",
    targetFile: "safeguarding-adults-refresher-main-module.mp4",
    videoUrl: "/videos/safeguarding-adults-refresher-main-module.mp4",
    category: "Mandatory Care Training",
    level: "Intermediate",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "A refresher or main module for safeguarding adults training.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "role-of-home-care-worker",
    courseTitle: "Role of the Home Care Worker",
    lessonTitle: "Duties and Responsibilities of a Home Care Worker",
    originalFile: "Role of the Home Care 2 .mp4",
    targetFile: "role-of-home-care-worker-duties-responsibilities.mp4",
    videoUrl: "/videos/role-of-home-care-worker-duties-responsibilities.mp4",
    category: "Induction Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Induction training covering the role, duties and responsibilities of a home care worker.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "pressure-ulcer-awareness",
    courseTitle: "Pressure Ulcer Awareness",
    lessonTitle: "Pressure Ulcer Prevention",
    originalFile: "Pressure Ulcer Prevention.mp4",
    targetFile: "pressure-ulcer-awareness-prevention.mp4",
    videoUrl: "/videos/pressure-ulcer-awareness-prevention.mp4",
    category: "Specialist Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on pressure ulcer risk, prevention and reporting responsibilities.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "medication-awareness",
    courseTitle: "Medication Awareness",
    lessonTitle: "Safe Medication Support in Domiciliary Care",
    originalFile: "Medication.mp4",
    targetFile: "medication-awareness-safe-medication-support.mp4",
    videoUrl: "/videos/medication-awareness-safe-medication-support.mp4",
    category: "Mandatory Care Training",
    level: "Intermediate",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on safe medication support, recording, reporting and escalation in domiciliary care.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "positive-behaviour-support",
    courseTitle: "Positive Behaviour Support",
    lessonTitle: "Managing Distressed Behaviour",
    originalFile: "Managing Distressed Behaviour.mp4",
    targetFile: "positive-behaviour-support-managing-distressed-behaviour.mp4",
    videoUrl: "/videos/positive-behaviour-support-managing-distressed-behaviour.mp4",
    category: "Specialist Care Training",
    level: "Intermediate",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on understanding and safely responding to distressed behaviour.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "home-care-health-and-safety",
    courseTitle: "Home Care Health and Safety",
    lessonTitle: "Home Care Health and Safety",
    originalFile: "Home Care 5 Health And Safety.mp4",
    targetFile: "home-care-health-and-safety.mp4",
    videoUrl: "/videos/home-care-health-and-safety.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Home-care-specific health and safety training.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "effective-communication-written",
    courseTitle: "Effective Communication - Written Communication",
    lessonTitle: "Written Communication in Care",
    originalFile: "Effective Communication(Written Communication).mp4",
    targetFile: "effective-communication-written-communication.mp4",
    videoUrl: "/videos/effective-communication-written-communication.mp4",
    category: "Mandatory Care Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on written communication, recording and professional care documentation.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  },
  {
    courseId: "developing-as-care-worker",
    courseTitle: "Developing as a Care Worker",
    lessonTitle: "Personal Development and Professional Practice",
    originalFile: "Devlop as a Worker .mp4",
    targetFile: "developing-as-care-worker-professional-practice.mp4",
    videoUrl: "/videos/developing-as-care-worker-professional-practice.mp4",
    category: "Induction Training",
    level: "Beginner",
    mandatory: true,
    passMark: 80,
    allowedAttempts: 2,
    certificateValidityMonths: 12,
    description: "Training on personal development, learning, professional conduct and reflective practice.",
    declarationText: "I confirm I have watched this training video and understood the content.",
    certificateRule: "Issue certificate only after mandatory video, declaration and quiz pass are completed."
  }
] satisfies LqcsVideoCourseImport[];

export function getBatchOneCourseSlug(courseId: string) {
  return `batch-1-${courseId}`;
}

function mapCourseCategory(course: LqcsVideoCourseImport): Course["category"] {
  const title = course.courseTitle.toLowerCase();

  if (title.includes("safeguarding")) {
    return "Safeguarding";
  }

  if (title.includes("medication")) {
    return "Medication";
  }

  if (title.includes("health and safety")) {
    return "Health and Safety";
  }

  if (course.category === "Specialist Care Training") {
    return "Specialist";
  }

  if (course.category === "Induction Training") {
    return "Care Certificate";
  }

  return "Mandatory Care";
}

function buildVideoQuiz(course: LqcsVideoCourseImport): QuizQuestion[] {
  return [
    {
      id: `${course.courseId}-q1`,
      text: `What does this ${course.courseTitle} training confirm in the LQCS demo?`,
      options: ["External accreditation", "Internal LQCS training completion", "CQC course approval", "Skills for Care endorsement"],
      answerIndex: 1
    },
    {
      id: `${course.courseId}-q2`,
      text: "What should staff do when they notice a concern linked to this subject?",
      options: ["Ignore it until appraisal", "Record facts and escalate through LQCS procedure", "Post details publicly", "Delete the record"],
      answerIndex: 1
    },
    {
      id: `${course.courseId}-q3`,
      text: "Which record style is expected for care governance evidence?",
      options: ["Factual, timely and clear", "Opinion only", "Delayed and incomplete", "Informal messages only"],
      answerIndex: 0
    },
    {
      id: `${course.courseId}-q4`,
      text: "What must happen before a certificate can be unlocked for this video course?",
      options: ["Only open the course card", "Complete the video lesson, tick the declaration and pass the quiz", "Only visit the dashboard", "Skip the quiz"],
      answerIndex: 1
    },
    {
      id: `${course.courseId}-q5`,
      text: "What is the pass mark for this Batch 1 demo course?",
      options: ["50%", "60%", "80%", "100%"],
      answerIndex: 2
    },
    {
      id: `${course.courseId}-q6`,
      text: "How many quiz attempts are allowed in this demo course setting?",
      options: ["1", "2", "5", "Unlimited"],
      answerIndex: 1
    },
    {
      id: `${course.courseId}-q7`,
      text: "Why is a learner declaration used after the video lesson?",
      options: ["To replace supervision", "To confirm the learner watched and understood the training video", "To claim external approval", "To bypass the quiz"],
      answerIndex: 1
    },
    {
      id: `${course.courseId}-q8`,
      text: "Which wording should staff avoid unless authorised by an admin for that course?",
      options: ["Internal LQCS training", "Course title", "Completion date", "External approval or accreditation claims"],
      answerIndex: 3
    },
    {
      id: `${course.courseId}-q9`,
      text: "What should a learner do if they are unsure how to apply the training in practice?",
      options: ["Ask a manager or appropriate senior colleague", "Guess without recording", "Ignore the uncertainty", "Wait for inspection"],
      answerIndex: 0
    },
    {
      id: `${course.courseId}-q10`,
      text: "What type of data is used in this prototype?",
      options: ["Real staff records", "Fake demo records only", "Live payroll data", "External inspection data"],
      answerIndex: 1
    }
  ];
}

function buildQuestionBankQuiz(courseId: string): QuizQuestion[] {
  const courseBank = lqcsQuestionBankBatch1.find((course) => course.courseId === courseId);

  if (!courseBank) {
    return [];
  }

  return courseBank.questions.map((question) => ({
    id: question.questionId,
    text: question.question,
    options: optionOrder.map((option) => question.options[option]),
    answerIndex: Math.max(optionOrder.indexOf(question.correctOption as (typeof optionOrder)[number]), 0),
    explanation: question.explanation,
    reviewStatus: normalizeReviewStatus(question.reviewStatus),
    createdBy: question.createdBy,
    reviewedBy: question.reviewedBy || "Not reviewed",
    approvedBy: question.approvedBy || "Not approved",
    version: question.version,
    reviewDate: question.reviewDate || "Not scheduled"
  }));
}

export const lqcsDraftQuizQuestionsBySlug: Record<string, QuizQuestion[]> = Object.fromEntries(
  lqcsQuestionBankBatch1.map((course) => [getBatchOneCourseSlug(course.courseId), buildQuestionBankQuiz(course.courseId)])
);

export const lqcsQuestionBankReviewRows = lqcsQuestionBankBatch1.map((course) => {
  const questions = buildQuestionBankQuiz(course.courseId);
  const approvedCount = questions.filter((question) => question.reviewStatus === "Approved").length;
  const reviewedCount = questions.filter((question) => question.reviewStatus === "Reviewed").length;
  const draftCount = questions.filter((question) => question.reviewStatus === "Draft").length;

  return {
    slug: getBatchOneCourseSlug(course.courseId),
    courseId: course.courseId,
    courseTitle: course.courseTitle,
    status: normalizeReviewStatus(course.status),
    rawStatus: course.status,
    questionCount: questions.length,
    draftCount,
    reviewedCount,
    approvedCount,
    passMark: course.passMark,
    allowedAttempts: course.allowedAttempts,
    createdBy: questions[0]?.createdBy ?? "Not recorded",
    reviewedBy: questions[0]?.reviewedBy ?? "Not reviewed",
    approvedBy: questions[0]?.approvedBy ?? "Not approved",
    version: questions[0]?.version ?? "0.1-draft",
    reviewDate: questions[0]?.reviewDate ?? "Not scheduled"
  };
});

export const lqcsVideoCourses: Course[] = lqcsVideoCourseImports.map((course, index) => ({
  id: `batch-1-video-course-${String(index + 1).padStart(3, "0")}`,
  slug: getBatchOneCourseSlug(course.courseId),
  title: course.courseTitle,
  category: mapCourseCategory(course),
  accessLevel: course.level,
  provider: "CareVerity Training Academy",
  duration: "Video lesson",
  certificateValidity: `${course.certificateValidityMonths} months`,
  active: true,
  lessons: 1,
  quizQuestions: 10,
  passMark: course.passMark,
  allowedAttempts: course.allowedAttempts,
  assignedStaff: 6 + (index % 5),
  completionPercentage: (index * 7) % 91,
  colorFrom: index % 3 === 0 ? "#185c9a" : index % 3 === 1 ? "#0f766e" : "#24417c",
  colorTo: index % 3 === 0 ? "#11a7a5" : index % 3 === 1 ? "#2f9f71" : "#0891b2",
  summary: course.description
}));

export const lqcsVideoCourseSlidesBySlug: Record<string, CourseSlide[]> = Object.fromEntries(
  lqcsVideoCourseImports.map((course) => [
    getBatchOneCourseSlug(course.courseId),
    [
      {
        id: `${getBatchOneCourseSlug(course.courseId)}-lesson-1`,
        type: "Video",
        title: course.lessonTitle,
        body: `${course.description} Watch the mandatory video lesson, then confirm the declaration before moving to the quiz.`,
        videoUrl: course.videoUrl,
        videoCaption: `Source file: ${course.originalFile}. Place as public/videos/${course.targetFile}.`
      }
    ]
  ])
);

export const lqcsVideoQuizQuestionsBySlug: Record<string, QuizQuestion[]> = Object.fromEntries(
  lqcsVideoCourseImports.map((course) => {
    const slug = getBatchOneCourseSlug(course.courseId);
    const approvedQuestionBank = (lqcsDraftQuizQuestionsBySlug[slug] ?? []).filter((question) => question.reviewStatus === "Approved");

    return [slug, approvedQuestionBank.length === 10 ? approvedQuestionBank : buildVideoQuiz(course)];
  })
);
