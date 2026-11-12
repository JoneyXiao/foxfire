import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";
import mark from "@/assets/foxfire-mark.png";
import { buttonVariants } from "@/components/ui/button";
import { categories } from "@/lib/categories";
import type { CategoryId } from "@/lib/types";
import { totalQuestions } from "@/data/questions";
import { mindmapIndex } from "@/data/mindmaps";
import { cn } from "@/lib/utils";

const CATEGORY_BY_ID = Object.fromEntries(categories.map((item) => [item.id, item]));

function categoryHref(id: CategoryId) {
  return `/category/${id}`;
}

function categoryName(id: CategoryId) {
  return CATEGORY_BY_ID[id]?.name ?? id;
}

function chipLabel(id: CategoryId) {
  return categoryName(id).replace(/（[^）]+）/g, "");
}

const START_GROUPS = [
  {
    badge: "模型与调用",
    title: "模型调用这一层，面试通常怎么问？",
    href: categoryHref("llm-basics"),
    more: "从大模型通识开始",
    items: [
      { kind: "分类", id: "llm-basics" as const },
      { kind: "分类", id: "api-structured" as const },
      { kind: "分类", id: "prompting" as const },
      { kind: "分类", id: "ml-basics" as const },
    ],
  },
  {
    badge: "检索与知识",
    title: "RAG 和知识工程怎么讲清楚？",
    href: categoryHref("rag"),
    more: "从 RAG 开始",
    items: [
      { kind: "分类", id: "rag" as const },
      { kind: "分类", id: "knowledge" as const },
    ],
  },
  {
    badge: "Agent",
    title: "Agent 的规划、权限和框架怎么答？",
    href: categoryHref("agent"),
    more: "从智能体开始",
    items: [
      { kind: "分类", id: "agent" as const },
      { kind: "分类", id: "harness" as const },
      { kind: "分类", id: "frameworks" as const },
    ],
  },
  {
    badge: "上线与代价",
    title: "部署、评估、安全和成本怎么答？",
    href: categoryHref("deployment"),
    more: "从部署与推理开始",
    items: [
      { kind: "分类", id: "deployment" as const },
      { kind: "分类", id: "evaluation" as const },
      { kind: "分类", id: "reliability" as const },
      { kind: "分类", id: "safety" as const },
      { kind: "分类", id: "product-cost" as const },
    ],
  },
] as const;

function Chip({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center whitespace-nowrap rounded-sm border border-border bg-foreground/[0.055] px-[9px] py-1.5 font-mono text-xs font-medium text-foreground/80 transition-colors hover:border-foreground hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
    >
      {children}
    </Link>
  );
}

function KindBadge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex w-fit rounded-[4px] border border-border px-[7px] py-[5px] font-mono text-[10px] font-medium leading-none tracking-[0.10em] text-foreground">
      {children}
    </span>
  );
}

function HeroVisual() {
  return (
    <div className="relative hidden min-h-80 w-full overflow-hidden sm:flex">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_20%,oklch(0.86_0.16_82)_0%,transparent_55%),radial-gradient(ellipse_at_20%_85%,oklch(0.78_0.14_45)_0%,transparent_52%),radial-gradient(ellipse_at_90%_90%,oklch(0.82_0.13_70)_0%,transparent_48%),linear-gradient(180deg,oklch(0.84_0.13_75)_0%,oklch(0.72_0.14_50)_100%)] dark:bg-[radial-gradient(ellipse_at_70%_20%,oklch(0.48_0.14_75)_0%,transparent_55%),radial-gradient(ellipse_at_20%_85%,oklch(0.38_0.12_40)_0%,transparent_52%),radial-gradient(ellipse_at_90%_90%,oklch(0.42_0.11_65)_0%,transparent_48%),linear-gradient(180deg,oklch(0.36_0.1_70)_0%,oklch(0.22_0.08_45)_100%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-10 bg-gradient-to-l from-transparent via-transparent to-background"
      />
      <div className="relative z-20 flex h-full min-h-[520px] w-full flex-col items-center justify-end px-8 pb-12 pt-16">
        <Image
          src={mark}
          alt=""
          width={96}
          height={96}
          className="mb-5 size-20 drop-shadow-sm lg:size-24"
          priority
        />
        <p className="font-heading text-[4.5rem] leading-none font-bold tracking-tight text-primary-foreground dark:text-primary lg:text-[5.75rem]">
          狐火
        </p>
        <p className="mt-3 font-mono text-[11px] font-medium tracking-[0.18em] text-primary-foreground/70 uppercase dark:text-primary/80">
          Foxfire
        </p>
      </div>
    </div>
  );
}

