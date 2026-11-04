import { AppShell } from "@/components/AppShell";
import { PracticeSummary } from "@/components/PracticeSummary";

export const metadata = { title: "会话小结" };

export default function PracticeSummaryPage() {
  return (
    <AppShell current="practice">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">会话小结</h1>
          <p className="text-muted-foreground">本场完成率、访问进度，以及收藏题目回顾。</p>
        </header>
        <PracticeSummary />
      </div>
    </AppShell>
  );
}
