import { getSessionId } from "@/lib/session/manager";
import { VotingClient } from "./voting-client";
import { GameSubHeader } from "@/components/layout/game-sub-header";

export default async function PlayPage() {
  const sessionId = await getSessionId();

  return (
    <>
      <GameSubHeader />
      <VotingClient sessionId={sessionId} />
    </>
  );
}
