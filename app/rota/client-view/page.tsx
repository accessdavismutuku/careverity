import type { Metadata } from "next";
import { RotaRoute } from "../RotaRoute";

export const metadata: Metadata = {
  title: "Client Rota View | CareVerity ECM",
  description: "Client-focused rota view for CareVerity ECM shift planning."
};

export default function ClientRotaViewPage() {
  return <RotaRoute />;
}
