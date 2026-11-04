import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";
import mark from "@/assets/foxfire-mark.png";

type AppShellProps = {
  children: React.ReactNode;
  current?: "home" | "search" | "progress" | "practice";
};

const nav = [
  { href: "/", id: "home" as const, label: "题库" },
  { href: "/practice", id: "practice" as const, label: "会话" },
  { href: "/search", id: "search" as const, label: "搜索" },
  { href: "/progress", id: "progress" as const, label: "进度" },
];

export function AppShell({ children, current }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        跳到题目
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
            <Image src={mark} alt="" width={28} height={28} priority className="size-7" />
            <span className="text-base">狐火</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">Foxfire</span>
          </Link>
          <nav className="flex items-center gap-1" aria-label="主要">
            {nav.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                aria-current={current === item.id ? "page" : undefined}
                className={cn(
                  buttonVariants({
                    variant: current === item.id ? "secondary" : "ghost",
                    size: "sm",
                  }),
                )}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/JoneyXiao/foxfire"
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ variant: "ghost", size: "sm" }))}
            >
              GitHub
            </a>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main id="content" className="flex-1">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-10">{children}</div>
      </main>
      <footer className="mt-auto border-t">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 px-4 py-6 text-sm text-muted-foreground sm:px-6">
          <Separator />
          <p>
            <strong className="font-medium text-foreground">狐火</strong>
            {" · "}
            本地保存进度的 AI 应用面试题库
            {" · "}
            <a
              href="https://github.com/JoneyXiao/foxfire"
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-2 hover:text-foreground hover:underline"
            >
              GitHub 仓库
            </a>
          </p>
          <p className="max-w-3xl leading-relaxed">
            本站为个人面试练习工具。题库参考极客知识库「AI 面试」专题等公开学习资料整理、改写，仅供个人学习练习，不构成官方教材或题库，亦与极客时间、极客知识库无隶属或授权关系。
          </p>
        </div>
      </footer>
    </div>
  );
}
