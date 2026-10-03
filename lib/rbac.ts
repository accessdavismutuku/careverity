import type { UserRole } from "@/lib/types";

// Demo RBAC scaffold. In production, derive the role from Supabase auth metadata
// or a joined profiles/roles query, then enforce the same rules in Postgres RLS.
export const protectedRoutePrefixes = [
  "/careverity-ecm",
  "/manager-dashboard",
  "/learner-dashboard",
  "/course-library",
  "/courses",
  "/quiz-admin",
  "/course-player",
  "/quiz",
  "/certificates",
  "/training-matrix",
  "/reports",
  "/policies",
  "/competency-records",
  "/webinars",
  "/users",
  "/profile",
  "/settings"
];

const roleRoutePrefixes: Record<UserRole, string[]> = {
  "Super Admin": protectedRoutePrefixes,
  Manager: [
    "/manager-dashboard",
    "/learner-dashboard",
    "/course-library",
    "/courses",
    "/quiz-admin",
    "/course-player",
    "/quiz",
    "/certificates",
    "/training-matrix",
    "/reports",
    "/policies",
    "/competency-records",
    "/webinars",
    "/profile"
  ],
  "HR / Training Coordinator": [
    "/manager-dashboard",
    "/learner-dashboard",
    "/course-library",
    "/courses",
    "/quiz-admin",
    "/course-player",
    "/quiz",
    "/certificates",
    "/training-matrix",
    "/reports",
    "/policies",
    "/competency-records",
    "/webinars",
    "/users",
    "/profile"
  ],
  "Staff / Learner": ["/learner-dashboard", "/course-player", "/quiz", "/certificates", "/policies", "/webinars", "/profile"]
};

export const defaultRouteByRole: Record<UserRole, string> = {
  "Super Admin": "/manager-dashboard",
  Manager: "/manager-dashboard",
  "HR / Training Coordinator": "/manager-dashboard",
  "Staff / Learner": "/learner-dashboard"
};

export function isProtectedPath(pathname: string) {
  return protectedRoutePrefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function canAccessRoute(role: UserRole, pathname: string) {
  return roleRoutePrefixes[role].some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function canViewStaffRecord({
  role,
  currentStaffId,
  targetStaffId,
  assignedStaffIds = []
}: {
  role: UserRole;
  currentStaffId: string;
  targetStaffId: string;
  assignedStaffIds?: string[];
}) {
  if (role === "Super Admin" || role === "HR / Training Coordinator") {
    return true;
  }

  if (role === "Manager") {
    return assignedStaffIds.includes(targetStaffId);
  }

  return currentStaffId === targetStaffId;
}

export function canViewCertificate(args: Parameters<typeof canViewStaffRecord>[0]) {
  return canViewStaffRecord(args);
}

export function getDefaultRouteForRole(role: UserRole) {
  return defaultRouteByRole[role];
}
