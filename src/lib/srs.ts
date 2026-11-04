import type { ProgressState, SrsCard, SrsRating } from "@/lib/types";

export const SRS_RATING_LABEL: Record<SrsRating, string> = {
  hard: "生疏",
  fuzzy: "模糊",
  known: "掌握",
};

export const SRS_RATINGS: readonly SrsRating[] = ["hard", "fuzzy", "known"] as const;

/** Calendar day YYYY-MM-DD in local timezone. */
export function localDayStamp(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDays(day: string, days: number): string {
  const [y, m, d] = day.split("-").map((part) => Number(part));
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return localDayStamp(date);
}

function compareDay(a: string, b: string): number {
  if (a === b) return 0;
  return a < b ? -1 : 1;
}

/** Next interval (days) from a three-level self-rating. */
export function nextIntervalDays(rating: SrsRating, previous?: SrsCard | null): number {
  const prev = previous?.intervalDays ?? 0;
  if (rating === "hard") {
    return 1;
  }
  if (rating === "fuzzy") {
    if (prev <= 0) return 3;
    return Math.min(14, Math.max(2, Math.round(prev * 1.5)));
  }
  // known / 掌握
  if (prev >= 7) {
    return Math.min(60, prev * 2);
  }
  return 7;
}

export function applyRating(
  previous: SrsCard | null | undefined,
  rating: SrsRating,
  now: Date = new Date(),
): SrsCard {
  const reviewedAt = now.toISOString();
  const today = localDayStamp(now);
  const intervalDays = nextIntervalDays(rating, previous);
  return {
    rating,
    intervalDays,
    dueAt: addDays(today, intervalDays),
    reviewedAt,
    reps: (previous?.reps ?? 0) + 1,
  };
}

export function getSrsCard(state: ProgressState, id: string): SrsCard | undefined {
  return state.srs?.[id];
}

export function isDue(card: SrsCard, today: string = localDayStamp()): boolean {
  return compareDay(card.dueAt, today) <= 0;
}

/** Due cards sorted by due date ascending, then by id. */
export function listDueIds(
  state: ProgressState,
  today: string = localDayStamp(),
): string[] {
  const entries = Object.entries(state.srs ?? {}).filter(([, card]) => isDue(card, today));
  entries.sort((a, b) => {
    const byDue = compareDay(a[1].dueAt, b[1].dueAt);
    if (byDue !== 0) return byDue;
    return a[0].localeCompare(b[0]);
  });
  return entries.map(([id]) => id);
}

export function countDue(state: ProgressState, today: string = localDayStamp()): number {
  return listDueIds(state, today).length;
}

export function parseSrsMap(raw: unknown): Record<string, SrsCard> {
  if (raw === null || raw === undefined) {
    return {};
  }
  if (typeof raw !== "object" || Array.isArray(raw)) {
    return {};
  }
  const out: Record<string, SrsCard> = {};
  for (const [id, value] of Object.entries(raw as Record<string, unknown>)) {
    if (typeof id !== "string" || !id) continue;
    const card = parseSrsCard(value);
    if (card) {
      out[id] = card;
    }
  }
  return out;
}

function parseSrsCard(raw: unknown): SrsCard | null {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    return null;
  }
  const obj = raw as Record<string, unknown>;
  const rating = obj.rating;
  if (rating !== "hard" && rating !== "fuzzy" && rating !== "known") {
    return null;
  }
  const intervalDays =
    typeof obj.intervalDays === "number" && Number.isFinite(obj.intervalDays)
      ? Math.max(1, Math.floor(obj.intervalDays))
      : 1;
  const dueAt = typeof obj.dueAt === "string" && /^\d{4}-\d{2}-\d{2}/.test(obj.dueAt)
    ? obj.dueAt.slice(0, 10)
    : null;
  const reviewedAt = typeof obj.reviewedAt === "string" ? obj.reviewedAt : null;
  if (!dueAt || !reviewedAt) {
    return null;
  }
  const reps =
    typeof obj.reps === "number" && Number.isFinite(obj.reps)
      ? Math.max(0, Math.floor(obj.reps))
      : 1;
  return { rating, intervalDays, dueAt, reviewedAt, reps };
}
