import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";

type CompanyResponse = Pick<
  Idea,
  | "id"
  | "slug"
  | "hero"
  | "subtitle"
  | "ship_percentage"
  | "total_votes"
  | "source"
  | "source_outcome"
  | "yc_id"
  | "yc_name"
  | "yc_slug"
  | "yc_batch"
  | "yc_status"
  | "yc_logo_url"
  | "yc_website"
  | "yc_long_description"
  | "yc_team_size"
  | "yc_industry"
  | "yc_subindustry"
  | "yc_tags"
  | "yc_location"
  | "yc_launched_at"
  | "yc_is_top_company"
  | "is_in_active_pool"
  | "created_at"
>;

const SELECT_FIELDS = `
  id, slug, hero, subtitle, ship_percentage, total_votes, source, source_outcome,
  yc_id, yc_name, yc_slug, yc_batch, yc_status, yc_logo_url, yc_website,
  yc_long_description, yc_team_size, yc_industry, yc_subindustry, yc_tags,
  yc_location, yc_launched_at, yc_is_top_company, is_in_active_pool, created_at
`;

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

  // Try to find by yc_slug first
  let { data, error } = await supabase
    .from("ideas")
    .select(SELECT_FIELDS)
    .eq("yc_slug", slug)
    .eq("is_active", true)
    .limit(1)
    .returns<CompanyResponse[]>();

  if (error || !data || data.length === 0) {
    // Fallback to regular slug
    const result = await supabase
      .from("ideas")
      .select(SELECT_FIELDS)
      .eq("slug", slug)
      .eq("is_active", true)
      .limit(1)
      .returns<CompanyResponse[]>();

    data = result.data;
    error = result.error;
  }

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch company" },
      { status: 500 }
    );
  }

  if (!data || data.length === 0) {
    return NextResponse.json(
      { error: "Company not found" },
      { status: 404 }
    );
  }

  const company = data[0];

  return NextResponse.json({
    id: company.id,
    slug: company.slug,
    hero: company.hero,
    subtitle: company.subtitle,
    ship_percentage: company.ship_percentage,
    total_votes: company.total_votes,
    source: company.source,
    source_outcome: company.source_outcome,
    yc_id: company.yc_id,
    yc_name: company.yc_name,
    yc_slug: company.yc_slug,
    yc_batch: company.yc_batch,
    yc_status: company.yc_status,
    yc_logo_url: company.yc_logo_url,
    yc_website: company.yc_website,
    yc_long_description: company.yc_long_description,
    yc_team_size: company.yc_team_size,
    yc_industry: company.yc_industry,
    yc_subindustry: company.yc_subindustry,
    yc_tags: company.yc_tags,
    yc_location: company.yc_location,
    yc_launched_at: company.yc_launched_at,
    yc_is_top_company: company.yc_is_top_company,
    is_in_active_pool: company.is_in_active_pool,
    created_at: company.created_at,
  });
}
