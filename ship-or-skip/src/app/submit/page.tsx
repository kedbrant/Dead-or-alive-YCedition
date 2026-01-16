import { Suspense } from "react";
import { SubmitClient } from "./submit-client";

function SubmitLoading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-[480px] mx-auto text-center">
        <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin mx-auto mb-4" />
        <p className="text-foreground/60">Loading...</p>
      </div>
    </div>
  );
}

export default function SubmitPage() {
  return (
    <Suspense fallback={<SubmitLoading />}>
      <SubmitClient />
    </Suspense>
  );
}
