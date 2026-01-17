import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function getScoreColor(score: number): string {
  if (score >= 80) return "#22C55E"; // green
  if (score >= 60) return "#EAB308"; // yellow
  if (score >= 40) return "#F97316"; // orange
  return "#EF4444"; // red
}

function getScoreLabel(score: number): string {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Moderate";
  if (score >= 40) return "Risky";
  return "Caution";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get dynamic parameters
  const type = searchParams.get("type"); // "report" for validation reports
  const hero = searchParams.get("hero") || "Would You Fund This Startup?";
  const score = searchParams.get("score");
  const idea = searchParams.get("idea");
  const ship = searchParams.get("ship");
  const votes = searchParams.get("votes");

  // Check if this is a validation report
  const isReport = type === "report" && score !== null;
  const scoreNum = isReport ? parseInt(score, 10) : null;

  // Render validation report OG image
  if (isReport && scoreNum !== null) {
    const scoreColor = getScoreColor(scoreNum);
    const scoreLabel = getScoreLabel(scoreNum);
    const ideaText = idea ? decodeURIComponent(idea).substring(0, 100) + (idea.length > 100 ? "..." : "") : "";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#0A0A0A",
            padding: "40px 60px",
          }}
        >
          {/* Logo/Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "40px",
            }}
          >
            <span
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#FFFFFF",
                opacity: 0.7,
              }}
            >
              YC Archive - Idea Validator
            </span>
          </div>

          {/* Card Container */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#18181B",
              borderRadius: "24px",
              padding: "48px 60px",
              maxWidth: "900px",
              width: "100%",
            }}
          >
            {/* Score Display */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "24px",
                marginBottom: ideaText ? "24px" : "0px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "baseline",
                }}
              >
                <span
                  style={{
                    fontSize: 96,
                    fontWeight: "bold",
                    color: scoreColor,
                  }}
                >
                  {scoreNum}
                </span>
                <span
                  style={{
                    fontSize: 48,
                    fontWeight: "bold",
                    color: "#FFFFFF",
                    opacity: 0.5,
                  }}
                >
                  /100
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    fontSize: 36,
                    fontWeight: "bold",
                    color: scoreColor,
                  }}
                >
                  {scoreLabel}
                </span>
                <span
                  style={{
                    fontSize: 20,
                    color: "#FFFFFF",
                    opacity: 0.5,
                  }}
                >
                  Validation Score
                </span>
              </div>
            </div>

            {/* Idea Text */}
            {ideaText && (
              <div
                style={{
                  fontSize: 24,
                  color: "#FFFFFF",
                  opacity: 0.7,
                  textAlign: "center",
                  lineHeight: 1.4,
                  maxWidth: "800px",
                }}
              >
                &ldquo;{ideaText}&rdquo;
              </div>
            )}
          </div>

          {/* CTA */}
          <div
            style={{
              marginTop: "40px",
              fontSize: 24,
              color: "#FFFFFF",
              opacity: 0.6,
            }}
          >
            Validated against 5,500+ YC companies + live market data
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  }

  // Legacy: Check if this is for a specific idea with voting data
  const hasVotingData = ship !== null && votes !== null;
  const shipPercentage = hasVotingData ? parseInt(ship, 10) : null;
  const totalVotes = hasVotingData ? parseInt(votes, 10) : null;

  // Determine styling based on ship percentage
  const isShipped = shipPercentage !== null ? shipPercentage >= 50 : true;
  const emoji = isShipped ? "🚀" : "💀";
  const statusColor = isShipped ? "#22C55E" : "#EF4444";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0A0A0A",
          padding: "40px 60px",
        }}
      >
        {/* Logo/Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <span
            style={{
              fontSize: 36,
              fontWeight: "bold",
              color: "#FFFFFF",
              opacity: 0.7,
            }}
          >
            YC Archive - Idea Validator
          </span>
        </div>

        {/* Card Container */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#18181B",
            borderRadius: "24px",
            padding: "48px 60px",
            maxWidth: "900px",
            width: "100%",
          }}
        >
          {/* Hero Text */}
          <div
            style={{
              fontSize: 48,
              fontWeight: "bold",
              color: "#FFFFFF",
              textAlign: "center",
              marginBottom: hasVotingData ? "32px" : "0px",
              lineHeight: 1.2,
            }}
          >
            {hero}
          </div>

          {/* Results - only show if we have voting data */}
          {hasVotingData && shipPercentage !== null && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <span style={{ fontSize: 64 }}>{emoji}</span>
              <span
                style={{
                  fontSize: 72,
                  fontWeight: "bold",
                  color: statusColor,
                }}
              >
                {shipPercentage}%
              </span>
              <span
                style={{
                  fontSize: 32,
                  color: "#FFFFFF",
                  opacity: 0.7,
                }}
              >
                would {isShipped ? "Ship" : "Skip"}
              </span>
            </div>
          )}

          {/* Vote Count */}
          {hasVotingData && totalVotes !== null && totalVotes > 0 && (
            <div
              style={{
                marginTop: "24px",
                fontSize: 24,
                color: "#FFFFFF",
                opacity: 0.5,
              }}
            >
              {totalVotes.toLocaleString()} votes
            </div>
          )}

          {/* For landing page - show validation prompt */}
          {!hasVotingData && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginTop: "32px",
              }}
            >
              <span
                style={{
                  fontSize: 28,
                  color: "#A855F7",
                  fontWeight: "bold",
                }}
              >
                Validate your idea now
              </span>
            </div>
          )}
        </div>

        {/* CTA */}
        <div
          style={{
            marginTop: "40px",
            fontSize: 28,
            color: "#FFFFFF",
            opacity: 0.6,
          }}
        >
          {hasVotingData ? "What would you vote?" : "AI-powered validation against 5,500+ YC startups"}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
