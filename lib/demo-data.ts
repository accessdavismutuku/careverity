import type {
  AssignmentStatus,
  AccreditationWordingSettings,
  Certificate,
  CompanyProfile,
  CompetencyRecord,
  Course,
  CourseAssignment,
  CourseAccreditationSetting,
  CourseSlide,
  Iso9001Certification,
  Policy,
  QuizAttempt,
  QuizQuestion,
  ReportRow,
  StaffUser,
  WebinarSession
} from "./types";
import { lqcsVideoCourses, lqcsVideoCourseSlidesBySlug, lqcsVideoQuizQuestionsBySlug } from "@/src/lib/lqcs-video-courses";

// Demo-only records for the local prototype. When Supabase is connected, replace
// these exports with typed query functions that read the matching tables in
// supabase/schema.sql and enforce RLS through the authenticated user session.
export const companyProfile: CompanyProfile = {
  companyName: "London Quality Care Services Ltd",
  academyName: "CareVerity Training Academy",
  cqcProviderId: "1-1384737040",
  cqcRegisteredActivity: "Personal care",
  aohtRegistrationNumber: "AOH7786145"
};

export const accreditationWordingSettings: AccreditationWordingSettings = {
  showCqcRegisteredProviderWording: true,
  cqcRegisteredProviderText: "London Quality Care Services Ltd is a CQC-registered provider.",
  showSkillsForCareWording: true,
  skillsForCareText:
    "London Quality Care Services Ltd maintains workforce training and compliance records in line with adult social care workforce expectations.",
  showAohtMembershipWording: true,
  aohtMembershipText:
    "London Quality Care Training is a registered member of the Association of Healthcare Trainers (AoHT), Registration No: AOH7786145.",
  showIso9001Wording: true,
  iso9001Text:
    "London Quality Care Services Ltd is ISO 9001:2015 registered by QMS International Ltd for the provision of qualified and trained care staff for the needy and elderly. Certificate No: 285522018. Certificate expiry: 31 January 2028.",
  iso9001DisplayPermissionConfirmed: true,
  showIsoQmsLogoOnCertificate: true,
  isoCertificateExpiryReminderDays: 90,
  showCpdWordingWhenCourseAuthorised: true,
  cpdText: "Course-specific CPD wording has been authorised for this course record.",
  showNhsDsptWording: true,
  nhsDsptText:
    "NHS/DSPT evidence wording is enabled for information governance training records where the provider holds the relevant publication reference. This is not NHS logo or NHS service branding."
};

export const iso9001Certification: Iso9001Certification = {
  standard: "ISO 9001:2015",
  certificationBody: "QMS International Ltd",
  certificateNumber: "285522018",
  scope: "The provision of qualified and trained care staff for the needy and elderly.",
  originalApprovalDate: "2018-02-01",
  currentCertificateDate: "2018-02-01",
  certificateExpiryDate: "2028-01-31"
};

export const courseAccreditationSettings: CourseAccreditationSetting[] = [
  { courseSlug: "safeguarding-adults", cpdAccreditationAuthorised: true },
  { courseSlug: "safeguarding-children", cpdAccreditationAuthorised: true },
  { courseSlug: "moving-and-handling", cpdAccreditationAuthorised: true },
  { courseSlug: "medication-awareness", cpdAccreditationAuthorised: true },
  ...lqcsVideoCourses.map((course) => ({ courseSlug: course.slug, cpdAccreditationAuthorised: true }))
];

