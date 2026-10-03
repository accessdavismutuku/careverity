import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Missed Visit Risk | Live ECM | CareVerity ECM",
  description: "Missed visit risk monitoring in the Live ECM Board."
};

export default function CareVerityLiveEcmMissedRiskPage() {
  return <CareVerityPrototype initialLiveEcmPath="missed-risk" initialModule="live" />;
}
