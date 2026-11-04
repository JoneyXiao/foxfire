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
import { categoryById, difficultyLabel } from "@/lib/categories";
import { PROGRESS_CHANGED_EVENT, readProgress } from "@/lib/progress";
import { clearSession, readSession, type PracticeSession } from "@/lib/session";
import { cn } from "@/lib/utils";

export function PracticeSummary() {
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [done, setDone] = useState<string[]>([]);
  const [starred, setStarred] = useState<string[]>([]);

  useEffect(() => {
    function refresh() {
      setSession(readSession());
      const progress = readProgress();
      setDone(progress.done);
      setStarred(progress.starred);
      setReady(true);
    }
    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
  }, []);

  const stats = useMemo(() => {
    if (!session) {
      return null;
    }
    const ids = session.questionIds;
    const doneSet = new Set(done);
    const starredSet = new Set(starred);
    const completed = ids.filter((id) => doneSet.has(id));
    const favorites = ids.filter((id) => starredSet.has(id));
    const visited = ids.filter((id) => session.visitedIds.includes(id));
    const rate = ids.length === 0 ? 0 : Math.round((completed.length / ids.length) * 100);
    return {
      total: ids.length,
      completedCount: completed.length,
      favoriteCount: favorites.length,
      visitedCount: visited.length,
      rate,
      favoriteItems: questions.filter((item) => favorites.includes(item.id)),
      sessionItems: questions.filter((item) => ids.includes(item.id)),
    };
  }, [session, done, starred]);

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
      <Card>
        <CardHeader>
          <CardTitle>还没有会话小结</CardTitle>
          <CardDescription>先开一场练习，结束后会在这里显示完成率与收藏回顾。</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/practice" className={buttonVariants()}>
            去开一场
          </Link>
        </CardContent>
      </Card>
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
      <div className="grid gap-3 sm:grid-cols-3">
        <Card size="sm">
          <CardHeader>
            <CardTitle>完成率</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">
              {stats.rate}
              <span className="ml-1 text-sm font-normal text-muted-foreground">%</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              已练 {stats.completedCount} / {stats.total}
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>本场访问</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">
              {stats.visitedCount}
              <span className="ml-1 text-sm font-normal text-muted-foreground">/ {stats.total}</span>
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>收藏</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">{stats.favoriteCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>本场筛选</CardTitle>
          <CardDescription>
            {categoryLabel} · {difficultyText} ·{" "}
            {session.filters.unpracticedOnly ? "仅未练" : "含已练"} · 计划{" "}
            {session.filters.count} 题
            {session.status === "active" ? " · 仍在进行中" : null}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {session.status === "active" ? (
            <Link
              href={`/questions/${session.questionIds[session.index]}`}
              className={buttonVariants()}
            >
              回到会话
            </Link>
          ) : null}
          <Link href="/practice" className={buttonVariants({ variant: "outline" })}>
            <RotateCcwIcon data-icon="inline-start" className="size-4" />
            再开一场
          </Link>
          {session.status === "finished" ? (
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                clearSession();
                setSession(null);
              }}
            >
              清除小结
            </Button>
          ) : null}
        </CardContent>
      </Card>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-medium">收藏回顾</h2>
        <QuestionTable
          items={stats.favoriteItems}
          emptyTitle="本场没有收藏"
          emptyBody="在题目页点收藏，结束后会集中出现在这里方便复盘。"
        />
      </section>

      <section className="space-y-3">
        <h2 className="font-heading text-lg font-medium">本场题目</h2>
        <QuestionTable
          items={stats.sessionItems}
          emptyTitle="本场题目为空"
          emptyBody="重新开一场练习即可。"
        />
      </section>

      <p className={cn("text-sm text-muted-foreground")}>
        完成率按本场题中已标「已练」计算；收藏来自本机进度。
      </p>
    </div>
  );
}
