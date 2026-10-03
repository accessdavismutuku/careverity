import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Behaviour Monitoring & Positive Behaviour Support | CareVerity ECM",
  description: "Person-centred behaviour monitoring, PBS planning, ABC records, sleep records, review actions and inspection evidence."
};

export default function CareVerityBehaviourMonitoringPage() {
  return <CareVerityPrototype initialModule="behaviour" />;
}
