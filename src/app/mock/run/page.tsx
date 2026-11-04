import { AppShell } from "@/components/AppShell";
import { MockRunner } from "@/components/MockRunner";

export const metadata = { title: "模拟进行中" };

export default function MockRunPage() {
  return (
    <AppShell current="mock">
      <div className="space-y-6">
        <header className="space-y-2">
          <h1 className="font-heading text-2xl font-medium tracking-tight">模拟进行中</h1>
          <p className="text-muted-foreground">先口述，再展开对照要点；计时到点后仍可收尾。</p>
        </header>
        <MockRunner />
      </div>
    </AppShell>
  );
}
