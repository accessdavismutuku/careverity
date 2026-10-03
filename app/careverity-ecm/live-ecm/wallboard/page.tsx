import type { Metadata } from "next";
import { CareVerityPrototype } from "../../careverity-prototype";

export const metadata: Metadata = {
  title: "Live ECM TV Wallboard | CareVerity ECM",
  description: "Office TV wallboard for authorised Live ECM monitoring."
};

export default function CareVerityLiveEcmWallboardPage() {
  return <CareVerityPrototype initialLiveEcmPath="wallboard" initialModule="live" />;
}