export function LandingPage() {
  const stats = [
    { value: String(totalQuestions), label: "题库题目" },
    { value: String(categories.length), label: "题目分类" },
    { value: String(mindmapIndex.length), label: "复习导图" },
  ] as const;

  const practiceChips = ["llm-basics", "rag", "agent", "deployment", "safety", "product-cost"] as const;

  return (
    <div className="relative flex flex-1 flex-col">
      <header
        id="hero"
        className="relative grid w-full grid-cols-1 items-stretch border-b border-border md:min-h-[520px] md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden sm:hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_10%,color-mix(in_oklch,var(--primary)_55%,transparent)_0%,transparent_58%),radial-gradient(ellipse_at_10%_90%,oklch(0.72_0.14_45_/_0.45)_0%,transparent_50%)] dark:bg-[radial-gradient(ellipse_at_80%_10%,color-mix(in_oklch,var(--primary)_40%,transparent)_0%,transparent_58%),radial-gradient(ellipse_at_10%_90%,oklch(0.45_0.1_40_/_0.35)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/70 to-background" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-4 pt-14 pb-14 sm:px-6 sm:pt-[88px] sm:pb-[72px]">
          <p className="mb-3 font-mono text-[11px] font-medium tracking-[0.16em] text-foreground/70 uppercase dark:text-foreground/65">
            AI 应用面试 · 狐火
          </p>
          <h1 className="font-heading mb-[22px] text-[2.35rem] leading-[1.15] font-bold tracking-tight text-balance sm:text-[2.85rem] lg:text-[3.35rem] lg:leading-[1.12]">
            会调模型，
            <br />
            还过不了应用面试。
          </h1>
          <div className="max-w-[22em] space-y-2 text-[17px] leading-[1.5] text-pretty text-foreground/70 sm:text-[19px] lg:text-[21px]">
            <p>按十四分类刷 150 题，对照参考作答。</p>
            <p>
              <span className="whitespace-nowrap">第 15–20 章</span> Agent 导图可拖拽复习。
            </p>
            <p>不登录也能用，进度只留在本机。</p>
          </div>

          <div className="mt-[34px] flex flex-wrap items-center gap-2.5">
            <Link
              href="/practice"
              className={cn(
                buttonVariants({ variant: "default" }),
                "h-[46px] rounded-[9px] px-5 text-[15px] font-bold",
              )}
            >
              开始刷题
            </Link>
            <Link
              href="/mindmaps"
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-[46px] gap-2 rounded-[9px] border-foreground/20 px-5 text-[15px] font-medium hover:border-foreground/40",
              )}
            >
              复习导图
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>

          <dl className="mt-11 grid max-w-xl grid-cols-3 gap-x-6 border-t border-border pt-[26px] sm:flex sm:gap-x-[34px]">
            {stats.map((item) => (
              <div key={item.label} className="flex min-w-0 flex-col sm:flex-1 sm:basis-0">
                <dt className="sr-only">{item.label}</dt>
                <dd className="font-mono text-2xl leading-none font-medium tracking-[-0.02em] sm:text-[26px]">
                  {item.value}
                </dd>
                <p className="mt-1.5 font-mono text-[11px] font-medium tracking-[0.12em] text-muted-foreground" aria-hidden="true">
                  {item.label}
                </p>
              </div>
            ))}
          </dl>
        </div>

        <HeroVisual />
      </header>

      <section className="border-b border-border">
        <div className="grid grid-cols-1 gap-8 px-4 py-14 sm:px-6 sm:pt-[76px] sm:pb-[72px] md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] md:gap-16">
          <h2 className="font-heading text-[1.75rem] leading-[1.15] font-bold tracking-tight text-balance sm:text-[2.0625rem] lg:text-[2.5rem] lg:leading-[1.12]">
            背答案不够，
            <br />
            现场要能讲清楚取舍。
          </h2>
          <div className="flex max-w-[62ch] flex-col gap-5 text-[16.5px] leading-[1.68] text-pretty text-muted-foreground sm:text-[17.5px] [&_p:last-child]:font-medium [&_p:last-child]:text-foreground">
            <p>应用岗很少只问「这个接口怎么调」。更常见的是：检索为什么这样切，Agent 的权限边界在哪，上线后成本怎么控。</p>
            <p>狐火按十四分类整理 150 道题，对照参考作答，再自评掌握度；到期的题会出现在进度里的「今天练什么」。</p>
            <p>第 15–20 章原文只有思维导图，这里做成可拖拽画布，只复习、不入题库。不登录也能用，进度只留在本机。</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="landing-tracks" className="border-b border-border bg-muted/45">
        <div className="flex flex-col gap-6 px-4 pt-14 pb-10 sm:px-6 sm:pt-[76px] md:flex-row md:items-end md:justify-between md:gap-[30px] md:pb-[38px]">
          <div className="md:max-w-2xl">
            <h2
              id="landing-tracks"
              className="font-heading text-[1.875rem] leading-[1.12] font-bold tracking-tight text-balance sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.08]"
            >
              三种用法，从任意一个开始
            </h2>
            <p className="mt-4 max-w-[62ch] text-[16.5px] leading-[1.68] text-pretty text-muted-foreground sm:text-[17.5px]">
              150 题按分类练习，<span className="whitespace-nowrap">第 15–20 章</span>做成可拖拽导图。到期题记在进度页。
            </p>
          </div>
          <Link
            href="/practice"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto w-fit shrink-0 gap-1.5 rounded-[9px] border-foreground/20 px-[17px] py-[11px] text-sm font-medium hover:border-foreground/40",
            )}
          >
            开始刷题
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <div className="px-4 pb-14 sm:px-6 sm:pb-20 md:pt-3">
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            <li className="flex flex-col bg-background px-6 pt-[26px] pb-[22px]">
              <h3 className="mb-2 flex items-baseline gap-2.5 text-lg leading-snug font-bold tracking-tight text-balance sm:text-xl">
                <span aria-hidden="true" className="font-mono text-xs font-medium text-primary">
                  01
                </span>
                150 题刷题
              </h3>
              <p className="mb-[18px] text-sm leading-relaxed text-pretty text-muted-foreground">
                十四分类，对照参考作答，展开参考后自评掌握度。
              </p>
              <ul className="mb-5 flex flex-wrap gap-1.5">
                {practiceChips.map((id) => (
                  <li key={id}>
                    <Chip href={categoryHref(id)}>{chipLabel(id)}</Chip>
                  </li>
                ))}
              </ul>
              <Link
                href="/practice"
                className="mt-auto inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-foreground/20 px-3.5 text-sm font-medium transition-colors hover:border-foreground/40 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                开始练习会话
                <ArrowRightIcon className="size-4" />
              </Link>
            </li>

            <li className="flex flex-col bg-background px-6 pt-[26px] pb-[22px]">
              <h3 className="mb-2 flex items-baseline gap-2.5 text-lg leading-snug font-bold tracking-tight text-balance sm:text-xl">
                <span aria-hidden="true" className="font-mono text-xs font-medium text-primary">
                  02
                </span>
                Agent 导图复习
              </h3>
              <p className="mb-[18px] text-sm leading-relaxed text-pretty text-muted-foreground">
                第 15–20 章做成可拖拽画布。只复习，不入题库。
              </p>
              <ul className="mb-5 flex flex-wrap gap-1.5">
                {mindmapIndex.map((item) => (
                  <li key={item.id}>
                    <Chip href={`/mindmaps/${item.id}`}>
                      {item.chapter}.{item.shortTitle}
                    </Chip>
                  </li>
                ))}
              </ul>
              <Link
                href="/mindmaps"
                className="mt-auto inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-foreground/20 px-3.5 text-sm font-medium transition-colors hover:border-foreground/40 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                打开导图
                <ArrowRightIcon className="size-4" />
              </Link>
            </li>

            <li className="flex flex-col bg-background px-6 pt-[26px] pb-[22px] sm:col-span-2 lg:col-span-1">
              <h3 className="mb-2 flex items-baseline gap-2.5 text-lg leading-snug font-bold tracking-tight text-balance sm:text-xl">
                <span aria-hidden="true" className="font-mono text-xs font-medium text-primary">
                  03
                </span>
                间隔复习
              </h3>
              <p className="mb-[18px] text-sm leading-relaxed text-pretty text-muted-foreground">
                自评掌握度后，到期题会出现在进度页的「今天练什么」。进度只留在本机。
              </p>
              <ul className="mb-5 flex flex-wrap gap-1.5">
                <li>
                  <Chip href="/progress">今天练什么</Chip>
                </li>
                <li>
                  <Chip href="/progress">导出备份</Chip>
                </li>
              </ul>
              <Link
                href="/progress"
                className="mt-auto inline-flex h-10 w-full items-center justify-between gap-2 rounded-md border border-foreground/20 px-3.5 text-sm font-medium transition-colors hover:border-foreground/40 hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
              >
                查看进度
                <ArrowRightIcon className="size-4" />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="landing-start">
        <div className="flex flex-col gap-6 px-4 pt-14 pb-10 sm:px-6 sm:pt-[76px] md:flex-row md:items-end md:justify-between md:pb-[38px]">
          <div className="md:max-w-2xl">
            <h2
              id="landing-start"
              className="font-heading text-[1.875rem] leading-[1.12] font-bold tracking-tight text-balance sm:text-[2.25rem] lg:text-[2.75rem] lg:leading-[1.08]"
            >
              想从哪部分开始？
            </h2>
            <p className="mt-4 max-w-[36em] text-[16.5px] leading-[1.68] text-pretty text-muted-foreground sm:text-[17.5px]">
              按面试里常见的几块选，不必按顺序刷完。
            </p>
          </div>
          <Link
            href="/practice"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-auto w-fit shrink-0 gap-1.5 rounded-[9px] border-foreground/20 px-[17px] py-[11px] text-sm font-medium hover:border-foreground/40",
            )}
          >
            开始刷题
            <ArrowRightIcon className="size-4" />
          </Link>
        </div>

        <ul className="px-4 pb-16 sm:px-6 sm:pb-20">
          {START_GROUPS.map((group) => (
            <li
              key={group.badge}
              className="grid grid-cols-1 gap-5 border-t border-border py-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:gap-10 md:py-10"
            >
              <div className="flex flex-col gap-3">
                <p>
                  <span className="inline-block rounded-[4px] bg-foreground/10 px-[7px] py-[5px] font-mono text-[10px] font-medium tracking-[0.10em] text-foreground uppercase">
                    {group.badge}
                  </span>
                </p>
                <h3 className="text-[1.25rem] leading-[1.25] font-bold tracking-tight text-balance sm:text-[1.375rem] lg:text-[1.5625rem] lg:leading-[1.2]">
                  {group.title}
                </h3>
                <Link
                  href={group.href}
                  className="group mt-1 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {group.more}
                  <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item.id}>
                    <Link
                      href={categoryHref(item.id)}
                      className="group flex items-center gap-4 border-b border-border py-3 transition-colors last:border-b-0 hover:bg-muted/40 focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none md:-mx-4 md:px-4"
                    >
                      <span className="hidden w-[74px] flex-none sm:block">
                        <KindBadge>{item.kind}</KindBadge>
                      </span>
                      <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5">
                        <span className="sm:hidden">
                          <KindBadge>{item.kind}</KindBadge>
                        </span>
                        <span className="text-base leading-snug font-medium text-balance">{categoryName(item.id)}</span>
                      </span>
                      <ArrowRightIcon className="size-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
