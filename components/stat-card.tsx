import type { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  detail: string;
  tone?: "blue" | "teal" | "green" | "amber" | "red" | "violet";
  icon?: ReactNode;
}

const tones = {
  blue: "bg-lqcs-sky text-lqcs-blue",
  teal: "bg-lqcs-mint text-lqcs-teal",
  green: "bg-green-50 text-care-green",
  amber: "bg-amber-50 text-care-amber",
  red: "bg-red-50 text-care-red",
  violet: "bg-violet-50 text-care-violet"
};

export function StatCard({ label, value, detail, tone = "blue", icon }: StatCardProps) {
  return (
    <article className="rounded-lg border border-lqcs-line bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-sm font-bold ${tones[tone]}`}>
          {icon ?? value.slice(0, 2)}
        </div>
      </div>
      <p className="mt-3 text-sm text-slate-600">{detail}</p>
    </article>
  );
}
