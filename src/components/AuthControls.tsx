"use client";

import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/AuthProvider";
import { cn } from "@/lib/utils";

function accountLabel(email: string | undefined): string {
  if (!email) return "已登录";
  const local = email.split("@")[0] ?? email;
  return local.length > 16 ? `${local.slice(0, 14)}…` : local;
}

type AuthControlsProps = {
  variant?: "compact" | "drawer";
  onNavigate?: () => void;
};

export function AuthControls({ variant = "compact", onNavigate }: AuthControlsProps) {
  const { ready, user, signOut } = useAuth();

  if (!ready) {
    return (
      <span
        className={cn(
          variant === "compact" && "inline-block size-11",
          variant === "drawer" && "min-h-11",
        )}
        aria-hidden="true"
      />
    );
  }

  if (variant === "drawer") {
    if (user) {
      return (
        <div className="flex flex-col gap-1">
          <p className="px-1 text-sm text-foreground" title={user.email ?? undefined}>
            {accountLabel(user.email)}
          </p>
          {user.email ? (
            <p className="px-1 text-xs text-muted-foreground break-all">{user.email}</p>
          ) : null}
          <button
            type="button"
            onClick={async () => {
              await signOut();
              onNavigate?.();
            }}
            className="flex min-h-11 items-center px-1 text-left text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
          >
            退出
          </button>
        </div>
      );
    }

    return (
      <Link
        href="/login/"
        onClick={onNavigate}
        className="flex min-h-11 items-center px-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
      >
        登录
      </Link>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-0.5">
        <span
          className="hidden max-w-[7.5rem] truncate px-1.5 text-sm text-muted-foreground sm:inline"
          title={user.email ?? "已登录"}
        >
          {accountLabel(user.email)}
        </span>
        <Button
          type="button"
          variant="ghost"
          className="h-11 px-2.5 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            void signOut();
          }}
        >
          退出
        </Button>
      </div>
    );
  }

  return (
    <Link
      href="/login/"
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "h-11 px-2.5 text-sm text-muted-foreground hover:text-foreground",
      )}
    >
      登录
    </Link>
  );
}
