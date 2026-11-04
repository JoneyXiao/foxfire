"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCwIcon, PlayIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { questions } from "@/data/questions";
import {
  emptyProgress,
  PROGRESS_CHANGED_EVENT,
  readProgress,
} from "@/lib/progress";
import { listDueIds, SRS_RATING_LABEL } from "@/lib/srs";
import {
  createSession,
  currentQuestionId,
  writeSession,
  type SessionFilters,
} from "@/lib/session";
import type { ProgressState, QuestionSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type TodayReviewProps = {
  /** Cap list preview length on home. */
  previewLimit?: number;
  className?: string;
};

export function TodayReview({ previewLimit = 5, className }: TodayReviewProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState<ProgressState>(emptyProgress);

  useEffect(() => {
    function refresh() {
      setProgress(readProgress());
      setReady(true);
    }
    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
  }, []);

  const dueIds = useMemo(() => (ready ? listDueIds(progress) : []), [ready, progress]);
  const byId = useMemo(() => {
    const map = new Map<string, QuestionSummary>();
    for (const q of questions) {
      map.set(q.id, q);
    }
    return map;
  }, []);

  const dueItems = useMemo(
    () =>
      dueIds
        .map((id) => byId.get(id))
        .filter((item): item is QuestionSummary => Boolean(item)),
    [dueIds, byId],
  );

  const preview = dueItems.slice(0, previewLimit);

  function startReviewSession() {
    if (dueItems.length === 0) return;
    const ids = dueItems.map((item) => item.id);
    const filters: SessionFilters = {
      category: "all",
      difficulty: "all",
      unpracticedOnly: false,
      count: ids.length,
    };
    const session = createSession(ids, filters);
    writeSession(session);
    const first = currentQuestionId(session);
    if (first) {
      router.push(`/questions/${first}`);
    }
  }

  if (!ready) {
    return (
      <Card size="sm" className={className} aria-busy="true">
        <CardHeader>
          <CardTitle>今日待复习</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card size="sm" className={className}>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div className="space-y-1">
          <CardTitle className="flex items-center gap-2">
            <RefreshCwIcon className="size-4" aria-hidden />
            今日待复习
          </CardTitle>
          <CardDescription>
            {dueItems.length > 0
              ? `共 ${dueItems.length} 题到期，按掌握度自评后会重新排期。`
              : "暂无到期题目。练过并自评掌握度后会出现在这里。"}
          </CardDescription>
        </div>
        {dueItems.length > 0 ? (
          <span className="rounded-lg bg-primary px-2.5 py-1 text-sm font-medium tabular-nums text-primary-foreground">
            {dueItems.length}
          </span>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-3">
        {dueItems.length > 0 ? (
          <>
            <ul className="space-y-2">
              {preview.map((item) => {
                const card = progress.srs[item.id];
                return (
                  <li key={item.id}>
                    <Link
                      href={`/questions/${item.id}`}
                      className="flex items-start justify-between gap-3 rounded-lg border px-3 py-2 text-sm transition-colors hover:bg-muted/40"
                    >
                      <span className="min-w-0 font-medium leading-snug">{item.title}</span>
                      {card ? (
                        <span className="shrink-0 text-muted-foreground">
                          {SRS_RATING_LABEL[card.rating]}
                        </span>
                      ) : null}
                    </Link>
                  </li>
                );
              })}
            </ul>
            {dueItems.length > previewLimit ? (
              <p className="text-sm text-muted-foreground">
                另有 {dueItems.length - previewLimit} 题未列出。
              </p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button type="button" onClick={startReviewSession}>
                <PlayIcon data-icon="inline-start" />
                开始今日复习
              </Button>
              <Link
                href="/progress?tab=review"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                在进度页查看
              </Link>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            打开一题、展开参考后点「生疏 / 模糊 / 掌握」即可进入复习队列。
          </p>
        )}
      </CardContent>
    </Card>
  );
}
