"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { RotateCcwIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionTable } from "@/components/QuestionTable";
import { questions } from "@/data/questions";
import { checklistById } from "@/data/generated/checklist-index";
import { categoryById, difficultyLabel } from "@/lib/categories";
import { flattenChecklist } from "@/lib/checklist";
import {
  clearMockSession,
  elapsedSeconds,
  formatClock,
  plannedSeconds,
  readMockSession,
  type MockSession,
} from "@/lib/mock";
import { QuietEmpty } from "@/components/QuietEmpty";
import { cn } from "@/lib/utils";

export function MockSummary() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<MockSession | null>(null);

  useEffect(() => {
    setSession(readMockSession());
    setReady(true);
  }, []);

  const stats = useMemo(() => {
    if (!session) return null;
    const ids = session.questionIds;
    let revealed = 0;
    let recorded = 0;
    let checked = 0;
    let checklistTotal = 0;
    for (const id of ids) {
      const result = session.results[id];
      if (result?.revealed) revealed += 1;
      if (result?.recorded) recorded += 1;
      const items = flattenChecklist(
        id,
        checklistById[id as keyof typeof checklistById],
      );
      checklistTotal += items.length;
      if (result) {
        checked += result.checked.filter((cid) =>
          items.some((item) => item.id === cid),
        ).length;
      }
    }
    const elapsed = elapsedSeconds(session);
    const planned = plannedSeconds(session);
    return {
      total: ids.length,
      revealed,
      recorded,
      checked,
      checklistTotal,
      elapsed,
      planned,
      overtime: Math.max(0, elapsed - planned),
      items: questions.filter((item) => ids.includes(item.id)),
    };
  }, [session]);

  if (!ready) {
    return (
      <div className="space-y-3 py-6" aria-busy="true">
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (!session || !stats) {
    return (
      <QuietEmpty
        label="summary"
        title="还没有模拟小结"
        body="先开一场 15–30 分钟模拟，结束后会显示用时与覆盖题目。"
        nextStep="到模拟页设定时长与题量，点黄按钮开场。"
        href="/mock"
        action="去开一场"
      />
    );
  }

  const categoryLabel =
    session.filters.category === "all"
      ? "全部分类"
      : categoryById(session.filters.category)?.name ?? session.filters.category;
  const difficultyText =
    session.filters.difficulty === "all"
      ? "全部难度"
      : difficultyLabel[session.filters.difficulty];

  return (
    <div className="space-y-6">
      <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
        本场读数
      </p>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle>用时</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">{formatClock(stats.elapsed)}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              计划 {formatClock(stats.planned)}
              {stats.overtime > 0 ? ` · 超时 ${formatClock(stats.overtime)}` : null}
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>覆盖题目</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">
              {stats.total}
              <span className="ml-1 text-sm font-normal text-muted-foreground">题</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              已展开要点 {stats.revealed} · 录音 {stats.recorded}
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>要点勾选</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">
              {stats.checked}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                / {stats.checklistTotal}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>本场设置</CardTitle>
          <CardDescription>
            {categoryLabel} · {difficultyText} · {session.filters.durationMinutes} 分钟 ·{" "}
            {session.filters.count} 题
            {session.status === "active" ? " · 仍在进行中" : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {session.status === "active" ? (
            <Link href="/mock/run" className={buttonVariants()}>
              回到模拟
            </Link>
          ) : null}
          <Link href="/mock" className={buttonVariants({ variant: "outline" })}>
            <RotateCcwIcon data-icon="inline-start" className="size-4" />
            再开一场
          </Link>
          {session.status === "finished" ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                clearMockSession();
                setSession(null);
              }}
            >
              清除小结
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">本场题目</h2>
        <p className="text-sm text-muted-foreground">
          题号：{session.questionIds.join("、")}
        </p>
        <QuestionTable
          items={stats.items}
          emptyTitle="本场题目为空"
          emptyBody="重新开一场模拟即可。"
        />
      </section>

      <p className={cn("text-sm text-muted-foreground")}>
        录音片段不会写入本机进度备份；要点勾选仅保存在本场 sessionStorage。
      </p>
    </div>
  );
}
