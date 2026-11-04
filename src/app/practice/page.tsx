import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { PracticeSetup } from "@/components/PracticeSetup";

export const metadata = { title: "练习会话" };

export default function PracticePage() {
  return (
    <AppShell current="practice">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">练习会话</h1>
          <p className="text-muted-foreground">
            选好分类、难度和题量，随机抽一串题连续练；结束后看完成率与收藏回顾。
          </p>
        </header>
        <Suspense
          fallback={
            <div className="space-y-3 py-6" aria-busy="true">
              <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </div>
          }
        >
          <PracticeSetup />
        </Suspense>
      </div>
    </AppShell>
  );
}
