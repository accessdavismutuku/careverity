import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "Rota / Shift Allocation | CareVerity ECM",
  description: "Create client visits, allocate care workers, manage regular carers, temporary cover, unallocated visits and future rota planning."
};

export default function CareVerityRotaPage() {
  return <CareVerityPrototype initialModule="rota" />;
}
