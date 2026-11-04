export const CATEGORY_IDS = [
  "llm-basics",
  "api-structured",
  "prompting",
  "rag",
  "knowledge",
  "agent",
  "harness",
  "frameworks",
  "deployment",
  "evaluation",
  "reliability",
  "safety",
  "product-cost",
  "ml-basics",
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

export const DIFFICULTIES = ["foundation", "applied", "system"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

export type Category = {
  id: CategoryId;
  name: string;
  summary: string;
};

/** List / client-safe shape — no reference answer body. */
export type QuestionSummary = {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  tags: string[];
  prompt: string;
};

/** Full question including reference answer (detail / server). */
export type Question = QuestionSummary & {
  answer: string;
};

export type ProgressState = {
  done: string[];
  starred: string[];
};

export const SORT_OPTIONS = ["default", "open", "difficulty", "difficulty-desc"] as const;
export type SortOption = (typeof SORT_OPTIONS)[number];

export type QuestionFilters = {
  q?: string;
  category?: CategoryId | "all";
  difficulty?: Difficulty | "all";
  mark?: "all" | "open" | "done" | "starred";
  tag?: string;
  /** When true, also match against the optional answer keyword index. */
  inAnswers?: boolean;
  sort?: SortOption;
};
