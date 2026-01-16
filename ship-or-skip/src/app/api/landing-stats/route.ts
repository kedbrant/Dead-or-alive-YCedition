import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Idea } from "@/lib/supabase/types";

// Featured company for landing page hook stat
// Can be changed to rotate different companies
const FEATURED_COMPANY_NAME = "Airbnb";

/**
 * GET /api/landing-stats
 * Returns stats for the landing page (company count, featured company skip %)
 */
export async function GET() {
  const supabase = createServerSupabaseClient();

  // Count YC companies in the database
  const { count, error: countError } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("source", "yc")
    .eq("is_active", true);

  if (countError) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }

  // Get featured company's vote stats
  const { data: featuredCompany, error: featuredError } = await supabase
    .from("ideas")
    .select("yc_name, ship_percentage, total_votes")
    .eq("yc_name", FEATURED_COMPANY_NAME)
    .eq("source", "yc")
    .limit(1)
    .returns<Pick<Idea, "yc_name" | "ship_percentage" | "total_votes">[]>();

  // Calculate skip percentage (100 - ship_percentage)
  let featuredSkipPercentage: number | null = null;
  let featuredCompanyName: string | null = null;
  let featuredHasVotes = false;

  if (!featuredError && featuredCompany && featuredCompany.length > 0) {
    const company = featuredCompany[0];
    if (company.total_votes > 0) {
      featuredSkipPercentage = 100 - company.ship_percentage;
      featuredCompanyName = company.yc_name;
      featuredHasVotes = true;
    }
  }

  return NextResponse.json({
    company_count: count ?? 0,
    featured_company_name: featuredCompanyName,
    featured_skip_percentage: featuredSkipPercentage,
    featured_has_votes: featuredHasVotes,
  });
}
