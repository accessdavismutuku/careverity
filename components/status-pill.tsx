import { statusTone } from "@/lib/demo-data";
import { cx } from "@/lib/format";

interface StatusPillProps {
  status: string;
  compact?: boolean;
}

export function StatusPill({ status, compact = false }: StatusPillProps) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-md px-2.5 py-1 font-semibold ring-1 ring-inset",
        compact ? "text-[11px]" : "text-xs",
        statusTone(status)
      )}
    >
      {status}
    </span>
  );
}
