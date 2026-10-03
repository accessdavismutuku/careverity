import type { Metadata } from "next";
import { RotaRoute } from "../RotaRoute";

export const metadata: Metadata = {
  title: "Unallocated Visits | CareVerity ECM",
  description: "Unallocated visit queue and cover tools for CareVerity ECM."
};

export default function UnallocatedRotaPage() {
  return <RotaRoute />;
}
