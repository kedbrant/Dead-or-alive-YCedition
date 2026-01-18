"use client";

import type { PHProduct } from "@/lib/supabase/types";

interface ProductHuntSectionProps {
  summary: string;
  products: PHProduct[];
}

export function ProductHuntSection({ summary, products }: ProductHuntSectionProps) {
  if (products.length === 0) {
    return null;
  }

  return (
    <div className="bg-surface rounded-2xl p-6 mb-6">
      <h2 className="text-sm font-medium text-foreground/60 uppercase tracking-wide mb-4">
        Product Hunt Launches
      </h2>

      {/* AI Summary */}
      <p className="text-foreground/80 mb-4">{summary}</p>

      {/* Products List */}
      <div className="space-y-3">
        {products.slice(0, 8).map((product, index) => (
          <a
            key={index}
            href={product.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 bg-foreground/5 rounded-xl hover:bg-foreground/10 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-foreground">{product.name}</div>
                <div className="text-sm text-foreground/60 mt-1 line-clamp-2">
                  {product.tagline}
                </div>
                {product.website && (
                  <div className="text-xs text-foreground/40 mt-1 truncate">
                    {product.website}
                  </div>
                )}
              </div>
              <div className="flex-shrink-0 flex items-center gap-1 bg-yc-orange/10 text-yc-orange px-2 py-1 rounded-lg text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                {product.votesCount}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
