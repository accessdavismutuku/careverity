import { accreditationWordingSettings, courseAccreditationSettings } from "./demo-data";
import type { AccreditationWordingSettings } from "./types";

export const ACCREDITATION_TOGGLE_STORAGE_KEY = "lqcs-accreditation-wording-toggles";
export const COURSE_CPD_STORAGE_KEY = "lqcs-course-cpd-authorisations";

export type AccreditationToggleSettings = Pick<
  AccreditationWordingSettings,
  | "showCqcRegisteredProviderWording"
  | "showSkillsForCareWording"
  | "showAohtMembershipWording"
  | "showIso9001Wording"
  | "iso9001DisplayPermissionConfirmed"
  | "showIsoQmsLogoOnCertificate"
  | "isoCertificateExpiryReminderDays"
  | "showCpdWordingWhenCourseAuthorised"
  | "showNhsDsptWording"
>;

export type CourseCpdAuthorisations = Record<string, boolean>;

export function getDefaultAccreditationToggles(): AccreditationToggleSettings {
  return {
    showCqcRegisteredProviderWording: accreditationWordingSettings.showCqcRegisteredProviderWording,
    showSkillsForCareWording: accreditationWordingSettings.showSkillsForCareWording,
    showAohtMembershipWording: accreditationWordingSettings.showAohtMembershipWording,
    showIso9001Wording: accreditationWordingSettings.showIso9001Wording,
    iso9001DisplayPermissionConfirmed: accreditationWordingSettings.iso9001DisplayPermissionConfirmed,
    showIsoQmsLogoOnCertificate: accreditationWordingSettings.showIsoQmsLogoOnCertificate,
    isoCertificateExpiryReminderDays: accreditationWordingSettings.isoCertificateExpiryReminderDays,
    showCpdWordingWhenCourseAuthorised: accreditationWordingSettings.showCpdWordingWhenCourseAuthorised,
    showNhsDsptWording: accreditationWordingSettings.showNhsDsptWording
  };
}

export function getDefaultCourseCpdAuthorisations(): CourseCpdAuthorisations {
  return Object.fromEntries(courseAccreditationSettings.map((setting) => [setting.courseSlug, setting.cpdAccreditationAuthorised]));
}

export function parseStoredAccreditationToggles(value: string | null): AccreditationToggleSettings {
  if (!value) return getDefaultAccreditationToggles();

  try {
    return {
      ...getDefaultAccreditationToggles(),
      ...JSON.parse(value)
    };
  } catch {
    return getDefaultAccreditationToggles();
  }
}

export function parseStoredCourseCpdAuthorisations(value: string | null): CourseCpdAuthorisations {
  if (!value) return getDefaultCourseCpdAuthorisations();

  try {
    return {
      ...getDefaultCourseCpdAuthorisations(),
      ...JSON.parse(value)
    };
  } catch {
    return getDefaultCourseCpdAuthorisations();
  }
}
