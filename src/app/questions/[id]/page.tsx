import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MarkdownBody } from "@/components/MarkdownBody";
import { ProgressButtons } from "@/components/ProgressButtons";
import { categoryById, difficultyLabel } from "@/lib/categories";
import { adjacentQuestions, getQuestion, questions } from "@/data/questions";

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
      <nav className="crumbs" aria-label="面包屑">
        <Link href="/">题库</Link>
        <span className="crumb-sep" aria-hidden="true">
          /
        </span>
        {category ? <Link href={`/category/${category.id}`}>{category.name}</Link> : null}
      </nav>
      <article>
        <h1 className="stem-title">{question.title}</h1>
        <div className="meta">
          <span>{category?.name}</span>
          <span>{difficultyLabel[question.difficulty]}</span>
          <span className="tags">
            {question.tags.map((tag) => (
              <span className="tag" key={tag}>
                {tag}
              </span>
            ))}
          </span>
        </div>
        <MarkdownBody source={question.prompt} />
        <ProgressButtons id={question.id} />
        <details className="answer">
          <summary>展开参考作答</summary>
          <div className="answer__body">
            <MarkdownBody source={question.answer} />
          </div>
        </details>
      </article>
      <nav className="pager" aria-label="相邻题目">
        {prev ? <Link href={`/questions/${prev.id}`}>{prev.title}</Link> : <span />}
        {next ? <Link href={`/questions/${next.id}`}>{next.title}</Link> : <span />}
      </nav>
    </AppShell>
  );
}
