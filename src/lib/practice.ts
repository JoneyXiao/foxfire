import type { CategoryId, Difficulty, QuestionSummary } from "@/lib/types";

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

export type SessionPoolFilters = {
  category?: CategoryId | "all";
  difficulty?: Difficulty | "all";
  unpracticedOnly?: boolean;
  done?: Iterable<string>;
};

function shuffleInPlace<T>(items: T[]): T[] {
  for (let i = items.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = items[i];
    items[i] = items[j];
    items[j] = tmp;
  }
  return items;
}

/** Filter the bank for a practice session, then shuffle and take up to `count`. */
export function buildSessionQuestions(
  all: readonly QuestionSummary[],
  count: number,
  filters: SessionPoolFilters = {},
): QuestionSummary[] {
  const category = filters.category ?? "all";
  const difficulty = filters.difficulty ?? "all";
  const done = filters.unpracticedOnly ? doneSet(filters.done ?? []) : null;

  let pool = all.filter((item) => {
    if (category !== "all" && item.category !== category) {
      return false;
    }
    if (difficulty !== "all" && item.difficulty !== difficulty) {
      return false;
    }
    if (done && done.has(item.id)) {
      return false;
    }
    return true;
  });

  pool = shuffleInPlace([...pool]);
  const n = Number.isFinite(count) ? Math.max(0, Math.floor(count)) : 0;
  return pool.slice(0, n);
}
