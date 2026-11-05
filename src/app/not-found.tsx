import { AppShell } from "@/components/AppShell";
import { QuietEmpty } from "@/components/QuietEmpty";

export default function NotFound() {
  return (
    <AppShell>
      <QuietEmpty
        label="404"
        title="没有这道题"
        body="编号不存在，或分类写错了。"
        nextStep="回题库换一题，或用搜索找关键词。"
        href="/"
        action="回到题库"
      />
    </AppShell>
  );
}
