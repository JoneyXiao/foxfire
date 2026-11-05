"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PlayIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { IndexRow, IndexSection } from "@/components/IndexRow";
import { PracticeActions } from "@/components/PracticeActions";
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
      <section className={cn("space-y-3", className)} aria-busy="true">
        <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          今天练什么
        </h2>
        <div className="h-4 w-2/3 animate-pulse rounded-md bg-muted" />
      </section>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <IndexSection
        label="今天练什么"
        action={
          dueItems.length > 0 ? (
            <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
              {dueItems.length} due
            </span>
          ) : null
        }
      >
        {dueItems.length > 0 ? (
          preview.map((item, index) => {
            const card = progress.srs[item.id];
            return (
              <IndexRow
                key={item.id}
                href={`/questions/${item.id}`}
                badge={String(index + 1).padStart(2, "0")}
                title={item.title}
                meta={card ? SRS_RATING_LABEL[card.rating] : undefined}
              />
            );
          })
        ) : (
          <li className="border-b border-border/80 py-3 text-sm text-muted-foreground last:border-b-0">
            暂无到期题。打开一题、展开参考后点「生疏 / 模糊 / 掌握」会出现在这里。
          </li>
        )}
      </IndexSection>

      {dueItems.length > 0 ? (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Button type="button" className="min-h-11 px-4" onClick={startReviewSession}>
              <PlayIcon data-icon="inline-start" />
              开始今日复习
            </Button>
            {dueItems.length > previewLimit ? (
              <p className="text-sm text-muted-foreground">
                另有 {dueItems.length - previewLimit} 题未列出。
              </p>
            ) : null}
            <Link
              href="/progress?tab=review"
              className={cn(buttonVariants({ variant: "ghost" }), "min-h-11")}
            >
              在进度页查看
            </Link>
          </div>
          <PracticeActions compact nextVariant="outline" />
        </div>
      ) : (
        <PracticeActions compact />
      )}
    </div>
  );
}
