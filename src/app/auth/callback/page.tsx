import { Suspense } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthCallback } from "@/components/AuthCallback";
import { LoginScreen } from "@/components/LoginScreen";

export const metadata = { title: "登录回调" };

export default function AuthCallbackPage() {
  return (
    <AppShell sidebar={false} flush>
      <LoginScreen>
        <div className="space-y-4 text-center">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">登录狐火</h1>
          <Suspense
            fallback={<p className="text-sm text-muted-foreground">正在完成登录…</p>}
          >
            <AuthCallback />
          </Suspense>
        </div>
      </LoginScreen>
    </AppShell>
  );
}
