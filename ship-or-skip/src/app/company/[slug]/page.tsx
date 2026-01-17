import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Idea, SourceOutcome } from "@/lib/supabase/types";
import { OutcomeBadge } from "@/components/voting/outcome-badge";
import { BackButton } from "@/components/ui/back-button";
import { CompanyLogo } from "@/components/ui/company-logo";

export const dynamic = "force-dynamic";

interface CompanyPageProps {
  params: Promise<{ slug: string }>;
}

type CompanyData = Pick<
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
>;

type SimilarCompany = Pick<
  Idea,
  | "yc_slug"
  | "yc_name"
  | "yc_logo_url"
  | "yc_batch"
  | "source_outcome"
  | "hero"
>;

async function getCompanyBySlug(slug: string): Promise<CompanyData | null> {
  const supabase = createServerSupabaseClient();

  // Try to find by yc_slug first
  let { data, error } = await supabase
    .from("ideas")
    .select(
      `id, slug, hero, subtitle, ship_percentage, total_votes, source, source_outcome,
       yc_id, yc_name, yc_slug, yc_batch, yc_status, yc_logo_url, yc_website,
       yc_long_description, yc_team_size, yc_industry, yc_subindustry, yc_tags,
       yc_location, yc_launched_at, yc_is_top_company`
    )
    .eq("yc_slug", slug)
    .eq("is_active", true)
    .limit(1)
    .returns<CompanyData[]>();

  if (error || !data || data.length === 0) {
    // Fallback to regular slug
    const result = await supabase
      .from("ideas")
      .select(
        `id, slug, hero, subtitle, ship_percentage, total_votes, source, source_outcome,
         yc_id, yc_name, yc_slug, yc_batch, yc_status, yc_logo_url, yc_website,
         yc_long_description, yc_team_size, yc_industry, yc_subindustry, yc_tags,
         yc_location, yc_launched_at, yc_is_top_company`
      )
      .eq("slug", slug)
      .eq("is_active", true)
      .limit(1)
      .returns<CompanyData[]>();

    data = result.data;
    error = result.error;
  }

  if (error || !data || data.length === 0) {
    return null;
  }
  return data[0];
}

async function getSimilarCompanies(
  industry: string | null,
  currentSlug: string
): Promise<SimilarCompany[]> {
  if (!industry) return [];

  const supabase = createServerSupabaseClient();

  const { data } = await supabase
    .from("ideas")
    .select("yc_slug, yc_name, yc_logo_url, yc_batch, source_outcome, hero")
    .eq("yc_industry", industry)
    .eq("source", "yc")
    .eq("is_active", true)
    .neq("yc_slug", currentSlug)
    .limit(6)
    .returns<SimilarCompany[]>();

  return data || [];
}

