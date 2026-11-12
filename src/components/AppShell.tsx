import Image from "next/image";
import Link from "next/link";
import { AppSidebar } from "@/components/AppSidebar";
import { SiteNav, type NavId } from "@/components/SiteNav";
import { SHELL_MAX_WIDTH_CLASS } from "@/lib/shell";
import { questionThumbBarClearanceClass } from "@/lib/thumb-bar";
import { cn } from "@/lib/utils";
import mark from "@/assets/foxfire-mark.png";

type AppShellProps = {
  children: React.ReactNode;
  current?: NavId;
  /** Reserve space under SiteFooter for the fixed mobile QuestionThumbBar. */
  clearThumbBar?: boolean;
  /**
   * Left sticky sidebar (lg+). Default true.
   * Set false on mindmap canvas pages so the React Flow desk stays full width.
   * Mobile drawer always keeps SidebarNav groups regardless of this flag.
   */
  sidebar?: boolean;
  /** Drop the default main padding so a page can fill and vertically center its content (login). */
  flush?: boolean;
};

function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/70">
      <div className="flex w-full flex-col gap-2 px-4 py-5 text-sm text-muted-foreground sm:px-11">
        <p className="max-w-3xl text-xs leading-relaxed opacity-90">
          本站为个人面试练习工具：经典十四分类 150 题刷题（含间隔复习）；第 15–20 章
          Agent 导图为复习画布，不入题库。题库与导图参考极客知识库「AI
          面试」等公开学习资料整理，不构成官方教材，亦与极客时间、极客知识库无隶属或授权关系。
        </p>
      </div>
    </footer>
  );
}

export function AppShell({
  children,
  current,
  clearThumbBar = false,
  sidebar = true,
  flush = false,
}: AppShellProps) {
  return (
    <div
      className={cn(
        "flex min-h-svh flex-col",
        clearThumbBar && questionThumbBarClearanceClass,
      )}
    >
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-[max(1rem,env(safe-area-inset-top))] focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-3 focus-visible:py-2 focus-visible:text-primary-foreground"
      >
        跳到主要内容
      </a>
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background pt-[env(safe-area-inset-top)]">
        <div
          className={cn(
            "mx-auto flex h-12 w-full items-center justify-between gap-3 px-4 sm:px-6",
            SHELL_MAX_WIDTH_CLASS,
          )}
        >
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2 font-medium tracking-tight outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <Image src={mark} alt="" width={24} height={24} priority className="size-6" />
            <span className="text-sm sm:text-[0.95rem]">狐火</span>
            <span className="hidden font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground sm:inline">
              Foxfire
            </span>
          </Link>
          {/* Mobile drawer always includes SidebarNav groups; desktop aside is gated by `sidebar`. */}
          <SiteNav current={current} />
        </div>
      </header>

      {/*
        Body: on lg+ with sidebar, left rail border-r meets header border-b and
        runs to the page bottom; footer lives only in the right column (aihero).
      */}
      <div
        className={cn(
          "mx-auto flex w-full flex-1",
          SHELL_MAX_WIDTH_CLASS,
          sidebar ? "lg:items-stretch" : "flex-col",
        )}
      >
        {sidebar ? <AppSidebar /> : null}
        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            "pl-[max(0px,env(safe-area-inset-left))] pr-[max(0px,env(safe-area-inset-right))]",
          )}
        >
          <main id="content" className="flex flex-1 flex-col scroll-mt-14">
            <div
              className={
                flush ? "flex flex-1 flex-col" : "px-4 py-7 sm:px-11 sm:py-9"
              }
            >
              {children}
            </div>
          </main>
          <SiteFooter />
        </div>
      </div>
    </div>
  );
}
