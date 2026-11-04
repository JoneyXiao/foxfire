import type { ProgressState, SrsCard, SrsRating } from "@/lib/types";
import { applyRating, parseSrsMap } from "@/lib/srs";

export const PROGRESS_KEY = "foxfire-progress";
/** v2 adds optional `srs` map; v1 imports still load (srs defaults to {}). */
export const PROGRESS_EXPORT_VERSION = 2;
export const PROGRESS_CHANGED_EVENT = "foxfire-progress-changed";

export type ProgressExportPayload = {
  version: number;
  exportedAt: string;
  done: string[];
  starred: string[];
  srs: Record<string, SrsCard>;
};

export const emptyProgress = (): ProgressState => ({
  done: [],
  starred: [],
  srs: {},
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
      srs: parseSrsMap(parsed.srs),
    };
  } catch {
    return emptyProgress();
  }
}

export function writeProgress(next: ProgressState): void {
  const normalized: ProgressState = {
    done: next.done,
    starred: next.starred,
    srs: next.srs ?? {},
  };
  window.localStorage.setItem(PROGRESS_KEY, JSON.stringify(normalized));
  window.dispatchEvent(new Event(PROGRESS_CHANGED_EVENT));
}

export function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}

/** Rate mastery; also marks the question as done. */
export function rateQuestion(id: string, rating: SrsRating): ProgressState {
  const current = readProgress();
  const previous = current.srs[id];
  const card = applyRating(previous, rating);
  const done = current.done.includes(id) ? current.done : [...current.done, id];
  const next: ProgressState = {
    ...current,
    done,
    srs: {
      ...current.srs,
      [id]: card,
    },
  };
  writeProgress(next);
  return next;
}

export function exportProgressPayload(state?: ProgressState): ProgressExportPayload {
  const progress = state ?? readProgress();
  return {
    version: PROGRESS_EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    done: [...progress.done],
    starred: [...progress.starred],
    srs: { ...progress.srs },
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
    // Accept v1 (no srs) and v2; refuse future majors we don't understand.
    if (obj.version > PROGRESS_EXPORT_VERSION) {
      throw new Error(`备份版本 ${obj.version} 高于本站支持的 ${PROGRESS_EXPORT_VERSION}`);
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
    srs: parseSrsMap(obj.srs),
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
