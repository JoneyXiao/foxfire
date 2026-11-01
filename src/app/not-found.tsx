import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <AppShell>
      <div className="mx-auto max-w-md space-y-3 rounded-xl border bg-card px-6 py-10 text-center">
        <h2 className="font-heading text-base font-medium">没有这道题</h2>
        <p className="text-sm text-muted-foreground">编号不存在，或分类写错了。</p>
        <Link href="/" className={cn(buttonVariants())}>
          回到题库
        </Link>
      </div>
    </AppShell>
  );
}
