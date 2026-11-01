import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { FilterLinks } from "@/components/FilterLinks";
import { QuestionTable } from "@/components/QuestionTable";
import { SearchForm } from "@/components/SearchForm";
import { categories, categoryById, isCategoryId } from "@/lib/categories";
import { filterQuestions } from "@/data/questions";
import type { Difficulty } from "@/lib/types";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ difficulty?: string; mark?: string; q?: string }>;
};

export function generateStaticParams() {
  return categories.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryById(slug);
  return { title: category ? category.name : "分类" };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const query = await searchParams;

  if (!isCategoryId(slug)) {
    notFound();
  }

  const category = categoryById(slug);
  if (!category) {
    notFound();
  }

  const difficulty =
    query.difficulty === "foundation" || query.difficulty === "applied" || query.difficulty === "system"
      ? (query.difficulty as Difficulty)
      : "all";
  const mark = query.mark ?? "all";
  const items = filterQuestions({
    category: slug,
    difficulty,
    q: query.q,
  });

  return (
    <AppShell current="home">
      <nav className="crumbs" aria-label="面包屑">
        <Link href="/">题库</Link>
        <span className="crumb-sep" aria-hidden="true">
          /
        </span>
        <span>{category.name}</span>
      </nav>
      <header className="mast">
        <h1>{category.name}</h1>
        <p className="lead">{category.summary}</p>
      </header>
      <SearchForm action={`/category/${slug}`} query={query.q ?? ""} />
      <FilterLinks
        basePath={`/category/${slug}`}
        query={query.q}
        category={slug}
        difficulty={difficulty}
        mark={mark}
        showCategory={false}
      />
      <QuestionTable
        items={items}
        mark={mark}
        emptyTitle="这个分类下没有匹配"
        emptyBody="换难度，或清掉搜索词。"
        emptyHref={`/category/${slug}`}
        emptyAction="查看该分类全部"
      />
    </AppShell>
  );
}
