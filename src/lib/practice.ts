import type { QuestionSummary } from "@/lib/types";

export type RandomPick = {
  question: QuestionSummary;
  pool: "unpracticed" | "all";
};

function doneSet(done: Iterable<string>): Set<string> {
  return done instanceof Set ? done : new Set(done);
}

/** Unpracticed questions in the given list order. */
export function listUnpracticed(
  all: readonly QuestionSummary[],
  done: Iterable<string>,
): QuestionSummary[] {
  const marked = doneSet(done);
  return all.filter((item) => !marked.has(item.id));
}

/**
 * Next unpracticed question after `afterId` in `all` order (wraps once).
 * If `afterId` is missing or unknown, returns the first unpracticed item.
 */
export function pickNextUnpracticed(
  all: readonly QuestionSummary[],
  done: Iterable<string>,
  afterId?: string,
): QuestionSummary | undefined {
  const open = listUnpracticed(all, done);
  if (open.length === 0) {
    return undefined;
  }

  if (!afterId) {
    return open[0];
  }

  const start = all.findIndex((item) => item.id === afterId);
  if (start < 0) {
    return open[0];
  }

  for (let offset = 1; offset <= all.length; offset += 1) {
    const candidate = all[(start + offset) % all.length];
    if (open.some((item) => item.id === candidate.id)) {
      return candidate;
    }
  }

  return open[0];
}

/**
 * Prefer a random unpracticed question; if none remain, pick from all.
 */
export function pickRandomQuestion(
  all: readonly QuestionSummary[],
  done: Iterable<string>,
): RandomPick | undefined {
  if (all.length === 0) {
    return undefined;
  }

  const open = listUnpracticed(all, done);
  const pool = open.length > 0 ? open : [...all];
  const index = Math.floor(Math.random() * pool.length);
  return {
    question: pool[index],
    pool: open.length > 0 ? "unpracticed" : "all",
  };
}
