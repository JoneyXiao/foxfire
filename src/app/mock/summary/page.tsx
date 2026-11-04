import { AppShell } from "@/components/AppShell";
import { MockSummary } from "@/components/MockSummary";

export const metadata = { title: "模拟小结" };

export default function MockSummaryPage() {
  return (
    <AppShell current="mock">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">模拟小结</h1>
          <p className="text-muted-foreground">本场用时、覆盖题号，以及要点勾选概况。</p>
        </header>
        <MockSummary />
      </div>
    </AppShell>
  );
}
