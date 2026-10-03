"use client";

type CareVerityBackendSetupMessageProps = {
  appEnv: string;
  routeName: string;
  missingConfig: string[];
  configStatus: Array<{ key: string; present: boolean }>;
  message?: string;
};

export function CareVerityBackendSetupMessage({
  appEnv,
  routeName,
  missingConfig,
  configStatus,
  message = "CareVerity production backend requires Supabase/Postgres environment variables before live data can be used. Please configure staging environment and run the migration."
}: CareVerityBackendSetupMessageProps) {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="rounded-lg bg-amber-50 p-4 text-sm font-bold text-amber-900 ring-1 ring-amber-200">
          Backend is not configured.
        </div>
        <h1 className="mt-5 text-3xl font-black text-slate-950">{routeName} is waiting for backend setup</h1>
        <p className="mt-3 max-w-3xl text-sm font-semibold leading-6 text-slate-700">{message}</p>
        <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm font-bold text-slate-700 ring-1 ring-slate-100">
          Environment: {appEnv}. Secret values are not shown. Only present/missing status is displayed.
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {configStatus.map((item) => (
            <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white p-3" key={item.key}>
              <span className="font-mono text-xs font-bold text-slate-700">{item.key}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-black ${item.present ? "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200" : "bg-rose-50 text-rose-800 ring-1 ring-rose-200"}`}>
                {item.present ? "Present" : "Missing"}
              </span>
            </div>
          ))}
        </div>
        {missingConfig.length ? (
          <div className="mt-5 rounded-lg bg-rose-50 p-4 text-sm font-bold leading-6 text-rose-900 ring-1 ring-rose-200">
            Missing values: {missingConfig.join(", ")}
          </div>
        ) : null}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="rounded-md bg-teal-600 px-5 py-3 text-sm font-black text-white" onClick={() => window.location.reload()} type="button">
            Retry
          </button>
          <a className="rounded-md border border-slate-200 px-5 py-3 text-sm font-black text-slate-800" href="/careverity-ecm">
            Return to Dashboard
          </a>
        </div>
      </div>
    </main>
  );
}

export function CareVerityDemoModeBanner() {
  return (
    <div className="bg-amber-50 px-4 py-2 text-center text-xs font-black uppercase tracking-wide text-amber-900 ring-1 ring-amber-200">
      Demo mode - not for live care records
    </div>
  );
}
