import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { listTagsWithCounts } from "@/data/questions";
import { categories, difficultyLabel } from "@/lib/categories";
import type { Difficulty, SortOption } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterLinksProps = {
  basePath: string;
  query?: string;
  category?: string;
  difficulty?: string;
  mark?: string;
  tag?: string;
  sort?: string;
  answers?: boolean;
  showCategory?: boolean;
};

function hrefOf(
  basePath: string,
  current: {
    q?: string;
    category?: string;
    difficulty?: string;
    mark?: string;
    tag?: string;
    sort?: string;
    answers?: boolean;
  },
  patch: Record<string, string | boolean | undefined>,
) {
  const params = new URLSearchParams();
  const next = { ...current, ...patch };
  if (next.q) params.set("q", next.q);
  if (next.category && next.category !== "all") params.set("category", next.category);
  if (next.difficulty && next.difficulty !== "all") params.set("difficulty", next.difficulty);
  if (next.mark && next.mark !== "all") params.set("mark", next.mark);
  if (next.tag) params.set("tag", next.tag);
  if (next.sort && next.sort !== "default") params.set("sort", next.sort);
  if (next.answers) params.set("answers", "1");
  const text = params.toString();
  return text ? `${basePath}?${text}` : basePath;
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={cn(
        badgeVariants({ variant: active ? "default" : "outline" }),
        "h-8 shrink-0 px-2.5 focus-visible:outline-none",
      )}
    >
      {children}
    </Link>
  );
}

const SORT_CHIPS: Array<{ id: SortOption; label: string }> = [
  { id: "default", label: "默认顺序" },
  { id: "open", label: "未练优先" },
  { id: "difficulty", label: "难度↑" },
  { id: "difficulty-desc", label: "难度↓" },
];

function activeFilterCount(opts: {
  category: string;
  difficulty: string;
  mark: string;
  tag: string;
  sort: string;
}): number {
  let n = 0;
  if (opts.category !== "all") n += 1;
  if (opts.difficulty !== "all") n += 1;
  if (opts.mark !== "all") n += 1;
  if (opts.tag) n += 1;
  if (opts.sort !== "default") n += 1;
  return n;
}

