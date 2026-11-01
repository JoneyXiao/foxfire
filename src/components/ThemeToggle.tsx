"use client";

import { useEffect, useState } from "react";
import { IconMoon, IconSun } from "@/components/Icons";

type Mode = "light" | "dark";

function readMode(): Mode {
  const attr = document.documentElement.dataset.mode;
  if (attr === "light" || attr === "dark") {
    return attr;
  }
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

export function ThemeToggle() {
  const [mode, setMode] = useState<Mode>("dark");

  useEffect(() => {
    setMode(readMode());
  }, []);

  function toggle() {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.dataset.mode = next;
    window.localStorage.setItem("foxfire-mode", next);
    setMode(next);
  }

  return (
    <button className="mode" type="button" onClick={toggle} aria-pressed={mode === "dark"}>
      {mode === "dark" ? <IconSun /> : <IconMoon />}
    </button>
  );
}