export const staffUsers: StaffUser[] = [
  {
    id: "staff-001",
    fullName: "Amira Khan",
    firstName: "Amira",
    lastName: "Khan",
    staffId: "LQCS-1001",
    email: "amira.khan.demo@lqcs.local",
    accessCode: "DEMO-AK01",
    role: "Staff / Learner",
    jobTitle: "Care Worker",
    branch: "North London",
    phone: "07000 100001",
    employmentStartDate: "2025-09-02",
    createdDate: "2026-04-28",
    status: "Active",
    lineManager: "Maya Turner",
    lastLogin: "2026-05-10 09:14",
    trainingGroup: "Mandatory Care"
  },
  {
    id: "staff-002",
    fullName: "Noah Bennett",
    firstName: "Noah",
    lastName: "Bennett",
    staffId: "LQCS-1002",
    email: "noah.bennett.demo@lqcs.local",
    accessCode: "DEMO-NB02",
    role: "Staff / Learner",
    jobTitle: "Senior Care Worker",
    branch: "East London",
    phone: "07000 100002",
    employmentStartDate: "2024-11-16",
    createdDate: "2026-04-22",
    status: "Active",
    lineManager: "Maya Turner",
    lastLogin: "2026-05-11 08:22",
    trainingGroup: "Medication-trained staff"
  },
  {
    id: "staff-003",
    fullName: "Sofia Williams",
    firstName: "Sofia",
    lastName: "Williams",
    staffId: "LQCS-1003",
    email: "sofia.williams.demo@lqcs.local",
    accessCode: "DEMO-SW03",
    role: "Staff / Learner",
    jobTitle: "Outreach Support Worker",
    branch: "West London",
    phone: "07000 100003",
    employmentStartDate: "2026-03-04",
    createdDate: "2026-05-01",
    status: "Active",
    lineManager: "Jon Ellis",
    lastLogin: "2026-05-09 17:05",
    trainingGroup: "Learning disability/autism support"
  },
  {
    id: "staff-004",
    fullName: "Daniel Morgan",
    firstName: "Daniel",
    lastName: "Morgan",
    staffId: "LQCS-1004",
    email: "daniel.morgan.demo@lqcs.local",
    accessCode: "DEMO-DM04",
    role: "Manager",
    jobTitle: "Field Supervisor",
    branch: "South London",
    phone: "07000 100004",
    employmentStartDate: "2023-06-18",
    createdDate: "2026-04-18",
    status: "Active",
    lineManager: "Ruth Ahmed",
    lastLogin: "2026-05-11 07:48",
    trainingGroup: "Field Supervisor"
  },
  {
    id: "staff-005",
    fullName: "Maya Turner",
    firstName: "Maya",
    lastName: "Turner",
    staffId: "LQCS-1005",
    email: "maya.turner.demo@lqcs.local",
    accessCode: "DEMO-MT05",
    role: "Super Admin",
    jobTitle: "Registered Manager",
    branch: "Head Office",
    phone: "07000 100005",
    employmentStartDate: "2022-01-10",
    createdDate: "2026-04-12",
    status: "Active",
    lineManager: "Director",
    lastLogin: "2026-05-11 10:03",
    trainingGroup: "Registered Manager"
  },
  {
    id: "staff-006",
    fullName: "Jon Ellis",
    firstName: "Jon",
    lastName: "Ellis",
    staffId: "LQCS-1006",
    email: "jon.ellis.demo@lqcs.local",
    accessCode: "DEMO-JE06",
    role: "HR / Training Coordinator",
    jobTitle: "HR Officer",
    branch: "Head Office",
    phone: "07000 100006",
    employmentStartDate: "2024-02-19",
    createdDate: "2026-04-12",
    status: "Active",
    lineManager: "Maya Turner",
    lastLogin: "2026-05-10 14:31",
    trainingGroup: "Office Admin"
  },
  {
    id: "staff-007",
    fullName: "Priya Shah",
    firstName: "Priya",
    lastName: "Shah",
    staffId: "LQCS-1007",
    email: "priya.shah.demo@lqcs.local",
    accessCode: "DEMO-PS07",
    role: "Staff / Learner",
    jobTitle: "Care Worker",
    branch: "North London",
    phone: "07000 100007",
    employmentStartDate: "2025-04-23",
    createdDate: "2026-04-29",
    status: "Active",
    lineManager: "Daniel Morgan",
    lastLogin: "2026-05-08 11:19",
    trainingGroup: "Mandatory Care"
  },
  {
    id: "staff-008",
    fullName: "Owen Clarke",
    firstName: "Owen",
    lastName: "Clarke",
    staffId: "LQCS-1008",
    email: "owen.clarke.demo@lqcs.local",
    accessCode: "DEMO-OC08",
    role: "Staff / Learner",
    jobTitle: "Driver / Transport Support",
    branch: "East London",
    phone: "07000 100008",
    employmentStartDate: "2026-02-11",
    createdDate: "2026-05-02",
    status: "Active",
    lineManager: "Daniel Morgan",
    lastLogin: "2026-05-06 16:47",
    trainingGroup: "Driver / Transport Support"
  },
  {
    id: "staff-009",
    fullName: "Leah Robinson",
    firstName: "Leah",
    lastName: "Robinson",
    staffId: "LQCS-1009",
    email: "leah.robinson.demo@lqcs.local",
    accessCode: "DEMO-LR09",
    role: "Staff / Learner",
    jobTitle: "Care Worker",
    branch: "South London",
    phone: "07000 100009",
    employmentStartDate: "2023-10-07",
    createdDate: "2026-04-17",
    status: "Inactive",
    lineManager: "Daniel Morgan",
    lastLogin: "2026-04-20 10:12",
    trainingGroup: "Mandatory Care"
  },
  {
    id: "staff-010",
    fullName: "Ethan Harris",
    firstName: "Ethan",
    lastName: "Harris",
    staffId: "LQCS-1010",
    email: "ethan.harris.demo@lqcs.local",
    accessCode: "DEMO-EH10",
    role: "Staff / Learner",
    jobTitle: "Care Worker",
    branch: "West London",
    phone: "07000 100010",
    employmentStartDate: "2025-12-01",
    createdDate: "2026-04-30",
    status: "Active",
    lineManager: "Jon Ellis",
    lastLogin: "2026-05-11 06:52",
    trainingGroup: "Mandatory Care"
  }
];

