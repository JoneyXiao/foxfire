import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswerReveal } from "@/components/AnswerReveal";
import { InterviewQuotes } from "@/components/InterviewQuotes";
import { AppShell } from "@/components/AppShell";
import { PracticeActions } from "@/components/PracticeActions";
import { QuestionNavShortcuts } from "@/components/QuestionNavShortcuts";
import { QuestionThumbBar } from "@/components/QuestionThumbBar";
import { SessionBar } from "@/components/SessionBar";
import { categoryById, difficultyLabel } from "@/lib/categories";
import { adjacentQuestions } from "@/data/questions";
import { getQuestion, listQuestionIds } from "@/data/questions-full";

type QuestionPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return listQuestionIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: QuestionPageProps) {
  const { id } = await params;
  const question = getQuestion(id);
  return { title: question ? question.title : "题目" };
}

export default async function QuestionPage({ params }: QuestionPageProps) {
  const { id } = await params;
  const question = getQuestion(id);
  if (!question) {
    notFound();
  }

  const category = categoryById(question.category);
  const { prev, next } = adjacentQuestions(question.id);
  const showPrompt =
    question.prompt.trim() !== "" && question.prompt.trim() !== question.title.trim();

  return (
    <AppShell clearThumbBar>
      <div className="space-y-8">
        <nav
          className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem] tracking-tight text-muted-foreground"
          aria-label="面包屑"
        >
          <Link href="/" className="hover:text-foreground hover:underline">
            题库
          </Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <Link
              href={`/category/${category.id}`}
              className="hover:text-foreground hover:underline"
            >
              {category.name}
            </Link>
          ) : null}
          <span aria-hidden="true">/</span>
          <span className="tabular-nums">{question.id}</span>
        </nav>

        <header className="space-y-4">
          <h1 className="font-heading text-pretty text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            {question.title}
          </h1>
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {category ? <span>{category.name}</span> : null}
            <span aria-hidden="true" className="text-border">
              ·
            </span>
            <span>{difficultyLabel[question.difficulty]}</span>
            {question.tags.length > 0 ? (
              <>
                <span aria-hidden="true" className="text-border">
                  ·
                </span>
                <span className="flex flex-wrap gap-x-2 gap-y-1">
                  {question.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/search?tag=${encodeURIComponent(tag)}`}
                      className="underline-offset-2 hover:text-foreground hover:underline"
                    >
                      {tag}
                    </Link>
                  ))}
                </span>
              </>
            ) : null}
          </p>
          <SessionBar questionId={question.id} />
          {showPrompt ? (
            <p className="max-w-3xl whitespace-pre-wrap text-base leading-relaxed text-foreground/90">
              {question.prompt}
            </p>
          ) : null}
        </header>

        {/* Desktop meta actions sit in flow; mobile uses sticky thumb bar. */}
        <div className="hidden space-y-3 sm:block">
          <QuestionThumbBar questionId={question.id} prev={prev} next={next} />
          <PracticeActions currentId={question.id} nextVariant="outline" />
          <QuestionNavShortcuts prev={prev} next={next} />
        </div>

        <div className="sm:hidden">
          <PracticeActions currentId={question.id} nextVariant="outline" className="opacity-90" />
          <QuestionNavShortcuts prev={prev} next={next} />
        </div>

        <InterviewQuotes quotes={question.interviewQuotes} />

        {/* Answer body is fetched on expand from /data/questions/<id>.json — not inlined into the client bundle. */}
        <AnswerReveal key={question.id} questionId={question.id} />

        <nav className="border-t border-border/80" aria-label="相邻题目">
          <ul>
            {prev ? (
              <li className="border-b border-border/80">
                <Link
                  href={`/questions/${prev.id}`}
                  className="group flex min-h-11 items-center gap-3 py-3 outline-none transition-colors hover:bg-muted/30 focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  <span className="w-10 shrink-0 font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                    prev
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{prev.title}</span>
                </Link>
              </li>
            ) : null}
            {next ? (
              <li className="border-b border-border/80 last:border-b-0">
                <Link
                  href={`/questions/${next.id}`}
                  className="group flex min-h-11 items-center gap-3 py-3 outline-none transition-colors hover:bg-muted/30 focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
                >
                  <span className="w-10 shrink-0 font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                    next
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-medium">{next.title}</span>
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>

      <div className="sm:hidden">
        <QuestionThumbBar questionId={question.id} prev={prev} next={next} />
      </div>
    </AppShell>
  );
}
