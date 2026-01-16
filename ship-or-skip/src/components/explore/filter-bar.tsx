"use client";

interface FilterState {
  outcome: string;
  industry: string;
  batch: string;
  sort: string;
}

interface FilterBarProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  industries: string[];
  industriesLoading?: boolean;
}

// Generate batch options from 2024 down to 2005
const BATCH_OPTIONS = [
  { value: "all", label: "All" },
  ...Array.from({ length: 20 }, (_, i) => {
    const year = 2024 - i;
    return { value: year.toString(), label: year.toString() };
  }),
];

const OUTCOME_OPTIONS = [
  { value: "all", label: "All" },
  { value: "unicorn", label: "Unicorns" },
  { value: "acquired", label: "Acquired" },
  { value: "dead", label: "Dead" },
  { value: "active", label: "Active" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "team_size", label: "Team size" },
  { value: "votes", label: "Most votes" },
];

export function FilterBar({
  filters,
  onChange,
  industries,
  industriesLoading = false,
}: FilterBarProps) {
  const handleChange = (key: keyof FilterState, value: string) => {
    onChange({
      ...filters,
      [key]: value,
    });
  };

  const selectClassName = `w-full px-3 py-2 bg-background border border-foreground/20 rounded-lg
    text-foreground text-sm
    focus:outline-none focus:border-ship transition-colors
    disabled:opacity-50 disabled:cursor-not-allowed`;

  return (
    <div className="bg-surface rounded-xl p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Outcome Filter */}
        <div>
          <label className="block text-xs text-foreground/60 mb-1">
            Outcome
          </label>
          <select
            className={selectClassName}
            value={filters.outcome}
            onChange={(e) => handleChange("outcome", e.target.value)}
          >
            {OUTCOME_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Industry Filter */}
        <div>
          <label className="block text-xs text-foreground/60 mb-1">
            Industry
          </label>
          <select
            className={selectClassName}
            value={filters.industry}
            onChange={(e) => handleChange("industry", e.target.value)}
            disabled={industriesLoading}
          >
            <option value="all">
              {industriesLoading ? "Loading..." : "All"}
            </option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        {/* Batch Filter */}
        <div>
          <label className="block text-xs text-foreground/60 mb-1">
            Batch
          </label>
          <select
            className={selectClassName}
            value={filters.batch}
            onChange={(e) => handleChange("batch", e.target.value)}
          >
            {BATCH_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-xs text-foreground/60 mb-1">Sort</label>
          <select
            className={selectClassName}
            value={filters.sort}
            onChange={(e) => handleChange("sort", e.target.value)}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
