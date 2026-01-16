import { getSessionId } from "@/lib/session/manager";
import { PlayClient } from "./play-client";
import { GameSubHeader } from "@/components/layout/game-sub-header";

export default async function PlayPage() {
  const sessionId = await getSessionId();

  return (
    <>
      <GameSubHeader />
      <PlayClient sessionId={sessionId} />
    </>
  );
}
