import type { CategoryId, Difficulty } from "@/lib/types";

export const MOCK_KEY = "foxfire-mock-session";
export const MOCK_CHANGED_EVENT = "foxfire-mock-changed";
export const MOCK_VERSION = 1 as const;

export const MOCK_DURATIONS = [15, 20, 25, 30] as const;
export type MockDurationMinutes = (typeof MOCK_DURATIONS)[number];

export type MockFilters = {
  category: CategoryId | "all";
  difficulty: Difficulty | "all";
  count: number;
  durationMinutes: MockDurationMinutes;
};

export type MockChecklistItem = {
  id: string;
  source: "quote" | "knowledge" | "answer";
  text: string;
};

export type MockQuestionResult = {
  /** Whether the self-check checklist was revealed. */
  revealed: boolean;
  /** Checklist item ids the user marked as covered. */
  checked: string[];
  /** True if the user recorded at least one voice clip this turn (blob not persisted). */
  recorded: boolean;
  /** Seconds spent on this question while it was active (approx). */
  secondsSpent: number;
};

export type MockSession = {
  version: typeof MOCK_VERSION;
  id: string;
  createdAt: string;
  finishedAt?: string;
  status: "active" | "finished";
  filters: MockFilters;
  questionIds: string[];
  index: number;
  /** Absolute end time for the overall countdown (ISO). */
  endsAt: string;
  results: Record<string, MockQuestionResult>;
};

function emitChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(MOCK_CHANGED_EVENT));
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `mock-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function emptyResult(): MockQuestionResult {
  return {
    revealed: false,
    checked: [],
    recorded: false,
    secondsSpent: 0,
  };
}

export function createMockSession(
  questionIds: string[],
  filters: MockFilters,
): MockSession {
  const now = Date.now();
  const endsAt = new Date(now + filters.durationMinutes * 60_000).toISOString();
  const results: Record<string, MockQuestionResult> = {};
  for (const id of questionIds) {
    results[id] = emptyResult();
  }
  return {
    version: MOCK_VERSION,
    id: newId(),
    createdAt: new Date(now).toISOString(),
    status: "active",
    filters: { ...filters, count: questionIds.length },
    questionIds: [...questionIds],
    index: 0,
    endsAt,
    results,
  };
}

function isDuration(value: unknown): value is MockDurationMinutes {
  return (
    typeof value === "number" &&
    (MOCK_DURATIONS as readonly number[]).includes(value)
  );
}

export function readMockSession(): MockSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(MOCK_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<MockSession>;
    if (
      parsed.version !== MOCK_VERSION ||
      (parsed.status !== "active" && parsed.status !== "finished") ||
      !Array.isArray(parsed.questionIds) ||
      typeof parsed.index !== "number" ||
      !parsed.filters ||
      typeof parsed.id !== "string" ||
      typeof parsed.endsAt !== "string"
    ) {
      return null;
    }

    const durationMinutes = isDuration(parsed.filters.durationMinutes)
      ? parsed.filters.durationMinutes
      : 20;

    const results: Record<string, MockQuestionResult> = {};
    const rawResults =
      parsed.results && typeof parsed.results === "object" ? parsed.results : {};
    for (const id of parsed.questionIds) {
      if (typeof id !== "string") continue;
      const entry = (rawResults as Record<string, Partial<MockQuestionResult>>)[id];
      results[id] = {
        revealed: Boolean(entry?.revealed),
        checked: Array.isArray(entry?.checked)
          ? entry.checked.filter((item): item is string => typeof item === "string")
          : [],
        recorded: Boolean(entry?.recorded),
        secondsSpent:
          typeof entry?.secondsSpent === "number" && Number.isFinite(entry.secondsSpent)
            ? Math.max(0, Math.floor(entry.secondsSpent))
            : 0,
      };
    }

    return {
      version: MOCK_VERSION,
      id: parsed.id,
      createdAt:
        typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
      finishedAt: typeof parsed.finishedAt === "string" ? parsed.finishedAt : undefined,
      status: parsed.status,
      filters: {
        category: (parsed.filters.category as MockFilters["category"]) ?? "all",
        difficulty: (parsed.filters.difficulty as MockFilters["difficulty"]) ?? "all",
        count:
          typeof parsed.filters.count === "number" && Number.isFinite(parsed.filters.count)
            ? parsed.filters.count
            : parsed.questionIds.length,
        durationMinutes,
      },
      questionIds: parsed.questionIds.filter((id): id is string => typeof id === "string"),
      index: Math.max(0, Math.floor(parsed.index)),
      endsAt: parsed.endsAt,
      results,
    };
  } catch {
    return null;
  }
}

export function writeMockSession(session: MockSession): void {
  window.sessionStorage.setItem(MOCK_KEY, JSON.stringify(session));
  emitChanged();
}

export function clearMockSession(): void {
  window.sessionStorage.removeItem(MOCK_KEY);
  emitChanged();
}

export function currentMockQuestionId(session: MockSession): string | undefined {
  return session.questionIds[session.index];
}

export function isLastMockQuestion(session: MockSession): boolean {
  return session.questionIds.length === 0 || session.index >= session.questionIds.length - 1;
}

export function setMockIndex(session: MockSession, index: number): MockSession {
  const clamped = Math.max(0, Math.min(index, Math.max(0, session.questionIds.length - 1)));
  return {
    ...session,
    index: clamped,
  };
}

export function patchMockResult(
  session: MockSession,
  questionId: string,
  patch: Partial<MockQuestionResult>,
): MockSession {
  const prev = session.results[questionId] ?? emptyResult();
  return {
    ...session,
    results: {
      ...session.results,
      [questionId]: {
        ...prev,
        ...patch,
        checked: patch.checked ?? prev.checked,
      },
    },
  };
}

export function finishMockSession(session: MockSession): MockSession {
  return {
    ...session,
    status: "finished",
    finishedAt: new Date().toISOString(),
  };
}

/** Remaining seconds until endsAt; 0 when expired. */
export function remainingSeconds(endsAt: string, nowMs = Date.now()): number {
  const end = Date.parse(endsAt);
  if (!Number.isFinite(end)) {
    return 0;
  }
  return Math.max(0, Math.ceil((end - nowMs) / 1000));
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${String(m).padStart(2, "0")}:${String(r).padStart(2, "0")}`;
}

export function elapsedSeconds(session: MockSession, nowMs = Date.now()): number {
  const start = Date.parse(session.createdAt);
  const end =
    session.status === "finished" && session.finishedAt
      ? Date.parse(session.finishedAt)
      : nowMs;
  if (!Number.isFinite(start) || !Number.isFinite(end)) {
    return 0;
  }
  const planned = session.filters.durationMinutes * 60;
  // Cap display at planned + small overtime awareness via raw elapsed separately if needed.
  return Math.max(0, Math.floor((end - start) / 1000));
}

export function plannedSeconds(session: MockSession): number {
  return session.filters.durationMinutes * 60;
}
