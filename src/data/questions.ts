import { categories } from "@/lib/categories";
import { questionSummaries } from "@/data/generated/summaries";
import type {
  CategoryId,
  Difficulty,
  QuestionFilters,
  QuestionSummary,
  SortOption,
} from "@/lib/types";

/**
 * Client-safe question index (no `answer` field).
 * Full answers live in `@/data/questions-full` for detail / SSG pages only.
 * Optional answer keyword search loads `@/data/generated/answer-index` dynamically.
 */
export const questions: readonly QuestionSummary[] = questionSummaries;

const questionById = new Map(questions.map((item) => [item.id, item]));

export function getQuestionSummary(id: string): QuestionSummary | undefined {
  return questionById.get(id);
}

/** @deprecated Prefer getQuestionSummary in list/client code; use questions-full for answers. */
export function getQuestion(id: string): QuestionSummary | undefined {
  return getQuestionSummary(id);
}

export function questionsByCategory(category: CategoryId): QuestionSummary[] {
  return questions.filter((item) => item.category === category);
}

export function countByCategory(): Record<CategoryId, number> {
  return categories.reduce(
    (acc, category) => {
      acc[category.id] = questionsByCategory(category.id).length;
      return acc;
    },
    {} as Record<CategoryId, number>,
  );
}

export function adjacentQuestions(id: string): {
  prev?: QuestionSummary;
  next?: QuestionSummary;
} {
  const current = getQuestionSummary(id);
  if (!current) {
    return {};
  }

  const siblings = questionsByCategory(current.category);
  const index = siblings.findIndex((item) => item.id === id);
  return {
    prev: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

function matchesMetaQuery(question: QuestionSummary, q: string): boolean {
  const haystack = [question.title, question.prompt, question.tags.join(" "), question.id]
    .join("\n")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterQuestions(
  filters: QuestionFilters,
  marks?: { done: Set<string>; starred: Set<string> },
  answerTextById?: Readonly<Record<string, string>>,
): QuestionSummary[] {
  const q = filters.q?.trim().toLowerCase() ?? "";

  return questions.filter((item) => {
    if (filters.category && filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== "all" && item.difficulty !== filters.difficulty) {
      return false;
    }
    if (q) {
      const metaHit = matchesMetaQuery(item, q);
      if (filters.inAnswers && answerTextById) {
        const answerHit = (answerTextById[item.id] ?? "").includes(q);
        if (!metaHit && !answerHit) {
          return false;
        }
      } else if (!metaHit) {
        return false;
      }
    }
    if (marks && filters.mark && filters.mark !== "all") {
      if (filters.mark === "done" && !marks.done.has(item.id)) {
        return false;
      }
      if (filters.mark === "open" && marks.done.has(item.id)) {
        return false;
      }
      if (filters.mark === "starred" && !marks.starred.has(item.id)) {
        return false;
      }
    }
    if (filters.tag && !item.tags.includes(filters.tag)) {
      return false;
    }
    return true;
  });
}

const DIFFICULTY_RANK: Record<Difficulty, number> = {
  foundation: 0,
  applied: 1,
  system: 2,
};

export function sortQuestions(
  items: QuestionSummary[],
  sort: SortOption = "default",
  done?: Set<string>,
): QuestionSummary[] {
  if (sort === "default") {
    return items;
  }

  const copy = [...items];
  if (sort === "open") {
    const doneSet = done ?? new Set<string>();
    copy.sort((a, b) => {
      const aOpen = doneSet.has(a.id) ? 1 : 0;
      const bOpen = doneSet.has(b.id) ? 1 : 0;
      if (aOpen !== bOpen) return aOpen - bOpen;
      return a.id.localeCompare(b.id);
    });
    return copy;
  }

  if (sort === "difficulty") {
    copy.sort(
      (a, b) =>
        DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty] ||
        a.id.localeCompare(b.id),
    );
    return copy;
  }

  // difficulty-desc
  copy.sort(
    (a, b) =>
      DIFFICULTY_RANK[b.difficulty] - DIFFICULTY_RANK[a.difficulty] ||
      a.id.localeCompare(b.id),
  );
  return copy;
}

export type TagCount = { tag: string; count: number };

/** Unique tags sorted by frequency desc, then localeCompare zh. */
export function listTagsWithCounts(): TagCount[] {
  const counts = new Map<string, number>();
  for (const item of questions) {
    for (const tag of item.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, "zh"));
}

export const totalQuestions = questions.length;
