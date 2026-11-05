"use client";

import Link from "next/link";
import { ProgressButtons } from "@/components/ProgressButtons";
import { cn } from "@/lib/utils";

type Neighbor = {
  id: string;
  title: string;
} | null | undefined;

type QuestionThumbBarProps = {
  questionId: string;
  prev?: Neighbor;
  next?: Neighbor;
  className?: string;
};

/**
 * Sticky thumb-zone actions on the question reading desk.
 * Keeps practiced/favorite reachable without blocking the stem.
 */
export function QuestionThumbBar({
  questionId,
  prev,
  next,
  className,
}: QuestionThumbBarProps) {
  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-background/95 backdrop-blur",
        "pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2",
        "sm:static sm:inset-auto sm:z-auto sm:border-0 sm:bg-transparent sm:p-0 sm:backdrop-blur-none",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-2 px-4 sm:px-0">
        <ProgressButtons id={questionId} compact />
        <div className="flex gap-2 sm:hidden">
          {prev ? (
            <Link
              href={`/questions/${prev.id}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              上一题
            </Link>
          ) : (
            <span className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-transparent px-3 text-sm text-muted-foreground/50">
              上一题
            </span>
          )}
          {next ? (
            <Link
              href={`/questions/${next.id}`}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-transparent bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              下一题
            </Link>
          ) : (
            <span className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-border px-3 text-sm text-muted-foreground/50">
              下一题
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
