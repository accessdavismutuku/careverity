import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "Staff Support & Recognition Intelligence | CareVerity ECM",
  description: "CareVerity HRIS support, recognition, coaching, medication/geofence alerts, AI-assisted drafts and CQC workforce evidence."
};

export default function StaffSupportRecognitionRoute() {
  return <CareVerityPrototype initialModule="staffsupport" />;
}
