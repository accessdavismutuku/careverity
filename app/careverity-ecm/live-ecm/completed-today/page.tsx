import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Completed Today | Live ECM | CareVerity ECM",
  description: "Completed care delivery lines from today's Live ECM Board."
};

export default function CareVerityLiveEcmCompletedTodayPage() {
  return <CareVerityPrototype initialLiveEcmPath="completed-today" initialModule="live" />;
}
