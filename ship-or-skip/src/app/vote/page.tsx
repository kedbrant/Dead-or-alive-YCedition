import { getOrCreateSessionId } from "@/lib/session/manager";
import { VotingClient } from "./voting-client";

export default async function VotePage() {
  const sessionId = await getOrCreateSessionId();

  return <VotingClient sessionId={sessionId} />;
}
