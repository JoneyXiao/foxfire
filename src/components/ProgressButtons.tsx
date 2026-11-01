"use client";

import { useEffect, useState } from "react";
import { IconMark, IconStar } from "@/components/Icons";
import { emptyProgress, readProgress, toggleId, writeProgress } from "@/lib/progress";

type ProgressButtonsProps = {
  id: string;
};

export function ProgressButtons({ id }: ProgressButtonsProps) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    const progress = readProgress();
    setDone(progress.done.includes(id));
    setStarred(progress.starred.includes(id));
    setReady(true);
  }, [id]);

  function update(kind: "done" | "starred") {
    const current = readProgress();
    const next = {
      done: kind === "done" ? toggleId(current.done, id) : current.done,
      starred: kind === "starred" ? toggleId(current.starred, id) : current.starred,
    };
    writeProgress(next);
    setDone(next.done.includes(id));
    setStarred(next.starred.includes(id));
  }

  if (!ready) {
    return (
      <div className="actions">
        <button className="btn btn--quiet" type="button" disabled>
          读取进度
        </button>
      </div>
    );
  }

  return (
    <div className="actions">
      <button
        className="btn btn--quiet"
        type="button"
        aria-pressed={done}
        onClick={() => update("done")}
      >
        <IconMark pressed={done} />
        {done ? "取消已练" : "标为已练"}
      </button>
      <button
        className="btn btn--quiet"
        type="button"
        aria-pressed={starred}
        onClick={() => update("starred")}
      >
        <IconStar pressed={starred} />
        {starred ? "取消收藏" : "收藏"}
      </button>
    </div>
  );
}

export function useProgressSets() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(emptyProgress);

  useEffect(() => {
    setProgress(readProgress());
    setReady(true);
  }, []);

  return { ready, done: new Set(progress.done), starred: new Set(progress.starred) };
}