export async function generateMetadata({
  params,
}: CompanyPageProps): Promise<Metadata> {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    return {
      title: "Company Not Found",
    };
  }

  const companyName = company.yc_name || "Company";
  const title = `${companyName} - Ship or Skip`;
  const description =
    company.yc_long_description || company.subtitle || company.hero;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title,
      description,
      siteName: "Ship or Skip",
      images: company.yc_logo_url ? [{ url: company.yc_logo_url }] : undefined,
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  const { slug } = await params;
  const company = await getCompanyBySlug(slug);

  if (!company) {
    notFound();
  }

  const similarCompanies = await getSimilarCompanies(
    company.yc_industry,
    company.yc_slug || ""
  );

  const ycProfileUrl = company.yc_slug
    ? `https://www.ycombinator.com/companies/${company.yc_slug}`
    : null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back button */}
        <div className="mb-6">
          <BackButton />
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Company Identity */}
          <div className="lg:col-span-1 space-y-6">
            {/* Logo & Name Card */}
            <div className="bg-surface rounded-2xl p-4 sm:p-6">
              <div className="flex flex-row sm:flex-col items-center sm:text-center gap-4 sm:gap-0">
                {/* Company Logo */}
                <CompanyLogo
                  src={company.yc_logo_url}
                  alt={`${company.yc_name || "Company"} logo`}
                  name={company.yc_name || "?"}
                  size="md"
                  className="sm:!w-24 sm:!h-24 rounded-xl sm:rounded-2xl sm:mb-4"
                />

                <div className="flex-1 sm:w-full">
                  {/* Company Name */}
                  <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
                    {company.yc_name || "Unknown Company"}
                  </h1>

                  {/* Outcome Badge */}
                  <OutcomeBadge
                    outcome={company.source_outcome as SourceOutcome}
                    size="md"
                  />
                </div>
              </div>

              {/* External Links */}
              <div className="flex gap-3 mt-4 sm:mt-6 w-full">
                  {company.yc_website && (
                    <a
                      href={company.yc_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-ship text-white font-semibold rounded-xl text-sm
                        transition-all duration-150 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z" clipRule="evenodd" />
                      </svg>
                      Website
                    </a>
                  )}
                  {ycProfileUrl && (
                    <a
                      href={ycProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 border border-foreground/20 font-semibold rounded-xl text-sm
                        transition-all duration-150 hover:border-foreground/40 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-orange-500">Y</span>
                      YC Profile
                    </a>
                  )}
              </div>
            </div>

            {/* Company Info Card */}
            <div className="bg-surface rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">Company Info</h2>
              <div className="space-y-3">
                {company.yc_batch && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">YC Batch</span>
                    <span className="font-medium">{company.yc_batch}</span>
                  </div>
                )}
                {company.yc_industry && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Industry</span>
                    <span className="font-medium">{company.yc_industry}</span>
                  </div>
                )}
                {company.yc_subindustry && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Sub-industry</span>
                    <span className="font-medium">{company.yc_subindustry}</span>
                  </div>
                )}
                {company.yc_location && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Location</span>
                    <span className="font-medium text-right">{company.yc_location}</span>
                  </div>
                )}
                {company.yc_team_size && company.yc_team_size > 0 && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Team Size</span>
                    <span className="font-medium">{company.yc_team_size.toLocaleString()}</span>
                  </div>
                )}
                {company.yc_status && (
                  <div className="flex justify-between">
                    <span className="text-foreground/60">Status</span>
                    <span className="font-medium">{company.yc_status}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Crowd Vote Stats - Small Card */}
            <div className="bg-surface rounded-2xl p-6">
              <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">Crowd Prediction</h2>
              <div className="text-center mb-4">
                <span className="text-4xl font-bold">{company.ship_percentage}%</span>
                <span className="text-foreground/60 ml-2">Ship</span>
              </div>
              <div className="h-2 bg-foreground/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-ship transition-all duration-500"
                  style={{ width: `${company.ship_percentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-foreground/50">
                <span>{company.ship_percentage}% Ship</span>
                <span>{100 - company.ship_percentage}% Skip</span>
              </div>
              <p className="text-center text-foreground/50 text-sm mt-3">
                {company.total_votes.toLocaleString()} votes
              </p>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* One-liner Card */}
            <div className="bg-surface rounded-2xl p-4 sm:p-6">
              <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-2 sm:mb-3">The Pitch</h2>
              <p className="text-lg sm:text-2xl font-medium leading-relaxed">{company.hero}</p>
            </div>

            {/* About Section */}
            {company.yc_long_description && (
              <div className="bg-surface rounded-2xl p-4 sm:p-6">
                <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-3 sm:mb-4">About</h2>
                <p className="text-sm sm:text-base text-foreground/80 whitespace-pre-line leading-relaxed">
                  {company.yc_long_description}
                </p>
              </div>
            )}

            {/* Similar Companies */}
            {similarCompanies.length > 0 && (
              <div className="bg-surface rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">
                  Similar Companies in {company.yc_industry}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {similarCompanies.map((similar) => (
                    <Link
                      key={similar.yc_slug}
                      href={`/company/${similar.yc_slug}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-background hover:bg-foreground/5 transition-colors"
                    >
                      <CompanyLogo
                        src={similar.yc_logo_url}
                        alt={similar.yc_name || ""}
                        name={similar.yc_name || "?"}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{similar.yc_name}</span>
                          <OutcomeBadge outcome={similar.source_outcome as SourceOutcome} size="sm" />
                        </div>
                        <p className="text-xs text-foreground/50 truncate">{similar.hero}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {company.yc_tags && company.yc_tags.length > 0 && (
              <div className="bg-surface rounded-2xl p-6">
                <h2 className="text-sm font-semibold text-foreground/50 uppercase tracking-wide mb-4">Tags</h2>
                <div className="flex flex-wrap gap-2">
                  {company.yc_tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 bg-foreground/10 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
