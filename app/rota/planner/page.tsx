import type { Metadata } from "next";
import { RotaRoute } from "../RotaRoute";

export const metadata: Metadata = {
  title: "Rota Planner | CareVerity ECM",
  description: "Plan service-user shifts, allocate carers and publish the CareVerity ECM rota."
};

export default function RotaPlannerPage() {
  return <RotaRoute />;
}
