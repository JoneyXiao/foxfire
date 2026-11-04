"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DownloadIcon, UploadIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { badgeVariants } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuestionTable } from "@/components/QuestionTable";
import { useProgressSets } from "@/components/ProgressButtons";
import { questions, totalQuestions } from "@/data/questions";
import { downloadProgressJson, importProgressFromFile } from "@/lib/progress";
import { cn } from "@/lib/utils";

export function ProgressPanel() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") === "starred" ? "starred" : "done";
  const { ready, done, starred } = useProgressSets();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [importBusy, setImportBusy] = useState(false);
  const doneItems = questions.filter((item) => done.has(item.id));
  const starredItems = questions.filter((item) => starred.has(item.id));

  function handleExport() {
    setImportError(null);
    downloadProgressJson();
  }

  function handleImportClick() {
    setImportError(null);
    fileInputRef.current?.click();
  }

  async function handleImportFile(file: File | undefined) {
    if (!file) {
      return;
    }

    const confirmed = window.confirm(
      "导入会覆盖本机当前的已练与收藏进度，确定继续？",
    );
    if (!confirmed) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setImportBusy(true);
    setImportError(null);
    try {
      await importProgressFromFile(file);
    } catch (error) {
      const message = error instanceof Error ? error.message : "导入失败";
      setImportError(message);
    } finally {
      setImportBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  if (!ready) {
    return (
      <div className="space-y-3 py-6" aria-busy="true">
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>已练</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">
              {done.size}
              <span className="ml-2 text-sm font-normal text-muted-foreground">/ {totalQuestions}</span>
            </p>
          </CardContent>
        </Card>
        <Card size="sm">
          <CardHeader>
            <CardTitle>收藏</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-medium tabular-nums">{starred.size}</p>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>备份与恢复</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            进度只保存在本机。可导出 JSON 备份，或导入后覆盖当前进度。
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" onClick={handleExport}>
              <DownloadIcon data-icon="inline-start" />
              导出进度
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleImportClick}
              disabled={importBusy}
            >
              <UploadIcon data-icon="inline-start" />
              {importBusy ? "导入中…" : "导入进度"}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              className="sr-only"
              aria-label="选择进度 JSON 文件"
              onChange={(event) => {
                void handleImportFile(event.target.files?.[0]);
              }}
            />
          </div>
          {importError ? (
            <p className="text-sm text-destructive" role="alert">
              {importError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-2" role="tablist" aria-label="进度列表">
        <Link
          href="/progress?tab=done"
          aria-current={tab === "done" ? "page" : undefined}
          className={cn(badgeVariants({ variant: tab === "done" ? "default" : "outline" }), "h-7 px-2.5")}
        >
          已练
        </Link>
        <Link
          href="/progress?tab=starred"
          aria-current={tab === "starred" ? "page" : undefined}
          className={cn(
            badgeVariants({ variant: tab === "starred" ? "default" : "outline" }),
            "h-7 px-2.5",
          )}
        >
          收藏
        </Link>
      </div>
      {tab === "done" ? (
        <QuestionTable
          items={doneItems}
          emptyTitle="还没有练过"
          emptyBody="从题库打开一题，对照参考作答后标为已练。"
        />
      ) : (
        <QuestionTable
          items={starredItems}
          emptyTitle="还没有收藏"
          emptyBody="在题目页点收藏，回头只看要复盘的几道。"
        />
      )}
    </div>
  );
}
