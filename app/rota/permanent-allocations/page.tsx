import type { Metadata } from "next";
import { RotaRoute } from "../RotaRoute";

export const metadata: Metadata = {
  title: "Permanent Allocations | CareVerity ECM",
  description: "Permanent regular carer allocation management for CareVerity ECM."
};

export default function PermanentAllocationsPage() {
  return <RotaRoute />;
}