export const courses: Course[] = [
  {
    id: "course-001",
    slug: "safeguarding-adults",
    title: "Safeguarding Adults",
    category: "Safeguarding",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "45 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 8,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 82,
    colorFrom: "#1f6fbf",
    colorTo: "#11a7a5",
    summary: "Internal safeguarding responsibilities, reporting routes, record keeping and escalation."
  },
  {
    id: "course-002",
    slug: "safeguarding-children",
    title: "Safeguarding Children",
    category: "Safeguarding",
    accessLevel: "Advanced",
    provider: "CareVerity Training Academy",
    duration: "60 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 10,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 8,
    completionPercentage: 63,
    colorFrom: "#4267c7",
    colorTo: "#7b61bf",
    summary: "Advanced awareness of children safeguarding duties, vulnerabilities and referral pathways."
  },
  {
    id: "course-003",
    slug: "moving-and-handling",
    title: "Moving and Handling",
    category: "Health and Safety",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "50 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 7,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 74,
    colorFrom: "#2f9f71",
    colorTo: "#1f6fbf",
    summary: "Safe principles, risk assessment, equipment awareness and practical observation prompts."
  },
  {
    id: "course-004",
    slug: "medication-awareness",
    title: "Medication Awareness",
    category: "Medication",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "55 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 9,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 7,
    completionPercentage: 58,
    colorFrom: "#0f8f88",
    colorTo: "#c47a16",
    summary: "Medicine support responsibilities, recording, escalation, errors and competency checks."
  },
  {
    id: "course-005",
    slug: "infection-prevention-control",
    title: "Infection Prevention and Control",
    category: "Health and Safety",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "40 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 7,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 91,
    colorFrom: "#11a7a5",
    colorTo: "#2f9f71",
    summary: "PPE, hand hygiene, infection risks, outbreak reporting and care environment controls."
  },
  {
    id: "course-006",
    slug: "health-and-safety",
    title: "Health and Safety",
    category: "Health and Safety",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "35 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 6,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 9,
    completionPercentage: 76,
    colorFrom: "#355f9f",
    colorTo: "#c47a16",
    summary: "Workplace safety duties, incident reporting, risk controls and lone-working awareness."
  },
  {
    id: "course-007",
    slug: "fire-safety",
    title: "Fire Safety",
    category: "Health and Safety",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "30 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 5,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 86,
    colorFrom: "#c94343",
    colorTo: "#c47a16",
    summary: "Fire prevention, evacuation principles, alarms, responsibilities and reporting."
  },
  {
    id: "course-008",
    slug: "food-hygiene",
    title: "Food Hygiene",
    category: "Health and Safety",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "35 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 6,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 8,
    completionPercentage: 71,
    colorFrom: "#2f9f71",
    colorTo: "#c47a16",
    summary: "Food handling, storage, hygiene, allergy awareness and care-setting practice."
  },
  {
    id: "course-009",
    slug: "mental-capacity-act",
    title: "Mental Capacity Act",
    category: "Governance",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "45 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 8,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 9,
    completionPercentage: 69,
    colorFrom: "#7b61bf",
    colorTo: "#1f6fbf",
    summary: "Capacity principles, best interests, consent, restrictions and escalation."
  },
  {
    id: "course-010",
    slug: "equality-diversity",
    title: "Equality and Diversity",
    category: "Governance",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "30 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 5,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 88,
    colorFrom: "#1f6fbf",
    colorTo: "#2f9f71",
    summary: "Inclusive care, dignity, protected characteristics and professional behaviour."
  },
  {
    id: "course-011",
    slug: "gdpr-confidentiality",
    title: "GDPR and Confidentiality",
    category: "Governance",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "30 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 5,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 9,
    completionPercentage: 79,
    colorFrom: "#0f2747",
    colorTo: "#11a7a5",
    summary: "Data protection, confidentiality, records, lawful sharing and incident reporting."
  },
  {
    id: "course-012",
    slug: "lone-working",
    title: "Lone Working",
    category: "Health and Safety",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "25 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 5,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 67,
    colorFrom: "#355f9f",
    colorTo: "#11a7a5",
    summary: "Risk awareness, escalation, personal safety and communication expectations."
  },
  {
    id: "course-013",
    slug: "autism-learning-disability-awareness",
    title: "Autism and Learning Disability Awareness",
    category: "Specialist",
    accessLevel: "Specialist",
    provider: "CareVerity Training Academy",
    duration: "55 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 9,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 6,
    completionPercentage: 52,
    colorFrom: "#7b61bf",
    colorTo: "#11a7a5",
    summary: "Communication, reasonable adjustments, risk, dignity and person-centred support."
  },
  {
    id: "course-014",
    slug: "dementia-awareness",
    title: "Dementia Awareness",
    category: "Specialist",
    accessLevel: "Specialist",
    provider: "CareVerity Training Academy",
    duration: "45 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 7,
    quizQuestions: 10,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 6,
    completionPercentage: 61,
    colorFrom: "#4267c7",
    colorTo: "#2f9f71",
    summary: "Recognition, communication, distress, daily support and escalation."
  },
  {
    id: "course-015",
    slug: "pressure-sore-awareness",
    title: "Pressure Sore Awareness",
    category: "Specialist",
    accessLevel: "Specialist",
    provider: "CareVerity Training Academy",
    duration: "35 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 6,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 7,
    completionPercentage: 49,
    colorFrom: "#c47a16",
    colorTo: "#1f6fbf",
    summary: "Skin integrity, prevention, repositioning, reporting and documentation."
  },
  {
    id: "course-016",
    slug: "care-planning",
    title: "Care Planning",
    category: "Governance",
    accessLevel: "Intermediate",
    provider: "CareVerity Training Academy",
    duration: "45 min",
    certificateValidity: "24 months",
    active: true,
    lessons: 7,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 5,
    completionPercentage: 66,
    colorFrom: "#1f6fbf",
    colorTo: "#c47a16",
    summary: "Person-centred planning, updates, outcomes, risk and recording expectations."
  },
  {
    id: "course-017",
    slug: "incident-accident-reporting",
    title: "Incident and Accident Reporting",
    category: "Governance",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "30 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 5,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 9,
    completionPercentage: 73,
    colorFrom: "#c94343",
    colorTo: "#1f6fbf",
    summary: "Immediate action, escalation, duty of candour and accurate evidence."
  },
  {
    id: "course-018",
    slug: "complaints-duty-candour",
    title: "Complaints and Duty of Candour",
    category: "Governance",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "30 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 5,
    quizQuestions: 8,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 8,
    completionPercentage: 62,
    colorFrom: "#0f2747",
    colorTo: "#c47a16",
    summary: "Listening, recording, escalation, learning from complaints and openness."
  },
  {
    id: "course-019",
    slug: "whistleblowing",
    title: "Whistleblowing",
    category: "Policy",
    accessLevel: "Mandatory",
    provider: "CareVerity Training Academy",
    duration: "25 min",
    certificateValidity: "12 months",
    active: true,
    lessons: 4,
    quizQuestions: 6,
    passMark: 80,
    allowedAttempts: 2,
    assignedStaff: 10,
    completionPercentage: 84,
    colorFrom: "#7b61bf",
    colorTo: "#c94343",
    summary: "Raising concerns, protection, routes for escalation and professional duty."
  },
  {
    id: "course-020",
    slug: "care-certificate",
    title: "Care Certificate",
    category: "Care Certificate",
    accessLevel: "Beginner",
    provider: "CareVerity Training Academy",
    duration: "15 standards",
    certificateValidity: "Evidence based",
    active: true,
    lessons: 15,
    quizQuestions: 15,
    passMark: 80,
    allowedAttempts: 3,
    assignedStaff: 4,
    completionPercentage: 38,
    colorFrom: "#2f9f71",
    colorTo: "#7b61bf",
    summary: "Evidence, observation and manager sign-off against Care Certificate standards."
  },
  ...lqcsVideoCourses
];

