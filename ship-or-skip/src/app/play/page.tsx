import { getSessionId } from "@/lib/session/manager";
import { VotingClient } from "./voting-client";

export default async function PlayPage() {
  const sessionId = await getSessionId();

  return <VotingClient sessionId={sessionId} />;
}
