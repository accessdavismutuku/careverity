import { TrainingAcademyLogo } from "@/components/training-academy-logo";
import type { Certificate } from "@/lib/types";
import { formatDate } from "@/lib/format";

const qrMotif = [
  1, 1, 1, 0, 1, 0, 1, 1, 1,
  1, 0, 1, 0, 0, 1, 1, 0, 1,
  1, 1, 1, 1, 0, 1, 1, 1, 1,
  0, 0, 1, 0, 1, 0, 0, 1, 0,
  1, 0, 0, 1, 1, 1, 0, 0, 1,
  1, 1, 0, 0, 1, 0, 1, 1, 0,
  1, 0, 1, 1, 0, 1, 1, 0, 1,
  1, 0, 0, 1, 0, 0, 1, 0, 1,
  1, 1, 1, 0, 1, 1, 1, 1, 1
];

function CertificateLogo() {
  return (
    <div className="flex min-w-0 items-center gap-4">
      <div className="certificate-logo-box flex h-20 w-72 max-w-full items-center justify-start bg-white">
        <TrainingAcademyLogo imageClassName="certificate-logo-image max-h-16" priority width={360} height={110} />
      </div>
      <div className="hidden border-l border-lqcs-teal/30 pl-4 text-left sm:block">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-lqcs-teal">Training Academy</p>
        <p className="mt-1 text-sm font-bold text-slate-600">Internal care-sector learning record</p>
      </div>
    </div>
  );
}

export function QrPlaceholder({ id, size = "small" }: { id: string; size?: "small" | "large" }) {
  return (
    <div
      aria-label="QR verification placeholder"
      className={`qr-placeholder grid shrink-0 grid-cols-9 gap-1 rounded-md border-2 border-navy bg-white ${
        size === "large" ? "h-28 w-28 p-2" : "h-20 w-20 p-1.5"
      }`}
    >
      {qrMotif.map((filled, index) => (
        <span className={filled ? "rounded-sm bg-navy" : "rounded-sm bg-lqcs-sky"} key={`${id}-qr-${index}`} />
      ))}
    </div>
  );
}

interface CertificateTemplateProps {
  certificate: Certificate;
  footerStatements: string[];
  showIsoQmsLogo?: boolean;
}

export function CertificateTemplate({ certificate, footerStatements, showIsoQmsLogo = false }: CertificateTemplateProps) {
  return (
    <article className="certificate-frame rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
      <div className="certificate-sheet relative mx-auto overflow-hidden bg-white text-ink">
        <div className="absolute inset-x-0 top-0 h-3 bg-gradient-to-r from-navy via-lqcs-blue to-lqcs-teal" />
        <div className="absolute inset-x-8 top-8 bottom-8 rounded-sm border-2 border-lqcs-blue/80" />
        <div className="absolute inset-x-12 top-12 bottom-12 rounded-sm border border-lqcs-teal/70" />
        <div aria-hidden="true" className="certificate-watermark pointer-events-none absolute inset-0 grid place-items-center">
          <span>CareVerity</span>
        </div>

        <div className="certificate-content relative flex h-full flex-col p-7 md:p-8">
          <header className="flex items-start justify-between gap-6">
            <CertificateLogo />
            <div className="shrink-0 rounded-md border border-lqcs-teal/25 bg-lqcs-sky/60 px-3 py-2 text-right">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Internal training certificate</p>
              <p className="mt-2 text-sm font-bold text-ink">{certificate.certificateNumber}</p>
            </div>
          </header>

          <div className="mt-5 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-lqcs-teal">CareVerity Training Academy</p>
            <h1 className="mt-2 text-3xl font-black leading-tight text-navy md:text-4xl">Certificate of Completion</h1>
            <div className="mx-auto mt-3 h-px w-72 bg-gradient-to-r from-transparent via-lqcs-teal to-transparent" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">This is to certify that</p>
            <h2 className="mt-3 text-4xl font-black leading-tight text-navy">{certificate.staffName}</h2>
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">has successfully completed</p>
            <p className="mt-2 text-lg font-black uppercase tracking-[0.14em] text-lqcs-teal">{certificate.courseTitle}</p>
            <div className="mx-auto mt-3 max-w-3xl space-y-2 text-sm leading-6 text-slate-700">
              <p>
                Issued by London Quality Care Services Ltd through the CareVerity Training Academy.
              </p>
              <p>This training forms part of the provider&apos;s internal induction, refresher training, competency and governance arrangements.</p>
            </div>
          </div>

          <dl className="mt-4 grid grid-cols-2 gap-3 text-xs md:grid-cols-4">
            <div className="rounded-md border border-lqcs-line bg-lqcs-sky/60 p-2 text-center">
              <dt className="font-bold uppercase text-slate-500">Date issued</dt>
              <dd className="mt-1 font-black text-ink">{formatDate(certificate.issueDate)}</dd>
            </div>
            <div className="rounded-md border border-lqcs-line bg-lqcs-sky/60 p-2 text-center">
              <dt className="font-bold uppercase text-slate-500">Expiry date</dt>
              <dd className="mt-1 font-black text-ink">{formatDate(certificate.expiryDate)}</dd>
            </div>
            <div className="rounded-md border border-lqcs-line bg-lqcs-sky/60 p-2 text-center">
              <dt className="font-bold uppercase text-slate-500">Score</dt>
              <dd className="mt-1 font-black text-ink">{certificate.score}%</dd>
            </div>
            <div className="rounded-md border border-lqcs-line bg-lqcs-sky/60 p-2 text-center">
              <dt className="font-bold uppercase text-slate-500">Verification</dt>
              <dd className="mt-1 font-black text-ink">{certificate.verificationCode}</dd>
            </div>
          </dl>

          <footer className="mt-auto grid items-end gap-3 pt-3 md:grid-cols-[1fr_auto]">
            <div>
              <div className="h-px w-52 bg-navy" />
              <p className="mt-2 text-xs font-black text-ink">Authorised by London Quality Care Services Ltd</p>
              <p className="mt-1 text-[11px] leading-4 text-slate-600">
                CareVerity ECM & Care Compliance Platform. External approval or accreditation wording is controlled by admin settings and course records.
              </p>
            </div>
            <div className="flex items-end gap-3">
              {showIsoQmsLogo ? (
                <div className="certificate-iso-logo grid h-14 w-24 place-items-center rounded-md border border-lqcs-line bg-white px-2 text-center text-[9px] font-black uppercase leading-3 text-navy">
                  ISO / QMS logo
                </div>
              ) : null}
              <div className="text-right">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">Verification code</p>
                <p className="mt-2 rounded-md border border-lqcs-line bg-white px-2 py-1.5 font-mono text-xs font-black text-navy">{certificate.verificationCode}</p>
              </div>
              <QrPlaceholder id={certificate.id} />
            </div>
            {footerStatements.length > 0 ? (
              <div className="certificate-footer-wording space-y-0.5 rounded-md border border-lqcs-line bg-white/80 p-2 md:col-span-2">
                {footerStatements.map((statement) => (
                  <p className="text-[9px] font-semibold leading-3 text-slate-600" key={statement}>
                    {statement}
                  </p>
                ))}
              </div>
            ) : null}
          </footer>
        </div>
      </div>
    </article>
  );
}
