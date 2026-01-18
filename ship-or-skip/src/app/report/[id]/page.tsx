"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type {
  NewsArticle,
  RedditPost,
  HackerNewsPost,
  PHProduct,
  DiscoveredCompany,
  AnalysisResult,
} from "@/lib/data-sources";

// YC Company type from validation API
interface YCCompanyResult {
  id: string;
  yc_name: string | null;
  yc_slug: string | null;
  yc_batch: string | null;
  yc_status: string | null;
  yc_industry: string | null;
  hero: string;
  subtitle: string;
  source_outcome: "unicorn" | "acquired" | "dead" | "active" | null;
}

// Validation report structure
interface ValidationReport {
  idea: string;
  timestamp: string;
  ycCompanies: YCCompanyResult[];
  phProducts: PHProduct[];
  competitors: DiscoveredCompany[];
  news: NewsArticle[];
  redditPosts: RedditPost[];
  hnPosts: HackerNewsPost[];
  trends: null;
  analysis: AnalysisResult | null;
}

// Empty state component props
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  hint?: string;
}

// Reusable empty state component
function EmptyState({ icon, title, description, hint }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <span className="text-4xl mb-3">{icon}</span>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-foreground-secondary mb-1">{description}</p>
      {hint && (
        <p className="text-xs text-foreground-secondary/70 italic">{hint}</p>
      )}
    </div>
  );
}

// Section wrapper component
interface SectionProps {
  title: string;
  children: React.ReactNode;
}

function Section({ title, children }: SectionProps) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary">
          {title}
        </h2>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

