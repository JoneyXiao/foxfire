"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { MicIcon, PlayIcon } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { questions } from "@/data/questions";
import { categories, difficultyLabel } from "@/lib/categories";
import { buildSessionQuestions } from "@/lib/practice";
import {
  createMockSession,
  MOCK_DURATIONS,
  readMockSession,
  writeMockSession,
  type MockDurationMinutes,
  type MockFilters,
} from "@/lib/mock";
import type { CategoryId, Difficulty } from "@/lib/types";
import { cn } from "@/lib/utils";

const COUNT_PRESETS = [3, 5, 8, 10] as const;

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
        "inline-flex h-8 items-center rounded-lg border px-2.5 text-sm transition-colors",
        active
          ? "border-transparent bg-primary text-primary-foreground"
          : "border-border bg-background hover:bg-muted",
      )}
    >
      {children}
    </button>
  );
}

export function MockSetup() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [active, setActive] = useState<ReturnType<typeof readMockSession>>(null);
  const [category, setCategory] = useState<CategoryId | "all">("all");
  const [difficulty, setDifficulty] = useState<Difficulty | "all">("all");
  const [count, setCount] = useState(5);
  const [durationMinutes, setDurationMinutes] = useState<MockDurationMinutes>(20);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setActive(readMockSession());
    setReady(true);
  }, []);

  const poolSize = useMemo(() => {
    if (!ready) return 0;
    return buildSessionQuestions(questions, Number.MAX_SAFE_INTEGER, {
      category,
      difficulty,
      unpracticedOnly: false,
    }).length;
  }, [ready, category, difficulty]);

  const effectiveCount = Math.min(Math.max(1, count), Math.max(1, poolSize || 1));

  function startMock() {
    setError(null);
    if (active?.status === "active") {
      const ok = window.confirm("已有进行中的模拟面试，开始新场会覆盖它。确定继续？");
      if (!ok) return;
    }
    if (poolSize === 0) {
      setError("当前筛选下没有题目，请调整分类或难度。");
      return;
    }
    const picked = buildSessionQuestions(questions, effectiveCount, {
      category,
      difficulty,
      unpracticedOnly: false,
    });
    if (picked.length === 0) {
      setError("未能抽题，请重试。");
      return;
    }
    const filters: MockFilters = {
      category,
      difficulty,
      count: picked.length,
      durationMinutes,
    };
    const session = createMockSession(
      picked.map((item) => item.id),
      filters,
    );
    writeMockSession(session);
    router.push("/mock/run");
  }

  function resumeMock() {
    if (!active || active.status !== "active") return;
    router.push("/mock/run");
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
    <div className="space-y-8">
      {active?.status === "active" ? (
        <section className="space-y-3 border-y border-border/80 py-4">
          <p className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            进行中
          </p>
          <p className="font-mono text-lg tabular-nums tracking-tight">
            {active.index + 1}
            <span className="text-muted-foreground"> / {active.questionIds.length}</span>
            <span className="ml-3 text-sm text-muted-foreground">
              计划 {active.filters.durationMinutes} 分钟
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            <Button type="button" className="min-h-11" onClick={resumeMock}>
              继续模拟
            </Button>
            <Link
              href="/mock/summary"
              className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}
            >
              查看小结
            </Link>
          </div>
        </section>
      ) : null}

      {active?.status === "finished" ? (
        <p className="text-sm text-muted-foreground">
          上一场模拟已结束，可在{" "}
          <Link href="/mock/summary" className="underline-offset-2 hover:underline">
            小结页
          </Link>{" "}
          回顾，或再开一场。
        </p>
      ) : null}

      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            开一场模拟
          </h2>
          <p className="text-sm text-muted-foreground">
            三步：定时长 → 筛分类/难度与题量 → 开始。限时口述，结束后对照要点自检。
          </p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">1 · 时长</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="时长">
            {MOCK_DURATIONS.map((mins) => (
              <Chip
                key={mins}
                active={durationMinutes === mins}
                onClick={() => setDurationMinutes(mins)}
              >
                {mins} 分钟
              </Chip>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">2 · 分类与难度</p>
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
          <div className="flex flex-wrap gap-2 pt-1" role="group" aria-label="难度">
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
          <p className="text-sm font-medium">3 · 题量</p>
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
                className="w-20 font-mono tabular-nums"
                aria-label="自定义题量"
              />
            </label>
          </div>
          <p className="font-mono text-[0.7rem] tabular-nums tracking-tight text-muted-foreground">
            候选 {poolSize}
            {poolSize > 0 ? ` · 抽取 ${Math.min(effectiveCount, poolSize)}` : null}
          </p>
        </div>

        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <MicIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          录音可选：仅保存在本机内存，拒绝麦克风也能继续口述自检。
        </p>

        {error ? (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="button"
          size="lg"
          className="min-h-11"
          disabled={poolSize === 0}
          onClick={startMock}
        >
          <PlayIcon data-icon="inline-start" />
          开始模拟
        </Button>
      </section>

      <p className="text-sm text-muted-foreground">
        想无计时连续刷？去{" "}
        <Link href="/practice" className="underline-offset-2 hover:underline">
          练习会话
        </Link>
        。
      </p>
    </div>
  );
}
