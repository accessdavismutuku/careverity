import type { Metadata } from "next";
import { LiveEcmRoute } from "../LiveEcmRoute";

export const metadata: Metadata = {
  title: "Live ECM TV Wallboard | CareVerity ECM",
  description: "Full-screen TV and wallboard view for live ECM monitoring."
};

export default function LiveEcmWallboardPage() {
  return <LiveEcmRoute initialLiveEcmPath="wallboard" />;
}
