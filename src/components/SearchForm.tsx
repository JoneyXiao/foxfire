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

const PRESERVE_KEYS = ["category", "difficulty", "mark", "tag"] as const;

export function SearchForm({ action = "/search", query = "", autoFocus }: SearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const next = String(data.get("q") ?? "").trim();
      const params = new URLSearchParams();
      if (next) params.set("q", next);
      for (const key of PRESERVE_KEYS) {
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
      className="flex w-full flex-col gap-2 sm:flex-row"
      action={withBasePath(action)}
      method="get"
      role="search"
      onSubmit={onSubmit}
    >
      <label className="sr-only" htmlFor="q">
        搜索题目
      </label>
      <Input
        id="q"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="题干、标签或编号"
        autoComplete="off"
        autoFocus={autoFocus}
        className="h-9 flex-1"
      />
      {PRESERVE_KEYS.map((key) => {
        const value = searchParams.get(key);
        return value ? <input key={key} type="hidden" name={key} value={value} /> : null;
      })}
      <Button type="submit" className="sm:w-auto">
        <SearchIcon data-icon="inline-start" />
        搜索
      </Button>
    </form>
  );
}
