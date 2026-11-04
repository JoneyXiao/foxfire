import type { CategoryId, Difficulty } from "@/lib/types";

export const SESSION_KEY = "foxfire-practice-session";
export const SESSION_CHANGED_EVENT = "foxfire-session-changed";
export const SESSION_VERSION = 1 as const;

export type SessionFilters = {
  category: CategoryId | "all";
  difficulty: Difficulty | "all";
  unpracticedOnly: boolean;
  count: number;
};

export type PracticeSession = {
  version: typeof SESSION_VERSION;
  id: string;
  createdAt: string;
  finishedAt?: string;
  status: "active" | "finished";
  filters: SessionFilters;
  questionIds: string[];
  index: number;
  visitedIds: string[];
};

function emitChanged(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
  }
}

function newId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function createSession(
  questionIds: string[],
  filters: SessionFilters,
): PracticeSession {
  return {
    version: SESSION_VERSION,
    id: newId(),
    createdAt: new Date().toISOString(),
    status: "active",
    filters,
    questionIds: [...questionIds],
    index: 0,
    visitedIds: questionIds[0] ? [questionIds[0]] : [],
  };
}

export function readSession(): PracticeSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as Partial<PracticeSession>;
    if (
      parsed.version !== SESSION_VERSION ||
      (parsed.status !== "active" && parsed.status !== "finished") ||
      !Array.isArray(parsed.questionIds) ||
      typeof parsed.index !== "number" ||
      !parsed.filters ||
      typeof parsed.id !== "string"
    ) {
      return null;
    }
    return {
      version: SESSION_VERSION,
      id: parsed.id,
      createdAt: typeof parsed.createdAt === "string" ? parsed.createdAt : new Date().toISOString(),
      finishedAt: typeof parsed.finishedAt === "string" ? parsed.finishedAt : undefined,
      status: parsed.status,
      filters: {
        category: (parsed.filters.category as SessionFilters["category"]) ?? "all",
        difficulty: (parsed.filters.difficulty as SessionFilters["difficulty"]) ?? "all",
        unpracticedOnly: Boolean(parsed.filters.unpracticedOnly),
        count:
          typeof parsed.filters.count === "number" && Number.isFinite(parsed.filters.count)
            ? parsed.filters.count
            : parsed.questionIds.length,
      },
      questionIds: parsed.questionIds.filter((id): id is string => typeof id === "string"),
      index: Math.max(0, Math.floor(parsed.index)),
      visitedIds: Array.isArray(parsed.visitedIds)
        ? parsed.visitedIds.filter((id): id is string => typeof id === "string")
        : [],
    };
  } catch {
    return null;
  }
}

export function writeSession(session: PracticeSession): void {
  window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  emitChanged();
}

export function clearSession(): void {
  window.sessionStorage.removeItem(SESSION_KEY);
  emitChanged();
}

export function markVisited(session: PracticeSession, questionId: string): PracticeSession {
  if (session.visitedIds.includes(questionId)) {
    return session;
  }
  return {
    ...session,
    visitedIds: [...session.visitedIds, questionId],
  };
}

export function setSessionIndex(session: PracticeSession, index: number): PracticeSession {
  const clamped = Math.max(0, Math.min(index, Math.max(0, session.questionIds.length - 1)));
  const id = session.questionIds[clamped];
  const next = {
    ...session,
    index: clamped,
  };
  return id ? markVisited(next, id) : next;
}

export function finishSession(session: PracticeSession): PracticeSession {
  return {
    ...session,
    status: "finished",
    finishedAt: new Date().toISOString(),
  };
}

export function currentQuestionId(session: PracticeSession): string | undefined {
  return session.questionIds[session.index];
}

export function isLastQuestion(session: PracticeSession): boolean {
  return session.questionIds.length === 0 || session.index >= session.questionIds.length - 1;
}
