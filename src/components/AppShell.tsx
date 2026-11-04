import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { SiteNav, type NavId } from "@/components/SiteNav";
import mark from "@/assets/foxfire-mark.png";

type AppShellProps = {
  children: React.ReactNode;
  current?: NavId;
};

export function AppShell({ children, current }: AppShellProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <a
        href="#content"
        className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:left-4 focus-visible:top-[max(1rem,env(safe-area-inset-top))] focus-visible:z-50 focus-visible:rounded-md focus-visible:bg-primary focus-visible:px-3 focus-visible:py-2 focus-visible:text-primary-foreground"
      >
        跳到主要内容
      </a>
      <header className="sticky top-0 z-40 border-b bg-background/95 pt-[env(safe-area-inset-top)] backdrop-blur supports-backdrop-filter:bg-background/80">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 font-medium tracking-tight">
            <Image src={mark} alt="" width={28} height={28} priority className="size-7" />
            <span className="text-base">狐火</span>
            <span className="hidden text-sm text-muted-foreground sm:inline">Foxfire</span>
          </Link>
          <SiteNav current={current} />
        </div>
      </header>
      <main id="content" className="flex-1 scroll-mt-16">
        <div className="mx-auto w-full max-w-5xl px-4 py-8 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-6 sm:py-10 sm:pl-[max(1.5rem,env(safe-area-inset-left))] sm:pr-[max(1.5rem,env(safe-area-inset-right))]">{children}</div>
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
