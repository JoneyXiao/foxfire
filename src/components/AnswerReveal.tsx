"use client";

import { useEffect, useState } from "react";
import { BrainIcon, EyeIcon } from "lucide-react";
import { MarkdownBody } from "@/components/MarkdownBody";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { buttonVariants } from "@/components/ui/button";
import { PREFS_CHANGED_EVENT, patchPrefs, readPrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type AnswerRevealProps = {
  answer: string;
};

export function AnswerReveal({ answer }: AnswerRevealProps) {
  const [ready, setReady] = useState(false);
  const [thinkFirst, setThinkFirst] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function refresh() {
      setThinkFirst(readPrefs().thinkFirst);
      setReady(true);
    }
    refresh();
    window.addEventListener(PREFS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, refresh);
  }, []);

  // Reset gate when switching questions.
  useEffect(() => {
    setUnlocked(false);
    setOpen(false);
  }, [answer]);

  function toggleThinkFirst() {
    const next = !thinkFirst;
    patchPrefs({ thinkFirst: next });
    setThinkFirst(next);
    if (next) {
      setUnlocked(false);
      setOpen(false);
    }
  }

  function confirmThought() {
    setUnlocked(true);
    setOpen(true);
  }

  const gated = thinkFirst && !unlocked;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">
          {thinkFirst
            ? "已开启「先想再看」：展开前需确认自己想过一遍。"
            : "可开启「先想再看」，展开前先强制自测。"}
        </p>
        <Button
          type="button"
          size="sm"
          variant={thinkFirst ? "secondary" : "outline"}
          aria-pressed={thinkFirst}
          onClick={toggleThinkFirst}
          disabled={!ready}
        >
          <BrainIcon data-icon="inline-start" />
          先想再看
        </Button>
      </div>

      {gated ? (
        <div className="rounded-xl border bg-card px-4 py-5">
          <p className="font-medium">先想一想再看参考</p>
          <p className="mt-2 text-sm text-muted-foreground">
            用自己的话复述要点、边界条件与取舍。想清楚后再展开参考作答。
          </p>
          <div className="mt-4">
            <Button type="button" onClick={confirmThought}>
              <EyeIcon data-icon="inline-start" />
              我已想过，展开参考
            </Button>
          </div>
        </div>
      ) : (
        <Collapsible
          open={open}
          onOpenChange={setOpen}
          className="rounded-xl border bg-card"
        >
          <CollapsibleTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-auto w-full justify-start rounded-xl px-4 py-3 text-left font-medium",
            )}
          >
            {open ? "收起参考作答" : "展开参考作答"}
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t px-4 py-4">
            <MarkdownBody source={answer} />
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}
