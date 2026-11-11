import { AppShell } from "@/components/AppShell";
import { LoginForm } from "@/components/LoginForm";

export const metadata = { title: "登录" };

export default function LoginPage() {
  return (
    <AppShell>
      <div className="space-y-8">
        <header className="space-y-2">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Account
          </p>
          <h1 className="font-heading text-2xl font-medium tracking-tight sm:text-3xl">登录</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            登录是可选的。不登录也可以刷题、跑模拟和复习导图。进度仍只保存在本机浏览器，退出不会清除。
          </p>
        </header>
        <LoginForm />
      </div>
    </AppShell>
  );
}
