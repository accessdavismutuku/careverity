import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Late Calls | Live ECM | CareVerity ECM",
  description: "Running late calls and coordinator actions in the Live ECM Board."
};

export default function CareVerityLiveEcmLateCallsPage() {
  return <CareVerityPrototype initialLiveEcmPath="late-calls" initialModule="live" />;
}
