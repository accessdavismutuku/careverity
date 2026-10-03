import type { Metadata } from "next";
import { RotaRoute } from "./RotaRoute";

export const metadata: Metadata = {
  title: "Rota / Shift Allocation | CareVerity ECM",
  description: "Create client visits, allocate care workers, manage regular carers, temporary cover, unallocated visits and future rota planning."
};

export default function RotaPage() {
  return <RotaRoute />;
}
