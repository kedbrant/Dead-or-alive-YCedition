import { Idea } from "@/lib/supabase/types";

export type CardAnimationState = "entering" | "visible" | "exiting-ship" | "exiting-skip";

interface IdeaCardProps {
  idea: Pick<Idea, "hero" | "subtitle" | "source" | "yc_batch" | "yc_industry">;
  animationState?: CardAnimationState;
}

export function IdeaCard({ idea, animationState = "visible" }: IdeaCardProps) {
  const getAnimationClasses = () => {
    switch (animationState) {
      case "entering":
        return "animate-card-enter";
      case "exiting-ship":
        return "animate-card-exit-right";
      case "exiting-skip":
        return "animate-card-exit-left";
      case "visible":
      default:
        return "";
    }
  };

  return (
    <div
      className={`w-full max-w-[480px] mx-auto bg-gradient-to-br from-surface to-surface/80 rounded-3xl px-8 py-14
        border border-foreground/10 shadow-2xl shadow-black/20
        backdrop-blur-sm
        ${getAnimationClasses()}`}
    >
      {/* Decorative quote marks */}
      <div className="text-6xl text-foreground/10 font-serif leading-none mb-2 select-none">&ldquo;</div>
      <h2 className="text-[32px] font-bold text-center leading-tight mb-6">
        {idea.hero}
      </h2>
      <p className="text-[18px] text-center text-foreground/70 leading-relaxed">
        {idea.subtitle}
      </p>
      <div className="text-6xl text-foreground/10 font-serif leading-none mt-2 text-right select-none">&rdquo;</div>

      {/* YC batch and industry info - only shown for YC companies */}
      {idea.source === "yc" && (idea.yc_batch || idea.yc_industry) && (
        <div className="mt-6 text-center text-sm text-foreground/50">
          {idea.yc_batch && <span>YC {idea.yc_batch}</span>}
          {idea.yc_batch && idea.yc_industry && <span> • </span>}
          {idea.yc_industry && <span>{idea.yc_industry}</span>}
        </div>
      )}
    </div>
  );
}
