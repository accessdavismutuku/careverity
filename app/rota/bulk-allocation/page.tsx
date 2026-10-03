import type { Metadata } from "next";
import { RotaRoute } from "../RotaRoute";

export const metadata: Metadata = {
  title: "Bulk Rota Allocation | CareVerity ECM",
  description: "Bulk allocation tools for CareVerity ECM rota planning."
};

export default function BulkAllocationPage() {
  return <RotaRoute />;
}