export function FilterLinks({
  basePath,
  query,
  category = "all",
  difficulty = "all",
  mark = "all",
  tag = "",
  sort = "default",
  answers = false,
  showCategory = true,
}: FilterLinksProps) {
  const current = { q: query, category, difficulty, mark, tag, sort, answers };
  const difficulties: Array<Difficulty | "all"> = ["all", "foundation", "applied", "system"];
  const marks = [
    { id: "all", label: "全部" },
    { id: "open", label: "未练" },
    { id: "done", label: "已练" },
    { id: "starred", label: "收藏" },
  ];

  const allTags = listTagsWithCounts();
  const commonTags = allTags.filter((item) => item.count >= 2);
  const rareTags = allTags.filter((item) => item.count === 1);
  const selectedIsRare = Boolean(tag && rareTags.some((item) => item.tag === tag));
  const pinnedRare = selectedIsRare ? rareTags.find((item) => item.tag === tag) : undefined;
  const activeCount = activeFilterCount({ category, difficulty, mark, tag, sort });
  const sheetOpen = activeCount > 0 || Boolean(tag) || undefined;

  const primaryBar = (
    <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {marks.map((item) => (
        <Chip
          key={item.id}
          href={hrefOf(basePath, current, { mark: item.id })}
          active={mark === item.id}
        >
          {item.label}
        </Chip>
      ))}
      <span className="mx-0.5 w-px shrink-0 self-stretch bg-border/80" aria-hidden="true" />
      {difficulties.map((item) => (
        <Chip
          key={item}
          href={hrefOf(basePath, current, { difficulty: item })}
          active={difficulty === item}
        >
          {item === "all" ? "全部难度" : difficultyLabel[item]}
        </Chip>
      ))}
      <span className="mx-0.5 w-px shrink-0 self-stretch bg-border/80" aria-hidden="true" />
      {SORT_CHIPS.map((item) => (
        <Chip
          key={item.id}
          href={hrefOf(basePath, current, { sort: item.id })}
          active={sort === item.id}
        >
          {item.label}
        </Chip>
      ))}
    </div>
  );

  const categoryRow = showCategory ? (
    <div className="flex flex-wrap gap-2" role="group" aria-label="分类">
      <Chip href={hrefOf(basePath, current, { category: "all" })} active={category === "all"}>
        全部分类
      </Chip>
      {categories.map((item) => (
        <Chip
          key={item.id}
          href={hrefOf("/search", current, { category: item.id })}
          active={category === item.id}
        >
          {item.name}
        </Chip>
      ))}
    </div>
  ) : null;

  const tagsBlock = (
    <div className="space-y-2" role="group" aria-label="标签">
      <div className="flex flex-wrap gap-2">
        <Chip href={hrefOf(basePath, current, { tag: undefined })} active={!tag}>
          全部标签
        </Chip>
        {commonTags.map((item) => {
          const active = tag === item.tag;
          return (
            <Chip
              key={item.tag}
              href={hrefOf(basePath, current, { tag: active ? undefined : item.tag })}
              active={active}
            >
              {item.tag}
              <span className="ml-1 font-mono text-[0.65rem] tabular-nums opacity-70">
                {item.count}
              </span>
            </Chip>
          );
        })}
        {pinnedRare ? (
          <Chip href={hrefOf(basePath, current, { tag: undefined })} active>
            {pinnedRare.tag}
            <span className="ml-1 font-mono text-[0.65rem] tabular-nums opacity-70">
              {pinnedRare.count}
            </span>
          </Chip>
        ) : null}
      </div>
      {rareTags.length > 0 ? (
        <details
          className="rounded-lg border border-dashed border-border/80 px-3 py-2"
          open={selectedIsRare || undefined}
        >
          <summary className="cursor-pointer select-none text-sm text-muted-foreground hover:text-foreground">
            更多标签（{rareTags.length}）
          </summary>
          <div className="mt-2 flex flex-wrap gap-2">
            {rareTags.map((item) => {
              const active = tag === item.tag;
              return (
                <Chip
                  key={item.tag}
                  href={hrefOf(basePath, current, { tag: active ? undefined : item.tag })}
                  active={active}
                >
                  {item.tag}
                </Chip>
              );
            })}
          </div>
        </details>
      ) : null}
    </div>
  );

  return (
    <div className="space-y-3">
      {/* Desktop: flat primary bar + category + tags */}
      <div className="hidden space-y-3 sm:block">
        {primaryBar}
        {categoryRow}
        <details className="rounded-lg border border-border/80 px-3 py-2" open={sheetOpen}>
          <summary className="cursor-pointer select-none font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground">
            标签（{allTags.length}）
            {tag ? ` · ${tag}` : ""}
          </summary>
          <div className="mt-3">{tagsBlock}</div>
        </details>
      </div>

      {/* Narrow: primary mark chips + sheet for the rest */}
      <div className="space-y-3 sm:hidden">
        <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {marks.map((item) => (
            <Chip
              key={item.id}
              href={hrefOf(basePath, current, { mark: item.id })}
              active={mark === item.id}
            >
              {item.label}
            </Chip>
          ))}
        </div>
        <details
          className="rounded-xl border border-border/80 bg-card/40 px-3 py-2"
          open={sheetOpen}
        >
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 select-none">
            <span className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              筛选
            </span>
            <span className="font-mono text-[0.7rem] tabular-nums text-muted-foreground">
              {activeCount > 0 ? `${activeCount} 项` : "展开"}
            </span>
          </summary>
          <div className="mt-3 space-y-4 border-t border-border/80 pt-3">
            <div className="space-y-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                难度
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="难度">
                {difficulties.map((item) => (
                  <Chip
                    key={item}
                    href={hrefOf(basePath, current, { difficulty: item })}
                    active={difficulty === item}
                  >
                    {item === "all" ? "全部难度" : difficultyLabel[item]}
                  </Chip>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                排序
              </p>
              <div className="flex flex-wrap gap-2" role="group" aria-label="排序">
                {SORT_CHIPS.map((item) => (
                  <Chip
                    key={item.id}
                    href={hrefOf(basePath, current, { sort: item.id })}
                    active={sort === item.id}
                  >
                    {item.label}
                  </Chip>
                ))}
              </div>
            </div>
            {categoryRow ? (
              <div className="space-y-2">
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                  分类
                </p>
                {categoryRow}
              </div>
            ) : null}
            <div className="space-y-2">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
                标签
              </p>
              {tagsBlock}
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
