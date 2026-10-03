import type { Metadata } from "next";
import { LiveEcmRoute } from "../LiveEcmRoute";

export const metadata: Metadata = {
  title: "Completed Today | Live ECM | CareVerity ECM",
  description: "Completed care delivery lines from today's Live ECM Board."
};

export default function LiveEcmCompletedTodayPage() {
  return <LiveEcmRoute initialLiveEcmPath="completed-today" />;
}
