import { AppShell } from "@/components/AppShell";
import { TodayReview } from "@/components/TodayReview";
import { totalQuestions } from "@/data/questions";

export default function HomePage() {
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
          <p className="text-xs text-muted-foreground lg:hidden">
            刷题、导图与分类入口在右上角菜单；宽屏见左侧目录
            {` · ${totalQuestions} 题`}
          </p>
          <p className="hidden text-xs text-muted-foreground lg:block">
            左侧目录：刷题入口、Agent 导图、十四分类索引
            {` · ${totalQuestions} 题`}
          </p>
        </header>

        <TodayReview />
      </div>
    </AppShell>
  );
}