// YC Companies section
function YCCompaniesSection({ companies }: { companies: YCCompanyResult[] }) {
  if (companies.length === 0) {
    return (
      <Section title="YC Companies">
        <EmptyState
          icon="🔍"
          title="No similar YC companies found"
          description="Your idea might be truly novel in the YC universe."
          hint="Try broader keywords to find related companies"
        />
      </Section>
    );
  }

  return (
    <Section title="YC Companies">
      <div className="space-y-3">
        {companies.slice(0, 10).map((company) => (
          <Link
            key={company.id}
            href={`/company/${company.yc_slug || company.id}`}
            className="block p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">
                    {company.yc_name || company.hero}
                  </h3>
                  {company.yc_batch && (
                    <span className="text-xs px-2 py-0.5 bg-foreground/10 rounded-full text-foreground-secondary">
                      {company.yc_batch}
                    </span>
                  )}
                  {company.source_outcome && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        company.source_outcome === "unicorn"
                          ? "bg-purple-500/20 text-purple-400"
                          : company.source_outcome === "acquired"
                          ? "bg-blue-500/20 text-blue-400"
                          : company.source_outcome === "dead"
                          ? "bg-gray-500/20 text-gray-400"
                          : "bg-green-500/20 text-green-400"
                      }`}
                    >
                      {company.source_outcome}
                    </span>
                  )}
                </div>
                <p className="text-sm text-foreground-secondary mt-1 line-clamp-2">
                  {company.subtitle}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}

// News section
function NewsSection({ articles }: { articles: NewsArticle[] }) {
  if (articles.length === 0) {
    return (
      <Section title="Recent News">
        <EmptyState
          icon="📰"
          title="No recent news found"
          description="This space might be emerging or under the radar."
        />
      </Section>
    );
  }

  return (
    <Section title="Recent News">
      <div className="space-y-3">
        {articles.slice(0, 5).map((article, index) => (
          <a
            key={index}
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
          >
            <h3 className="font-medium text-foreground line-clamp-2 mb-1">
              {article.title}
            </h3>
            <p className="text-sm text-foreground-secondary line-clamp-2 mb-2">
              {article.snippet}
            </p>
            <div className="flex items-center gap-2 text-xs text-foreground-secondary">
              {article.source && <span>{article.source}</span>}
              {article.date && (
                <>
                  <span>•</span>
                  <span>{article.date}</span>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

// Reddit/Community section
function CommunitySection({ posts }: { posts: RedditPost[] }) {
  if (posts.length === 0) {
    return (
      <Section title="Community Discussions">
        <EmptyState
          icon="💬"
          title="No community discussions found"
          description="The community hasn't discussed this topic yet."
        />
      </Section>
    );
  }

  return (
    <Section title="Community Discussions">
      <div className="space-y-3">
        {posts.slice(0, 5).map((post, index) => (
          <a
            key={index}
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-3 bg-background/50 rounded-lg hover:bg-background/80 transition-colors"
          >
            <h3 className="font-medium text-foreground line-clamp-2 mb-1">
              {post.title}
            </h3>
            {post.snippet && (
              <p className="text-sm text-foreground-secondary line-clamp-2 mb-2">
                {post.snippet}
              </p>
            )}
            <div className="flex items-center gap-2 text-xs text-foreground-secondary">
              <span className="text-orange-500">r/{post.source}</span>
              {post.date && (
                <>
                  <span>•</span>
                  <span>{post.date}</span>
                </>
              )}
            </div>
          </a>
        ))}
      </div>
    </Section>
  );
}

// Analysis summary section
function AnalysisSection({ analysis }: { analysis: AnalysisResult | null }) {
  if (!analysis) {
    return (
      <Section title="AI Analysis">
        <EmptyState
          icon="🤖"
          title="Analysis not available"
          description="We couldn't generate an analysis for this idea."
        />
      </Section>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 70) return "text-ship";
    if (score >= 40) return "text-yellow-500";
    return "text-skip";
  };

  const getVerdictLabel = (verdict: string) => {
    switch (verdict) {
      case "strong":
        return "Strong Opportunity";
      case "moderate":
        return "Moderate Potential";
      case "weak":
        return "Weak Signal";
      case "risky":
        return "High Risk";
      default:
        return verdict;
    }
  };

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <div className="px-4 py-4 border-b border-border bg-gradient-to-r from-purple-500/10 to-blue-500/10">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-foreground-secondary">
            AI Analysis
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm text-foreground-secondary">Score:</span>
            <span className={`text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
              {analysis.overallScore}
            </span>
          </div>
        </div>
        <p className="text-lg font-semibold text-foreground mt-2">
          {getVerdictLabel(analysis.verdict)}
        </p>
        {analysis.summary && (
          <p className="text-sm text-foreground-secondary mt-2">{analysis.summary}</p>
        )}
      </div>
      <div className="p-4 space-y-4">
        {analysis.market && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Market</h3>
            <p className="text-sm text-foreground-secondary">{analysis.market.summary}</p>
            {analysis.market.keyInsights && analysis.market.keyInsights.length > 0 && (
              <ul className="mt-2 space-y-1">
                {analysis.market.keyInsights.map((insight, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                    <span className="text-focus-ring mt-0.5">•</span>
                    <span>{insight}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {analysis.competition && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Competition</h3>
            <p className="text-sm text-foreground-secondary">{analysis.competition.summary}</p>
            {analysis.competition.risks && analysis.competition.risks.length > 0 && (
              <div className="mt-2">
                <span className="text-xs font-medium text-skip">Risks: </span>
                <span className="text-xs text-foreground-secondary">
                  {analysis.competition.risks.join(", ")}
                </span>
              </div>
            )}
          </div>
        )}
        {analysis.sentiment && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">Sentiment</h3>
            <p className="text-sm text-foreground-secondary">{analysis.sentiment.summary}</p>
            {analysis.sentiment.keyThemes && analysis.sentiment.keyThemes.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.sentiment.keyThemes.map((theme, i) => (
                  <span
                    key={i}
                    className="text-xs px-2 py-1 bg-background/50 rounded-full text-foreground-secondary"
                  >
                    {theme}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        {analysis.recommendations && analysis.recommendations.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">Recommendations</h3>
            <ul className="space-y-1">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
                  <span className="text-ship mt-0.5">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportPage() {
  const params = useParams();
  const [report, setReport] = useState<ValidationReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reportId = params.id as string;

  useEffect(() => {
    if (!reportId) {
      setError("Report not found");
      setLoading(false);
      return;
    }

    // Load report from localStorage
    try {
      const storedReport = localStorage.getItem(`report_${reportId}`);
      if (storedReport) {
        const parsedReport = JSON.parse(storedReport) as ValidationReport;
        setReport(parsedReport);
      } else {
        setError("Report not found or has expired");
      }
    } catch {
      setError("Failed to load report");
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-focus-ring border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-foreground-secondary">Loading report...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !report) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-surface border border-border rounded-xl p-8 text-center">
          <span className="text-5xl mb-4 block">📋</span>
          <h1 className="text-2xl font-bold text-foreground mb-2">Report Not Found</h1>
          <p className="text-foreground-secondary mb-6">
            {error || "This report doesn't exist or has expired."}
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-button-bg text-button-text font-semibold rounded-xl hover:opacity-90 transition-opacity"
          >
            Validate New Idea
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 animate-page-fade-in">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-foreground-secondary hover:text-foreground transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to home
          </Link>

          <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Validation Report
          </h1>
          <div className="bg-surface border border-border rounded-lg p-4">
            <p className="text-foreground font-medium">{report.idea}</p>
            <p className="text-xs text-foreground-secondary mt-2">
              Generated {new Date(report.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* AI Analysis - show first as summary */}
          <AnalysisSection analysis={report.analysis} />

          {/* YC Companies */}
          <YCCompaniesSection companies={report.ycCompanies} />

          {/* News */}
          <NewsSection articles={report.news} />

          {/* Community (Reddit) */}
          <CommunitySection posts={report.redditPosts} />
        </div>

        {/* Footer CTA */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-button-bg text-button-text font-bold rounded-xl hover:opacity-90 btn-animate"
          >
            Validate Another Idea
          </Link>
        </div>
      </div>
    </div>
  );
}
