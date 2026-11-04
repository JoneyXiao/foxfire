"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FilterLinks } from "@/components/FilterLinks";
import { QuestionTable } from "@/components/QuestionTable";
import { SearchForm } from "@/components/SearchForm";
import { useProgressSets } from "@/components/ProgressButtons";
import { isCategoryId } from "@/lib/categories";
import { filterQuestions, sortQuestions } from "@/data/questions";
import type {
  CategoryId,
  Difficulty,
  QuestionSummary,
  SortOption,
} from "@/lib/types";
import { SORT_OPTIONS } from "@/lib/types";

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

function parseSort(value: string | null): SortOption {
  if (value && (SORT_OPTIONS as readonly string[]).includes(value)) {
    return value as SortOption;
  }
  return "default";
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
  const { ready, done } = useProgressSets();
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
  const sort = parseSort(searchParams.get("sort"));
  const inAnswers = searchParams.get("answers") === "1";

  const [answerTextById, setAnswerTextById] = useState<
    Readonly<Record<string, string>> | undefined
  >(undefined);
  const [answerIndexStatus, setAnswerIndexStatus] = useState<
    "idle" | "loading" | "ready" | "error"
  >("idle");

  useEffect(() => {
    if (!inAnswers) {
      setAnswerTextById(undefined);
      setAnswerIndexStatus("idle");
      return;
    }

    let cancelled = false;
    setAnswerIndexStatus("loading");
    import("@/data/generated/answer-index")
      .then((mod) => {
        if (cancelled) return;
        setAnswerTextById(mod.answerSearchById);
        setAnswerIndexStatus("ready");
      })
      .catch(() => {
        if (cancelled) return;
        setAnswerTextById(undefined);
        setAnswerIndexStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [inAnswers]);

  const items = useMemo(() => {
    const filtered = filterQuestions(
      {
        q,
        category,
        difficulty,
        tag: tag || undefined,
        inAnswers,
      },
      undefined,
      inAnswers ? answerTextById : undefined,
    );
    // open-first needs progress; until ready keep bank order to avoid flicker.
    if (sort === "open" && !ready) {
      return filtered;
    }
    return sortQuestions(filtered, sort, done);
  }, [q, category, difficulty, tag, inAnswers, answerTextById, sort, ready, done]);

  const waitingForAnswerIndex = inAnswers && Boolean(q.trim()) && answerIndexStatus === "loading";

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
        sort={sort}
        answers={inAnswers}
        showCategory={showCategory}
      />
      {inAnswers ? (
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {answerIndexStatus === "loading"
            ? "正在加载参考作答检索索引…"
            : answerIndexStatus === "error"
              ? "参考作答索引加载失败，当前仅搜题干/标签。"
              : answerIndexStatus === "ready"
                ? "已启用参考作答关键词检索（列表仍不含完整答案正文）。"
                : null}
        </p>
      ) : null}
      {waitingForAnswerIndex ? (
        <div className="space-y-3 py-6" aria-busy="true">
          <div className="h-5 w-2/5 animate-pulse rounded-md bg-muted" />
          <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        </div>
      ) : (
        <QuestionTable
          items={items}
          mark={mark}
          emptyTitle={emptyTitle}
          emptyBody={emptyBody}
          emptyHref={emptyHref}
          emptyAction={emptyAction}
        />
      )}
    </div>
  );
}
