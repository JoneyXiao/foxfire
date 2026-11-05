"use client";

import { AppShell } from "@/components/AppShell";
import { QuietEmpty } from "@/components/QuietEmpty";
import { Button } from "@/components/ui/button";

export default function ErrorView({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <QuietEmpty
        label="error"
        title="这一页没有打开"
        body="渲染时出错了。"
        nextStep="点重试；仍失败就回到题库另选一题。"
      >
        <Button type="button" onClick={reset}>
          重试
        </Button>
      </QuietEmpty>
    </AppShell>
  );
}
