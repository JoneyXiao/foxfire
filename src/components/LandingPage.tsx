import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { IndexRow, IndexSection } from "@/components/IndexRow";
import { TodayReview } from "@/components/TodayReview";
import { categories } from "@/lib/categories";
import { countByCategory, totalQuestions } from "@/data/questions";
import { mindmapIndex } from "@/data/mindmaps";
import { cn } from "@/lib/utils";

const TRACKS = [
  {
    no: "01",
    title: "150 题刷题",
    body: "十四分类，对照参考作答。展开参考后自评掌握度，到期题会出现在「今天练什么」。进度只留在本机。",
    href: "/practice",
    cta: "开始练习会话",
  },
  {
    no: "02",
    title: "Agent 导图复习",
    body: "第 15–20 章原文只有思维导图。这里做成可拖拽画布，只复习、不入题库、不进间隔复习。",
    href: "/mindmaps",
    cta: "打开导图",
  },
] as const;

function LandingWash() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[40rem] overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_10%,color-mix(in_oklch,var(--primary)_55%,transparent)_0%,transparent_52%),radial-gradient(ellipse_at_85%_20%,color-mix(in_oklch,var(--primary)_35%,transparent)_0%,transparent_58%),radial-gradient(ellipse_at_50%_100%,color-mix(in_oklch,var(--primary)_40%,transparent)_0%,transparent_55%),radial-gradient(ellipse_at_80%_85%,oklch(0.72_0.14_35_/_0.45)_0%,transparent_50%),radial-gradient(ellipse_at_10%_80%,oklch(0.62_0.12_25_/_0.35)_0%,transparent_48%)] dark:bg-[radial-gradient(ellipse_at_15%_10%,color-mix(in_oklch,var(--primary)_40%,transparent)_0%,transparent_52%),radial-gradient(ellipse_at_85%_20%,color-mix(in_oklch,var(--primary)_28%,transparent)_0%,transparent_58%),radial-gradient(ellipse_at_50%_100%,color-mix(in_oklch,var(--primary)_32%,transparent)_0%,transparent_55%),radial-gradient(ellipse_at_80%_85%,oklch(0.55_0.12_45_/_0.35)_0%,transparent_50%),radial-gradient(ellipse_at_10%_80%,oklch(0.45_0.1_30_/_0.3)_0%,transparent_48%)]" />
      <div className="absolute inset-0 bg-gradient-to-b from-background/15 via-background/55 to-background" />
    </div>
  );
}

export function LandingPage() {
  const counts = countByCategory();
  const stats = [
    { value: String(totalQuestions), label: "题" },
    { value: String(categories.length), label: "个分类" },
    { value: String(mindmapIndex.length), label: "张导图" },
  ] as const;

  return (
    <div className="relative flex flex-1 flex-col">
      <LandingWash />

      <div className="relative z-10 mx-auto flex w-full flex-1 flex-col px-4 pb-16 pt-12 sm:px-11 sm:pb-20 sm:pt-20">
        <section className="max-w-3xl space-y-8">
          <header className="space-y-4">
            <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              AI 应用面试
            </p>
            <h1 className="font-heading text-5xl font-bold tracking-tight text-balance sm:text-6xl md:text-7xl">
              狐火
            </h1>
            <div className="max-w-2xl space-y-2 text-base leading-relaxed text-foreground/80 sm:text-lg">
              <p>按十四分类刷 150 题，第 15–20 章 Agent 导图可拖拽复习。</p>
              <p>不登录也能用，进度只留在本机。</p>
            </div>
          </header>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/practice"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-12 rounded-xl px-6 text-base font-medium",
              )}
            >
              开始刷题
            </Link>
            <Link
              href="/mindmaps"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-12 rounded-xl px-6 text-base font-medium",
              )}
            >
              复习导图
            </Link>
          </div>

          <ul className="grid grid-cols-3 gap-x-6 gap-y-5 border-t border-border/70 pt-8">
            {stats.map((item) => (
              <li key={item.label} className="space-y-1">
                <p className="font-heading text-3xl font-semibold tracking-tight tabular-nums sm:text-4xl">
                  {item.value}
                </p>
                <p className="text-sm text-muted-foreground">{item.label}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 max-w-3xl space-y-0 sm:mt-20" aria-labelledby="landing-tracks">
          <h2
            id="landing-tracks"
            className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
          >
            两种入口
          </h2>
          <ul className="mt-4 divide-y divide-border/80 border-y border-border/80">
            {TRACKS.map((track) => (
              <li key={track.no} className="flex flex-col gap-4 py-8 sm:flex-row sm:items-start sm:gap-8">
                <span className="w-10 shrink-0 font-mono text-[0.7rem] tabular-nums tracking-tight text-muted-foreground">
                  {track.no}
                </span>
                <div className="min-w-0 flex-1 space-y-3">
                  <h3 className="font-heading text-xl font-medium tracking-tight">{track.title}</h3>
                  <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">{track.body}</p>
                  <Link
                    href={track.href}
                    className="inline-flex min-h-11 items-center text-sm font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    {track.cta}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <IndexSection label="十四分类" className="mt-16 max-w-3xl sm:mt-20">
          {categories.map((category, index) => (
            <IndexRow
              key={category.id}
              href={`/category/${category.id}`}
              badge={String(index + 1).padStart(2, "0")}
              title={category.name}
              description={category.summary}
              meta={`${counts[category.id]} 题`}
            />
          ))}
        </IndexSection>

        <IndexSection label="Agent 导图" className="mt-16 max-w-3xl sm:mt-20">
          {mindmapIndex.map((item) => (
            <IndexRow
              key={item.id}
              href={`/mindmaps/${item.id}`}
              badge={String(item.chapter)}
              title={item.shortTitle}
              description={item.title}
              meta={`第 ${item.chapter} 章`}
            />
          ))}
        </IndexSection>

        <div className="mt-16 max-w-3xl sm:mt-20">
          <TodayReview />
        </div>
      </div>
    </div>
  );
}