const matrixStatuses: AssignmentStatus[][] = [
  ["Completed", "In Progress", "Completed", "Due Soon", "Completed", "Not Started"],
  ["Completed", "Completed", "Due Soon", "Expired", "Completed", "Completed"],
  ["In Progress", "Not Started", "Due Soon", "Not Applicable", "Completed", "In Progress"],
  ["Completed", "Completed", "Completed", "Completed", "Completed", "Due Soon"],
  ["Completed", "Completed", "Completed", "Completed", "Completed", "Completed"],
  ["Completed", "Due Soon", "Not Started", "Not Applicable", "Completed", "Completed"],
  ["Expired", "Not Started", "In Progress", "Due Soon", "Completed", "Not Started"],
  ["Completed", "Not Applicable", "Due Soon", "Not Applicable", "Completed", "In Progress"],
  ["Expired", "Expired", "Expired", "Expired", "Expired", "Expired"],
  ["Completed", "In Progress", "Due Soon", "Not Started", "Completed", "Awaiting Manager Approval"]
];

export const matrixCourseSlugs = [
  "safeguarding-adults",
  "safeguarding-children",
  "moving-and-handling",
  "medication-awareness",
  "infection-prevention-control",
  "health-and-safety",
  ...lqcsVideoCourses.map((course) => course.slug)
];

