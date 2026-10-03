import Link from "next/link";
import type { ReactNode } from "react";
import { cx } from "@/lib/format";

interface ActionButtonProps {
  href?: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "quiet";
}

export function ActionButton({ href, children, variant = "primary" }: ActionButtonProps) {
  const className = cx(
    "focus-ring inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-semibold",
    variant === "primary" && "bg-lqcs-blue text-white",
    variant === "secondary" && "border border-lqcs-line bg-white text-ink",
    variant === "quiet" && "bg-lqcs-sky text-lqcs-blue"
  );

  if (href) {
    return (
      <Link className={className} href={href}>
        {children}
      </Link>
    );
  }

  return (
    <button className={className} type="button">
      {children}
    </button>
  );
}
