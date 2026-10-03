interface MiniChartProps {
  title: string;
  values: number[];
  labels?: string[];
}

export function MiniChart({ title, values, labels }: MiniChartProps) {
  const max = Math.max(...values, 1);

  return (
    <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-ink">{title}</h2>
        <span className="text-xs font-semibold uppercase text-slate-500">Demo</span>
      </div>
      <div className="mt-6 flex h-36 items-end gap-3">
        {values.map((value, index) => (
          <div className="flex flex-1 flex-col items-center gap-2" key={`${title}-${index}`}>
            <div className="flex h-28 w-full items-end rounded-md bg-slate-100">
              <div
                className="w-full rounded-md bg-lqcs-blue"
                style={{
                  height: `${Math.max((value / max) * 100, 8)}%`
                }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-500">{labels?.[index] ?? value}</span>
          </div>
        ))}
      </div>
    </article>
  );
}
