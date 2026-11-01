"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { badgeVariants } from "@/components/ui/badge";
import { QuestionTable } from "@/components/QuestionTable";
import { useProgressSets } from "@/components/ProgressButtons";
import { questions, totalQuestions } from "@/data/questions";
import { cn } from "@/lib/utils";

export function ProgressPanel() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "starred" ? "starred" : "done";
  const { ready, done, starred } = useProgressSets();
  const doneItems = questions.filter((item) => done.has(item.id));
  const starredItems = questions.filter((item) => starred.has(item.id));

  if (!ready) {
    return (
      <div className="space-y-3 py-6" aria-busy="true">
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>已练</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">
              {done.size}
              <span className="ml-2 text-sm font-normal text-muted-foreground">/ {totalQuestions}</span>
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>收藏</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">{starred.size}</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="进度列表">
        <Link
          href="/progress?tab=done"
          aria-current={tab === "done" ? "page" : undefined}
          className={cn(badgeVariants({ variant: tab === "done" ? "default" : "outline" }), "h-7 px-2.5")}
        >
          已练
        </Link>
        <Link
          href="/progress?tab=starred"
          aria-current={tab === "starred" ? "page" : undefined}
          className={cn(
            badgeVariants({ variant: tab === "starred" ? "default" : "outline" }),
            "h-7 px-2.5",
          )}
        >
          收藏
        </Link>
      </div>
      {tab === "done" ? (
        <QuestionTable
          items={doneItems}
          emptyTitle="还没有练过"
          emptyBody="从题库打开一题，对照参考作答后标为已练。"
        />
      ) : (
        <QuestionTable
          items={starredItems}
          emptyTitle="还没有收藏"
          emptyBody="在题目页点收藏，回头只看要复盘的几道。"
        />
      )}
    </div>
  );
}
