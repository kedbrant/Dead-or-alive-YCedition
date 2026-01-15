import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";

/**
 * GET /api/landing-stats
 * Returns stats for the landing page (company count, etc.)
 */
export async function GET() {
  const supabase = createServerSupabaseClient();

  // Count YC companies in the database
  const { count, error } = await supabase
    .from("ideas")
    .select("*", { count: "exact", head: true })
    .eq("source", "yc")
    .eq("is_active", true);

  if (error) {
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    company_count: count ?? 0,
  });
}
