"use client";

import { AppShell } from "@/components/AppShell";

export default function ErrorView({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <AppShell>
      <div className="fail">
        <h2>这一页没有打开</h2>
        <p>刷新一次。若仍在，回到题库另选一题。</p>
        <p>
          <button className="btn" type="button" onClick={reset}>
            重试
          </button>
        </p>
      </div>
    </AppShell>
  );
}
