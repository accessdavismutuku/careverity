"use client";

import { CareVerityPrototype as LegacyCareVerityPrototype } from "@/components/ecm/legacy/CareVerityPrototypeLegacy";

type CareVerityPrototypeProps = Parameters<typeof LegacyCareVerityPrototype>[0];

export function CareVerityPrototype(props: CareVerityPrototypeProps) {
  return <LegacyCareVerityPrototype {...props} />;
}

export function Shell(props: CareVerityPrototypeProps) {
  return <CareVerityPrototype {...props} />;
}
