import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Report, ReportData } from "@/lib/supabase/types";
import { ReportActions } from "@/components/report/report-actions";
import { ScoreDisplay } from "@/components/report/score-display";
import { HistoricalSection } from "@/components/report/historical-section";
import { MarketSection } from "@/components/report/market-section";
import { SentimentSection } from "@/components/report/sentiment-section";
import { TrendsSection } from "@/components/report/trends-section";
import { RecommendationsSection } from "@/components/report/recommendations-section";

export const dynamic = "force-dynamic";

interface ReportPageProps {
  params: Promise<{ id: string }>;
}

async function getReportById(id: string): Promise<Report | null> {
  const supabase = createServerSupabaseClient();

  const { data, error } = await supabase
    .from("reports")
    .select("*")
    .eq("id", id)
    .limit(1)
    .single();

  if (error || !data) {
    return null;
  }
  return data;
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Risky";
  return "Caution";
}

function truncateIdea(idea: string, maxLength: number = 60): string {
  if (idea.length <= maxLength) return idea;
  return idea.substring(0, maxLength).trim() + "...";
}

export async function generateMetadata({
  params,
}: ReportPageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    return {
      title: "Report Not Found",
    };
  }

  const reportData = report.report_data as ReportData;
  const ideaExcerpt = truncateIdea(reportData.idea);
  const title = `Validation Score: ${report.score}/100 - ${getScoreLabel(report.score)}`;
  const description = `${ideaExcerpt} - ${reportData.scoreReasoning}`;

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://ycarchive.com";

  // Build dynamic OG image URL with report-specific parameters
  const ogImageParams = new URLSearchParams({
    type: "report",
    score: report.score.toString(),
    idea: truncateIdea(reportData.idea, 100),
  });
  const ogImageUrl = `${siteUrl}/api/og?${ogImageParams.toString()}`;

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: `Startup Idea Validation: ${report.score}/100 - ${getScoreLabel(report.score)}`,
      description,
      siteName: "YC Archive - Idea Validator",
      url: `${siteUrl}/report/${id}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Validation score: ${report.score}/100 - ${getScoreLabel(report.score)}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Startup Idea Validation: ${report.score}/100 - ${getScoreLabel(report.score)}`,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ReportPage({ params }: ReportPageProps) {
  const { id } = await params;
  const report = await getReportById(id);

  if (!report) {
    notFound();
  }

  const reportData = report.report_data as ReportData;
  const { sections } = reportData;

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Back link */}
        <Link
          href="/"
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
          Validate another idea
        </Link>

        {/* Idea Display */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide mb-2">
            Your Idea
          </h2>
          <p className="text-lg text-foreground">{reportData.idea}</p>
        </div>

        {/* Score Display */}
        <div className="mb-6">
          <ScoreDisplay score={report.score} scoreReasoning={reportData.scoreReasoning} />
        </div>

        {/* Historical Analysis Section */}
        <HistoricalSection
          summary={sections.historical.summary}
          companies={sections.historical.companies}
          outcomeCounts={sections.historical.outcomeCounts}
        />

        {/* Market Analysis Section */}
        <MarketSection
          summary={sections.market.summary}
          articles={sections.market.articles}
        />

        {/* Sentiment Analysis Section */}
        <SentimentSection
          summary={sections.sentiment.summary}
          posts={sections.sentiment.posts}
          sentimentBreakdown={sections.sentiment.sentimentBreakdown}
        />

        {/* Trends Analysis Section */}
        <TrendsSection
          summary={sections.trends.summary}
          data={sections.trends.data}
        />

        {/* Recommendations Section */}
        <RecommendationsSection recommendations={sections.recommendations} />

        {/* Actions Bar */}
        <ReportActions reportId={id} score={report.score} />

        {/* Report metadata */}
        <div className="mt-8 text-center text-foreground/40 text-sm">
          Report generated{" "}
          {new Date(report.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </div>
    </div>
  );
}
