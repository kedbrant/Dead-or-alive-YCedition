import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { Report, ReportData, SourceOutcome } from "@/lib/supabase/types";
import { ReportActions } from "@/components/report/report-actions";
import { ScoreDisplay } from "@/components/report/score-display";

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

function getOutcomeEmoji(outcome: SourceOutcome): string {
  switch (outcome) {
    case "unicorn":
      return "🦄";
    case "acquired":
      return "🤝";
    case "dead":
      return "💀";
    case "active":
      return "🚀";
    default:
      return "❓";
  }
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
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-1">HISTORICAL ANALYSIS</h2>
          <p className="text-foreground/60 text-sm mb-4">
            Based on 5,500+ YC companies
          </p>

          {/* Outcome Distribution */}
          {sections.historical.outcomeCounts && (
            <div className="grid grid-cols-4 gap-2 mb-4">
              <div className="text-center p-3 bg-foreground/5 rounded-xl">
                <div className="text-2xl mb-1">🦄</div>
                <div className="text-lg font-bold">
                  {sections.historical.outcomeCounts.unicorn}
                </div>
                <div className="text-xs text-foreground/60">Unicorn</div>
              </div>
              <div className="text-center p-3 bg-foreground/5 rounded-xl">
                <div className="text-2xl mb-1">🤝</div>
                <div className="text-lg font-bold">
                  {sections.historical.outcomeCounts.acquired}
                </div>
                <div className="text-xs text-foreground/60">Acquired</div>
              </div>
              <div className="text-center p-3 bg-foreground/5 rounded-xl">
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-lg font-bold">
                  {sections.historical.outcomeCounts.active}
                </div>
                <div className="text-xs text-foreground/60">Active</div>
              </div>
              <div className="text-center p-3 bg-foreground/5 rounded-xl">
                <div className="text-2xl mb-1">💀</div>
                <div className="text-lg font-bold">
                  {sections.historical.outcomeCounts.dead}
                </div>
                <div className="text-xs text-foreground/60">Dead</div>
              </div>
            </div>
          )}

          <p className="text-foreground/80 mb-4">{sections.historical.summary}</p>

          {/* Similar Companies */}
          {sections.historical.companies && sections.historical.companies.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-foreground/60 uppercase tracking-wide mb-3">
                Similar Companies ({sections.historical.companies.length})
              </h3>
              <div className="space-y-2">
                {sections.historical.companies.slice(0, 5).map((company, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 bg-foreground/5 rounded-lg"
                  >
                    <span className="text-xl">
                      {getOutcomeEmoji(company.outcome)}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{company.name}</span>
                        {company.batch && (
                          <span className="text-xs text-foreground/60">
                            {company.batch}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-foreground/70 truncate">
                        {company.pitch}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Market Analysis Section */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-1">CURRENT MARKET</h2>
          <p className="text-foreground/60 text-sm mb-4">
            What&apos;s happening right now
          </p>

          <p className="text-foreground/80 mb-4">{sections.market.summary}</p>

          {/* News Articles */}
          {sections.market.articles && sections.market.articles.length > 0 ? (
            <div className="space-y-2">
              {sections.market.articles.slice(0, 5).map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
                >
                  <div className="font-medium text-sm line-clamp-2">
                    {article.title}
                  </div>
                  <div className="text-xs text-foreground/60 mt-1">
                    {article.source} • {article.date}
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <p className="text-foreground/60 text-sm italic">
              No recent news articles found for this topic.
            </p>
          )}
        </div>

        {/* Sentiment Analysis Section */}
        <div className="bg-surface rounded-2xl p-6 mb-6">
          <h2 className="text-xl font-bold mb-1">COMMUNITY SENTIMENT</h2>
          <p className="text-foreground/60 text-sm mb-4">
            What people are saying
          </p>

          {/* Sentiment Breakdown */}
          {sections.sentiment.sentimentBreakdown && (
            <div className="flex gap-2 mb-4">
              <div className="flex-1 text-center p-2 bg-green-500/10 rounded-lg">
                <div className="text-green-500 font-bold">
                  {sections.sentiment.sentimentBreakdown.positive}%
                </div>
                <div className="text-xs text-foreground/60">Positive</div>
              </div>
              <div className="flex-1 text-center p-2 bg-gray-500/10 rounded-lg">
                <div className="text-gray-400 font-bold">
                  {sections.sentiment.sentimentBreakdown.neutral}%
                </div>
                <div className="text-xs text-foreground/60">Neutral</div>
              </div>
              <div className="flex-1 text-center p-2 bg-red-500/10 rounded-lg">
                <div className="text-red-500 font-bold">
                  {sections.sentiment.sentimentBreakdown.negative}%
                </div>
                <div className="text-xs text-foreground/60">Negative</div>
              </div>
            </div>
          )}

          <p className="text-foreground/80 mb-4">{sections.sentiment.summary}</p>

          {/* Reddit Posts */}
          {sections.sentiment.posts && sections.sentiment.posts.length > 0 && (
            <div className="space-y-2">
              {sections.sentiment.posts.slice(0, 5).map((post, index) => (
                <a
                  key={index}
                  href={post.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 bg-foreground/5 rounded-lg hover:bg-foreground/10 transition-colors"
                >
                  <div className="font-medium text-sm line-clamp-2">
                    {post.title}
                  </div>
                  <div className="text-xs text-foreground/60 mt-1 flex items-center gap-2">
                    <span>r/{post.subreddit}</span>
                    <span>•</span>
                    <span>{post.score} upvotes</span>
                    <span>•</span>
                    <span>{post.comments} comments</span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </div>

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
