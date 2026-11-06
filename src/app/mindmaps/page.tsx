import { AppShell } from "@/components/AppShell";
import { IndexRow, IndexSection } from "@/components/IndexRow";
import { QuietEmpty } from "@/components/QuietEmpty";
import { mindmapIndex } from "@/data/mindmaps";

export const metadata = {
  title: "Agent 导图复习",
};

export default function MindmapsIndexPage() {
  return (
    <AppShell current="mindmaps">
      <div className="space-y-10">
        <header className="space-y-2">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            导图复习 · 非练习分类
          </p>
          <h1 className="font-heading text-pretty text-3xl font-medium tracking-tight">
            Agent 导图
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            极客时间专栏 Wiki 里第 16–20 章原文只有思维导图、没有问答页。这里做成可拖拽、可缩放的复习画布，不计入题库题数，也不进入 SRS / 进度。
          </p>
        </header>

        {mindmapIndex.length === 0 ? (
          <QuietEmpty
            title="还没有导图"
            body="导图数据尚未就绪。"
          />
        ) : (
          <IndexSection
            label="章节画布"
            action={
              <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
                {mindmapIndex.length} maps
              </span>
            }
          >
            {mindmapIndex.map((item) => (
              <IndexRow
                key={item.id}
                href={`/mindmaps/${item.id}`}
                badge={String(item.chapter)}
                title={item.title}
                description={`${item.shortTitle} · 专栏 ${item.sectionId}`}
                meta={`${item.branchCount} 分支 · ${item.stemCount} 节点`}
              />
            ))}
          </IndexSection>
        )}

        <section className="space-y-2 border-t border-border/80 pt-6">
          <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            说明
          </h2>
          <ul className="max-w-2xl space-y-1.5 text-sm text-muted-foreground">
            <li>第 15 章总览图本轮不上线（与专章重叠，仅作导读）。</li>
            <li>经典 150 题 / 14 分类练习入口不变；本页不是刷题分类。</li>
            <li>节点文案来自校对后的导图题干，不编造标签或占位答案。</li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
