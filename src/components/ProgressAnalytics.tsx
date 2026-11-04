"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PlayIcon, SearchIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      className="h-2 w-full overflow-hidden rounded-full bg-muted"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(rate * 100)}
    >
      <div
        className={cn(
          "h-full rounded-full transition-[width]",
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
      <p className="text-sm text-muted-foreground">
        当前筛选下没有可显示的项。
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {items.map((item) => {
        const tone = toneFor(item.rate, item.open);
        const browseHref =
          linkKind === "category"
            ? `/search?category=${encodeURIComponent(item.id)}&mark=open`
            : `/search?difficulty=${encodeURIComponent(item.id)}&mark=open`;
        const sessionHref =
          linkKind === "category"
            ? `/practice?category=${encodeURIComponent(item.id)}&unpracticed=1`
            : `/practice?difficulty=${encodeURIComponent(item.id)}&unpracticed=1`;

        return (
          <li key={item.id} className="space-y-1.5">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{item.label}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {item.done}/{item.total} · 未练 {item.open} · {formatPercent(item.rate)}
                </p>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.open > 0 ? (
                  <>
                    <Link
                      href={browseHref}
                      className={cn(buttonVariants({ variant: "outline", size: "sm" }), "h-7 gap-1 px-2")}
                    >
                      <SearchIcon className="size-3.5" />
                      未练
                    </Link>
                    <Link
                      href={sessionHref}
                      className={cn(buttonVariants({ variant: "default", size: "sm" }), "h-7 gap-1 px-2")}
                    >
                      <PlayIcon className="size-3.5" />
                      会话
                    </Link>
                  </>
                ) : (
                  <span className="text-xs text-muted-foreground">已练完</span>
                )}
              </div>
            </div>
            <ProgressBar rate={item.rate} tone={tone} />
          </li>
        );
      })}
    </ul>
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
      // Prefer under 50%; if none, show all with open remaining, weakest first.
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

  return (
    <div className="space-y-4">
      <Card size="sm">
        <CardHeader>
          <CardTitle>覆盖概览</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <p className="text-2xl font-medium tabular-nums">
              {formatPercent(overallRate)}
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                全库完成率 · {overallDone}/{overallTotal}
              </span>
            </p>
            {weakList.length > 0 ? (
              <p className="text-sm text-muted-foreground">
                薄弱分类（&lt;50%）{weakList.length} 个
              </p>
            ) : overallDone === 0 ? (
              <p className="text-sm text-muted-foreground">从任意分类开始练即可</p>
            ) : (
              <p className="text-sm text-muted-foreground">暂无低于 50% 的分类</p>
            )}
          </div>
          <ProgressBar rate={overallRate} tone={toneFor(overallRate, overallTotal - overallDone)} />
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader className="gap-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <CardTitle>分类完成率</CardTitle>
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
            </div>
            <p className="text-xs text-muted-foreground">
              点「未练」进筛选列表，「会话」直接开该分类练习。
            </p>
          </CardHeader>
          <CardContent>
            <BucketList items={visibleCategories} linkKind="category" />
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>难度完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <BucketList items={difficultyStats} linkKind="difficulty" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
