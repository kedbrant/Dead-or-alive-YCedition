import { Idea } from "@/lib/supabase/types";

interface IdeaCardProps {
  idea: Pick<Idea, "hero" | "subtitle">;
}

export function IdeaCard({ idea }: IdeaCardProps) {
  return (
    <div className="w-full max-w-[480px] mx-auto bg-surface rounded-2xl px-6 py-12">
      <h2 className="text-[32px] font-bold text-center leading-tight mb-4">
        {idea.hero}
      </h2>
      <p className="text-[18px] text-center text-foreground/80">
        {idea.subtitle}
      </p>
    </div>
  );
}
