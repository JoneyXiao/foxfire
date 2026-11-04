"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { DicesIcon, ListOrderedIcon, MicIcon, TimerIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { questions } from "@/data/questions";
import {
  listUnpracticed,
  pickNextUnpracticed,
  pickRandomQuestion,
} from "@/lib/practice";
import { PROGRESS_CHANGED_EVENT, readProgress } from "@/lib/progress";

type PracticeActionsProps = {
  /** When set, 「下一道未练」 starts after this question in bank order. */
  currentId?: string;
  className?: string;
};

export function PracticeActions({ currentId, className }: PracticeActionsProps) {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setDone(readProgress().done);
      setReady(true);
    }

    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
  }, []);

  const openCount = useMemo(
    () => (ready ? listUnpracticed(questions, done).length : 0),
    [ready, done],
  );
  const allDone = ready && openCount === 0 && questions.length > 0;

  function goNextUnpracticed() {
    setHint(null);
    const next = pickNextUnpracticed(questions, done, currentId);
    if (!next) {
      setHint("题库都练过了。可去进度页回顾，或点「随机一题」再刷一遍。");
      return;
    }
    router.push(`/questions/${next.id}`);
  }

  function goRandom() {
    setHint(null);
    const pick = pickRandomQuestion(questions, done);
    if (!pick) {
      setHint("题库为空，暂时无法抽题。");
      return;
    }
    if (pick.pool === "all") {
      setHint("未练题已清空，改为从全部题目中随机。");
    }
    router.push(`/questions/${pick.question.id}`);
  }

  if (!ready) {
    return (
      <div className={className}>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" disabled>
            读取进度
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="default"
          disabled={allDone}
          onClick={goNextUnpracticed}
        >
          <ListOrderedIcon data-icon="inline-start" />
          下一道未练
          {!allDone ? (
            <span className="ml-1 tabular-nums text-primary-foreground/80">
              · {openCount}
            </span>
          ) : null}
        </Button>
        <Button type="button" variant="outline" onClick={goRandom}>
          <DicesIcon data-icon="inline-start" />
          随机一题
        </Button>
        <Link
          href="/practice"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <TimerIcon data-icon="inline-start" />
          练习会话
        </Link>
        <Link
          href="/mock"
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <MicIcon data-icon="inline-start" />
          模拟面试
        </Link>
      </div>
      {allDone ? (
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          全部 {questions.length} 题都标过已练了。可去{" "}
          <Link href="/progress" className="underline-offset-2 hover:text-foreground hover:underline">
            进度页
          </Link>{" "}
          回顾，或点「随机一题」再刷。
        </p>
      ) : null}
      {hint ? (
        <p className="mt-2 text-sm text-muted-foreground" role="status">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
