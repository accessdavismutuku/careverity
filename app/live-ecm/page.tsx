import type { Metadata } from "next";
import { LiveEcmRoute } from "./LiveEcmRoute";

export const metadata: Metadata = {
  title: "Live ECM Board | CareVerity ECM",
  description: "Monitor today's visits, check-ins, check-outs, running late calls, missed visit risks, high-risk calls and completed care delivery."
};

export default function LiveEcmPage() {
  return <LiveEcmRoute />;
}
