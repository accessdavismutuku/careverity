import type { Metadata } from "next";
import { LiveEcmRoute } from "../LiveEcmRoute";

export const metadata: Metadata = {
  title: "Live ECM Board | CareVerity ECM",
  description: "Live care delivery board for today's CareVerity ECM visits."
};

export default function LiveEcmBoardPage() {
  return <LiveEcmRoute initialLiveEcmPath="board" />;
}