// Demo course assignments intentionally mirror the future Supabase
// course_assignments rows: staffId + courseSlug + status + enrolled/due/expiry.
// Replace this array with a joined query against course_assignments, staff_profiles
// and courses once Supabase Auth/RLS is connected.
export const courseAssignments: CourseAssignment[] = staffUsers.flatMap((staff, staffIndex) =>
  matrixCourseSlugs.map((slug, courseIndex) => {
    const status =
      matrixStatuses[staffIndex][courseIndex] ??
      (["Completed", "In Progress", "Not Started", "Due Soon", "Completed", "Awaiting Manager Approval"] as AssignmentStatus[])[
        (staffIndex + courseIndex) % 6
      ];
    return {
      id: `${staff.id}-${slug}`,
      staffId: staff.id,
      courseSlug: slug,
      status,
      enrolledDate: `2026-04-${String(12 + ((staffIndex + courseIndex) % 14)).padStart(2, "0")}`,
      dueDate: `2026-06-${String(4 + ((staffIndex + courseIndex) % 20)).padStart(2, "0")}`,
      expiryDate: status === "Completed" || status === "Due Soon" ? `2027-05-${String(3 + courseIndex).padStart(2, "0")}` : undefined,
      score: status === "Completed" ? 82 + ((staffIndex + courseIndex) % 14) : undefined,
      attempts: status === "Failed" || status === "Expired" ? 2 : 1
    };
  })
);

export const certificates: Certificate[] = [
  {
    id: "cert-001",
    certificateNumber: "CV-CERT-2026-001",
    staffName: "Amira Khan",
    courseTitle: "Infection Prevention and Control",
    issueDate: "2026-05-02",
    expiryDate: "2027-05-02",
    score: 92,
    verificationCode: "LQCS-9F2A-001"
  },
  {
    id: "cert-002",
    certificateNumber: "CV-CERT-2026-002",
    staffName: "Noah Bennett",
    courseTitle: "Safeguarding Adults",
    issueDate: "2026-05-04",
    expiryDate: "2027-05-04",
    score: 88,
    verificationCode: "LQCS-8B7C-002"
  },
  {
    id: "cert-003",
    certificateNumber: "CV-CERT-2026-003",
    staffName: "Maya Turner",
    courseTitle: "Medication Awareness",
    issueDate: "2026-05-05",
    expiryDate: "2027-05-05",
    score: 96,
    verificationCode: "LQCS-4D1E-003"
  },
  {
    id: "cert-004",
    certificateNumber: "CV-CERT-2026-004",
    staffName: "Priya Shah",
    courseTitle: "Whistleblowing",
    issueDate: "2026-05-06",
    expiryDate: "2027-05-06",
    score: 86,
    verificationCode: "LQCS-2A9D-004"
  }
];

