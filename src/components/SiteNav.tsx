"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Drawer } from "@base-ui/react/drawer";
import { MenuIcon, XIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export type NavId = "home" | "search" | "progress" | "practice" | "mock";

export const NAV_ITEMS: { href: string; id: NavId; label: string }[] = [
  { href: "/", id: "home", label: "题库" },
  { href: "/practice", id: "practice", label: "会话" },
  { href: "/mock", id: "mock", label: "模拟" },
  { href: "/search", id: "search", label: "搜索" },
  { href: "/progress", id: "progress", label: "进度" },
];

const GITHUB_HREF = "https://github.com/JoneyXiao/foxfire";

type SiteNavProps = {
  current?: NavId;
};

function NavLink({
  href,
  label,
  active,
  className,
  onNavigate,
}: {
  href: string;
  label: string;
  active?: boolean;
  className?: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      onClick={onNavigate}
      className={cn(
        buttonVariants({
          variant: active ? "secondary" : "ghost",
          size: "sm",
        }),
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function SiteNav({ current }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descId = useId();

  return (
    <>
      <nav className="hidden items-center gap-1 md:flex" aria-label="主要">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            href={item.href}
            label={item.label}
            active={current === item.id}
          />
        ))}
        <a
          href={GITHUB_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
        >
          GitHub
        </a>
        <ThemeToggle />
      </nav>

      <div className="flex items-center gap-1 md:hidden">
        <ThemeToggle />
        <Drawer.Root
          open={open}
          onOpenChange={setOpen}
          swipeDirection="right"
          modal
        >
          <Drawer.Trigger
            className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-11")}
            aria-label={open ? "关闭导航" : "打开导航"}
            aria-expanded={open}
            aria-controls="foxfire-mobile-nav"
          >
            {open ? <XIcon aria-hidden="true" /> : <MenuIcon aria-hidden="true" />}
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Backdrop
              className={cn(
                "fixed inset-0 z-50 min-h-dvh bg-black/40 dark:bg-black/60",
                "opacity-[calc(1-var(--drawer-swipe-progress,0))]",
                "transition-opacity duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                "data-swiping:duration-0",
                "data-starting-style:opacity-0 data-ending-style:opacity-0",
                "supports-[-webkit-touch-callout:none]:absolute",
              )}
            />
            <Drawer.Viewport className="fixed inset-0 z-50 flex items-stretch justify-end">
              <Drawer.Popup
                id="foxfire-mobile-nav"
                aria-labelledby={titleId}
                aria-describedby={descId}
                className={cn(
                  "flex h-full w-[min(20rem,calc(100vw-3rem))] flex-col border-l border-border bg-background text-foreground outline-none",
                  "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
                  "overflow-y-auto overscroll-contain touch-auto",
                  "[transform:translateX(var(--drawer-swipe-movement-x,0px))]",
                  "transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
                  "data-swiping:select-none data-swiping:duration-0",
                  "data-starting-style:[transform:translateX(100%)] data-ending-style:[transform:translateX(100%)]",
                )}
              >
                <Drawer.Content className="flex flex-1 flex-col gap-4 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Drawer.Title
                        id={titleId}
                        className="text-base font-medium tracking-tight"
                      >
                        导航
                      </Drawer.Title>
                      <Drawer.Description
                        id={descId}
                        className="mt-1 text-sm text-muted-foreground"
                      >
                        狐火 · 面试题库
                      </Drawer.Description>
                    </div>
                    <Drawer.Close
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "size-11",
                      )}
                      aria-label="关闭导航"
                    >
                      <XIcon aria-hidden="true" />
                    </Drawer.Close>
                  </div>

                  <nav className="flex flex-col gap-1" aria-label="主要">
                    {NAV_ITEMS.map((item) => (
                      <NavLink
                        key={item.id}
                        href={item.href}
                        label={item.label}
                        active={current === item.id}
                        onNavigate={() => setOpen(false)}
                        className="h-11 justify-start px-3 text-base"
                      />
                    ))}
                    <a
                      href={GITHUB_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpen(false)}
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "sm" }),
                        "h-11 justify-start px-3 text-base",
                      )}
                    >
                      GitHub
                    </a>
                  </nav>
                </Drawer.Content>
              </Drawer.Popup>
            </Drawer.Viewport>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
    </>
  );
}
