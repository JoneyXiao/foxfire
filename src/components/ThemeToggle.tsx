"use client";

import { useEffect, useState } from "react";
import { MoonIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Mode = "light" | "dark";

function readMode(): Mode {
  if (document.documentElement.classList.contains("dark")) return "dark";
  const attr = document.documentElement.dataset.mode;
  if (attr === "light" || attr === "dark") return attr;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

const THEME_COLORS: Record<Mode, string> = {
  dark: "#0B0B0B",
  light: "#F7F6F3",
};

function syncThemeColor(mode: Mode) {
  const color = THEME_COLORS[mode];
  let meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.setAttribute("name", "theme-color");
    document.head.appendChild(meta);
  }
  meta.setAttribute("content", color);
}

function applyMode(mode: Mode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.dataset.mode = mode;
  window.localStorage.setItem("foxfire-mode", mode);
  syncThemeColor(mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    const current = readMode();
    setMode(current);
    syncThemeColor(current);
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    applyMode(next);
    setMode(next);
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      className="size-11"
      onClick={toggle}
      aria-pressed={mode === "dark"}
      aria-label={mode === "dark" ? "切换到日间" : "切换到夜间"}
    >
      {mode === "dark" ? <SunIcon aria-hidden="true" /> : <MoonIcon aria-hidden="true" />}
    </Button>
  );
}
