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

function applyMode(mode: Mode) {
  document.documentElement.classList.toggle("dark", mode === "dark");
  document.documentElement.dataset.mode = mode;
  window.localStorage.setItem("foxfire-mode", mode);
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    setMode(readMode());
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
      size="icon-sm"
      onClick={toggle}
      aria-pressed={mode === "dark"}
      aria-label={mode === "dark" ? "切换到日间" : "切换到夜间"}
    >
      {mode === "dark" ? <SunIcon /> : <MoonIcon />}
    </Button>
  );
}
