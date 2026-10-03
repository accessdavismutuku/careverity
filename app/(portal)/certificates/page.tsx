"use client";

import { useEffect, useState } from "react";
import { ActionButton } from "@/components/action-button";
import { CertificateTemplate, QrPlaceholder } from "@/components/certificate-template";
import { PageHeader } from "@/components/page-header";
import { StatusPill } from "@/components/status-pill";
import {
  ACCREDITATION_TOGGLE_STORAGE_KEY,
  COURSE_CPD_STORAGE_KEY,
  getDefaultAccreditationToggles,
  getDefaultCourseCpdAuthorisations,
  parseStoredAccreditationToggles,
  parseStoredCourseCpdAuthorisations
} from "@/lib/accreditation-config";
import { accreditationWordingSettings, certificates, courseAccreditationSettings, getCourseBySlug, getCourseSlidesBySlug } from "@/lib/demo-data";
import { cx, formatDate } from "@/lib/format";
import {
  getLessonCompletionStorageKey,
  getQuizPassStorageKey,
  getQuizScoreStorageKey,
  getVideoDeclarationStorageKey,
  isCertificateEligible
} from "@/lib/training-progress";

const demoCertificateCourseSlug = "batch-1-dementia-awareness";

export default function CertificatesPage() {
  const [settings, setSettings] = useState(getDefaultAccreditationToggles);
  const [courseCpdAuthorisations, setCourseCpdAuthorisations] = useState(getDefaultCourseCpdAuthorisations);
  const [demoCertificateProgress, setDemoCertificateProgress] = useState({
    lessonsComplete: false,
    quizPassed: false,
    quizScore: "",
    videoDeclarationComplete: false
  });
  const featured = certificates[0];
  const featuredCourseSlug = "infection-prevention-control";
  const demoCertificateCourse = getCourseBySlug(demoCertificateCourseSlug);
  const demoRequiresVideoDeclaration = getCourseSlidesBySlug(demoCertificateCourseSlug).some((slide) => Boolean(slide.videoUrl ?? slide.videoSrc));
  const featuredCourseAccreditation = courseAccreditationSettings.find((setting) => setting.courseSlug === featuredCourseSlug);
  const cpdAuthorisedForFeaturedCourse = courseCpdAuthorisations[featuredCourseSlug] ?? featuredCourseAccreditation?.cpdAccreditationAuthorised ?? false;
  const canGenerateDemoCertificate = isCertificateEligible({
    lessonsComplete: demoCertificateProgress.lessonsComplete,
    quizPassed: demoCertificateProgress.quizPassed,
    requiresVideoDeclaration: demoRequiresVideoDeclaration,
    videoDeclarationComplete: demoCertificateProgress.videoDeclarationComplete
  });
  const certificateFooterStatements = [
    settings.showCqcRegisteredProviderWording ? accreditationWordingSettings.cqcRegisteredProviderText : null,
    settings.showAohtMembershipWording ? accreditationWordingSettings.aohtMembershipText : null,
    settings.showSkillsForCareWording ? accreditationWordingSettings.skillsForCareText : null,
    settings.showIso9001Wording && settings.iso9001DisplayPermissionConfirmed ? accreditationWordingSettings.iso9001Text : null,
    settings.showNhsDsptWording ? accreditationWordingSettings.nhsDsptText : null,
    settings.showCpdWordingWhenCourseAuthorised && cpdAuthorisedForFeaturedCourse ? accreditationWordingSettings.cpdText : null
  ].filter((statement): statement is string => Boolean(statement));

  useEffect(() => {
    setSettings(parseStoredAccreditationToggles(window.localStorage.getItem(ACCREDITATION_TOGGLE_STORAGE_KEY)));
    setCourseCpdAuthorisations(parseStoredCourseCpdAuthorisations(window.localStorage.getItem(COURSE_CPD_STORAGE_KEY)));
    setDemoCertificateProgress({
      lessonsComplete: window.localStorage.getItem(getLessonCompletionStorageKey(demoCertificateCourseSlug)) === "true",
      quizPassed: window.localStorage.getItem(getQuizPassStorageKey(demoCertificateCourseSlug)) === "true",
      quizScore: window.localStorage.getItem(getQuizScoreStorageKey(demoCertificateCourseSlug)) ?? "",
      videoDeclarationComplete: window.localStorage.getItem(getVideoDeclarationStorageKey(demoCertificateCourseSlug)) === "true"
    });
  }, []);

  function handlePrintCertificate() {
    window.print();
  }

  return (
    <div className="certificate-page">
      <PageHeader
        actions={
          <>
            <button className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" onClick={handlePrintCertificate} type="button">
              Print Certificate
            </button>
            <button className="focus-ring rounded-md border border-lqcs-line bg-white px-4 py-2 text-sm font-bold text-ink" type="button">
              Download PDF placeholder
            </button>
            <button
              className={cx(
                "focus-ring rounded-md border border-lqcs-teal/40 bg-lqcs-sky px-4 py-2 text-sm font-bold text-lqcs-blue",
                !canGenerateDemoCertificate && "cursor-not-allowed opacity-50"
              )}
              disabled={!canGenerateDemoCertificate}
              title={canGenerateDemoCertificate ? "Demo certificate can be generated" : "Complete all lesson screens, declaration and quiz pass first"}
              type="button"
            >
              Generate Demo Certificate
            </button>
            <ActionButton href="/settings/accreditation" variant="secondary">
              Wording settings
            </ActionButton>
          </>
        }
        description="Certificates can show enabled CPD, AoHT, Skills for Care, ISO 9001 and NHS/DSPT wording where evidence and authorisation are held."
        eyebrow="Certificates"
        title="Certificate evidence"
      />

      <section className="print-hide mb-5 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <h2 className="text-lg font-bold text-ink">Selected certificate preview</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              The certificate below is formatted for A4 landscape printing with a 10mm page margin and optional registration wording controlled by academy settings.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 xl:justify-end">
            <button className="focus-ring rounded-md bg-lqcs-blue px-4 py-2 text-sm font-bold text-white" onClick={handlePrintCertificate} type="button">
              Print Certificate
            </button>
            <button className="focus-ring rounded-md border border-lqcs-line px-4 py-2 text-sm font-bold text-ink" type="button">
              Download PDF placeholder
            </button>
            <button
              className={cx(
                "focus-ring rounded-md border border-lqcs-teal/40 bg-lqcs-sky px-4 py-2 text-sm font-bold text-lqcs-blue",
                !canGenerateDemoCertificate && "cursor-not-allowed opacity-50"
              )}
              disabled={!canGenerateDemoCertificate}
              title={canGenerateDemoCertificate ? "Demo certificate can be generated" : "Complete all lesson screens, declaration and quiz pass first"}
              type="button"
            >
              Generate Demo Certificate
            </button>
            <button className="focus-ring rounded-md border border-lqcs-line px-4 py-2 text-sm font-bold text-ink" type="button">
              Select another certificate
            </button>
          </div>
        </div>
      </section>

      <section className="certificate-print-area">
        <CertificateTemplate
          certificate={featured}
          footerStatements={certificateFooterStatements}
          showIsoQmsLogo={settings.showIsoQmsLogoOnCertificate && settings.iso9001DisplayPermissionConfirmed}
        />
      </section>

      <section className="print-hide mt-6 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Certificate controls</h2>
          <div className="mt-4 space-y-3">
            <div className="rounded-md bg-slate-50 p-3">
              <p className="text-sm font-bold text-ink">Release rule</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Issue only after required video lessons are complete, quiz pass is achieved, declaration is signed and manager approval is completed where required.
              </p>
            </div>
            <div className="rounded-md border border-lqcs-line bg-white p-3">
              <p className="text-sm font-bold text-ink">{demoCertificateCourse.title} demo eligibility</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <StatusPill status={demoCertificateProgress.lessonsComplete ? "Lessons complete" : "Lessons incomplete"} />
                <StatusPill status={demoCertificateProgress.videoDeclarationComplete ? "Declaration complete" : "Declaration missing"} />
                <StatusPill
                  status={
                    demoCertificateProgress.quizPassed
                      ? `Quiz passed${demoCertificateProgress.quizScore ? ` (${demoCertificateProgress.quizScore}%)` : ""}`
                      : "Quiz not passed"
                  }
                />
                <StatusPill status={canGenerateDemoCertificate ? "Certificate unlocked" : "Certificate locked"} />
              </div>
            </div>
            <div className="rounded-md bg-amber-50 p-3 text-sm leading-6 text-care-amber">
              Certificates must not use external approval, endorsement or accreditation claims unless LQCS later configures lawful wording.
            </div>
            <div className="grid gap-2 sm:grid-cols-3 xl:grid-cols-1">
              <StatusPill status="A4 print layout" />
              <StatusPill status="Unique certificate number" />
              <StatusPill status="Audit record saved" />
              <StatusPill status="Optional footer wording" />
            </div>
          </div>
        </article>
        <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
          <h2 className="text-lg font-bold text-ink">Verification display</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-[auto_1fr]">
            <QrPlaceholder id={`${featured.id}-control`} size="large" />
            <div className="rounded-md bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-lqcs-teal">Verification code</p>
              <p className="mt-2 text-2xl font-black text-navy">{featured.verificationCode}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                This placeholder is ready for a future QR verification endpoint. It currently uses fake demo certificate data only.
              </p>
              <p className="mt-3 text-xs font-semibold text-slate-500">Certificate number: {featured.certificateNumber}</p>
            </div>
          </div>
        </article>
      </section>

      <section className="print-hide mt-6 rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink">Certificate list</h2>
            <p className="mt-1 text-sm text-slate-600">Demo certificate records for managers and training coordinators.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm font-bold text-ink" type="button">
              Search
            </button>
            <button className="focus-ring rounded-md border border-lqcs-line px-3 py-2 text-sm font-bold text-ink" type="button">
              Export CSV
            </button>
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-3 py-3">Certificate number</th>
                <th className="px-3 py-3">Staff name</th>
                <th className="px-3 py-3">Course title</th>
                <th className="px-3 py-3">Issue date</th>
                <th className="px-3 py-3">Expiry date</th>
                <th className="px-3 py-3">Score</th>
                <th className="px-3 py-3">Verification code</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lqcs-line">
              {certificates.map((certificate) => (
                <tr key={certificate.id}>
                  <td className="px-3 py-3 font-semibold text-ink">{certificate.certificateNumber}</td>
                  <td className="px-3 py-3">{certificate.staffName}</td>
                  <td className="px-3 py-3">{certificate.courseTitle}</td>
                  <td className="px-3 py-3">{formatDate(certificate.issueDate)}</td>
                  <td className="px-3 py-3">{formatDate(certificate.expiryDate)}</td>
                  <td className="px-3 py-3">{certificate.score}%</td>
                  <td className="px-3 py-3 font-semibold text-navy">{certificate.verificationCode}</td>
                  <td className="px-3 py-3">
                    <button className="focus-ring rounded-md bg-lqcs-sky px-3 py-2 text-xs font-bold text-lqcs-blue" type="button">
                      View / print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