export const quizAttempts: QuizAttempt[] = [
  {
    id: "attempt-001",
    staffName: "Amira Khan",
    courseTitle: "Infection Prevention and Control",
    attemptNumber: 1,
    startedAt: "2026-05-02 09:08",
    completedAt: "2026-05-02 09:24",
    score: 92,
    outcome: "Passed",
    certificateIssued: true
  },
  {
    id: "attempt-002",
    staffName: "Noah Bennett",
    courseTitle: "Safeguarding Adults",
    attemptNumber: 1,
    startedAt: "2026-05-04 11:17",
    completedAt: "2026-05-04 11:35",
    score: 88,
    outcome: "Passed",
    certificateIssued: true
  },
  {
    id: "attempt-003",
    staffName: "Sofia Williams",
    courseTitle: "Autism and Learning Disability Awareness",
    attemptNumber: 1,
    startedAt: "2026-05-06 13:02",
    completedAt: "2026-05-06 13:18",
    score: 70,
    outcome: "Failed",
    certificateIssued: false
  },
  {
    id: "attempt-004",
    staffName: "Priya Shah",
    courseTitle: "Whistleblowing",
    attemptNumber: 2,
    startedAt: "2026-05-06 15:10",
    completedAt: "2026-05-06 15:22",
    score: 86,
    outcome: "Passed",
    certificateIssued: true
  },
  {
    id: "attempt-005",
    staffName: "Ethan Harris",
    courseTitle: "Medication Awareness",
    attemptNumber: 1,
    startedAt: "2026-05-10 10:05",
    completedAt: "2026-05-10 10:24",
    score: 60,
    outcome: "Failed",
    certificateIssued: false
  }
];

export const policies: Policy[] = [
  {
    id: "policy-001",
    title: "Safeguarding Policy",
    version: "v3.2",
    issueDate: "2026-01-10",
    reviewDate: "2027-01-10",
    acknowledgedCount: 8,
    pendingCount: 2
  },
  {
    id: "policy-002",
    title: "Medication Policy",
    version: "v2.8",
    issueDate: "2026-02-15",
    reviewDate: "2027-02-15",
    acknowledgedCount: 7,
    pendingCount: 3
  },
  {
    id: "policy-003",
    title: "Incident and Accident Policy",
    version: "v4.1",
    issueDate: "2026-03-04",
    reviewDate: "2027-03-04",
    acknowledgedCount: 9,
    pendingCount: 1
  },
  {
    id: "policy-004",
    title: "GDPR Policy",
    version: "v2.4",
    issueDate: "2026-04-02",
    reviewDate: "2027-04-02",
    acknowledgedCount: 6,
    pendingCount: 4
  }
];

export const competencyRecords: CompetencyRecord[] = [
  {
    id: "comp-001",
    staffName: "Noah Bennett",
    area: "Medication administration",
    assessor: "Maya Turner",
    observedDate: "2026-05-03",
    outcome: "Needs Support",
    actionRequired: "Repeat MAR documentation observation",
    reassessmentDate: "2026-05-24"
  },
  {
    id: "comp-002",
    staffName: "Amira Khan",
    area: "Moving and handling",
    assessor: "Daniel Morgan",
    observedDate: "2026-05-05",
    outcome: "Competent",
    actionRequired: "None",
    reassessmentDate: "2027-05-05"
  },
  {
    id: "comp-003",
    staffName: "Sofia Williams",
    area: "Autism support communication",
    assessor: "Jon Ellis",
    observedDate: "2026-05-07",
    outcome: "Competent",
    actionRequired: "Continue reflective supervision",
    reassessmentDate: "2026-11-07"
  }
];

