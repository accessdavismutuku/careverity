import type { Metadata } from "next";
import { CareVerityPrototype } from "../careverity-prototype";

export const metadata: Metadata = {
  title: "HR / Staff Files | CareVerity ECM",
  description: "Search staff records, add staff members and open individual private staff files."
};

export default function CareVerityStaffFilesPage() {
  return <CareVerityPrototype initialModule="staff" />;
}
