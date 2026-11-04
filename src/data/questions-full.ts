import { questions as fullQuestions } from "@/data/generated/full";
import type { Question } from "@/lib/types";

/**
 * Full question bank including reference answers.
 * Import only from server components / SSG paths — not from `"use client"` modules.
 */
export const questions: readonly Question[] = fullQuestions;

const questionById = new Map(questions.map((item) => [item.id, item]));

export function getQuestion(id: string): Question | undefined {
  return questionById.get(id);
}
