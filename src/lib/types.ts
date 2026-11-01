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

export type Question = {
  id: string;
  title: string;
  category: CategoryId;
  difficulty: Difficulty;
  tags: string[];
  prompt: string;
  answer: string;
};

export type ProgressState = {
  done: string[];
  starred: string[];
};

export type QuestionFilters = {
  q?: string;
  category?: CategoryId | "all";
  difficulty?: Difficulty | "all";
  mark?: "all" | "open" | "done" | "starred";
};
