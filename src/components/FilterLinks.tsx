import Link from "next/link";
import { badgeVariants } from "@/components/ui/badge";
import { categories, difficultyLabel } from "@/lib/categories";
import type { Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

type FilterLinksProps = {
  basePath: string;
  query?: string;
  category?: string;
  difficulty?: string;
  mark?: string;
  showCategory?: boolean;
};

function hrefOf(
  basePath: string,
  current: { q?: string; category?: string; difficulty?: string; mark?: string },
  patch: Record<string, string | undefined>,
) {
  const params = new URLSearchParams();
  const next = { ...current, ...patch };
  if (next.q) params.set("q", next.q);
  if (next.category && next.category !== "all") params.set("category", next.category);
  if (next.difficulty && next.difficulty !== "all") params.set("difficulty", next.difficulty);
  if (next.mark && next.mark !== "all") params.set("mark", next.mark);
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
      className={cn(badgeVariants({ variant: active ? "default" : "outline" }), "h-7 px-2.5")}
    >
      {children}
    </Link>
  );
}

export function FilterLinks({
  basePath,
  query,
  category = "all",
  difficulty = "all",
  mark = "all",
  showCategory = true,
}: FilterLinksProps) {
  const current = { q: query, category, difficulty, mark };
  const difficulties: Array<Difficulty | "all"> = ["all", "foundation", "applied", "system"];
  const marks = [
    { id: "all", label: "全部" },
    { id: "open", label: "未练" },
    { id: "done", label: "已练" },
    { id: "starred", label: "收藏" },
  ];

  return (
    <div className="space-y-3">
      {showCategory ? (
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
      ) : null}
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
      <div className="flex flex-wrap gap-2" role="group" aria-label="进度">
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
    </div>
  );
}
