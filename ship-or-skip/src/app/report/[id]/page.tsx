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

function getScoreColor(score: number): string {
  if (score >= 80) return "text-green-500";
  if (score >= 60) return "text-yellow-500";
  if (score >= 40) return "text-orange-500";
  return "text-red-500";
}

function getScoreBgColor(score: number): string {
  if (score >= 80) return "bg-green-500";
  if (score >= 60) return "bg-yellow-500";
  if (score >= 40) return "bg-orange-500";
  return "bg-red-500";
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

  const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shiporskip.app";

  return {
    title,
    description,
    openGraph: {
      type: "article",
      title: `Startup Idea Validation: ${report.score}/100`,
      description,
      siteName: "YC Archive - Idea Validator",
      url: `${siteUrl}/report/${id}`,
      images: [
        {
          url: `${siteUrl}/api/og?hero=${encodeURIComponent(`Score: ${report.score}/100 - ${getScoreLabel(report.score)}`)}`,
          width: 1200,
          height: 630,
          alt: `Validation score: ${report.score}/100`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `Startup Idea Validation: ${report.score}/100`,
      description,
      images: [
        `${siteUrl}/api/og?hero=${encodeURIComponent(`Score: ${report.score}/100 - ${getScoreLabel(report.score)}`)}`,
      ],
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
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-1">MARKET TRENDS</h2>
          <p className="text-foreground/60 text-sm mb-4">
            Search interest over time
          </p>

          {sections.trends.data ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold">
                    {sections.trends.data.currentLevel}
                  </span>
                  <span className="text-foreground/60">/100</span>
                </div>
                <div
                  className={`text-lg font-medium ${
                    sections.trends.data.changePercent >= 0
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {sections.trends.data.changePercent >= 0 ? "+" : ""}
                  {sections.trends.data.changePercent}%
                </div>
              </div>

              {/* Simple Trend Chart */}
              {sections.trends.data.timeline &&
                sections.trends.data.timeline.length > 0 && (
                  <div className="h-24 flex items-end gap-0.5 mb-4">
                    {sections.trends.data.timeline.map((point, index) => (
                      <div
                        key={index}
                        className={`flex-1 ${getScoreBgColor(point.value)} opacity-60 rounded-t`}
                        style={{ height: `${Math.max(point.value, 5)}%` }}
                        title={`${point.date}: ${point.value}`}
                      />
                    ))}
                  </div>
                )}
            </>
          ) : (
            <p className="text-foreground/60 text-sm italic">
              Trends data not available for this topic.
            </p>
          )}

          <p className="text-foreground/80">{sections.trends.summary}</p>
        </div>

        {/* Recommendations Section */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">RECOMMENDATIONS</h2>

          {sections.recommendations && sections.recommendations.length > 0 ? (
            <div className="space-y-4">
              {sections.recommendations.map((rec, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">{rec.title}</h3>
                    <p className="text-foreground/70 text-sm">
                      {rec.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-foreground/60 text-sm italic">
              No specific recommendations available.
            </p>
          )}
        </div>

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
