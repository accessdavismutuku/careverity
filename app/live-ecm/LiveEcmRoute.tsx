import { CareVerityPrototype } from "../careverity-ecm/careverity-prototype";

export function LiveEcmRoute({ initialLiveEcmPath = "" }: { initialLiveEcmPath?: string }) {
  return <CareVerityPrototype initialLiveEcmPath={initialLiveEcmPath} initialModule="live" />;
}
