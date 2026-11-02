import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ProgressButtons } from "@/components/ProgressButtons";
import { Badge, badgeVariants } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { categoryById, difficultyLabel } from "@/lib/categories";
import { adjacentQuestions, getQuestion, questions } from "@/data/questions";
import { cn } from "@/lib/utils";

type QuestionPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return questions.map((item) => ({ id: item.id }));
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
            <CardTitle className="text-xl leading-snug sm:text-2xl">{question.title}</CardTitle>
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
            <MarkdownBody source={question.prompt} />
            <ProgressButtons id={question.id} />
          </CardContent>
        </Card>

        <Collapsible className="rounded-xl border bg-card">
          <CollapsibleTrigger
            className={cn(
              buttonVariants({ variant: "ghost" }),
              "h-auto w-full justify-start rounded-xl px-4 py-3 text-left font-medium",
            )}
          >
            展开参考作答
          </CollapsibleTrigger>
          <CollapsibleContent className="border-t px-4 py-4">
            <MarkdownBody source={question.answer} />
          </CollapsibleContent>
        </Collapsible>

        <nav className="grid gap-3 sm:grid-cols-2" aria-label="相邻题目">
          {prev ? (
            <Link
              href={`/questions/${prev.id}`}
              className="rounded-xl border bg-card p-4 text-sm hover:bg-muted/40"
            >
              <span className="text-muted-foreground">上一题</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/questions/${next.id}`}
              className="rounded-xl border bg-card p-4 text-sm hover:bg-muted/40 sm:text-right"
            >
              <span className="text-muted-foreground">下一题</span>
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
