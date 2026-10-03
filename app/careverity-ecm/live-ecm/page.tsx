import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Live ECM Board | CareVerity ECM",
  description: "Monitor today's visits, check-ins, check-outs, running late calls, missed visit risks, high-risk calls and completed care delivery."
};

export default function CareVerityLiveEcmPage() {
  return <CareVerityPrototype initialModule="live" />;
}
