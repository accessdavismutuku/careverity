export default function CareVerityClientsLoading() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-4xl rounded-xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
        <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
        <div className="mt-5 h-8 w-96 max-w-full animate-pulse rounded bg-slate-200" />
        <div className="mt-4 h-4 w-full animate-pulse rounded bg-slate-100" />
        <div className="mt-2 h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        <div className="mt-6 grid gap-3 md:grid-cols-2">
          <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
          <div className="h-28 animate-pulse rounded-lg bg-slate-100" />
        </div>
        <div className="mt-5 text-sm font-bold text-slate-600">Loading demo service users safely...</div>
      </div>
    </main>
  );
}
