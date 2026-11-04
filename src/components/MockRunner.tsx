"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckSquareIcon,
  FlagIcon,
  MicIcon,
  MicOffIcon,
  SkipForwardIcon,
  SquareIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { questions } from "@/data/questions";
import { checklistById } from "@/data/generated/checklist-index";
import { categoryById, difficultyLabel } from "@/lib/categories";
import { CHECKLIST_SOURCE_LABEL, flattenChecklist } from "@/lib/checklist";
import {
  currentMockQuestionId,
  elapsedSeconds,
  finishMockSession,
  formatClock,
  isLastMockQuestion,
  MOCK_CHANGED_EVENT,
  patchMockResult,
  plannedSeconds,
  readMockSession,
  remainingSeconds,
  setMockIndex,
  writeMockSession,
  type MockSession,
} from "@/lib/mock";
import { cn } from "@/lib/utils";

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg",
  ];
  return candidates.find((type) => MediaRecorder.isTypeSupported(type));
}

export function MockRunner() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<MockSession | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [recording, setRecording] = useState(false);
  const [recordError, setRecordError] = useState<string | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const questionStartedAtRef = useRef<number>(Date.now());

  const refresh = useCallback(() => {
    const current = readMockSession();
    setSession(current);
    setReady(true);
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(MOCK_CHANGED_EVENT, refresh);
    return () => window.removeEventListener(MOCK_CHANGED_EVENT, refresh);
  }, [refresh]);

  useEffect(() => {
    const id = window.setInterval(() => setNowMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const questionId = session ? currentMockQuestionId(session) : undefined;
  const question = useMemo(
    () => (questionId ? questions.find((item) => item.id === questionId) : undefined),
    [questionId],
  );

  const checklist = useMemo(
    () =>
      questionId
        ? flattenChecklist(questionId, checklistById[questionId as keyof typeof checklistById])
        : [],
    [questionId],
  );

  const result = questionId && session ? session.results[questionId] : undefined;

  // Accumulate time spent when leaving the current question (not every second).
  useEffect(() => {
    if (!session || session.status !== "active" || !questionId) return;
    questionStartedAtRef.current = Date.now();
    const activeId = questionId;
    return () => {
      const current = readMockSession();
      if (!current || !activeId) return;
      const delta = Math.max(
        0,
        Math.floor((Date.now() - questionStartedAtRef.current) / 1000),
      );
      if (delta <= 0) return;
      const prev = current.results[activeId];
      writeMockSession(
        patchMockResult(current, activeId, {
          secondsSpent: (prev?.secondsSpent ?? 0) + delta,
        }),
      );
    };
  }, [session?.id, questionId, session?.status]);

  function stopTracks() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function revokeAudio() {
    setAudioUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== "inactive") {
      recorder.stop();
    }
    setRecording(false);
  }, []);

  // Stop recording + revoke blob when leaving a question.
  useEffect(() => {
    return () => {
      stopRecording();
      stopTracks();
      revokeAudio();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

  async function startRecording() {
    setRecordError(null);
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setRecordError("当前浏览器不支持录音，可继续口述并对照要点。");
      return;
    }
    if (typeof MediaRecorder === "undefined") {
      setRecordError("当前浏览器不支持 MediaRecorder，已跳过录音。");
      return;
    }
    try {
      revokeAudio();
      chunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const mimeType = pickMimeType();
      const recorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data);
      };
      recorder.onstop = () => {
        stopTracks();
        const blob = new Blob(chunksRef.current, {
          type: recorder.mimeType || "audio/webm",
        });
        chunksRef.current = [];
        if (blob.size > 0) {
          const url = URL.createObjectURL(blob);
          setAudioUrl(url);
          const current = readMockSession();
          const id = current ? currentMockQuestionId(current) : undefined;
          if (current && id) {
            writeMockSession(patchMockResult(current, id, { recorded: true }));
          }
        }
        setRecording(false);
      };
      recorder.start();
      setRecording(true);
    } catch {
      stopTracks();
      setRecording(false);
      setRecordError("无法使用麦克风（已拒绝或不可用）。仍可口述并对照要点自检。");
    }
  }

  function revealChecklist() {
    if (!session || !questionId) return;
    writeMockSession(patchMockResult(session, questionId, { revealed: true }));
  }

  function toggleChecked(itemId: string) {
    if (!session || !questionId) return;
    const prev = session.results[questionId]?.checked ?? [];
    const next = prev.includes(itemId)
      ? prev.filter((id) => id !== itemId)
      : [...prev, itemId];
    writeMockSession(patchMockResult(session, questionId, { checked: next }));
  }

  function endMock(opts?: { skipConfirm?: boolean }) {
    if (!opts?.skipConfirm) {
      const ok = window.confirm("确定结束本场模拟面试并查看小结？");
      if (!ok) {
        return;
      }
    }
    stopRecording();
    const current = readMockSession();
    if (!current) {
      router.push("/mock/summary");
      return;
    }
    writeMockSession(finishMockSession(current));
    router.push("/mock/summary");
  }

  function goNext() {
    stopRecording();
    const current = readMockSession();
    if (!current || current.status !== "active") return;
    if (isLastMockQuestion(current)) {
      endMock({ skipConfirm: true });
      return;
    }
    writeMockSession(setMockIndex(current, current.index + 1));
  }

  if (!ready) {
    return (
      <div className="space-y-3 py-6" aria-busy="true">
        <div className="h-5 w-1/3 animate-pulse rounded-md bg-muted" />
        <div className="h-4 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  if (!session) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>还没有模拟场次</CardTitle>
          <CardDescription>先配置时长与题量，再开始口述练习。</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/mock" className={buttonVariants()}>
            去开一场
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (session.status === "finished") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>本场已结束</CardTitle>
          <CardDescription>可查看小结，或回到设置页再开一场。</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Link href="/mock/summary" className={buttonVariants()}>
            查看小结
          </Link>
          <Link href="/mock" className={buttonVariants({ variant: "outline" })}>
            模拟设置
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (!question || !questionId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>题目缺失</CardTitle>
          <CardDescription>本场题目无法加载，请重新开一场。</CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/mock" className={buttonVariants()}>
            返回设置
          </Link>
        </CardContent>
      </Card>
    );
  }

  const remain = remainingSeconds(session.endsAt, nowMs);
  const elapsed = elapsedSeconds(session, nowMs);
  const planned = plannedSeconds(session);
  const overtime = remain === 0 && elapsed >= planned;
  const position = session.index + 1;
  const total = session.questionIds.length;
  const last = isLastMockQuestion(session);
  const category = categoryById(question.category);
  const checked = new Set(result?.checked ?? []);
  const revealed = Boolean(result?.revealed);

  return (
    <div className="space-y-6">
      <div
        className={cn(
          "sticky top-14 z-30 -mx-4 border-b px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6",
          overtime ? "border-destructive/40 bg-destructive/10" : "bg-background/95",
        )}
      >
        <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-between gap-3">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              模拟面试 ·{" "}
              <span className="tabular-nums">
                {position} / {total}
              </span>
            </p>
            <p
              className={cn(
                "font-outlier text-2xl tabular-nums tracking-tight",
                overtime ? "text-destructive" : "text-foreground",
              )}
              aria-live="polite"
            >
              {overtime ? `超时 +${formatClock(elapsed - planned)}` : formatClock(remain)}
            </p>
            <p className="text-xs text-muted-foreground">
              计划 {session.filters.durationMinutes} 分钟 · 已用 {formatClock(elapsed)}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => endMock()}>
              <FlagIcon data-icon="inline-start" />
              结束模拟
            </Button>
            <Button type="button" size="sm" onClick={goNext}>
              <SkipForwardIcon data-icon="inline-start" />
              {last ? "完成并查看小结" : "下一题"}
            </Button>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader className="space-y-3">
          <CardTitle className="text-pretty text-xl leading-snug sm:text-2xl">{question.title}</CardTitle>
          <CardDescription className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{category?.name}</Badge>
            <Badge variant="outline">{difficultyLabel[question.difficulty]}</Badge>
            <Badge variant="outline">{question.id}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="leading-relaxed whitespace-pre-wrap">{question.prompt}</p>
          <p className="text-sm text-muted-foreground">
            先口述作答（可录音），想清楚后再展开对照要点。本题不展示完整参考作答。
          </p>
        </CardContent>
      </Card>

      <Card size="sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <MicIcon className="size-4" aria-hidden="true" />
            可选录音
          </CardTitle>
          <CardDescription>
            录音仅保存在当前页面内存，切换题目或离开后会释放；不会写入进度备份。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {recording ? (
              <Button type="button" variant="destructive" onClick={stopRecording}>
                <SquareIcon data-icon="inline-start" />
                停止录音
              </Button>
            ) : (
              <Button type="button" variant="outline" onClick={startRecording}>
                <MicIcon data-icon="inline-start" />
                开始录音
              </Button>
            )}
            {audioUrl ? (
              <span className="inline-flex items-center text-sm text-muted-foreground">
                已录本机片段 · 可回放
              </span>
            ) : null}
          </div>
          {audioUrl ? (
            // eslint-disable-next-line jsx-a11y/media-has-caption -- local self-recording blob, no captions
            <audio
              controls
              src={audioUrl}
              className="w-full max-w-md"
              aria-label="本机录音回放"
            />
          ) : null}
          {recordError ? (
            <p className="flex items-start gap-2 text-sm text-muted-foreground" role="status">
              <MicOffIcon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              {recordError}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <CheckSquareIcon className="size-4" aria-hidden="true" />
            对照要点
          </CardTitle>
          <CardDescription>
            来自本题面试金句、知识点与答案要点；勾选你已口述覆盖的条目。
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!revealed ? (
            <Button type="button" onClick={revealChecklist}>
              展开自检 checklist
            </Button>
          ) : (
            <ul className="space-y-3">
              {checklist.length === 0 ? (
                <li className="text-sm text-muted-foreground">
                  本题暂无结构化要点，可到题目页查看完整参考作答。
                </li>
              ) : (
                checklist.map((item) => {
                  const isOn = checked.has(item.id);
                  return (
                    <li key={item.id}>
                      <label className="flex cursor-pointer gap-3 rounded-xl border bg-card px-3 py-3 hover:bg-muted/40">
                        <input
                          type="checkbox"
                          className="mt-1 size-4 shrink-0"
                          checked={isOn}
                          onChange={() => toggleChecked(item.id)}
                        />
                        <span className="space-y-1">
                          <span className="block text-xs text-muted-foreground">
                            {CHECKLIST_SOURCE_LABEL[item.source]}
                          </span>
                          <span className="block text-sm leading-relaxed">{item.text}</span>
                        </span>
                      </label>
                    </li>
                  );
                })
              )}
            </ul>
          )}
          {revealed && checklist.length > 0 ? (
            <p className="text-sm text-muted-foreground">
              已勾选{" "}
              <span className="tabular-nums">
                {checked.size} / {checklist.length}
              </span>
              {" · "}
              <Link
                href={`/questions/${question.id}`}
                className="underline-offset-2 hover:underline"
                target="_blank"
              >
                打开完整题目页
              </Link>
            </p>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
