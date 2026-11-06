import { AppShell } from "@/components/AppShell";
import { IndexRow, IndexSection } from "@/components/IndexRow";
import { TodayReview } from "@/components/TodayReview";
import { categories } from "@/lib/categories";
import { mindmapIndex } from "@/data/mindmaps";
import { countByCategory, totalQuestions } from "@/data/questions";

export default function HomePage() {
  const counts = countByCategory();

  return (
    <AppShell current="home">
      <div className="space-y-10">
        <header className="space-y-2">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            AI 应用面试 · 两套入口
          </p>
          <h1 className="font-heading text-pretty text-3xl font-medium tracking-tight">
            狐火
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            <strong className="font-medium text-foreground">150 题刷题</strong>
            ：十四分类，对照参考作答，掌握度驱动今日待复习，进度只留在本机。
            {" "}
            <strong className="font-medium text-foreground">Agent 导图复习</strong>
            ：第 15–20 章可拖拽画布，只复习、不入题库、不进 SRS。
          </p>
        </header>

        <TodayReview />

        <IndexSection label="刷题入口">
          <IndexRow
            href="/practice"
            badge="01"
            title="练习会话"
            description="连续刷一串，按筛选组卷"
          />
          <IndexRow
            href="/mock"
            badge="02"
            title="模拟面试"
            description="限时口述，按轮次复盘"
          />
          <IndexRow
            href="/search"
            badge="03"
            title="搜索题库"
            description="题干、标签、编号或参考关键词"
          />
          <IndexRow
            href="/progress"
            badge="04"
            title="练习进度"
            description="已练、收藏与复习队列"
          />
        </IndexSection>

        <IndexSection
          label="Agent 导图复习"
          action={
            <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
              {mindmapIndex.length} maps · 非题库
            </span>
          }
        >
          <IndexRow
            href="/mindmaps"
            badge="全"
            title="全部导图"
            description={`第 15–20 章 React Flow 画布 · 不计入 ${totalQuestions} 题`}
            meta="复习"
          />
          {mindmapIndex.map((item) => (
            <IndexRow
              key={item.id}
              href={`/mindmaps/${item.id}`}
              badge={String(item.chapter)}
              title={item.shortTitle}
              description={`${item.title} · 专栏 ${item.sectionId}`}
              meta={`${item.branchCount} 分支`}
            />
          ))}
        </IndexSection>

        <IndexSection
          label="150 题 · 分类索引"
          action={
            <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
              {categories.length} cats · {totalQuestions} 题
            </span>
          }
        >
          {categories.map((category, index) => (
            <IndexRow
              key={category.id}
              href={`/category/${category.id}`}
              badge={String(index + 1).padStart(2, "0")}
              title={category.name}
              description={category.summary}
              meta={`${counts[category.id] ?? 0} 题`}
            />
          ))}
        </IndexSection>
      </div>
    </AppShell>
  );
}
