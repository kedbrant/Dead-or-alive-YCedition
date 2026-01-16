import { Suspense } from "react";
import { ExploreClient } from "./explore-client";

function ExploreLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
    </div>
  );
}

export default function ExplorePage() {
  return (
    <Suspense fallback={<ExploreLoading />}>
      <ExploreClient />
    </Suspense>
  );
}
