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
  /** Empty when the bank prompt duplicated title (saves list-chunk bytes). */
  prompt: string;
};

/** Full question including reference answer (detail / server). */
export type Question = QuestionSummary & {
  answer: string;
  /** Three short, speakable interview lines extracted from the source answer. */
  interviewQuotes: readonly [string, string, string] | readonly string[];
};

/** Self-rated mastery for spaced repetition: 生疏 / 模糊 / 掌握. */
export type SrsRating = "hard" | "fuzzy" | "known";

export type SrsCard = {
  rating: SrsRating;
  /** Days until next review after the last rating. */
  intervalDays: number;
  /** Local calendar day YYYY-MM-DD when the card becomes due. */
  dueAt: string;
  reviewedAt: string;
  reps: number;
};

export type ProgressState = {
  done: string[];
  starred: string[];
  /** Per-question SRS state; absent keys mean never rated. */
  srs: Record<string, SrsCard>;
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
