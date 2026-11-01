"use client";

import Link from "next/link";
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
import { useProgressSets } from "@/components/ProgressButtons";
import { categoryById, difficultyLabel } from "@/lib/categories";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";

type QuestionTableProps = {
  items: Question[];
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

  if (visible.length === 0) {
    return (
      <div className="rounded-xl border bg-card px-6 py-10 text-center">
        <h2 className="font-heading text-base font-medium">{emptyTitle}</h2>
        <p className="mt-2 text-sm text-muted-foreground">{emptyBody}</p>
        <p className="mt-4">
          <Link href={emptyHref} className={cn(buttonVariants())}>
            {emptyAction}
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>题目</TableHead>
            <TableHead className="hidden sm:table-cell">分类</TableHead>
            <TableHead>难度</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.map((item) => {
            const category = categoryById(item.category);
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <Link
                    href={`/questions/${item.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {item.title}
                  </Link>
                  <div className="mt-1 flex flex-wrap gap-1.5 text-xs text-muted-foreground">
                    {done.has(item.id) ? (
                      <Badge variant="secondary">已练</Badge>
                    ) : (
                      <span>未练</span>
                    )}
                    {starred.has(item.id) ? <Badge variant="outline">收藏</Badge> : null}
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
        </TableBody>
      </Table>
    </div>
  );
}
