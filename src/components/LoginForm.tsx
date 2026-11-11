"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/components/AuthProvider";
import { mapAuthError } from "@/lib/auth-errors";
import {
  getAuthCallbackUrl,
  getSupabaseBrowserClient,
  isSupabaseConfigured,
} from "@/lib/supabase-browser";

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function LoginForm() {
  const { user, ready, signOut } = useAuth();
  const configured = isSupabaseConfigured();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState<"email" | "otp" | "github" | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function sendLink(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    const trimmed = email.trim();
    if (!trimmed) {
      setError("请输入邮箱地址。");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("登录尚未配置。");
      return;
    }
    setPending("email");
    const { error: sendError } = await supabase.auth.signInWithOtp({
      email: trimmed,
      options: {
        emailRedirectTo: getAuthCallbackUrl(),
        shouldCreateUser: true,
      },
    });
    setPending(null);
    if (sendError) {
      console.error("signInWithOtp failed");
      setError(mapAuthError(sendError.message));
      return;
    }
    setSent(true);
    setMessage("登录邮件已发送。请点击邮件中的链接，或在下方输入 6 位验证码。");
  }

  async function verifyCode(event: FormEvent) {
    event.preventDefault();
    setError(null);
    const trimmedEmail = email.trim();
    const token = otp.trim();
    if (!trimmedEmail || !token) {
      setError("请输入邮箱和 6 位验证码。");
      return;
    }
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("登录尚未配置。");
      return;
    }
    setPending("otp");
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: trimmedEmail,
      token,
      type: "email",
    });
    setPending(null);
    if (verifyError) {
      console.error("verifyOtp failed");
      setError(mapAuthError(verifyError.message));
    }
  }

  async function signInGitHub() {
    setError(null);
    setMessage(null);
    const supabase = getSupabaseBrowserClient();
    if (!supabase) {
      setError("登录尚未配置。");
      return;
    }
    setPending("github");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: getAuthCallbackUrl(),
      },
    });
    if (oauthError) {
      console.error("signInWithOAuth failed");
      setPending(null);
      setError(mapAuthError(oauthError.message));
    }
    // On success the browser is redirected; leave pending if that happens.
  }

  if (!ready) {
    return (
      <div className="space-y-3 py-6" aria-busy="true">
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
        <div className="h-10 w-full animate-pulse rounded-md bg-muted motion-reduce:animate-none" />
      </div>
    );
  }

  if (!configured) {
    return (
      <p className="text-sm text-muted-foreground">
        登录尚未配置。本地请复制 <code className="font-mono text-xs">.env.example</code> 为{" "}
        <code className="font-mono text-xs">.env.local</code> 并填写公开环境变量；未登录也可继续刷题和复习导图。
      </p>
    );
  }

  if (user) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          已登录{user.email ? `为 ${user.email}` : ""}。刷题进度仍只保存在本机，退出不会清除进度。
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="outline" className="h-11 px-3" onClick={() => void signOut()}>
            退出
          </Button>
          <Link href="/" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            回到首页
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-8">
      <form onSubmit={sendLink} className="space-y-3">
        <div className="space-y-1.5">
          <label htmlFor="login-email" className="text-sm font-medium">
            邮箱
          </label>
          <Input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            className="h-11 text-sm"
          />
        </div>
        <Button type="submit" className="h-11 w-full sm:w-auto px-4" disabled={pending !== null}>
          {pending === "email" ? "发送中…" : "发送登录链接"}
        </Button>
      </form>

      {sent ? (
        <form onSubmit={verifyCode} className="space-y-3">
          <div className="space-y-1.5">
            <label htmlFor="login-otp" className="text-sm font-medium">
              6 位验证码
            </label>
            <Input
              id="login-otp"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]*"
              maxLength={8}
              value={otp}
              onChange={(event) => setOtp(event.target.value)}
              placeholder="123456"
              className="h-11 text-sm tracking-[0.2em]"
            />
          </div>
          <Button
            type="submit"
            variant="outline"
            className="h-11 w-full sm:w-auto px-4"
            disabled={pending !== null}
          >
            {pending === "otp" ? "验证中…" : "用验证码登录"}
          </Button>
        </form>
      ) : null}

      <div className="space-y-3">
        <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
          或
        </p>
        <Button
          type="button"
          variant="outline"
          className="h-11 w-full sm:w-auto gap-2 px-4"
          onClick={() => void signInGitHub()}
          disabled={pending !== null}
        >
          <GitHubMark className="size-4" />
          {pending === "github" ? "跳转中…" : "用 GitHub 登录"}
        </Button>
      </div>

      {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
