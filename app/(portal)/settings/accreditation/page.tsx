"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import {
  ACCREDITATION_TOGGLE_STORAGE_KEY,
  COURSE_CPD_STORAGE_KEY,
  type AccreditationToggleSettings,
  type CourseCpdAuthorisations,
  getDefaultAccreditationToggles,
  getDefaultCourseCpdAuthorisations,
  parseStoredAccreditationToggles,
  parseStoredCourseCpdAuthorisations
} from "@/lib/accreditation-config";
import { accreditationWordingSettings, companyProfile, courseAccreditationSettings, courses, iso9001Certification } from "@/lib/demo-data";
import { formatDate } from "@/lib/format";

const settingRows = [
  {
    key: "showCqcRegisteredProviderWording",
    title: "Show CQC registered provider wording",
    text: accreditationWordingSettings.cqcRegisteredProviderText,
    note: "Registration wording only. This must not be phrased as CQC approval of any course."
  },
  {
    key: "showSkillsForCareWording",
    title: "Show Skills for Care / ASC-WDS wording",
    text: accreditationWordingSettings.skillsForCareText,
    note: "Workforce expectation wording only. This does not state Skills for Care approval or endorsement."
  },
  {
    key: "showAohtMembershipWording",
    title: "Show Association of Healthcare Trainers membership wording",
    text: accreditationWordingSettings.aohtMembershipText,
    note: "Membership wording only. This does not state AoHT accreditation or quality assurance."
  },
  {
    key: "showIso9001Wording",
    title: "Show ISO 9001 wording on certificate",
    text: accreditationWordingSettings.iso9001Text,
    note: "ISO wording appears only when this toggle and the permission confirmation are enabled."
  },
  {
    key: "showCpdWordingWhenCourseAuthorised",
    title: "Show CPD wording only if authorised for that specific course",
    text: accreditationWordingSettings.cpdText,
    note: "This wording is blocked unless the individual course record is marked as lawfully authorised."
  },
  {
    key: "showNhsDsptWording",
    title: "Show NHS/DSPT evidence wording",
    text: accreditationWordingSettings.nhsDsptText,
    note: "Plain evidence wording only. This does not display NHS logo or NHS service branding."
  }
] as const;

