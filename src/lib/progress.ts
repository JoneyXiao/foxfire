import type { ProgressState } from "@/lib/types";

export const PROGRESS_KEY = "foxfire-progress";

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
}

export function toggleId(list: string[], id: string): string[] {
  return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
