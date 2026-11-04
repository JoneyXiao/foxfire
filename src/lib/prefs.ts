export const PREFS_KEY = "foxfire-prefs";
export const PREFS_CHANGED_EVENT = "foxfire-prefs-changed";

export type ListLayout = "table" | "cards";

export type UiPrefs = {
  listLayout: ListLayout;
  thinkFirst: boolean;
};

export const defaultPrefs = (): UiPrefs => ({
  listLayout: "table",
  thinkFirst: false,
});

function isListLayout(value: unknown): value is ListLayout {
  return value === "table" || value === "cards";
}

export function readPrefs(): UiPrefs {
  if (typeof window === "undefined") {
    return defaultPrefs();
  }

  try {
    const raw = window.localStorage.getItem(PREFS_KEY);
    if (!raw) {
      // Prefer cards on narrow screens the first time.
      const narrow = window.matchMedia("(max-width: 639px)").matches;
      return {
        listLayout: narrow ? "cards" : "table",
        thinkFirst: false,
      };
    }

    const parsed = JSON.parse(raw) as Partial<UiPrefs>;
    return {
      listLayout: isListLayout(parsed.listLayout) ? parsed.listLayout : "table",
      thinkFirst: Boolean(parsed.thinkFirst),
    };
  } catch {
    return defaultPrefs();
  }
}

export function writePrefs(next: UiPrefs): void {
  window.localStorage.setItem(PREFS_KEY, JSON.stringify(next));
  window.dispatchEvent(new Event(PREFS_CHANGED_EVENT));
}

export function patchPrefs(patch: Partial<UiPrefs>): UiPrefs {
  const next = { ...readPrefs(), ...patch };
  writePrefs(next);
  return next;
}
