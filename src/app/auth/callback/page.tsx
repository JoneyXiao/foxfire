import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthCallback } from "@/components/AuthCallback";

export const metadata = { title: "登录回调" };

export default function AuthCallbackPage() {
  return (
    <AppShell>
      <div className="space-y-4">
        <h1 className="font-heading text-2xl font-medium tracking-tight">登录</h1>
        <Suspense
          fallback={<p className="text-sm text-muted-foreground">正在完成登录…</p>}
        >
          <AuthCallback />
        </Suspense>
      </div>
    </AppShell>
  );
}
