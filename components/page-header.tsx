import type { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
  logo?: ReactNode;
}

export function PageHeader({ eyebrow, title, description, actions, logo }: PageHeaderProps) {
  return (
    <header className="mb-6 flex flex-col gap-4 border-b border-lqcs-line pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        {logo ? <div className="shrink-0">{logo}</div> : null}
        <div>
          {eyebrow ? <p className="text-xs font-bold uppercase tracking-[0.18em] text-lqcs-teal">{eyebrow}</p> : null}
          <h1 className="mt-2 text-2xl font-bold text-ink md:text-3xl">{title}</h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  );
}
