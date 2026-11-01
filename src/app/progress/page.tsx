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
          <p className="text-muted-foreground">已练和收藏只留在这台设备。</p>
        </header>
        <Suspense
          fallback={
            <div className="space-y-3 py-6" aria-busy="true">
              <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
              <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
            </div>
          }
        >
          <ProgressPanel />
        </Suspense>
      </div>
    </AppShell>
  );
}
