"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ListIcon, TableIcon } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IndexRow } from "@/components/IndexRow";
import { QuietEmpty } from "@/components/QuietEmpty";
import { useProgressSets } from "@/components/ProgressButtons";
import {
  LIST_ROW_ESTIMATE,
  TABLE_ROW_ESTIMATE,
  useWindowVirtual,
} from "@/hooks/useWindowVirtual";
import { categoryById, difficultyLabel } from "@/lib/categories";
import {
  PREFS_CHANGED_EVENT,
  patchPrefs,
  readPrefs,
  type ListLayout,
} from "@/lib/prefs";
import type { QuestionSummary } from "@/lib/types";
import { cn } from "@/lib/utils";

type QuestionTableProps = {
  items: QuestionSummary[];
  mark?: string;
  emptyTitle: string;
  emptyBody: string;
  emptyHref?: string;
  emptyAction?: string;
};

export function QuestionTable({
  items,
  mark = "all",
  emptyTitle,
  emptyBody,
  emptyHref = "/",
  emptyAction = "回到题库",
}: QuestionTableProps) {
  const { ready, done, starred } = useProgressSets();
  const [layoutReady, setLayoutReady] = useState(false);
  const [layout, setLayout] = useState<ListLayout>("table");

  useEffect(() => {
    function refresh() {
      setLayout(readPrefs().listLayout);
      setLayoutReady(true);
    }
    refresh();
    window.addEventListener(PREFS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PREFS_CHANGED_EVENT, refresh);
  }, []);

  function setListLayout(next: ListLayout) {
    setLayout(next);
    patchPrefs({ listLayout: next });
  }

  if (!ready) {
    return (
      <div className="space-y-3 py-6" aria-busy="true" aria-live="polite">
        <div className="h-5 w-2/5 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-3/5 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  const visible = items.filter((item) => {
    if (mark === "done") return done.has(item.id);
    if (mark === "open") return !done.has(item.id);
    if (mark === "starred") return starred.has(item.id);
    return true;
  });

  const toolbar = (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <p className="text-sm text-muted-foreground tabular-nums">
        {visible.length} 题
        {layoutReady && layout === "cards" ? " · 列表视图" : null}
        {layoutReady && layout === "table" ? " · 表格视图" : null}
      </p>
      <div
        className="inline-flex rounded-lg border p-0.5"
        role="group"
        aria-label="列表视图"
      >
        <button
          type="button"
          aria-pressed={layout === "table"}
          className={cn(
            buttonVariants({
              variant: layout === "table" ? "secondary" : "ghost",
              size: "sm",
            }),
            "gap-1",
          )}
          onClick={() => setListLayout("table")}
        >
          <TableIcon data-icon="inline-start" />
          表格
        </button>
        <button
          type="button"
          aria-pressed={layout === "cards"}
          className={cn(
            buttonVariants({
              variant: layout === "cards" ? "secondary" : "ghost",
              size: "sm",
            }),
            "gap-1",
          )}
          onClick={() => setListLayout("cards")}
        >
          <ListIcon data-icon="inline-start" />
          列表
        </button>
      </div>
    </div>
  );

  if (visible.length === 0) {
    return (
      <div className="space-y-3">
        {toolbar}
        <QuietEmpty
          label="empty"
          title={emptyTitle}
          body={emptyBody}
          href={emptyHref}
          action={emptyAction}
        />
      </div>
    );
  }

  if (layout === "cards") {
    return (
      <div className="space-y-3">
        {toolbar}
        <VirtualCardList items={visible} done={done} starred={starred} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {toolbar}
      <VirtualTableList items={visible} done={done} starred={starred} />
    </div>
  );
}

type VirtualListProps = {
  items: QuestionSummary[];
  done: Set<string>;
  starred: Set<string>;
};

function VirtualCardList({ items, done, starred }: VirtualListProps) {
  const { containerRef, virtualItems, paddingTop, paddingBottom, enabled } =
    useWindowVirtual({
      count: items.length,
      estimateSize: LIST_ROW_ESTIMATE,
    });

  return (
    <ul
      ref={containerRef}
      className="border-t border-border/80"
      style={enabled ? { paddingTop, paddingBottom } : undefined}
    >
      {virtualItems.map(({ index }) => {
        const item = items[index];
        const category = categoryById(item.category);
        const status = [
          difficultyLabel[item.difficulty],
          done.has(item.id) ? "已练" : "未练",
          starred.has(item.id) ? "收藏" : null,
        ]
          .filter(Boolean)
          .join(" · ");
        return (
          <IndexRow
            key={item.id}
            href={`/questions/${item.id}`}
            badge={String(index + 1).padStart(2, "0")}
            title={item.title}
            description={category?.name}
            meta={status}
            className={enabled ? undefined : "cv-auto"}
          />
        );
      })}
    </ul>
  );
}

function VirtualTableList({ items, done, starred }: VirtualListProps) {
  const { containerRef, virtualItems, paddingTop, paddingBottom, enabled } =
    useWindowVirtual({
      count: items.length,
      estimateSize: TABLE_ROW_ESTIMATE,
    });

  return (
    <div ref={containerRef} className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>题目</TableHead>
            <TableHead className="hidden sm:table-cell">分类</TableHead>
            <TableHead>难度</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {enabled && paddingTop > 0 ? (
            <TableRow aria-hidden="true" className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="border-0 p-0"
                style={{ height: paddingTop }}
              />
            </TableRow>
          ) : null}
          {virtualItems.map(({ index }) => {
            const item = items[index];
            const category = categoryById(item.category);
            return (
              <TableRow
                key={item.id}
                className={enabled ? undefined : "cv-auto"}
              >
                <TableCell className="min-w-0 max-w-[28rem]">
                  <Link
                    href={`/questions/${item.id}`}
                    className="line-clamp-2 font-medium text-pretty text-foreground hover:underline focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    {done.has(item.id) ? (
                      <Badge variant="secondary">已练</Badge>
                    ) : (
                      <span>未练</span>
                    )}
                    {starred.has(item.id) ? (
                      <Badge variant="outline">收藏</Badge>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell className="hidden text-muted-foreground sm:table-cell">
                  {category?.name}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {difficultyLabel[item.difficulty]}
                </TableCell>
              </TableRow>
            );
          })}
          {enabled && paddingBottom > 0 ? (
            <TableRow aria-hidden="true" className="hover:bg-transparent">
              <TableCell
                colSpan={3}
                className="border-0 p-0"
                style={{ height: paddingBottom }}
              />
            </TableRow>
          ) : null}
        </TableBody>
      </Table>
    </div>
  );
}
