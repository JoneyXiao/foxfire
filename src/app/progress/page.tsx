import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";

export const metadata = { title: "进度" };

export default function ProgressPage() {
  return (
    <AppShell current="progress">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">进度</h1>
          <p className="text-muted-foreground">
            看分类/难度完成率与今日待复习；自评掌握度驱动间隔复习。进度只留在本机，可导出 JSON 备份。
          </p>
        </header>
        <Suspense
          fallback={
            <div className="space-y-3 py-6" aria-busy="true">
              <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
            </div>
          }
        >
          <ProgressPanel />
        </Suspense>
      </div>
    </AppShell>
  );
}
