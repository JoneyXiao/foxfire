"use client";

import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type InterviewQuotesProps = {
  quotes: readonly string[];
};

function QuoteCard({ quote, index }: { quote: string; index: number }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(quote);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Clipboard may be blocked; leave UI quiet — user can still select text.
      setCopied(false);
    }
  }

  return (
    <li className="border-b border-border/80 last:border-b-0">
      <div className="flex items-start gap-3 py-3">
        <span className="mt-0.5 w-8 shrink-0 font-mono text-[0.7rem] tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
        <blockquote className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
          {quote}
        </blockquote>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 shrink-0 px-2"
          onClick={() => void copy()}
          aria-label={copied ? "已复制" : "复制金句"}
        >
          {copied ? (
            <CheckIcon className="size-3.5" aria-hidden="true" />
          ) : (
            <CopyIcon className="size-3.5" aria-hidden="true" />
          )}
          <span className={cn("ml-1 hidden sm:inline", copied && "text-foreground")}>
            {copied ? "已复制" : "复制"}
          </span>
        </Button>
      </div>
    </li>
  );
}

/** Speakable interview lines — copyable cards in a doc section, not a floating card. */
export function InterviewQuotes({ quotes }: InterviewQuotesProps) {
  if (!quotes.length) return null;
  return (
    <section className="space-y-3 border-t border-border/80 pt-6" aria-labelledby="interview-quotes-heading">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2
          id="interview-quotes-heading"
          className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
        >
          面试金句
        </h2>
        <span className="text-xs text-muted-foreground">可复述 · 点复制带走</span>
      </div>
      <ol className="list-none">
        {quotes.map((quote, index) => (
          <QuoteCard key={quote} quote={quote} index={index} />
        ))}
      </ol>
    </section>
  );
}
