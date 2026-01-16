import { getSessionId } from "@/lib/session/manager";
import { BattleClient } from "./battle-client";
import { GameSubHeader } from "@/components/layout/game-sub-header";

export default async function BattlePage() {
  const sessionId = await getSessionId();

  return (
    <>
      <GameSubHeader />
      <BattleClient sessionId={sessionId} />
    </>
  );
}
