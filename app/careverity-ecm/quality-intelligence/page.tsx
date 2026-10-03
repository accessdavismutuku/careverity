import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Quality Intelligence & CQC Evidence Hub | CareVerity ECM",
  description: "AI-assisted quality intelligence, CQC evidence mapping, lessons learned, quality reports and inspection evidence packs with mandatory human approval."
};

export default function CareVerityQualityIntelligencePage() {
  return <CareVerityPrototype initialModule="qualityhub" />;
}
