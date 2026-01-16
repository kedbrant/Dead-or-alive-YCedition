import { StatsClient } from "./stats-client";
import { GameSubHeader } from "@/components/layout/game-sub-header";

export default function StatsPage() {
  return (
    <>
      <GameSubHeader />
      <StatsClient />
    </>
  );
}
