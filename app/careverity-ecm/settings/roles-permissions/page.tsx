import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Roles & Permissions | CareVerity ECM",
  description: "Configure office, admin, mobile, family and auditor role-based access controls."
};

export default function CareVerityRolesPermissionsPage() {
  return <CareVerityPrototype initialModule="settings" initialSettingsSection="Roles & Permissions" />;
}
