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
            Agent 导图复习 · 非 150 题刷题
          </p>
          <h1 className="font-heading text-pretty text-3xl font-medium tracking-tight">
            Agent 导图复习
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            极客时间专栏 Wiki 第 15–20 章原文只有思维导图、没有问答页。这里做成可折叠、可搜索、可拖拽缩放的复习画布——与首页「150 题刷题」分开：不计入题库题数，也不进入练习会话 / SRS / 进度。
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
            <li>想刷题请回首页「150 题 · 分类索引」或导航里的「会话 / 模拟」；本页只做导图复习。</li>
            <li>第 15 章为总览图，与 16–18 专章题干有重叠，仍单独成画布便于总览对照。</li>
            <li>节点文案对齐原图层级；不嵌入 JPG、不拆题入库、不编造答案。</li>
          </ul>
        </section>
      </div>
    </AppShell>
  );
}
