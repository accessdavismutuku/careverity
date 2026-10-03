export type UserRole = "Super Admin" | "Manager" | "HR / Training Coordinator" | "Staff / Learner";

export type CourseAccessLevel = "Beginner" | "Intermediate" | "Advanced" | "Mandatory" | "Specialist" | "Manager-only";

export type CourseCategory =
  | "Mandatory Care"
  | "Safeguarding"
  | "Medication"
  | "Health and Safety"
  | "Governance"
  | "Specialist"
  | "Care Certificate"
  | "Policy";

export type AssignmentStatus =
  | "Enrolled"
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Due Soon"
  | "Expired"
  | "Failed"
  | "Awaiting Manager Approval"
  | "External Certificate Uploaded"
  | "Not Applicable";

export type StaffStatus = "Active" | "Inactive";

export interface StaffUser {
  id: string;
  fullName: string;
  firstName: string;
  lastName: string;
  staffId: string;
  email: string;
  accessCode: string;
  role: UserRole;
  jobTitle: string;
  branch: string;
  phone: string;
  employmentStartDate: string;
  createdDate: string;
  status: StaffStatus;
  lineManager: string;
  lastLogin: string;
  trainingGroup: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  category: CourseCategory;
  accessLevel: CourseAccessLevel;
  provider: string;
  duration: string;
  certificateValidity: string;
  active: boolean;
  lessons: number;
  quizQuestions: number;
  passMark: number;
  allowedAttempts: number;
  assignedStaff: number;
  completionPercentage: number;
  colorFrom: string;
  colorTo: string;
  summary: string;
}

export interface CourseAssignment {
  id: string;
  staffId: string;
  courseSlug: string;
  status: AssignmentStatus;
  enrolledDate: string;
  dueDate: string;
  expiryDate?: string;
  score?: number;
  attempts?: number;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  staffName: string;
  courseTitle: string;
  issueDate: string;
  expiryDate: string;
  score: number;
  verificationCode: string;
}

export interface Policy {
  id: string;
  title: string;
  version: string;
  issueDate: string;
  reviewDate: string;
  acknowledgedCount: number;
  pendingCount: number;
}

export interface CompetencyRecord {
  id: string;
  staffName: string;
  area: string;
  assessor: string;
  observedDate: string;
  outcome: "Competent" | "Needs Support" | "Not Competent";
  actionRequired: string;
  reassessmentDate: string;
}

export interface WebinarSession {
  id: string;
  subject: string;
  date: string;
  time: string;
  attendanceStatus: "Booked" | "Attended" | "Missed";
  certificateStatus: "Not issued" | "Issued" | "Pending";
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
  reviewStatus?: "Draft" | "Reviewed" | "Approved";
  createdBy?: string;
  reviewedBy?: string;
  approvedBy?: string;
  version?: string;
  reviewDate?: string;
}

export interface QuizAttempt {
  id: string;
  staffName: string;
  courseTitle: string;
  attemptNumber: number;
  startedAt: string;
  completedAt: string;
  score: number;
  outcome: "Passed" | "Failed";
  certificateIssued: boolean;
}

export interface CourseSlide {
  id: string;
  type: "Title" | "Outcomes" | "Video" | "Text" | "Checklist" | "Scenario" | "Quiz Intro";
  title: string;
  body: string;
  bullets?: string[];
  videoUrl?: string;
  videoSrc?: string;
  videoCaption?: string;
}

export interface ReportRow {
  courseName: string;
  enrolled: number;
  accessed: number;
  completed: number;
  completionPercentage: number;
  actionRequired: string;
}

export interface CompanyProfile {
  companyName: string;
  academyName: string;
  cqcProviderId: string;
  cqcRegisteredActivity: string;
  aohtRegistrationNumber: string;
}

export interface AccreditationWordingSettings {
  showCqcRegisteredProviderWording: boolean;
  cqcRegisteredProviderText: string;
  showSkillsForCareWording: boolean;
  skillsForCareText: string;
  showAohtMembershipWording: boolean;
  aohtMembershipText: string;
  showIso9001Wording: boolean;
  iso9001Text: string;
  iso9001DisplayPermissionConfirmed: boolean;
  showIsoQmsLogoOnCertificate: boolean;
  isoCertificateExpiryReminderDays: number;
  showCpdWordingWhenCourseAuthorised: boolean;
  cpdText: string;
  showNhsDsptWording: boolean;
  nhsDsptText: string;
}

export interface CourseAccreditationSetting {
  courseSlug: string;
  cpdAccreditationAuthorised: boolean;
}

export interface Iso9001Certification {
  standard: string;
  certificationBody: string;
  certificateNumber: string;
  scope: string;
  originalApprovalDate: string;
  currentCertificateDate: string;
  certificateExpiryDate: string;
}
