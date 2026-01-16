/**
 * InsightCard component for company deep dive pages
 * Shows crowd prediction analysis based on outcome and vote distribution
 * US-035: Create company insight card on deep dive
 */

import type { SourceOutcome } from "@/lib/supabase/types";

interface InsightCardProps {
  outcome: SourceOutcome;
  shipPercentage: number;
  totalVotes: number;
  companyName?: string;
}

/**
 * Get insight copy based on outcome and crowd voting pattern
 */
function getInsightCopy(
  outcome: SourceOutcome,
  shipPercentage: number,
  companyName: string
): { headline: string; subtext: string } | null {
  if (!outcome) return null;

  const skipPercentage = 100 - shipPercentage;
  const majorityShipped = shipPercentage >= 50;

  switch (outcome) {
    case "unicorn":
      if (majorityShipped) {
        return {
          headline: `The crowd got it right!`,
          subtext: `${shipPercentage}% of voters would have backed ${companyName} — and it became a unicorn.`,
        };
      } else {
        return {
          headline: `${skipPercentage}% would have missed this success`,
          subtext: `The majority would have skipped ${companyName}, which went on to become a unicorn worth billions.`,
        };
      }

    case "dead":
      if (majorityShipped) {
        return {
          headline: `${shipPercentage}% got fooled by this pitch`,
          subtext: `Most voters would have backed ${companyName}, but the company ultimately failed.`,
        };
      } else {
        return {
          headline: `The crowd saw through this one`,
          subtext: `${skipPercentage}% correctly passed on ${companyName}, which later shut down.`,
        };
      }

    case "acquired":
      if (majorityShipped) {
        return {
          headline: `Good call by the crowd`,
          subtext: `${shipPercentage}% would have shipped ${companyName}, and it was later acquired.`,
        };
      } else {
        return {
          headline: `A divided verdict`,
          subtext: `${companyName} was acquired despite ${skipPercentage}% of voters passing on it.`,
        };
      }

    case "active":
      return {
        headline: `Still in the game`,
        subtext: `${companyName} is still active. Time will tell if the ${shipPercentage}% who would ship were right.`,
      };

    default:
      return null;
  }
}

/**
 * Get the icon and color scheme for each outcome
 */
function getOutcomeStyle(outcome: SourceOutcome): {
  borderColor: string;
  bgColor: string;
  iconColor: string;
  icon: React.ReactNode;
} {
  switch (outcome) {
    case "unicorn":
      return {
        borderColor: "border-purple-500/30",
        bgColor: "bg-purple-500/10",
        iconColor: "text-purple-400",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case "dead":
      return {
        borderColor: "border-gray-500/30",
        bgColor: "bg-gray-500/10",
        iconColor: "text-gray-400",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-2.625 6c-.54 0-.828.419-.936.634a1.96 1.96 0 00-.189.866c0 .298.059.605.189.866.108.215.395.634.936.634.54 0 .828-.419.936-.634.13-.26.189-.568.189-.866 0-.298-.059-.605-.189-.866-.108-.215-.395-.634-.936-.634zm4.314.634c.108-.215.395-.634.936-.634.54 0 .828.419.936.634.13.26.189.568.189.866 0 .298-.059.605-.189.866-.108.215-.395.634-.936.634-.54 0-.828-.419-.936-.634a1.96 1.96 0 01-.189-.866c0-.298.059-.605.189-.866zm-4.34 7.964a.75.75 0 01-1.061-1.06 5.236 5.236 0 013.73-1.538 5.236 5.236 0 013.695 1.538.75.75 0 11-1.061 1.06 3.736 3.736 0 00-2.639-1.098 3.736 3.736 0 00-2.664 1.098z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
    case "acquired":
      return {
        borderColor: "border-amber-500/30",
        bgColor: "bg-amber-500/10",
        iconColor: "text-amber-400",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path d="M12 7.5a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z" />
            <path
              fillRule="evenodd"
              d="M1.5 4.875C1.5 3.839 2.34 3 3.375 3h17.25c1.035 0 1.875.84 1.875 1.875v9.75c0 1.036-.84 1.875-1.875 1.875H3.375A1.875 1.875 0 011.5 14.625v-9.75zM8.25 9.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM18.75 9a.75.75 0 00-.75.75v.008c0 .414.336.75.75.75h.008a.75.75 0 00.75-.75V9.75a.75.75 0 00-.75-.75h-.008zM4.5 9.75A.75.75 0 015.25 9h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H5.25a.75.75 0 01-.75-.75V9.75z"
              clipRule="evenodd"
            />
            <path d="M2.25 18a.75.75 0 000 1.5c5.4 0 10.63.722 15.6 2.075 1.19.324 2.4-.558 2.4-1.82V18.75a.75.75 0 00-.75-.75H2.25z" />
          </svg>
        ),
      };
    case "active":
    default:
      return {
        borderColor: "border-green-500/30",
        bgColor: "bg-green-500/10",
        iconColor: "text-green-400",
        icon: (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
              clipRule="evenodd"
            />
          </svg>
        ),
      };
  }
}

export function InsightCard({
  outcome,
  shipPercentage,
  totalVotes,
  companyName = "this company",
}: InsightCardProps) {
  const insight = getInsightCopy(outcome, shipPercentage, companyName);

  if (!insight || totalVotes < 10) {
    return null;
  }

  const style = getOutcomeStyle(outcome);

  return (
    <div
      className={`rounded-2xl p-6 border ${style.borderColor} ${style.bgColor}`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 ${style.iconColor}`}>{style.icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1">{insight.headline}</h3>
          <p className="text-foreground/70">{insight.subtext}</p>
        </div>
      </div>
    </div>
  );
}
