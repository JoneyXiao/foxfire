import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { ProgressPanel } from "@/components/ProgressPanel";

export const metadata = { title: "进度" };

export default function ProgressPage() {
  return (
    <AppShell current="progress">
      <header className="mast">
        <h1>进度</h1>
        <p className="lead">已练和收藏只留在这台设备。</p>
      </header>
      <Suspense fallback={<div className="skel" aria-busy="true" />}>
        <ProgressPanel />
      </Suspense>
    </AppShell>
  );
}
