import Image from "next/image";
import { cx } from "@/lib/format";

interface LqcsLogoProps {
  className?: string;
  priority?: boolean;
}

export function LqcsLogo({ className, priority = false }: LqcsLogoProps) {
  return (
    <Image
      alt="London Quality Care Services logo"
      className={cx("h-auto max-h-full w-auto max-w-full object-contain", className)}
      height={86}
      priority={priority}
      src="/images/lqcs-logo.jpg"
      unoptimized
      width={260}
    />
  );
}
