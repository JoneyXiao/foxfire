import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { QuestionBrowser } from "@/components/QuestionBrowser";

export const metadata = { title: "搜索" };

export default function SearchPage() {
  return (
    <AppShell current="search">
      <header className="mast">
        <h1>搜索</h1>
        <p className="lead">按题干、标签或编号找题。</p>
      </header>
      <Suspense fallback={<div className="skel" aria-busy="true" />}>
        <QuestionBrowser
          basePath="/search"
          emptyTitle="没有找到这题"
          emptyBody="换一个更短的词，或清掉分类和难度。"
          emptyHref="/search"
          emptyAction="清掉筛选"
          autoFocus
        />
      </Suspense>
    </AppShell>
  );
}
