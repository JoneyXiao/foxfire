"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FlagIcon, SkipForwardIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  currentQuestionId,
  finishSession,
  isLastQuestion,
  markVisited,
  readSession,
  SESSION_CHANGED_EVENT,
  setSessionIndex,
  writeSession,
  type PracticeSession,
} from "@/lib/session";
import { cn } from "@/lib/utils";

type SessionBarProps = {
  questionId: string;
};

export function SessionBar({ questionId }: SessionBarProps) {
  const router = useRouter();
  const [session, setSession] = useState<PracticeSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    function refresh() {
      const current = readSession();
      setSession(current);
      setReady(true);
    }
    refresh();
    window.addEventListener(SESSION_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(SESSION_CHANGED_EVENT, refresh);
  }, []);

  useEffect(() => {
    if (!ready) {
      return;
    }
    const current = readSession();
    if (!current || current.status !== "active") {
      return;
    }
    if (!current.questionIds.includes(questionId)) {
      return;
    }
    const index = current.questionIds.indexOf(questionId);
    let next = current;
    if (current.index !== index) {
      next = setSessionIndex(current, index);
    } else {
      next = markVisited(current, questionId);
    }
    if (
      next.index !== current.index ||
      next.visitedIds.length !== current.visitedIds.length
    ) {
      // writeSession emits SESSION_CHANGED_EVENT; the listener above refreshes UI.
      writeSession(next);
    }
  }, [questionId, ready]);

  if (!ready || !session || session.status !== "active") {
    return null;
  }

  if (!session.questionIds.includes(questionId)) {
    return null;
  }

  const position = session.index + 1;
  const total = session.questionIds.length;
  const last = isLastQuestion(session);

  function goNext() {
    const current = readSession();
    if (!current || current.status !== "active") {
      return;
    }
    if (isLastQuestion(current)) {
      endSession({ skipConfirm: true });
      return;
    }
    const next = setSessionIndex(current, current.index + 1);
    writeSession(next);
    const id = currentQuestionId(next);
    if (id) {
      router.push(`/questions/${id}`);
    }
  }

  function endSession(opts?: { skipConfirm?: boolean }) {
    if (!opts?.skipConfirm) {
      const ok = window.confirm("确定结束当前练习会话并查看小结？");
      if (!ok) {
        return;
      }
    }
    const current = readSession();
    if (!current) {
      router.push("/practice/summary");
      return;
    }
    const finished = finishSession(markVisited(current, questionId));
    writeSession(finished);
    router.push("/practice/summary");
  }

  return (
    <div className="rounded-xl border bg-muted/30 px-4 py-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">
            练习会话 ·{" "}
            <span className="tabular-nums">
              {position} / {total}
            </span>
          </p>
          <div
            className="h-1.5 w-40 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={total}
            aria-valuenow={position}
            aria-label="会话进度"
          >
            <div
              className="h-full rounded-full bg-primary transition-[width]"
              style={{ width: `${Math.round((position / Math.max(total, 1)) * 100)}%` }}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" size="sm" onClick={() => endSession()}>
            <FlagIcon data-icon="inline-start" />
            结束会话
          </Button>
          <Button type="button" size="sm" onClick={goNext}>
            <SkipForwardIcon data-icon="inline-start" />
            {last ? "完成并查看小结" : "下一题"}
          </Button>
        </div>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        可先自己想，再展开参考作答；标已练/收藏会记入本机进度。
        {" · "}
        <Link href="/practice" className={cn(buttonVariants({ variant: "link", size: "sm" }), "h-auto px-0")}>
          会话设置
        </Link>
      </p>
    </div>
  );
}
