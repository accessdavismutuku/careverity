"use client";

import Image from "next/image";
import { useState } from "react";
import { cx } from "@/lib/format";

export const trainingAcademyLogoSrc = "/branding/careverity-training-academy-logo.svg";

interface TrainingAcademyLogoProps {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  width?: number;
  height?: number;
  showFallbackSubtitle?: boolean;
}

export function TrainingAcademyLogo({
  className,
  imageClassName,
  priority = false,
  width = 360,
  height = 110,
  showFallbackSubtitle = true
}: TrainingAcademyLogoProps) {
  const [logoFailed, setLogoFailed] = useState(false);

  if (logoFailed) {
    return (
      <div className={cx("inline-flex flex-col justify-center rounded-md bg-white text-left", className)}>
        <span className="font-serif text-2xl font-black leading-none text-[#0B1F3A]">CareVerity</span>
        <span className="mt-1 text-xs font-black uppercase tracking-[0.22em] text-[#128F8B]">Training Academy</span>
        {showFallbackSubtitle ? <span className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">ECM & Care Compliance Learning</span> : null}
      </div>
    );
  }

  return (
    <Image
      alt="CareVerity Training Academy logo"
      className={cx("h-auto max-w-full object-contain", imageClassName)}
      height={height}
      onError={() => setLogoFailed(true)}
      priority={priority}
      src={trainingAcademyLogoSrc}
      unoptimized
      width={width}
    />
  );
}
