"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Neighbor = {
  id: string;
  title: string;
} | null | undefined;

type QuestionNavShortcutsProps = {
  prev?: Neighbor;
  next?: Neighbor;
};

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  if (target.isContentEditable) {
    return true;
  }
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

export function QuestionNavShortcuts({ prev, next }: QuestionNavShortcutsProps) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      if (isTypingTarget(event.target)) {
        return;
      }

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (key === "j" || key === "ArrowRight") {
        if (!next) {
          return;
        }
        event.preventDefault();
        router.push(`/questions/${next.id}`);
        return;
      }
      if (key === "k" || key === "ArrowLeft") {
        if (!prev) {
          return;
        }
        event.preventDefault();
        router.push(`/questions/${prev.id}`);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [prev, next, router]);

  return (
    <p className="text-xs text-muted-foreground" aria-live="polite">
      快捷键：
      <kbd className="mx-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
        j
      </kbd>
      /
      <kbd className="mx-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
        →
      </kbd>
      下一题，
      <kbd className="mx-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
        k
      </kbd>
      /
      <kbd className="mx-0.5 rounded border bg-muted px-1.5 py-0.5 font-mono text-[0.7rem]">
        ←
      </kbd>
      上一题
      {!prev && !next ? "（当前无相邻题）" : null}
      {prev && !next ? "（已是最后一题）" : null}
      {!prev && next ? "（已是第一题）" : null}
    </p>
  );
}
