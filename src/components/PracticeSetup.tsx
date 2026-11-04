"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PlayIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { questions } from "@/data/questions";
import { categories, difficultyLabel, isCategoryId } from "@/lib/categories";
import { buildSessionQuestions } from "@/lib/practice";
import { PROGRESS_CHANGED_EVENT, readProgress } from "@/lib/progress";
import {
  createSession,
  currentQuestionId,
  readSession,
  writeSession,
  type SessionFilters,
} from "@/lib/session";
import { DIFFICULTIES, type CategoryId, type Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

const COUNT_PRESETS = [5, 10, 15, 20] as const;

type ChipProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function Chip({ active, onClick, children }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex h-7 items-center rounded-lg border px-2.5 text-sm transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

function categoryFromParams(params: URLSearchParams): CategoryId | "all" {
  const value = params.get("category");
  return value && isCategoryId(value) ? value : "all";
}

function difficultyFromParams(params: URLSearchParams): Difficulty | "all" {
  const value = params.get("difficulty");
  return value && (DIFFICULTIES as readonly string[]).includes(value)
    ? (value as Difficulty)
    : "all";
}

function unpracticedFromParams(params: URLSearchParams): boolean {
  const value = params.get("unpracticed");
  if (value === "0" || value === "false") {
    return false;
  }
  if (value === "1" || value === "true") {
    return true;
  }
  return true;
}

function countFromParams(params: URLSearchParams): number {
  const value = params.get("count");
  if (!value) {
    return 10;
  }
  const n = Number.parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : 10;
}

export function PracticeSetup() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState<string[]>([]);
  const [activeSession, setActiveSession] = useState<ReturnType<typeof readSession>>(null);
  const [category, setCategory] = useState<CategoryId | "all">(() =>
    categoryFromParams(searchParams),
  );
  const [difficulty, setDifficulty] = useState<Difficulty | "all">(() =>
    difficultyFromParams(searchParams),
  );
  const [unpracticedOnly, setUnpracticedOnly] = useState(() =>
    unpracticedFromParams(searchParams),
  );
  const [count, setCount] = useState(() => countFromParams(searchParams));
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function refresh() {
      setDone(readProgress().done);
      setActiveSession(readSession());
      setReady(true);
    }
    refresh();
    window.addEventListener(PROGRESS_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(PROGRESS_CHANGED_EVENT, refresh);
  }, []);

  const poolSize = useMemo(() => {
    if (!ready) {
      return 0;
    }
    return buildSessionQuestions(questions, Number.MAX_SAFE_INTEGER, {
      category,
      difficulty,
      unpracticedOnly,
      done,
    }).length;
  }, [ready, category, difficulty, unpracticedOnly, done]);

  const effectiveCount = Math.min(Math.max(1, count), Math.max(1, poolSize || 1));

  function startSession() {
    setError(null);
    if (activeSession?.status === "active") {
      const ok = window.confirm("已有进行中的会话，开始新会话会覆盖它。确定继续？");
      if (!ok) {
        return;
      }
    }
    if (poolSize === 0) {
      setError(
        unpracticedOnly
          ? "当前筛选下没有未练题目。可取消「仅未练」或换分类/难度。"
          : "当前筛选下没有题目，请调整分类或难度。",
      );
      return;
    }

    const picked = buildSessionQuestions(questions, effectiveCount, {
      category,
      difficulty,
      unpracticedOnly,
      done,
    });
    if (picked.length === 0) {
      setError("未能生成会话题目，请重试。");
      return;
    }

    const filters: SessionFilters = {
      category,
      difficulty,
      unpracticedOnly,
      count: picked.length,
    };
    const session = createSession(
      picked.map((item) => item.id),
      filters,
    );
    writeSession(session);
    const first = currentQuestionId(session);
    if (!first) {
      setError("会话为空，无法开始。");
      return;
    }
    router.push(`/questions/${first}`);
  }

  function resumeSession() {
    if (!activeSession || activeSession.status !== "active") {
      return;
    }
    const id = currentQuestionId(activeSession);
    if (id) {
      router.push(`/questions/${id}`);
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
      {activeSession?.status === "active" ? (
        <Card size="sm">
          <CardHeader>
            <CardTitle>进行中的会话</CardTitle>
            <CardDescription>
              第 {activeSession.index + 1} / {activeSession.questionIds.length} 题
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button type="button" onClick={resumeSession}>
              继续会话
            </Button>
            <Link
              href="/practice/summary"
              className={buttonVariants({ variant: "outline" })}
            >
              查看小结
            </Link>
          </CardContent>
        </Card>
      ) : null}

      {activeSession?.status === "finished" ? (
        <p className="text-sm text-muted-foreground">
          上一场会话已结束，可在{" "}
          <Link href="/practice/summary" className="underline-offset-2 hover:underline">
            小结页
          </Link>{" "}
          回顾，或再开一场。
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>开一场练习</CardTitle>
          <CardDescription>
            按分类、难度和未练筛选后随机抽 N 题；不强制先作答，可随时展开参考作答。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-2">
            <p className="text-sm font-medium">分类</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="分类">
              <Chip active={category === "all"} onClick={() => setCategory("all")}>
                全部分类
              </Chip>
              {categories.map((item) => (
                <Chip
                  key={item.id}
                  active={category === item.id}
                  onClick={() => setCategory(item.id)}
                >
                  {item.name}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">难度</p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="难度">
              <Chip active={difficulty === "all"} onClick={() => setDifficulty("all")}>
                全部难度
              </Chip>
              {(Object.keys(difficultyLabel) as Difficulty[]).map((item) => (
                <Chip
                  key={item}
                  active={difficulty === item}
                  onClick={() => setDifficulty(item)}
                >
                  {difficultyLabel[item]}
                </Chip>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">范围</p>
            <div className="flex flex-wrap gap-2">
              <Chip
                active={unpracticedOnly}
                onClick={() => setUnpracticedOnly(true)}
              >
                仅未练
              </Chip>
              <Chip
                active={!unpracticedOnly}
                onClick={() => setUnpracticedOnly(false)}
              >
                含已练
              </Chip>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">题量</p>
            <div className="flex flex-wrap items-center gap-2">
              {COUNT_PRESETS.map((n) => (
                <Chip key={n} active={count === n} onClick={() => setCount(n)}>
                  {n} 题
                </Chip>
              ))}
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                自定义
                <Input
                  type="number"
                  min={1}
                  max={Math.max(poolSize, 1)}
                  value={count}
                  onChange={(event) => {
                    const next = Number(event.target.value);
                    if (Number.isFinite(next)) {
                      setCount(Math.max(1, Math.floor(next)));
                    }
                  }}
                  className="w-20"
                  aria-label="自定义题量"
                />
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              候选 {poolSize} 题
              {poolSize > 0 ? ` · 将抽取 ${Math.min(effectiveCount, poolSize)} 题` : null}
            </p>
          </div>

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}

          <Button type="button" size="lg" disabled={poolSize === 0} onClick={startSession}>
            <PlayIcon data-icon="inline-start" />
            开始练习
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
