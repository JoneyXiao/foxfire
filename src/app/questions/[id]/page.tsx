import Link from "next/link";
import { notFound } from "next/navigation";
import { AnswerReveal } from "@/components/AnswerReveal";
import { InterviewQuotes } from "@/components/InterviewQuotes";
import { AppShell } from "@/components/AppShell";
import { PracticeActions } from "@/components/PracticeActions";
import { QuestionNavShortcuts } from "@/components/QuestionNavShortcuts";
import { SessionBar } from "@/components/SessionBar";
import { ProgressButtons } from "@/components/ProgressButtons";
import { Badge, badgeVariants } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  const showPrompt = question.prompt.trim() !== "" && question.prompt.trim() !== question.title.trim();

  return (
    <AppShell>
      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="面包屑">
          <Link href="/" className="hover:text-foreground hover:underline">
            题库
          </Link>
          <span aria-hidden="true">/</span>
          {category ? (
            <Link href={`/category/${category.id}`} className="hover:text-foreground hover:underline">
              {category.name}
            </Link>
          ) : null}
        </nav>

        <Card>
          <CardHeader className="space-y-3">
            <CardTitle className="text-pretty text-xl leading-snug sm:text-2xl">{question.title}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">{category?.name}</Badge>
              <Badge variant="outline">{difficultyLabel[question.difficulty]}</Badge>
              {question.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/search?tag=${encodeURIComponent(tag)}`}
                  className={badgeVariants({ variant: "outline" })}
                >
                  {tag}
                </Link>
              ))}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <SessionBar questionId={question.id} />
            {showPrompt ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{question.prompt}</p>
            ) : null}
            <ProgressButtons id={question.id} />
            <PracticeActions currentId={question.id} />
            <QuestionNavShortcuts prev={prev} next={next} />
          </CardContent>
        </Card>

        <InterviewQuotes quotes={question.interviewQuotes} />

        {/* Answer body is fetched on expand from /data/questions/<id>.json — not inlined into the client bundle. */}
        <AnswerReveal key={question.id} questionId={question.id} />

        <nav className="grid gap-3 sm:grid-cols-2" aria-label="相邻题目">
          {prev ? (
            <Link
              href={`/questions/${prev.id}`}
              className="rounded-xl border bg-card p-4 text-sm transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              <span className="text-muted-foreground">上一题 · k</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/questions/${next.id}`}
              className="rounded-xl border bg-card p-4 text-sm transition-colors hover:bg-muted/40 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none sm:text-right"
            >
              <span className="text-muted-foreground">下一题 · j</span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </AppShell>
  );
}
