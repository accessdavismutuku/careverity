import type { Metadata } from "next";
import { RotaRoute } from "../../RotaRoute";

export const metadata: Metadata = {
  title: "Shift Detail | CareVerity ECM",
  description: "CareVerity ECM shift detail, allocation and audit workflow."
};

export default function ShiftDetailPage() {
  return <RotaRoute />;
}
