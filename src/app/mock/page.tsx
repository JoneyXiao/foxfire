import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { MockSetup } from "@/components/MockSetup";

export const metadata = { title: "模拟面试" };

export default function MockPage() {
  return (
    <AppShell current="mock">
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Mock
          </p>
          <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">
            模拟面试
          </h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            15–30 分钟限时口述：抽题、计时、可选录音，再对照知识点与金句自检。
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
          <MockSetup />
        </Suspense>
      </div>
    </AppShell>
  );
}
