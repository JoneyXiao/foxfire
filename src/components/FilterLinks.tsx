import Link from "next/link";
import { categories, difficultyLabel } from "@/lib/categories";
import type { Difficulty } from "@/lib/types";

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
  if (next.q) {
    params.set("q", next.q);
  }
  if (next.category && next.category !== "all") {
    params.set("category", next.category);
  }
  if (next.difficulty && next.difficulty !== "all") {
    params.set("difficulty", next.difficulty);
  }
  if (next.mark && next.mark !== "all") {
    params.set("mark", next.mark);
  }
  const text = params.toString();
  return text ? `${basePath}?${text}` : basePath;
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
    <div>
      {showCategory ? (
        <div className="filters" role="group" aria-label="分类">
          <Link
            className="chip"
            href={hrefOf(basePath, current, { category: "all" })}
            aria-current={category === "all" ? "page" : undefined}
          >
            全部分类
          </Link>
          {categories.map((item) => (
            <Link
              key={item.id}
              className="chip"
              href={hrefOf("/search", current, { category: item.id })}
              aria-current={category === item.id ? "page" : undefined}
            >
              {item.name}
            </Link>
          ))}
        </div>
      ) : null}
      <div className="filters" role="group" aria-label="难度">
        {difficulties.map((item) => (
          <Link
            key={item}
            className="chip"
            href={hrefOf(basePath, current, { difficulty: item })}
            aria-current={difficulty === item ? "page" : undefined}
          >
            {item === "all" ? "全部难度" : difficultyLabel[item]}
          </Link>
        ))}
      </div>
      <div className="filters" role="group" aria-label="进度">
        {marks.map((item) => (
          <Link
            key={item.id}
            className="chip"
            href={hrefOf(basePath, current, { mark: item.id })}
            aria-current={mark === item.id ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
