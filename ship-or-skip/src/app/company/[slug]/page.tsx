import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getSessionId } from "@/lib/session/manager";
import { Idea, SourceOutcome } from "@/lib/supabase/types";
import { OutcomeBadge } from "@/components/voting/outcome-badge";
import { InsightCard } from "@/components/voting/insight-card";
import { CompanyVoteCta } from "@/components/voting/company-vote-cta";

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

  const sessionId = await getSessionId();
  const ycProfileUrl = company.yc_slug
    ? `https://www.ycombinator.com/companies/${company.yc_slug}`
    : null;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/play"
          className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
              clipRule="evenodd"
            />
          </svg>
          Back to voting
        </Link>

        {/* Company Header */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4 mb-4">
            {/* Company Logo */}
            <div className="w-16 h-16 rounded-xl bg-foreground/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              {company.yc_logo_url ? (
                <Image
                  src={company.yc_logo_url}
                  alt={`${company.yc_name || "Company"} logo`}
                  width={64}
                  height={64}
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-bold text-foreground/40">
                  {(company.yc_name || "?")[0].toUpperCase()}
                </span>
              )}
            </div>

            {/* Company Name and Badge */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold mb-2 break-words">
                {company.yc_name || "Unknown Company"}
              </h1>
              <OutcomeBadge
                outcome={company.source_outcome as SourceOutcome}
                size="lg"
              />
            </div>
          </div>

          {/* One-liner pitch */}
          <p className="text-lg text-foreground/80 mb-4">{company.hero}</p>

          {/* Metadata grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {company.yc_batch && (
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Batch:</span>
                <span className="font-medium">YC {company.yc_batch}</span>
              </div>
            )}
            {company.yc_industry && (
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Industry:</span>
                <span className="font-medium">{company.yc_industry}</span>
              </div>
            )}
            {company.yc_subindustry && (
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Sub-industry:</span>
                <span className="font-medium">{company.yc_subindustry}</span>
              </div>
            )}
            {company.yc_location && (
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Location:</span>
                <span className="font-medium">{company.yc_location}</span>
              </div>
            )}
            {company.yc_team_size && company.yc_team_size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-foreground/50">Team Size:</span>
                <span className="font-medium">
                  {company.yc_team_size.toLocaleString()} employees
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Crowd Vote Stats */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4">Crowd Prediction</h2>
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-4xl font-bold">
                {company.ship_percentage}%
              </span>
              <span className="text-foreground/60 ml-2">would Ship</span>
            </div>
            <div className="text-foreground/60">
              {company.total_votes.toLocaleString()} votes
            </div>
          </div>

          {/* Vote bar */}
          <div className="h-3 bg-foreground/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-ship transition-all duration-500"
              style={{ width: `${company.ship_percentage}%` }}
            />
          </div>
          <div className="flex justify-between text-sm mt-2 text-foreground/60">
            <span>Ship {company.ship_percentage}%</span>
            <span>Skip {100 - company.ship_percentage}%</span>
          </div>
        </div>

        {/* Vote CTA */}
        <div className="mb-6">
          <CompanyVoteCta
            ideaId={company.id}
            companyName={company.yc_name || "this company"}
            sessionId={sessionId}
            initialShipPercentage={company.ship_percentage}
          />
        </div>

        {/* Insight Card */}
        <div className="mb-6">
          <InsightCard
            outcome={company.source_outcome as SourceOutcome}
            shipPercentage={company.ship_percentage}
            totalVotes={company.total_votes}
            companyName={company.yc_name || "this company"}
          />
        </div>

        {/* Long Description */}
        {company.yc_long_description && (
          <div className="bg-surface rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">About</h2>
            <p className="text-foreground/80 whitespace-pre-line leading-relaxed">
              {company.yc_long_description}
            </p>
          </div>
        )}

        {/* Tags */}
        {company.yc_tags && company.yc_tags.length > 0 && (
          <div className="bg-surface rounded-2xl p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {company.yc_tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-foreground/10 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* External Links */}
        <div className="flex flex-col sm:flex-row gap-3">
          {company.yc_website && (
            <a
              href={company.yc_website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 bg-ship text-white font-bold rounded-xl
                transition-all duration-150
                hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] hover:scale-[1.02]
                active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                  clipRule="evenodd"
                />
              </svg>
              Visit Website
            </a>
          )}
          {ycProfileUrl && (
            <a
              href={ycProfileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 border border-foreground/20 text-foreground font-bold rounded-xl
                transition-all duration-150
                hover:border-foreground/40 hover:scale-[1.02]
                active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-orange-500"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
              View on YC
            </a>
          )}
        </div>

        {/* Back to voting CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/play"
            className="text-foreground/60 hover:text-foreground transition-colors"
          >
            ← Continue voting on more companies
          </Link>
        </div>
      </div>
    </div>
  );
}
