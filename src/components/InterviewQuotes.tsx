type InterviewQuotesProps = {
  quotes: readonly string[];
};

/** Speakable interview lines derived from the source answer body — doc section, not a floating card. */
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
        <span className="text-xs text-muted-foreground">可复述 · 来自本题知识点</span>
      </div>
      <ol className="list-decimal space-y-2.5 pl-5 text-sm leading-relaxed">
        {quotes.map((quote) => (
          <li key={quote}>{quote}</li>
        ))}
      </ol>
    </section>
  );
}
