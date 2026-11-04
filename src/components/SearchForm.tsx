"use client";

import { FormEvent, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SearchFormProps = {
  action?: string;
  query?: string;
  autoFocus?: boolean;
};

function withBasePath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const withSlash = normalized.endsWith("/") ? normalized : `${normalized}/`;
  return `${base}${withSlash}`;
}

const PRESERVE_KEYS = ["category", "difficulty", "mark", "tag", "sort", "answers"] as const;

export function SearchForm({ action = "/search", query = "", autoFocus }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const answersOn = searchParams.get("answers") === "1";

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const next = String(data.get("q") ?? "").trim();
      const includeAnswers = data.get("answers") === "1";
      const params = new URLSearchParams();
      if (next) params.set("q", next);
      if (includeAnswers) params.set("answers", "1");
      for (const key of PRESERVE_KEYS) {
        if (key === "answers") continue;
        const value = searchParams.get(key);
        if (value) params.set(key, value);
      }
      const qs = params.toString();
      const appPath = action.endsWith("/") ? action : `${action}/`;
      router.push(qs ? `${appPath}?${qs}` : appPath);
    },
    [action, router, searchParams],
  );

  return (
    <form
      className="flex w-full flex-col gap-2"
      action={withBasePath(action)}
      method="get"
      role="search"
      onSubmit={onSubmit}
    >
      <div className="flex w-full flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor="q">
          搜索题目
        </label>
        <Input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder={
            answersOn ? "题干、标签、编号或参考作答关键词…" : "题干、标签或编号…"
          }
          autoComplete="off"
          autoFocus={autoFocus}
          className="h-9 flex-1"
        />
        {PRESERVE_KEYS.filter((key) => key !== "answers").map((key) => {
          const value = searchParams.get(key);
          return value ? <input key={key} type="hidden" name={key} value={value} /> : null;
        })}
        <Button type="submit" className="sm:w-auto">
          <SearchIcon data-icon="inline-start" />
          搜索
        </Button>
      </div>
      <label className="flex items-center gap-2 text-sm text-muted-foreground">
        <input
          type="checkbox"
          name="answers"
          value="1"
          defaultChecked={answersOn}
          className="size-4 rounded border-border accent-primary"
        />
        <span>
          同时搜参考作答关键词
          <span className="ml-1 text-xs opacity-80">（可选，首次勾选会加载检索索引）</span>
        </span>
      </label>
    </form>
  );
}
