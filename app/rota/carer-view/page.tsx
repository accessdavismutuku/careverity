import type { Metadata } from "next";
import { RotaRoute } from "../RotaRoute";

export const metadata: Metadata = {
  title: "Carer Rota View | CareVerity ECM",
  description: "Carer-focused rota view for CareVerity ECM workforce allocation."
};

export default function CarerRotaViewPage() {
  return <RotaRoute />;
}
