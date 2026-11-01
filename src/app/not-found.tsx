import Link from "next/link";
import { AppShell } from "@/components/AppShell";

export default function NotFound() {
  return (
    <AppShell>
      <div className="empty">
        <h2>没有这道题</h2>
        <p>编号不存在，或分类写错了。</p>
        <p>
          <Link className="btn" href="/">
            回到题库
          </Link>
        </p>
      </div>
    </AppShell>
  );
}
