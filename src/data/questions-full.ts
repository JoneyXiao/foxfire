import fs from "node:fs";
import path from "node:path";
import { questionSummaries } from "@/data/generated/summaries";
import type { Question } from "@/lib/types";

/**
 * Full questions including reference answers.
 * Each question is a JSON file under public/data/questions/<id>.json so:
 * - SSG detail pages load only that route's payload via fs
 * - The client can fetch the same file when expanding the answer
 * Never import this module from `"use client"` graphs.
 */

const questionsDir = path.join(process.cwd(), "public/data/questions");

export function listQuestionIds(): string[] {
  return questionSummaries.map((item) => item.id);
}

export function getQuestion(id: string): Question | undefined {
  if (!id || id.includes("/") || id.includes("..") || id.includes("\\")) {
    return undefined;
  }
  const file = path.join(questionsDir, `${id}.json`);
  if (!fs.existsSync(file)) {
    return undefined;
  }
  try {
    return JSON.parse(fs.readFileSync(file, "utf8")) as Question;
  } catch {
    return undefined;
  }
}
