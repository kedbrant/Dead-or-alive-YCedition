import { getSessionId } from "@/lib/session/manager";
import { PlayClient } from "./play-client";
import { GameSubHeader } from "@/components/layout/game-sub-header";

export default async function PlayPage() {
  // Session may be null, client will fetch from API if needed
  const sessionId = await getSessionId();

  return (
    <>
      <GameSubHeader />
      <PlayClient sessionId={sessionId} />
    </>
  );
}
