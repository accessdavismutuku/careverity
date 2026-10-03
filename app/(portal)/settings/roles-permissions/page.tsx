import type { Metadata } from "next";
import { CareVerityPrototype } from "../../../careverity-ecm/careverity-prototype";

export const metadata: Metadata = {
  title: "Roles & Permissions | CareVerity ECM",
  description: "Demo role-based access control centre for CareVerity ECM."
};

export default function RolesPermissionsPage() {
  return <CareVerityPrototype initialModule="settings" initialSettingsSection="Roles & Permissions" />;
}
