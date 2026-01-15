import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";

type PitchResponse = Pick<
  Idea,
  "id" | "hero" | "subtitle" | "submitter_twitter" | "ship_percentage" | "total_votes" | "created_at"
>;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  if (!slug) {
    return NextResponse.json(
      { error: "slug is required" },
      { status: 400 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Fetch idea by slug
  const { data: ideas, error } = await supabase
    .from("ideas")
    .select("id, hero, subtitle, submitter_twitter, ship_percentage, total_votes, created_at")
    .eq("slug", slug)
    .eq("is_active", true)
    .limit(1)
    .returns<PitchResponse[]>();

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch idea" },
      { status: 500 }
    );
  }

  if (!ideas || ideas.length === 0) {
    return NextResponse.json(
      { error: "Idea not found" },
      { status: 404 }
    );
  }

  const idea = ideas[0];

  return NextResponse.json({
    id: idea.id,
    hero: idea.hero,
    subtitle: idea.subtitle,
    submitter_twitter: idea.submitter_twitter,
    ship_percentage: idea.ship_percentage,
    total_votes: idea.total_votes,
    created_at: idea.created_at,
  });
}
