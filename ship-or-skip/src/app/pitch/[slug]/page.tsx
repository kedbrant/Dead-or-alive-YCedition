import { getOrCreateSessionId } from "@/lib/session/manager";
import { PitchClient } from "./pitch-client";

interface PitchPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PitchPage({ params }: PitchPageProps) {
  const { slug } = await params;
  const sessionId = await getOrCreateSessionId();

  return <PitchClient slug={slug} sessionId={sessionId} />;
}
