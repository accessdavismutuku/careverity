import type { Metadata } from "next";
import { LiveEcmRoute } from "../LiveEcmRoute";

export const metadata: Metadata = {
  title: "Missed Visit Risk | Live ECM | CareVerity ECM",
  description: "Missed visit risk monitoring in the Live ECM Board."
};

export default function LiveEcmMissedRiskPage() {
  return <LiveEcmRoute initialLiveEcmPath="missed-risk" />;
}
