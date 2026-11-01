"use client";

import { FormEvent, useCallback } from "react";
import { useRouter } from "next/navigation";

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

export function SearchForm({ action = "/search", query = "", autoFocus }: SearchFormProps) {
  const router = useRouter();

  const onSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const next = String(data.get("q") ?? "").trim();
      const params = new URLSearchParams();
      if (next) {
        params.set("q", next);
      }
      const qs = params.toString();
      // router.push paths are app-relative; Next adds basePath.
      const appPath = action.endsWith("/") ? action : `${action}/`;
      router.push(qs ? `${appPath}?${qs}` : appPath);
    },
    [action, router],
  );

  return (
    <form
      className="finder"
      action={withBasePath(action)}
      method="get"
      role="search"
      onSubmit={onSubmit}
    >
      <label className="visually-hidden" htmlFor="q">
        搜索题目
      </label>
      <input
        className="field"
        id="q"
        name="q"
        type="search"
        defaultValue={query}
        placeholder="题干、标签或编号"
        autoComplete="off"
        autoFocus={autoFocus}
      />
      <button className="btn" type="submit">
        搜索
      </button>
    </form>
  );
}
