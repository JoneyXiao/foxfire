"use client";

import Link from "next/link";
import { useProgressSets } from "@/components/ProgressButtons";
import { categoryById, difficultyLabel } from "@/lib/categories";
import type { Question } from "@/lib/types";

type QuestionTableProps = {
  items: Question[];
  mark?: string;
  emptyTitle: string;
  emptyBody: string;
  emptyHref?: string;
  emptyAction?: string;
};

export function QuestionTable({
  items,
  mark = "all",
  emptyTitle,
  emptyBody,
  emptyHref = "/",
  emptyAction = "回到题库",
}: QuestionTableProps) {
  const { ready, done, starred } = useProgressSets();

  if (!ready) {
    return (
      <div className="skel" aria-busy="true" aria-live="polite">
        <div className="skel-line skel-line--title" />
        <div className="skel-line" />
        <div className="skel-line skel-line--short" />
      </div>
    );
  }

  const visible = items.filter((item) => {
    if (mark === "done") {
      return done.has(item.id);
    }
    if (mark === "open") {
      return !done.has(item.id);
    }
    if (mark === "starred") {
      return starred.has(item.id);
    }
    return true;
  });

  if (visible.length === 0) {
    return (
      <div className="empty">
        <h2>{emptyTitle}</h2>
        <p>{emptyBody}</p>
        <p>
          <Link className="btn" href={emptyHref}>
            {emptyAction}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <table className="ledger">
      <thead>
        <tr>
          <th scope="col">题目</th>
          <th scope="col">分类</th>
          <th scope="col">难度</th>
        </tr>
      </thead>
      <tbody>
        {visible.map((item) => {
          const category = categoryById(item.category);
          return (
            <tr key={item.id}>
              <td>
                <Link className="row-link" href={`/questions/${item.id}`}>
                  {item.title}
                </Link>
                <div className="muted">
                  {done.has(item.id) ? "已练" : "未练"}
                  {starred.has(item.id) ? " 收藏" : ""}
                </div>
              </td>
              <td>{category?.name}</td>
              <td className="muted">{difficultyLabel[item.difficulty]}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