export const webinarSessions: WebinarSession[] = [
  {
    id: "WEB-1001",
    subject: "Safeguarding Adults refresher",
    date: "2026-05-21",
    time: "10:00",
    attendanceStatus: "Booked",
    certificateStatus: "Pending"
  },
  {
    id: "WEB-1002",
    subject: "Medication practice update",
    date: "2026-05-28",
    time: "14:00",
    attendanceStatus: "Booked",
    certificateStatus: "Pending"
  },
  {
    id: "WEB-0997",
    subject: "Infection control briefing",
    date: "2026-04-30",
    time: "09:30",
    attendanceStatus: "Attended",
    certificateStatus: "Issued"
  }
];

export const courseSlides: CourseSlide[] = [
  {
    id: "slide-001",
    type: "Title",
    title: "Safeguarding Adults Awareness",
    body: "Original LQCS demo lesson content for internal training and evidence readiness."
  },
  {
    id: "slide-002",
    type: "Outcomes",
    title: "Learning Outcomes",
    body: "By the end of this course, learners will understand their safeguarding responsibilities.",
    bullets: [
      "Recognise possible signs and indicators of abuse",
      "Know when and how to report a concern",
      "Understand internal LQCS escalation routes",
      "Keep clear, timely and factual records"
    ]
  },
  {
    id: "slide-003",
    type: "Text",
    title: "What Safeguarding Means",
    body: "Safeguarding means protecting a person from abuse, neglect and avoidable harm while supporting their rights, choices and dignity."
  },
  {
    id: "slide-004",
    type: "Checklist",
    title: "Immediate Actions",
    body: "When a concern is raised, staff should act promptly and follow company procedure.",
    bullets: [
      "Make the person safe if there is an immediate risk",
      "Report to the line manager or safeguarding lead",
      "Record facts, dates, times and exact words where possible",
      "Escalate externally where policy or law requires it"
    ]
  },
  {
    id: "slide-005",
    type: "Scenario",
    title: "Scenario Reflection",
    body: "A service user appears withdrawn and has unexplained bruising. The learner must decide how to record, report and escalate the concern without making unsupported assumptions."
  },
  {
    id: "slide-006",
    type: "Quiz Intro",
    title: "Final Assessment",
    body: "Complete the quiz with a pass mark of 80%. The certificate remains locked until the quiz is passed and any declaration is confirmed."
  }
];

export const courseSlidesBySlug: Record<string, CourseSlide[]> = {
  ...lqcsVideoCourseSlidesBySlug
};

export function getCourseSlidesBySlug(slug: string) {
  return courseSlidesBySlug[slug] ?? courseSlides;
}

export const quizQuestions: QuizQuestion[] = [
  {
    id: "q1",
    text: "What is the first priority when a safeguarding concern suggests immediate danger?",
    options: ["Wait for the next supervision", "Make the person safe and escalate", "Only write a note", "Ask another learner"],
    answerIndex: 1
  },
  {
    id: "q2",
    text: "Which record style is best for safeguarding evidence?",
    options: ["Opinion-based summary", "Factual, dated and timed notes", "A short verbal update only", "A social media message"],
    answerIndex: 1
  },
  {
    id: "q3",
    text: "Who should staff report concerns to internally?",
    options: ["No one until the annual appraisal", "The line manager or safeguarding lead", "Only a colleague", "A family member first"],
    answerIndex: 1
  },
  {
    id: "q4",
    text: "What should a staff member do if they are unsure whether something is a safeguarding concern?",
    options: ["Ignore it", "Discuss and escalate through policy", "Delete the record", "Wait 30 days"],
    answerIndex: 1
  },
  {
    id: "q5",
    text: "Which principle should guide information sharing?",
    options: ["Share everything publicly", "Follow lawful, necessary and proportionate sharing", "Never share anything", "Only share by text message"],
    answerIndex: 1
  },
  {
    id: "q6",
    text: "What can repeated missed medication training indicate?",
    options: ["No action needed", "A possible competency or supervision need", "Automatic promotion", "A reason to delete records"],
    answerIndex: 1
  },
  {
    id: "q7",
    text: "When should safeguarding training content be reviewed?",
    options: ["At least annually or sooner if guidance changes", "Never", "Every ten years only", "Only after inspection"],
    answerIndex: 0
  },
  {
    id: "q8",
    text: "What does the CareVerity certificate confirm?",
    options: ["CQC approval", "Completion of internal LQCS training", "Skills for Care endorsement", "External university accreditation"],
    answerIndex: 1
  },
  {
    id: "q9",
    text: "Which status means a manager still needs to sign off evidence?",
    options: ["Completed", "Awaiting Manager Approval", "Not Applicable", "Archived"],
    answerIndex: 1
  },
  {
    id: "q10",
    text: "Why does the training matrix matter?",
    options: ["It replaces all management oversight", "It gives live compliance and audit evidence", "It hides overdue records", "It is only for learners"],
    answerIndex: 1
  }
];

