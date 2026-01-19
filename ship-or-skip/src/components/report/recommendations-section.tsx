"use client";

interface Recommendation {
  title: string;
  description: string;
}

interface RecommendationsSectionProps {
  recommendations: Recommendation[];
}

export function RecommendationsSection({
  recommendations,
}: RecommendationsSectionProps) {
  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">RECOMMENDATIONS</h2>

      {recommendations && recommendations.length > 0 ? (
        <div className="space-y-4">
          {recommendations.map((rec, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yc-orange/20 text-yc-orange flex items-center justify-center font-bold">
                {index + 1}
              </div>
              <div>
                <h3 className="font-bold mb-1">{rec.title}</h3>
                <p className="text-foreground/70 text-sm">{rec.description}</p>
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
  );
}
