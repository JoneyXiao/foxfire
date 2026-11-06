"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { Drawer } from "@base-ui/react/drawer";
import { MenuIcon, XIcon } from "lucide-react";
import { SidebarNav } from "@/components/AppSidebar";
import { buttonVariants } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export type NavId = "home" | "search" | "progress" | "practice" | "mock" | "mindmaps";

export const NAV_ITEMS: { href: string; id: NavId; label: string }[] = [
  { href: "/", id: "home", label: "首页" },
  { href: "/practice", id: "practice", label: "会话" },
  { href: "/mock", id: "mock", label: "模拟" },
  { href: "/mindmaps", id: "mindmaps", label: "导图复习" },
  { href: "/search", id: "search", label: "搜索" },
  { href: "/progress", id: "progress", label: "进度" },
];

/** Slim global strip inside the mobile drawer (SidebarNav is the primary directory). */
const DRAWER_GLOBAL_LINKS: { href: string; id: NavId; label: string }[] = [
  { href: "/", id: "home", label: "首页" },
];

const GITHUB_HREF = "https://github.com/JoneyXiao/foxfire";

/** Simple GitHub mark — lucide dropped brand icons in this release. */
function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

type SiteNavProps = {
  current?: NavId;
  /**
   * When true (default), mobile drawer shows dense SidebarNav groups
   * (刷题 / 导图 / 分类). Always keep true so canvas pages (`sidebar={false}`)
   * still expose the directory on narrow screens.
   */
  showSidebarGroups?: boolean;
};

export function SiteNav({ current, showSidebarGroups = true }: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const titleId = useId();
  const descId = useId();
  const closeDrawer = () => setOpen(false);

  return (
    <>
      {/* Desktop: GitHub mark + appearance only — primary nav lives in the sidebar. */}
      <nav className="hidden items-center gap-0.5 md:flex" aria-label="主要">
        <a
          href={GITHUB_HREF}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            buttonVariants({ variant: "ghost", size: "icon" }),
            "size-11 text-muted-foreground hover:text-foreground",
          )}
          aria-label="GitHub 仓库"
        >
          <GitHubMark className="size-5" />
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
                <Drawer.Content className="flex flex-1 flex-col gap-5 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Drawer.Title
                        id={titleId}
                        className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
                      >
                        目录
                      </Drawer.Title>
                      <Drawer.Description
                        id={descId}
                        className="mt-1 text-sm text-foreground"
                      >
                        150 题刷题 + Agent 导图复习
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

                  {showSidebarGroups ? (
                    <SidebarNav onNavigate={closeDrawer} />
                  ) : null}

                  <nav
                    className="mt-auto flex flex-col border-t border-border/80 pt-3"
                    aria-label="全局"
                  >
                    {DRAWER_GLOBAL_LINKS.map((item) => (
                      <Link
                        key={item.id}
                        href={item.href}
                        aria-current={current === item.id ? "page" : undefined}
                        onClick={closeDrawer}
                        className={cn(
                          "flex min-h-11 items-center justify-between px-1 text-sm outline-none",
                          "focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset",
                          current === item.id
                            ? "font-medium text-foreground"
                            : "text-muted-foreground hover:text-foreground",
                        )}
                      >
                        <span>{item.label}</span>
                        {current === item.id ? (
                          <span className="font-mono text-[0.65rem] uppercase tracking-wider text-primary">
                            now
                          </span>
                        ) : null}
                      </Link>
                    ))}
                    <a
                      href={GITHUB_HREF}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeDrawer}
                      className="flex min-h-11 items-center gap-2 px-1 text-sm text-muted-foreground outline-none hover:text-foreground focus-visible:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:ring-inset"
                    >
                      <GitHubMark className="size-4" />
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