export const quizQuestionsBySlug: Record<string, QuizQuestion[]> = {
  ...lqcsVideoQuizQuestionsBySlug
};

export function getQuizQuestionsBySlug(slug: string) {
  return quizQuestionsBySlug[slug] ?? quizQuestions;
}

export const reportRows: ReportRow[] = courses.slice(0, 10).map((course, index) => ({
  courseName: course.title,
  enrolled: course.assignedStaff,
  accessed: Math.max(course.assignedStaff - (index % 3), 1),
  completed: Math.round((course.assignedStaff * course.completionPercentage) / 100),
  completionPercentage: course.completionPercentage,
  actionRequired:
    course.completionPercentage < 65
      ? "Manager review and reminder cycle required"
      : course.completionPercentage < 80
        ? "Monitor due-soon learners"
        : "No immediate action"
}));

export const auditEvents = [
  {
    actor: "Maya Turner",
    action: "Issued certificate",
    detail: "Medication Awareness certificate generated for Noah Bennett",
    time: "2026-05-11 09:32"
  },
  {
    actor: "Jon Ellis",
    action: "Assigned course",
    detail: "Autism and Learning Disability Awareness assigned to Sofia Williams",
    time: "2026-05-10 15:08"
  },
  {
    actor: "System",
    action: "Reminder queued",
    detail: "Training due in 30 days reminder prepared for 4 learners",
    time: "2026-05-10 08:00"
  }
];

export const notifications = [
  "4 staff have training due within 30 days",
  "2 quiz attempts need manager review",
  "3 policy acknowledgements are still pending",
  "CQC evidence pack was generated 6 days ago"
];

export function getCourseBySlug(slug: string) {
  return courses.find((course) => course.slug === slug) ?? courses[0];
}

export function getStaffById(id: string) {
  return staffUsers.find((staff) => staff.id === id) ?? staffUsers[0];
}

export function getLearnerAssignments(staffId = "staff-001") {
  return courseAssignments
    .filter((assignment) => assignment.staffId === staffId)
    .map((assignment) => ({
      ...assignment,
      course: getCourseBySlug(assignment.courseSlug)
    }));
}

export function statusTone(status: AssignmentStatus | string) {
  if (
    status === "Completed" ||
    status === "External Certificate Uploaded" ||
    status === "Competent" ||
    status === "Issued" ||
    status === "Active" ||
    status === "Approved" ||
    status === "Passed" ||
    status === "Two-factor enabled"
  ) {
    return "bg-green-50 text-care-green ring-green-200";
  }

  if (status === "Due Soon" || status === "In Progress" || status === "Booked" || status === "Pending" || status === "Needs Support") {
    return "bg-amber-50 text-care-amber ring-amber-200";
  }

  if (status === "Draft" || status === "Reviewed") {
    return "bg-violet-50 text-care-violet ring-violet-200";
  }

  if (status === "Expired" || status === "Failed" || status === "Not Competent" || status === "Missed") {
    return "bg-red-50 text-care-red ring-red-200";
  }

  if (status === "Awaiting Manager Approval" || status === "Enrolled") {
    return "bg-violet-50 text-care-violet ring-violet-200";
  }

  return "bg-slate-100 text-slate-600 ring-slate-200";
}

export function compliancePercentage() {
  const relevant = courseAssignments.filter((assignment) => assignment.status !== "Not Applicable");
  const complete = relevant.filter((assignment) => assignment.status === "Completed" || assignment.status === "External Certificate Uploaded");
  return Math.round((complete.length / relevant.length) * 100);
}

export function dueSoonCount() {
  return courseAssignments.filter((assignment) => assignment.status === "Due Soon").length;
}

export function overdueCount() {
  return courseAssignments.filter((assignment) => assignment.status === "Expired").length;
}
