import Link from "next/link";
import { notFound } from "next/navigation";
import { AppShell } from "@/components/AppShell";
import { MindmapCanvas } from "@/components/mindmap/MindmapCanvas";
import {
  allMindmapIds,
  getMindmapChapter,
  isMindmapId,
  mindmapIndex,
} from "@/data/mindmaps";

type MindmapPageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return allMindmapIds().map((id) => ({ id }));
}

export async function generateMetadata({ params }: MindmapPageProps) {
  const { id } = await params;
  const chapter = getMindmapChapter(id);
  return { title: chapter ? `${chapter.title} · 导图` : "导图" };
}

export default async function MindmapChapterPage({ params }: MindmapPageProps) {
  const { id } = await params;

  if (!isMindmapId(id)) {
    notFound();
  }

  const chapter = getMindmapChapter(id);
  if (!chapter) {
    notFound();
  }

  const entry = mindmapIndex.find((item) => item.id === id);

  return (
    <AppShell current="mindmaps">
      <div className="space-y-6">
        <nav
          className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground"
          aria-label="面包屑"
        >
          <Link href="/mindmaps" className="hover:text-foreground hover:underline">
            Agent 导图
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{chapter.shortTitle}</span>
        </nav>

        <header className="space-y-2">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            第 {chapter.chapter} 章 · {chapter.sectionId} · 导图复习
          </p>
          <h1 className="font-heading text-pretty text-2xl font-medium tracking-tight sm:text-3xl">
            {chapter.title}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            可拖动节点、滚轮缩放、空白处平移。这是复习画布，不是答题页
            {entry
              ? `（${entry.branchCount} 个分支 · ${entry.stemCount} 个题干节点）。`
              : "。"}
          </p>
        </header>

        <MindmapCanvas tree={chapter.tree} title={chapter.title} />

        <nav aria-label="其他章节" className="border-t border-border/80 pt-4">
          <p className="mb-2 font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
            其他导图
          </p>
          <ul className="flex flex-wrap gap-2">
            {mindmapIndex.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/mindmaps/${item.id}`}
                  aria-current={item.id === id ? "page" : undefined}
                  className={
                    item.id === id
                      ? "inline-flex min-h-9 items-center rounded-md border border-primary/60 bg-primary/15 px-3 text-sm font-medium text-foreground"
                      : "inline-flex min-h-9 items-center rounded-md border border-border/80 px-3 text-sm text-muted-foreground hover:text-foreground"
                  }
                >
                  {item.chapter}. {item.shortTitle}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </AppShell>
  );
}
