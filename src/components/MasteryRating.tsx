"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  PROGRESS_CHANGED_EVENT,
  rateQuestion,
  readProgress,
} from "@/lib/progress";
import {
  SRS_RATING_LABEL,
  SRS_RATINGS,
  localDayStamp,
} from "@/lib/srs";
import type { SrsCard, SrsRating } from "@/lib/types";
import { cn } from "@/lib/utils";

type MasteryRatingProps = {
  id: string;
  /** Compact row under answer reveal; default is a labeled section. */
  variant?: "card" | "inline";
  className?: string;
};

export function MasteryRating({ id, variant = "card", className }: MasteryRatingProps) {
  const [ready, setReady] = useState(false);
  const [card, setCard] = useState<SrsCard | undefined>();
  const [justRated, setJustRated] = useState<SrsRating | null>(null);

  useEffect(() => {
    function refresh() {
      setCard(readProgress().srs[id]);
      setReady(true);
    }
    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
  }, [id]);

  useEffect(() => {
    setJustRated(null);
  }, [id]);

  function onRate(rating: SrsRating) {
    const next = rateQuestion(id, rating);
    setCard(next.srs[id]);
    setJustRated(rating);
  }

  if (!ready) {
    return (
      <div className={cn("text-sm text-muted-foreground", className)} aria-busy="true">
        读取掌握度…
      </div>
    );
  }

  const today = localDayStamp();
  const isDue = Boolean(card && card.dueAt <= today);
  const dueHint = card
    ? isDue
      ? "今日待复习"
      : `下次复习 ${card.dueAt}`
    : "尚未自评";

  const body = (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          掌握度
        </p>
        <p
          className={cn(
            "font-mono text-[0.7rem] tabular-nums tracking-tight",
            isDue ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {card ? (
            <>
              {SRS_RATING_LABEL[card.rating]} · {dueHint}
            </>
          ) : (
            dueHint
          )}
        </p>
      </div>
      <p className="text-sm text-muted-foreground">
        看完参考后自评，驱动间隔复习队列（生疏 1 天 · 模糊约 3 天 · 掌握 7 天起翻倍）。待复习入口集中在首页。
      </p>
      <div className="flex flex-wrap gap-2" role="group" aria-label="自评掌握度">
        {SRS_RATINGS.map((rating) => {
          const active = (justRated ?? card?.rating) === rating;
          return (
            <Button
              key={rating}
              type="button"
              size="sm"
              variant={active ? "secondary" : "outline"}
              className="min-h-11"
              aria-pressed={active}
              onClick={() => onRate(rating)}
            >
              {SRS_RATING_LABEL[rating]}
            </Button>
          );
        })}
      </div>
      {justRated ? (
        <p className="text-sm text-muted-foreground" role="status">
          已记为「{SRS_RATING_LABEL[justRated]}」
          {card ? `，下次 ${card.dueAt}` : ""}；同时标为已练。
        </p>
      ) : null}
    </>
  );

  if (variant === "inline") {
    return <div className={cn("space-y-3 border-t border-border/80 pt-4", className)}>{body}</div>;
  }

  return (
    <div className={cn("space-y-3 border-y border-border/80 py-4", className)}>
      {body}
    </div>
  );
}
