"use client";

import { useEffect, useState } from "react";
import { CheckIcon, StarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  emptyProgress,
  PROGRESS_CHANGED_EVENT,
  readProgress,
  toggleId,
  writeProgress,
} from "@/lib/progress";

type ProgressButtonsProps = {
  id: string;
};

export function ProgressButtons({ id }: ProgressButtonsProps) {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [starred, setStarred] = useState(false);

  useEffect(() => {
    function refresh() {
      const progress = readProgress();
      setDone(progress.done.includes(id));
      setStarred(progress.starred.includes(id));
      setReady(true);
    }

    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
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
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" disabled>
          读取进度
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        type="button"
        variant={done ? "default" : "outline"}
        aria-pressed={done}
        onClick={() => update("done")}
      >
        <CheckIcon data-icon="inline-start" />
        {done ? "取消已练" : "标为已练"}
      </Button>
      <Button
        type="button"
        variant={starred ? "secondary" : "outline"}
        aria-pressed={starred}
        onClick={() => update("starred")}
      >
        <StarIcon data-icon="inline-start" className={starred ? "fill-current" : undefined} />
        {starred ? "取消收藏" : "收藏"}
      </Button>
    </div>
  );
}

export function useProgressSets() {
  const [ready, setReady] = useState(false);
  const [progress, setProgress] = useState(emptyProgress);

  useEffect(() => {
    function refresh() {
      setProgress(readProgress());
      setReady(true);
    }

    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
  }, []);

  return { ready, done: new Set(progress.done), starred: new Set(progress.starred) };
}
