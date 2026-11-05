"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayIcon, SearchIcon } from "lucide-react";
import { IndexSection } from "@/components/IndexRow";
import { buttonVariants } from "@/components/ui/button";
import { questions } from "@/data/questions";
import {
  categoryProgressStats,
  difficultyProgressStats,
  formatPercent,
  weakCategories,
  type BucketStats,
} from "@/lib/analytics";
import { cn } from "@/lib/utils";

type ProgressAnalyticsProps = {
  done: Set<string>;
  starred: Set<string>;
};

type WeakFilter = "all" | "weak";

function ProgressBar({ rate, tone }: { rate: number; tone: "default" | "weak" | "strong" }) {
  const width = `${Math.max(0, Math.min(100, Math.round(rate * 100)))}%`;
  return (
    <div
      className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(rate * 100)}
    >
      <div
        className={cn(
          "h-full rounded-full",
          tone === "weak" && "bg-amber-500/80",
          tone === "strong" && "bg-emerald-500/80",
          tone === "default" && "bg-primary",
        )}
        style={{ width }}
      />
    </div>
  );
}

function toneFor(rate: number, open: number): "default" | "weak" | "strong" {
  if (open === 0) {
    return "strong";
  }
  if (rate < 0.4) {
    return "weak";
  }
  return "default";
}

function BucketList({
  items,
  linkKind,
}: {
  items: BucketStats[];
  linkKind: "category" | "difficulty";
}) {
  if (items.length === 0) {
    return (
      <li className="border-b border-border/80 py-3 text-sm text-muted-foreground last:border-b-0">
        当前筛选下没有可显示的项。
      </li>
    );
  }

  return (
    <>
      {items.map((item, index) => {
        const browseHref =
          linkKind === "category"
            ? `/search?category=${encodeURIComponent(item.id)}&mark=open`
            : `/search?difficulty=${encodeURIComponent(item.id)}&mark=open`;
        const sessionHref =
          linkKind === "category"
            ? `/practice?category=${encodeURIComponent(item.id)}&unpracticed=1`
            : `/practice?difficulty=${encodeURIComponent(item.id)}&unpracticed=1`;

        return (
          <li key={item.id} className="border-b border-border/80 last:border-b-0">
            <div className="flex min-h-11 items-center gap-3 py-3">
              <span className="w-10 shrink-0 font-mono text-[0.7rem] tabular-nums tracking-tight text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-snug text-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                  {item.done}/{item.total} · 未练 {item.open} · {formatPercent(item.rate)}
                </p>
                <div className="mt-2">
                  <ProgressBar rate={item.rate} tone={toneFor(item.rate, item.open)} />
                </div>
              </div>
              <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                {item.open > 0 ? (
                  <>
                    <Link
                      href={browseHref}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 gap-1 px-2")}
                    >
                      <SearchIcon className="size-3.5" aria-hidden="true" />
                      未练
                    </Link>
                    <Link
                      href={sessionHref}
                      className={cn(buttonVariants({ variant: "default", size: "sm" }), "h-7 gap-1 px-2")}
                    >
                      <PlayIcon className="size-3.5" aria-hidden="true" />
                      会话
                    </Link>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">已练完</span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </>
  );
}

export function ProgressAnalytics({ done, starred }: ProgressAnalyticsProps) {
  const [weakOnly, setWeakOnly] = useState<WeakFilter>("weak");

  const categoryStats = useMemo(
    () => categoryProgressStats(questions, done, starred),
    [done, starred],
  );
  const difficultyStats = useMemo(
    () => difficultyProgressStats(questions, done, starred),
    [done, starred],
  );

  const weakList = useMemo(() => weakCategories(categoryStats, { maxRate: 0.5 }), [categoryStats]);

  const visibleCategories = useMemo(() => {
    if (weakOnly === "weak") {
      if (weakList.length > 0) {
        return weakList;
      }
      return weakCategories(categoryStats, { maxRate: 1 });
    }
    return [...categoryStats].sort((a, b) => a.rate - b.rate || b.open - a.open);
  }, [weakOnly, weakList, categoryStats]);

  const overallDone = done.size;
  const overallTotal = questions.length;
  const overallRate = overallTotal > 0 ? overallDone / overallTotal : 0;
  const overallOpen = overallTotal - overallDone;

  return (
    <div className="space-y-8">
      <section className="space-y-3" aria-labelledby="coverage-heading">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2
            id="coverage-heading"
            className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
          >
            覆盖概览
          </h2>
          <p className="text-xs text-muted-foreground">
            {weakList.length > 0
              ? `薄弱分类（<50%）${weakList.length} 个`
              : overallDone === 0
                ? "从任意分类开始练即可"
                : "暂无低于 50% 的分类"}
          </p>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2 border-t border-border/80 pt-3">
          <p className="text-2xl font-medium tabular-nums">
            {formatPercent(overallRate)}
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              全库 · {overallDone}/{overallTotal}
            </span>
          </p>
          {overallOpen > 0 ? (
            <Link
              href="/practice?unpracticed=1"
              className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              练未练题
            </Link>
          ) : null}
        </div>
        <ProgressBar rate={overallRate} tone={toneFor(overallRate, overallOpen)} />
      </section>

      <div className="grid gap-8 lg:grid-cols-2">
        <IndexSection
          label="分类完成率"
          action={
            <div className="flex gap-1" role="group" aria-label="分类筛选">
              <button
                type="button"
                aria-pressed={weakOnly === "weak"}
                onClick={() => setWeakOnly("weak")}
                className={cn(
                  "inline-flex h-7 items-center rounded-lg border px-2.5 text-xs transition-colors",
                  weakOnly === "weak"
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                薄弱优先
              </button>
              <button
                type="button"
                aria-pressed={weakOnly === "all"}
                onClick={() => setWeakOnly("all")}
                className={cn(
                  "inline-flex h-7 items-center rounded-lg border px-2.5 text-xs transition-colors",
                  weakOnly === "all"
                    ? "border-transparent bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted",
                )}
              >
                全部
              </button>
            </div>
          }
        >
          <BucketList items={visibleCategories} linkKind="category" />
        </IndexSection>

        <IndexSection label="难度完成率">
          <BucketList items={difficultyStats} linkKind="difficulty" />
        </IndexSection>
      </div>

      <p className="text-xs text-muted-foreground">
        「未练」打开筛选列表，「会话」直接开该桶练习。
      </p>
    </div>
  );
}
