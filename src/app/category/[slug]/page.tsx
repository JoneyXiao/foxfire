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
      <div className="space-y-6">
        <nav className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground" aria-label="面包屑">
          <Link href="/" className="hover:text-foreground hover:underline">
            题库
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">{category.summary}</p>
        </header>
        <Suspense
          fallback={
            <div className="space-y-3 py-6" aria-busy="true">
              <div className="h-9 animate-pulse rounded-md bg-muted" />
            </div>
          }
        >
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
      </div>
    </AppShell>
  );
}
