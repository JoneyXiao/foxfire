"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { mapAuthError } from "@/lib/auth-errors";
import { getSupabaseBrowserClient, safeNextPath } from "@/lib/supabase-browser";

export function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        if (!cancelled) setError("登录尚未配置。");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const oauthError = params.get("error_description") || params.get("error");
      if (oauthError) {
        if (!cancelled) setError(mapAuthError(oauthError));
        return;
      }

      const code = params.get("code");
      if (code) {
        const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            if (!cancelled) setError(mapAuthError(exchangeError.message));
            return;
          }
        }
      } else {
        let { data } = await supabase.auth.getSession();
        if (!data.session) {
          await new Promise((resolve) => setTimeout(resolve, 400));
          ({ data } = await supabase.auth.getSession());
        }
        if (!data.session) {
          if (!cancelled) setError("登录未完成，请返回登录页重试。");
          return;
        }
      }

      if (cancelled) return;
      const next = safeNextPath(searchParams.get("next"));
      router.replace(next);
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
        <Link
          href="/login/"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          返回登录
        </Link>
      </div>
    );
  }

  return <p className="text-sm text-muted-foreground">正在完成登录…</p>;
}
