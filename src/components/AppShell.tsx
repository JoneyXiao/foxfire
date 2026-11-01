import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import mark from "@/assets/foxfire-mark.png";

type AppShellProps = {
  children: React.ReactNode;
  current?: "home" | "search" | "progress";
};

export function AppShell({ children, current }: AppShellProps) {
  return (
    <div className="shell">
      <a className="skip" href="#content">
        跳到题目
      </a>
      <header className="topbar">
        <div className="container topbar__in">
          <Link className="wordmark" href="/">
            <Image
              className="wordmark__mark"
              src={mark}
              alt=""
              width={28}
              height={28}
              priority
            />
            <span className="wordmark__zh">狐火</span>
            <span className="wordmark__en">Foxfire</span>
          </Link>
          <nav className="nav" aria-label="主要">
            <Link href="/" aria-current={current === "home" ? "page" : undefined}>
              题库
            </Link>
            <Link href="/search" aria-current={current === "search" ? "page" : undefined}>
              搜索
            </Link>
            <Link href="/progress" aria-current={current === "progress" ? "page" : undefined}>
              进度
            </Link>
            <ThemeToggle />
          </nav>
        </div>
      </header>
      <main id="content" className="main">
        <div className="container">{children}</div>
      </main>
      <footer className="foot">
        <div className="container">
          <strong>狐火</strong>
          Foxfire，本地保存进度的 AI 应用面试题库。
        </div>
      </footer>
    </div>
  );
}
