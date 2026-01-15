import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea, IdeaInsert } from "@/lib/supabase/types";

interface SubmitRequestBody {
  hero: string;
  subtitle: string;
  twitter_handle?: string;
}

interface SubmitResponse {
  idea_id: string;
  slug: string;
  share_url: string;
}

const MAX_SUBMISSIONS_PER_SESSION_PER_DAY = 10;

/**
 * Generates a URL-friendly slug from the hero text
 */
function generateSlug(hero: string): string {
  return hero
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Remove consecutive hyphens
    .replace(/^-|-$/g, "") // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
}

/**
 * Generates a unique slug by appending a random suffix if needed
 */
async function generateUniqueSlug(
  supabase: ReturnType<typeof createServerSupabaseClient>,
  baseSlug: string
): Promise<string> {
  // First try the base slug
  const { data: existing } = await supabase
    .from("ideas")
    .select("id")
    .eq("slug", baseSlug)
    .limit(1)
    .returns<Pick<Idea, "id">[]>();

  if (!existing || existing.length === 0) {
    return baseSlug;
  }

  // Add random suffix to make unique
  const suffix = Math.random().toString(36).substring(2, 8);
  return `${baseSlug}-${suffix}`;
}

export async function POST(request: NextRequest) {
  let body: SubmitRequestBody;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const { hero, subtitle, twitter_handle } = body;

  // Validate required fields
  if (!hero || !subtitle) {
    return NextResponse.json(
      { error: "hero and subtitle are required" },
      { status: 400 }
    );
  }

  // Validate field lengths
  if (hero.length > 60) {
    return NextResponse.json(
      { error: "hero must be 60 characters or less" },
      { status: 400 }
    );
  }

  if (subtitle.length > 100) {
    return NextResponse.json(
      { error: "subtitle must be 100 characters or less" },
      { status: 400 }
    );
  }

  // Get session ID from cookie header (same pattern as other endpoints)
  const sessionCookie = request.cookies.get("ship-or-skip-session");
  const sessionId = sessionCookie?.value;

  if (!sessionId) {
    return NextResponse.json(
      { error: "Session required. Please refresh the page." },
      { status: 401 }
    );
  }

  const supabase = createServerSupabaseClient();

  // Rate limiting: max 10 submissions per session per day
  const oneDayAgo = new Date();
  oneDayAgo.setDate(oneDayAgo.getDate() - 1);

  const { data: recentSubmissions, error: countError } = await supabase
    .from("ideas")
    .select("id")
    .eq("submitter_session_id", sessionId)
    .gte("created_at", oneDayAgo.toISOString())
    .returns<Pick<Idea, "id">[]>();

  if (countError) {
    console.error("Failed to check rate limit:", countError);
    // Continue anyway - don't block on rate limit check failure
  }

  if (recentSubmissions && recentSubmissions.length >= MAX_SUBMISSIONS_PER_SESSION_PER_DAY) {
    return NextResponse.json(
      { error: `Rate limit exceeded. Maximum ${MAX_SUBMISSIONS_PER_SESSION_PER_DAY} submissions per day.` },
      { status: 429 }
    );
  }

  // Generate unique slug
  const baseSlug = generateSlug(hero);
  if (!baseSlug) {
    return NextResponse.json(
      { error: "Invalid hero text - cannot generate URL slug" },
      { status: 400 }
    );
  }

  const slug = await generateUniqueSlug(supabase, baseSlug);

  // Clean twitter handle (remove @ if present)
  const cleanTwitterHandle = twitter_handle?.replace(/^@/, "").trim() || null;

  // Create the idea
  const ideaInsert: IdeaInsert = {
    slug,
    hero: hero.trim(),
    subtitle: subtitle.trim(),
    source: "user",
    submitter_twitter: cleanTwitterHandle,
    submitter_session_id: sessionId,
    ship_count: 0,
    skip_count: 0,
    total_votes: 0,
    ship_percentage: 0,
    is_active: true,
  };

  const writeClient = createServerSupabaseClient();
  const { data: insertedIdeas, error: insertError } = await writeClient
    .from("ideas")
    .insert(ideaInsert)
    .select("id, slug")
    .returns<Pick<Idea, "id" | "slug">[]>();

  if (insertError) {
    console.error("Failed to insert idea:", insertError);
    return NextResponse.json(
      { error: "Failed to submit idea" },
      { status: 500 }
    );
  }

  if (!insertedIdeas || insertedIdeas.length === 0) {
    return NextResponse.json(
      { error: "Failed to create idea" },
      { status: 500 }
    );
  }

  const insertedIdea = insertedIdeas[0];

  // Build share URL
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shiporskip.app";
  const shareUrl = `${baseUrl}/pitch/${insertedIdea.slug}`;

  const response: SubmitResponse = {
    idea_id: insertedIdea.id,
    slug: insertedIdea.slug,
    share_url: shareUrl,
  };

  return NextResponse.json(response);
}
