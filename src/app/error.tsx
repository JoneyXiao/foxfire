"use client";

import { AppShell } from "@/components/AppShell";
import { Button } from "@/components/ui/button";

export default function ErrorView({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-3 rounded-xl border bg-card px-6 py-10 text-center">
        <h2 className="font-heading text-base font-medium">这一页没有打开</h2>
        <p className="text-sm text-muted-foreground">刷新一次。若仍在，回到题库另选一题。</p>
        <Button type="button" onClick={reset}>
          重试
        </Button>
      </div>
    </AppShell>
  );
}
