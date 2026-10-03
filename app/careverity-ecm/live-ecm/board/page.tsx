import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Live ECM Board | CareVerity ECM",
  description: "Live monitoring for today's visits, check-ins, check-outs and urgent ECM alerts."
};

export default function CareVerityLiveEcmBoardPage() {
  return <CareVerityPrototype initialLiveEcmPath="board" initialModule="live" />;
}