export default function AccreditationSettingsPage() {
  const [settings, setSettings] = useState<AccreditationToggleSettings>(getDefaultAccreditationToggles);
  const [courseCpdAuthorisations, setCourseCpdAuthorisations] = useState<CourseCpdAuthorisations>(getDefaultCourseCpdAuthorisations);
  const [saveStatus, setSaveStatus] = useState("Demo settings loaded");
  const isoExpiryDate = new Date(`${iso9001Certification.certificateExpiryDate}T00:00:00.000Z`);
  const isoExpired = isoExpiryDate < new Date("2026-05-13T00:00:00.000Z");

  useEffect(() => {
    setSettings(parseStoredAccreditationToggles(window.localStorage.getItem(ACCREDITATION_TOGGLE_STORAGE_KEY)));
    setCourseCpdAuthorisations(parseStoredCourseCpdAuthorisations(window.localStorage.getItem(COURSE_CPD_STORAGE_KEY)));
  }, []);

  function saveSettings() {
    window.localStorage.setItem(ACCREDITATION_TOGGLE_STORAGE_KEY, JSON.stringify(settings));
    window.localStorage.setItem(COURSE_CPD_STORAGE_KEY, JSON.stringify(courseCpdAuthorisations));
    setSaveStatus("Demo settings saved locally");
  }

  function resetSettings() {
    const defaultToggles = getDefaultAccreditationToggles();
    const defaultCourseSettings = getDefaultCourseCpdAuthorisations();
    setSettings(defaultToggles);
    setCourseCpdAuthorisations(defaultCourseSettings);
    window.localStorage.setItem(ACCREDITATION_TOGGLE_STORAGE_KEY, JSON.stringify(defaultToggles));
    window.localStorage.setItem(COURSE_CPD_STORAGE_KEY, JSON.stringify(defaultCourseSettings));
    setSaveStatus("Demo settings reset");
  }

  return (
    <>
      <PageHeader
        actions={
          <>
            <button className="focus-ring rounded-md bg-lqcs-blue px-3 py-2 text-sm font-semibold text-white" data-testid="save-accreditation-settings" onClick={saveSettings} type="button">
              Save settings
            </button>
            <ActionButton href="/certificates" variant="secondary">
              Preview certificate
            </ActionButton>
          </>
        }
        description="Admin-controlled wording for registration, membership and course-specific accreditation statements on CareVerity Training Academy certificates."
        eyebrow="Settings"
        title="Accreditation / Registration Wording"
      />
      <section className="mb-6 flex flex-col gap-3 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-bold text-ink">{saveStatus}</p>
          <p className="mt-1 text-sm text-slate-600">Settings are stored in this browser for demo testing only.</p>
        </div>
        <button className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm font-bold text-ink" onClick={resetSettings} type="button">
          Reset demo settings
        </button>
      </section>

      <section className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft" id="company-profile">
          <h2 className="text-lg font-bold text-ink">Company profile</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">These profile values feed certificate wording and audit evidence labels.</p>
          <dl className="mt-4 grid gap-3 text-sm">
            {[
              ["Company name", companyProfile.companyName],
              ["Academy name", companyProfile.academyName],
              ["CQC provider ID", companyProfile.cqcProviderId],
              ["Registered activity", companyProfile.cqcRegisteredActivity],
              ["AoHT registration number", companyProfile.aohtRegistrationNumber]
            ].map(([label, value]) => (
              <div className="rounded-md bg-slate-50 p-3" key={label}>
                <dt className="text-xs font-bold uppercase text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Certificate wording toggles</h2>
          <div className="mt-4 space-y-3">
            {settingRows.map((row) => (
              <label className="block rounded-lg border border-lqcs-line bg-white p-4" key={row.key}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-ink">{row.title}</p>
                    <p className="mt-2 text-sm leading-6 text-slate-700">&quot;{row.text}&quot;</p>
                    <p className="mt-2 text-xs font-semibold text-slate-500">{row.note}</p>
                  </div>
                  <input
                    checked={settings[row.key]}
                    className="mt-1 h-5 w-5 shrink-0 rounded border-lqcs-line"
                    data-testid={`toggle-${row.key}`}
                    onChange={(event) => setSettings((current) => ({ ...current, [row.key]: event.target.checked }))}
                    type="checkbox"
                  />
                </div>
              </label>
            ))}
          </div>
        </article>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Certificate branding controls</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">Logo uploads are placeholders for Supabase Storage in the live system.</p>
          <div className="mt-4 grid gap-4">
            <label className="block rounded-lg border border-lqcs-line bg-slate-50 p-3">
              <span className="text-sm font-bold text-ink">Upload CareVerity certificate logo</span>
              <input className="focus-ring mt-3 w-full rounded-md border border-lqcs-line bg-white px-3 py-2 text-sm" type="file" accept="image/*" />
              <span className="mt-2 block text-xs font-semibold text-slate-500">The current demo uses public/images/lqcs-logo.jpg and keeps object-fit: contain.</span>
            </label>
            <label className="block rounded-lg border border-lqcs-line bg-slate-50 p-3">
              <span className="text-sm font-bold text-ink">Upload ISO/QMS logo if permitted</span>
              <input className="focus-ring mt-3 w-full rounded-md border border-lqcs-line bg-white px-3 py-2 text-sm" type="file" accept="image/*" />
              <span className="mt-2 block text-xs font-semibold text-slate-500">Only upload and display the logo where LQCS has permission from the certification body.</span>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-lqcs-line p-3 text-sm font-semibold text-ink">
              <input
                checked={settings.showIsoQmsLogoOnCertificate}
                className="mt-1 h-4 w-4 rounded border-lqcs-line"
                onChange={(event) => setSettings((current) => ({ ...current, showIsoQmsLogoOnCertificate: event.target.checked }))}
                type="checkbox"
              />
              Show ISO/QMS logo on certificate
            </label>
          </div>
        </article>

        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink">ISO 9001 default fields</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">These values control the optional ISO wording in the certificate footer.</p>
            </div>
            <StatusPill status={isoExpired ? "ISO certificate expired" : "ISO certificate active"} />
          </div>
          {isoExpired ? (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm font-semibold text-care-red">
              Warning: the ISO certificate expiry date has passed. Hide ISO wording until the record is renewed.
            </div>
          ) : null}
          <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
            {[
              ["ISO standard", iso9001Certification.standard],
              ["Certification body", iso9001Certification.certificationBody],
              ["Certificate number", iso9001Certification.certificateNumber],
              ["Scope", iso9001Certification.scope],
              ["Original approval date", formatDate(iso9001Certification.originalApprovalDate)],
              ["Current certificate date", formatDate(iso9001Certification.currentCertificateDate)],
              ["Certificate expiry date", formatDate(iso9001Certification.certificateExpiryDate)]
            ].map(([label, value]) => (
              <div className="rounded-md bg-slate-50 p-3" key={label}>
                <dt className="text-xs font-bold uppercase text-slate-500">{label}</dt>
                <dd className="mt-1 font-bold text-ink">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-4 grid gap-3">
            <label className="block">
              <span className="text-sm font-bold text-ink">ISO certificate expiry reminder</span>
              <div className="mt-2 flex max-w-xs items-center gap-2">
                <input
                  className="focus-ring w-24 rounded-md border border-lqcs-line px-3 py-2 text-sm"
                  min={1}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      isoCertificateExpiryReminderDays: Number.parseInt(event.target.value, 10) || 90
                    }))
                  }
                  type="number"
                  value={settings.isoCertificateExpiryReminderDays}
                />
                <span className="text-sm font-semibold text-slate-600">days before expiry</span>
              </div>
            </label>
            <label className="flex items-start gap-3 rounded-lg border border-lqcs-line p-3 text-sm font-semibold text-ink">
              <input
                checked={settings.iso9001DisplayPermissionConfirmed}
                className="mt-1 h-4 w-4 rounded border-lqcs-line"
                onChange={(event) => setSettings((current) => ({ ...current, iso9001DisplayPermissionConfirmed: event.target.checked }))}
                type="checkbox"
              />
              I confirm that London Quality Care Services Ltd has permission to display this ISO 9001 wording/logo on certificates.
            </label>
          </div>
        </article>
      </section>

      <section className="mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Course-specific CPD authorisation</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              CPD wording appears when both the global CPD setting and the individual course authorisation are enabled. Demo defaults are now enabled.
            </p>
          </div>
          <StatusPill status={settings.showCpdWordingWhenCourseAuthorised ? "Global CPD display on" : "Global CPD display off"} />
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Course</th>
                <th className="px-3 py-3">Category</th>
                <th className="px-3 py-3">CPD authorised for course</th>
                <th className="px-3 py-3">Certificate footer result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {courses.slice(0, 8).map((course) => {
                const courseSetting = courseAccreditationSettings.find((item) => item.courseSlug === course.slug);
                const cpdAuthorised = courseCpdAuthorisations[course.slug] ?? courseSetting?.cpdAccreditationAuthorised ?? false;
                const footerResult = settings.showCpdWordingWhenCourseAuthorised && cpdAuthorised ? "CPD wording shown" : "CPD wording hidden";

                return (
                  <tr key={course.id}>
                    <td className="px-3 py-3 font-semibold text-ink">{course.title}</td>
                    <td className="px-3 py-3 text-slate-600">{course.category}</td>
                    <td className="px-3 py-3">
                      <label className="flex items-center gap-2">
                        <input
                          checked={cpdAuthorised}
                          className="h-4 w-4 rounded border-lqcs-line"
                          data-testid={`course-cpd-${course.slug}`}
                          onChange={(event) =>
                            setCourseCpdAuthorisations((current) => ({
                              ...current,
                              [course.slug]: event.target.checked
                            }))
                          }
                          type="checkbox"
                        />
                        <span className="text-slate-600">Admin course setting</span>
                      </label>
                    </td>
                    <td className="px-3 py-3">
                      <StatusPill status={footerResult} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-care-amber">
        Do not automatically describe courses with regulator approval, external approval, endorsement, accreditation or quality-assurance claims unless an authorised admin
        has enabled lawful wording for that specific course and evidence is held.
      </section>
    </>
  );
}
