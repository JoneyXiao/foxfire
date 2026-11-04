import { categories, difficultyLabel } from "@/lib/categories";
import type { QuestionSummary } from "@/lib/types";
import { DIFFICULTIES } from "@/lib/types";

export type BucketStats = {
  id: string;
  label: string;
  total: number;
  done: number;
  open: number;
  starred: number;
  /** 0–1 */
  rate: number;
};

function rateOf(done: number, total: number): number {
  if (total <= 0) {
    return 0;
  }
  return done / total;
}

export function categoryProgressStats(
  all: readonly QuestionSummary[],
  done: Iterable<string>,
  starred: Iterable<string> = [],
): BucketStats[] {
  const doneSet = done instanceof Set ? done : new Set(done);
  const starredSet = starred instanceof Set ? starred : new Set(starred);

  return categories.map((category) => {
    const items = all.filter((item) => item.category === category.id);
    const doneCount = items.filter((item) => doneSet.has(item.id)).length;
    const starredCount = items.filter((item) => starredSet.has(item.id)).length;
    return {
      id: category.id,
      label: category.name,
      total: items.length,
      done: doneCount,
      open: items.length - doneCount,
      starred: starredCount,
      rate: rateOf(doneCount, items.length),
    };
  });
}

export function difficultyProgressStats(
  all: readonly QuestionSummary[],
  done: Iterable<string>,
  starred: Iterable<string> = [],
): BucketStats[] {
  const doneSet = done instanceof Set ? done : new Set(done);
  const starredSet = starred instanceof Set ? starred : new Set(starred);

  return DIFFICULTIES.map((difficulty) => {
    const items = all.filter((item) => item.difficulty === difficulty);
    const doneCount = items.filter((item) => doneSet.has(item.id)).length;
    const starredCount = items.filter((item) => starredSet.has(item.id)).length;
    return {
      id: difficulty,
      label: difficultyLabel[difficulty],
      total: items.length,
      done: doneCount,
      open: items.length - doneCount,
      starred: starredCount,
      rate: rateOf(doneCount, items.length),
    };
  });
}

/** Categories with remaining open questions, weakest first. */
export function weakCategories(
  stats: readonly BucketStats[],
  options: { maxRate?: number; limit?: number } = {},
): BucketStats[] {
  const maxRate = options.maxRate ?? 1;
  const limit = options.limit ?? stats.length;
  return [...stats]
    .filter((item) => item.open > 0 && item.rate <= maxRate)
    .sort((a, b) => a.rate - b.rate || b.open - a.open)
    .slice(0, limit);
}

export function formatPercent(rate: number): string {
  return `${Math.round(rate * 100)}%`;
}

