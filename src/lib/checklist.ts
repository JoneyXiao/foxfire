import type { MockChecklistItem } from "@/lib/mock";

export type ChecklistBundle = {
  quotes: readonly string[];
  knowledge: readonly string[];
  answerBullets: readonly string[];
};

/** Flatten a generated checklist bundle into self-check rows. */
export function flattenChecklist(
  questionId: string,
  bundle: ChecklistBundle | undefined,
): MockChecklistItem[] {
  if (!bundle) {
    return [];
  }
  const items: MockChecklistItem[] = [];
  let i = 0;
  for (const text of bundle.quotes) {
    const trimmed = text.trim();
    if (!trimmed) continue;
    items.push({
      id: `${questionId}-quote-${i}`,
      source: "quote",
      text: trimmed,
    });
    i += 1;
  }
  for (const text of bundle.knowledge) {
    const trimmed = text.trim();
    if (!trimmed) continue;
    items.push({
      id: `${questionId}-knowledge-${i}`,
      source: "knowledge",
      text: trimmed,
    });
    i += 1;
  }
  for (const text of bundle.answerBullets) {
    const trimmed = text.trim();
    if (!trimmed) continue;
    items.push({
      id: `${questionId}-answer-${i}`,
      source: "answer",
      text: trimmed,
    });
    i += 1;
  }
  return items;
}

export const CHECKLIST_SOURCE_LABEL = {
  quote: "面试金句",
  knowledge: "知识点",
  answer: "答案要点",
} as const;
