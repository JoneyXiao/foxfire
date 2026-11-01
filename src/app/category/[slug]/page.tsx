import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { QuestionBrowser } from "@/components/QuestionBrowser";
import { categories, categoryById, isCategoryId } from "@/lib/categories";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((item) => ({ slug: item.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = categoryById(slug);
  return { title: category ? category.name : "分类" };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;

  if (!isCategoryId(slug)) {
    notFound();
  }

  const category = categoryById(slug);
  if (!category) {
    notFound();
  }

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
      <Suspense fallback={<div className="skel" aria-busy="true" />}>
        <QuestionBrowser
          basePath={`/category/${slug}`}
          lockedCategory={slug}
          showCategory={false}
          emptyTitle="这个分类下没有匹配"
          emptyBody="换难度，或清掉搜索词。"
          emptyHref={`/category/${slug}`}
          emptyAction="查看该分类全部"
        />
      </Suspense>
    </AppShell>
  );
}
