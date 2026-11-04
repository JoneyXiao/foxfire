import type { ProgressState } from "@/lib/types";

export const PROGRESS_KEY = "foxfire-progress";
export const PROGRESS_EXPORT_VERSION = 1;
export const PROGRESS_CHANGED_EVENT = "foxfire-progress-changed";

export type ProgressExportPayload = {
  version: number;
  exportedAt: string;
  done: string[];
  starred: string[];
};

export const emptyProgress = (): ProgressState => ({
  done: [],
  starred: [],
});

export function readProgress(): ProgressState {
  if (typeof window === "undefined") {
    return emptyProgress();
  }

  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    if (!raw) {
      return emptyProgress();
    }

    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      done: Array.isArray(parsed.done) ? parsed.done.filter((id) => typeof id === "string") : [],
      starred: Array.isArray(parsed.starred)
        ? parsed.starred.filter((id) => typeof id === "string")
        : [],
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(next: ProgressState): void {
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT));
}

export function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

export function exportProgressPayload(state?: ProgressState): ProgressExportPayload {
  const progress = state ?? readProgress();
  return {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    done: [...progress.done],
    starred: [...progress.starred],
  };
}

export function parseProgressImport(raw: unknown): ProgressState {
  if (raw === null || typeof raw !== "object" || Array.isArray(raw)) {
    throw new Error("格式无效：需要包含 done / starred 的对象");
  }

  const obj = raw as Record<string, unknown>;

  if ("version" in obj && obj.version !== undefined && obj.version !== null) {
    if (typeof obj.version !== "number" || !Number.isFinite(obj.version) || obj.version < 1) {
      throw new Error("不支持的备份版本");
    }
  }

  if (!("done" in obj) || !("starred" in obj)) {
    throw new Error("缺少 done 或 starred 字段");
  }

  if (!Array.isArray(obj.done) || !Array.isArray(obj.starred)) {
    throw new Error("done / starred 必须是数组");
  }

  return {
    done: obj.done.filter((id): id is string => typeof id === "string"),
    starred: obj.starred.filter((id): id is string => typeof id === "string"),
  };
}

function todayStamp(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function downloadProgressJson(filename?: string): void {
  const payload = exportProgressPayload();
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename ?? `foxfire-progress-${todayStamp()}.json`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

export async function importProgressFromText(text: string): Promise<ProgressState> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("不是有效的 JSON");
  }
  const state = parseProgressImport(parsed);
  writeProgress(state);
  return state;
}

export async function importProgressFromFile(file: File): Promise<ProgressState> {
  const text = await file.text();
  return importProgressFromText(text);
}
