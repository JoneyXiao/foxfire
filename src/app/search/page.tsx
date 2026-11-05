import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { QuestionBrowser } from "@/components/QuestionBrowser";

export const metadata = { title: "搜索" };

export default function SearchPage() {
  return (
    <AppShell current="search">
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Search
          </p>
          <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
            搜索
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            按题干、标签或编号找题；可勾选同时搜参考作答关键词，并按未练优先或难度排序。
          </p>
        </header>
        <Suspense
          fallback={
            <div className="space-y-3 py-6" aria-busy="true">
              <div className="h-9 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded-md bg-muted" />
            </div>
          }
        >
          <QuestionBrowser
            basePath="/search"
            emptyTitle="没有找到这题"
            emptyBody="换一个更短的词，或清掉分类和难度；需要的话再勾选「同时搜参考作答」。"
            emptyHref="/search"
            emptyAction="清掉筛选"
            autoFocus
          />
        </Suspense>
      </div>
    </AppShell>
  );
}
