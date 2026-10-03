import Link from "next/link";
import { LqcsLogo } from "@/components/lqcs-logo";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="grid min-h-screen lg:grid-cols-[1fr_520px]">
        <div className="flex items-center bg-navy px-6 py-10 text-white md:px-12">
          <div className="max-w-2xl">
            <div className="flex h-24 w-72 max-w-full items-center justify-start rounded-lg bg-white p-3 shadow-soft">
              <LqcsLogo className="max-h-20" priority />
            </div>
            <p className="mt-8 text-sm font-bold uppercase tracking-[0.18em] text-lqcs-mint">London Quality Care Services Ltd</p>
            <h1 className="mt-4 text-4xl font-bold leading-tight md:text-5xl">CareVerity Training Academy</h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">
              Secure internal training, compliance, competency and CQC evidence management for care teams.
            </p>
            <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-3">
              {["Role access", "Audit trail", "Certificates"].map((item) => (
                <div className="rounded-lg border border-white/20 bg-white/10 p-4" key={item}>
                  <p className="text-sm font-bold">{item}</p>
                  <p className="mt-2 text-xs leading-5 text-white/60">Version 1 scaffold</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center px-6 py-10 md:px-12">
          <div className="w-full rounded-lg border border-lqcs-line bg-white p-6 shadow-soft">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-lqcs-teal">Demo login</p>
            <h2 className="mt-2 text-2xl font-bold text-ink">Sign in to the academy</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">This prototype uses demo data only. Supabase authentication is scaffolded for the next phase.</p>
            <form className="mt-6 space-y-4">
              <label className="block">
                <span className="text-sm font-semibold text-ink">Email address</span>
                <input
                  className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-3 text-sm"
                  defaultValue="maya.turner.demo@lqcs.local"
                  type="email"
                />
              </label>
              <label className="block">
                <span className="text-sm font-semibold text-ink">Password</span>
                <input className="focus-ring mt-2 w-full rounded-md border border-lqcs-line px-3 py-3 text-sm" defaultValue="DemoPassword123!" type="password" />
              </label>
              <label className="flex items-center gap-3 text-sm text-slate-600">
                <input className="h-4 w-4 rounded border-lqcs-line" type="checkbox" />
                Require two-factor authentication for admin users
              </label>
              <Link className="focus-ring flex w-full items-center justify-center rounded-md bg-lqcs-blue px-4 py-3 text-sm font-bold text-white" href="/manager-dashboard">
                Sign in
              </Link>
              <button className="focus-ring w-full rounded-md border border-lqcs-line px-4 py-3 text-sm font-bold text-ink" type="button">
                Password reset placeholder
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
