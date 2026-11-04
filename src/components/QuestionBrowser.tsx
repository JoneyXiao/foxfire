"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { FilterLinks } from "@/components/FilterLinks";
import { QuestionTable } from "@/components/QuestionTable";
import { SearchForm } from "@/components/SearchForm";
import { isCategoryId } from "@/lib/categories";
import { filterQuestions } from "@/data/questions";
import type { CategoryId, Difficulty, QuestionSummary } from "@/lib/types";

type QuestionBrowserProps = {
  basePath: string;
  lockedCategory?: CategoryId;
  showCategory?: boolean;
  emptyTitle: string;
  emptyBody: string;
  emptyHref: string;
  emptyAction: string;
  autoFocus?: boolean;
  seed?: QuestionSummary[];
};

function parseDifficulty(value: string | null): Difficulty | "all" {
  if (value === "foundation" || value === "applied" || value === "system") {
    return value;
  }
  return "all";
}

export function QuestionBrowser({
  basePath,
  lockedCategory,
  showCategory = true,
  emptyTitle,
  emptyBody,
  emptyHref,
  emptyAction,
  autoFocus,
}: QuestionBrowserProps) {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const categoryParam = searchParams.get("category");
  const category: CategoryId | "all" = lockedCategory
    ? lockedCategory
    : categoryParam && isCategoryId(categoryParam)
      ? categoryParam
      : "all";
  const difficulty = parseDifficulty(searchParams.get("difficulty"));
  const mark = searchParams.get("mark") ?? "all";
  const tag = searchParams.get("tag") ?? "";

  const items = useMemo(
    () =>
      filterQuestions({
        q,
        category,
        difficulty,
        tag: tag || undefined,
      }),
    [q, category, difficulty, tag],
  );

  return (
    <div className="space-y-6">
      <SearchForm action={basePath} query={q} autoFocus={autoFocus} />
      <FilterLinks
        basePath={basePath}
        query={q}
        category={category}
        difficulty={difficulty}
        mark={mark}
        tag={tag}
        showCategory={showCategory}
      />
      <QuestionTable
        items={items}
        mark={mark}
        emptyTitle={emptyTitle}
        emptyBody={emptyBody}
        emptyHref={emptyHref}
        emptyAction={emptyAction}
      />
    </div>
  );
}
