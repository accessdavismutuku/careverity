import type { Metadata } from "next";
import { LiveEcmRoute } from "../LiveEcmRoute";

export const metadata: Metadata = {
  title: "Late Calls | Live ECM | CareVerity ECM",
  description: "Running late calls and coordinator actions in the Live ECM Board."
};

export default function LiveEcmLateCallsPage() {
  return <LiveEcmRoute initialLiveEcmPath="late-calls" />;
}
