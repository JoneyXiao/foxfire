"use client";

import Link from "next/link";
import { QuestionTable } from "@/components/QuestionTable";
import { useProgressSets } from "@/components/ProgressButtons";
import { questions, totalQuestions } from "@/data/questions";

type ProgressPanelProps = {
  tab: "done" | "starred";
};

export function ProgressPanel({ tab }: ProgressPanelProps) {
  const { ready, done, starred } = useProgressSets();
  const doneItems = questions.filter((item) => done.has(item.id));
  const starredItems = questions.filter((item) => starred.has(item.id));

  if (!ready) {
    return (
      <div className="skel" aria-busy="true">
        <div className="skel-line skel-line--title" />
        <div className="skel-line" />
      </div>
    );
  }

  return (
    <>
      <div className="stats">
        <p>
          <b className="num">{done.size}</b>
          <span>已练 / {totalQuestions}</span>
        </p>
        <p>
          <b className="num">{starred.size}</b>
          <span>收藏</span>
        </p>
      </div>
      <div className="filters" role="tablist" aria-label="进度列表">
        <Link className="chip" href="/progress?tab=done" aria-current={tab === "done" ? "page" : undefined}>
          已练
        </Link>
        <Link
          className="chip"
          href="/progress?tab=starred"
          aria-current={tab === "starred" ? "page" : undefined}
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
    </>
  );
}
