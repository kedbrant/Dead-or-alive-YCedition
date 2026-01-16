import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/explore/industries
 * Returns unique industry values from YC companies for the filter dropdown.
 * Results are sorted alphabetically and cached for performance.
 */
export async function GET() {
  const supabase = createServerSupabaseClient();

  // Fetch distinct yc_industry values from YC companies
  const { data, error } = await supabase
    .from("ideas")
    .select("yc_industry")
    .eq("source", "yc")
    .not("yc_industry", "is", null)
    .not("yc_industry", "eq", "");

  if (error) {
    console.error("Industries API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch industries" },
      { status: 500 }
    );
  }

  // Extract unique industry values
  const uniqueIndustries = new Set<string>();
  for (const row of data || []) {
    if (row.yc_industry && row.yc_industry.trim()) {
      uniqueIndustries.add(row.yc_industry.trim());
    }
  }

  // Sort alphabetically
  const industries = Array.from(uniqueIndustries).sort((a, b) =>
    a.toLowerCase().localeCompare(b.toLowerCase())
  );

  // Return with cache headers for performance
  return NextResponse.json(
    { industries },
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    }
  );
}
