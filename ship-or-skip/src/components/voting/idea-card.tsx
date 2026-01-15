import { Idea } from "@/lib/supabase/types";

export type CardAnimationState = "entering" | "visible" | "exiting-ship" | "exiting-skip";

interface IdeaCardProps {
  idea: Pick<Idea, "hero" | "subtitle">;
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
      className={`w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12 ${getAnimationClasses()}`}
    >
      <h2 className="text-[32px] font-bold text-center leading-tight mb-4">
        {idea.hero}
      </h2>
      <p className="text-[18px] text-center text-foreground/80">
        {idea.subtitle}
      </p>
    </div>
  );
}
