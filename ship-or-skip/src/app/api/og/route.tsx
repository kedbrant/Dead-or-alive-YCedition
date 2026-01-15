import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Get dynamic parameters
  const hero = searchParams.get("hero") || "Would You Fund This Startup?";
  const ship = searchParams.get("ship");
  const votes = searchParams.get("votes");

  // Check if this is for a specific idea with voting data
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
            Ship or Skip
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

          {/* For landing page - show ship/skip icons */}
          {!hasVotingData && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "40px",
                marginTop: "32px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: 64 }}>💀</span>
                <span
                  style={{
                    fontSize: 24,
                    color: "#EF4444",
                    fontWeight: "bold",
                  }}
                >
                  Skip
                </span>
              </div>
              <span
                style={{
                  fontSize: 36,
                  color: "#FFFFFF",
                  opacity: 0.5,
                }}
              >
                or
              </span>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <span style={{ fontSize: 64 }}>🚀</span>
                <span
                  style={{
                    fontSize: 24,
                    color: "#22C55E",
                    fontWeight: "bold",
                  }}
                >
                  Ship
                </span>
              </div>
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
          {hasVotingData ? "What would you vote?" : "Swipe through real startup pitches"}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
