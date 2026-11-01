import { AppShell } from "@/components/AppShell";
import { FilterLinks } from "@/components/FilterLinks";
import { QuestionTable } from "@/components/QuestionTable";
import { SearchForm } from "@/components/SearchForm";
import { isCategoryId } from "@/lib/categories";
import { filterQuestions } from "@/data/questions";
import type { Difficulty } from "@/lib/types";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
    difficulty?: string;
    mark?: string;
  }>;
};

export const metadata = { title: "搜索" };

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = await searchParams;
  const category = query.category && isCategoryId(query.category) ? query.category : "all";
  const difficulty =
    query.difficulty === "foundation" || query.difficulty === "applied" || query.difficulty === "system"
      ? (query.difficulty as Difficulty)
      : "all";
  const mark = query.mark ?? "all";
  const q = query.q ?? "";
  const items = filterQuestions({ q, category, difficulty });

  return (
    <AppShell current="search">
      <header className="mast">
        <h1>搜索</h1>
        <p className="lead">按题干、标签或编号找题。</p>
      </header>
      <SearchForm query={q} autoFocus />
      <FilterLinks basePath="/search" query={q} category={category} difficulty={difficulty} mark={mark} />
      <QuestionTable
        items={items}
        mark={mark}
        emptyTitle="没有找到这题"
        emptyBody="换一个更短的词，或清掉分类和难度。"
        emptyHref="/search"
        emptyAction="清掉筛选"
      />
    </AppShell>
  );
}
