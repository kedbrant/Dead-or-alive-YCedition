import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <main className="flex flex-col items-center gap-8 max-w-lg text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Would you ship this startup?
        </h1>

        {/* Hook stat */}
        <div className="bg-surface rounded-2xl px-6 py-4">
          <p className="text-lg sm:text-xl">
            <span className="text-skip font-bold">73%</span> would have skipped
            Airbnb&apos;s pitch
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/vote"
          className="bg-ship text-background font-bold text-lg px-8 py-4 rounded-xl hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-150"
        >
          Start Voting
        </Link>

        {/* How it works */}
        <div className="text-foreground/70 space-y-2 mt-4">
          <p className="text-sm font-medium uppercase tracking-wide text-foreground/50">
            How it works
          </p>
          <div className="space-y-1 text-sm sm:text-base">
            <p>Swipe through real startup pitches</p>
            <p>Vote Ship or Skip on each idea</p>
            <p>See what the crowd thinks</p>
            <p>Submit your own pitch</p>
          </div>
        </div>
      </main>
    </div>
  );
}
