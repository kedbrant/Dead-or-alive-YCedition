import { getSessionId } from "@/lib/session/manager";
import { BattleClient } from "./battle-client";

export default async function BattlePage() {
  const sessionId = await getSessionId();

  return <BattleClient sessionId={sessionId} />;
}
