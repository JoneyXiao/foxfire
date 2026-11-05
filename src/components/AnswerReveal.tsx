"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { BrainIcon, ChevronDownIcon, EyeIcon } from "lucide-react";
import { MasteryRating } from "@/components/MasteryRating";
import { QuietNotice } from "@/components/QuietEmpty";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { splitAnswerSections } from "@/lib/answer-sections";
import { PREFS_CHANGED_EVENT, patchPrefs, readPrefs } from "@/lib/prefs";
import { cn } from "@/lib/utils";

type AnswerRevealProps = {
  questionId: string;
};

type MarkdownBodyComponent = ComponentType<{ source: string }>;

function answersUrl(questionId: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  return `${base}/data/questions/${encodeURIComponent(questionId)}.json`;
}

export function AnswerReveal({ questionId }: AnswerRevealProps) {
  const [ready, setReady] = useState(false);
  const [thinkFirst, setThinkFirst] = useState(false);
  const [unlocked, setUnlocked] = useState(false);
  const [open, setOpen] = useState(false);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loadState, setLoadState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [MarkdownBody, setMarkdownBody] = useState<MarkdownBodyComponent | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const loadedRef = useRef(false);

  useEffect(() => {
    function refresh() {
      setThinkFirst(readPrefs().thinkFirst);
      setReady(true);
    }
    refresh();
    window.addEventListener(PREFS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, refresh);
  }, []);

  const needsContent = open || (thinkFirst && unlocked);

  useEffect(() => {
    if (!needsContent) return;
    if (loadedRef.current) return;

    let cancelled = false;
    setLoadState("loading");

    void (async () => {
      try {
        const [json, mdMod] = await Promise.all([
          fetch(answersUrl(questionId)).then(async (res) => {
            if (!res.ok) throw new Error(`answer ${res.status}`);
            return res.json() as Promise<{ answer: string }>;
          }),
          import("@/components/MarkdownBody"),
        ]);
        if (cancelled) return;
        setAnswer(json.answer);
        setMarkdownBody(() => mdMod.MarkdownBody);
        loadedRef.current = true;
        setLoadState("ready");
      } catch {
        if (cancelled) return;
        setLoadState("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [needsContent, questionId, reloadKey]);

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

  function retryLoad() {
    loadedRef.current = false;
    setAnswer(null);
    setMarkdownBody(null);
    setLoadState("idle");
    setOpen(true);
    setReloadKey((key) => key + 1);
  }

  const gated = thinkFirst && !unlocked;
  const sections = answer ? splitAnswerSections(answer) : [];

  return (
    <section className="space-y-3 border-t border-border/80 pt-6" aria-labelledby="answer-section-label">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2
          id="answer-section-label"
          className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
        >
          参考作答
        </h2>
        <Button
          type="button"
          size="sm"
          variant={thinkFirst ? "secondary" : "ghost"}
          aria-pressed={thinkFirst}
          onClick={toggleThinkFirst}
          disabled={!ready}
          className="h-8"
        >
          <BrainIcon data-icon="inline-start" />
          先想再看
        </Button>
      </div>

      <p className="text-sm text-muted-foreground">
        {thinkFirst
          ? "已开启「先想再看」：展开前需确认自己想过一遍。"
          : "可开启「先想再看」，展开前先强制自测。"}
      </p>

      {gated ? (
        <div className="space-y-3 border-y border-border/80 py-5">
          <p className="font-medium">先想一想再看参考</p>
          <p className="text-sm text-muted-foreground">
            用自己的话复述要点、边界条件与取舍。想清楚后再展开参考作答。
          </p>
          <Button type="button" onClick={confirmThought}>
            <EyeIcon data-icon="inline-start" />
            我已想过，展开参考
          </Button>
        </div>
      ) : (
        <Collapsible open={open} onOpenChange={setOpen} className="border-y border-border/80">
          <CollapsibleTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-auto w-full justify-between rounded-none px-0 py-3 text-left font-medium hover:bg-transparent",
            )}
          >
            <span>{open ? "收起参考作答" : "展开参考作答"}</span>
            <ChevronDownIcon
              aria-hidden="true"
              className={cn(
                "size-4 shrink-0 text-muted-foreground transition-transform",
                open && "rotate-180",
              )}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-6 pb-5">
            {loadState === "loading" || (open && loadState === "idle") ? (
              <p className="text-sm text-muted-foreground" aria-busy="true">
                正在加载参考作答…
              </p>
            ) : null}
            {loadState === "error" ? (
              <div className="space-y-3">
                <QuietNotice tone="danger" role="alert">
                  参考作答加载失败。
                </QuietNotice>
                <QuietNotice>
                  下一步：检查网络后点重试；仍失败可刷新本页或换一题。
                </QuietNotice>
                <Button type="button" variant="outline" size="sm" onClick={retryLoad}>
                  重试加载
                </Button>
              </div>
            ) : null}
            {loadState === "ready" && answer && MarkdownBody ? (
              <>
                {sections.map((section) => (
                  <article
                    key={`${section.kind}-${section.label}`}
                    className="space-y-3 border-t border-border/60 pt-5 first:border-t-0 first:pt-0"
                    aria-label={section.label}
                  >
                    <h3 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                      {section.label}
                    </h3>
                    <MarkdownBody source={section.body} />
                  </article>
                ))}
                <MasteryRating id={questionId} variant="inline" />
              </>
            ) : null}
          </CollapsibleContent>
        </Collapsible>
      )}
    </section>
  );
}
