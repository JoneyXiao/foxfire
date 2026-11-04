import { MessageSquareQuoteIcon } from "lucide-react";

type InterviewQuotesProps = {
  quotes: readonly string[];
};

/** Speakable interview lines derived from the source answer body. */
export function InterviewQuotes({ quotes }: InterviewQuotesProps) {
  if (!quotes.length) return null;
  return (
    <section
      className="rounded-xl border bg-card px-4 py-4"
      aria-labelledby="interview-quotes-heading"
    >
      <div className="flex items-center gap-2">
        <MessageSquareQuoteIcon className="size-4 text-muted-foreground" aria-hidden="true" />
        <h2 id="interview-quotes-heading" className="text-sm font-medium">
          面试金句
        </h2>
        <span className="text-xs text-muted-foreground">可复述 · 来自本题知识点</span>
      </div>
      <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed">
        {quotes.map((quote) => (
          <li key={quote}>{quote}</li>
        ))}
      </ol>
    </section>
  );
}
