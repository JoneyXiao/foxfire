"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export type VirtualItem = {
  index: number;
  start: number;
  size: number;
};

type UseWindowVirtualOptions = {
  count: number;
  /** Fixed row height in px — good enough for IndexRow / table rows. */
  estimateSize: number;
  overscan?: number;
  /** Below this count, render everything (keeps small filtered lists simple). */
  threshold?: number;
};

type Range = { start: number; end: number };

/**
 * Light window-scroll virtualizer — no extra dependency.
 * Attach `containerRef` to the list/table body wrapper; spacers use
 * paddingTop / paddingBottom so document scroll stays smooth on mobile.
 */
export function useWindowVirtual({
  count,
  estimateSize,
  overscan = 10,
  threshold = 40,
}: UseWindowVirtualOptions) {
  const enabled = count >= threshold;
  const containerRef = useRef<HTMLElement | null>(null);
  const [range, setRange] = useState<Range>(() => ({
    start: 0,
    end: Math.min(count, overscan * 2 + 20),
  }));

  const setContainerRef = useCallback((node: HTMLElement | null) => {
    containerRef.current = node;
  }, []);

  useEffect(() => {
    if (!enabled) {
      setRange({ start: 0, end: count });
      return;
    }

    let frame = 0;

    function measure() {
      frame = 0;
      const el = containerRef.current;
      const vh = typeof window !== "undefined" ? window.innerHeight : 800;
      if (!el || estimateSize <= 0 || count <= 0) {
        setRange({ start: 0, end: count });
        return;
      }
      const rect = el.getBoundingClientRect();
      // How far the container top has scrolled above the viewport.
      const scrolled = Math.max(0, -rect.top);
      const start = Math.max(0, Math.floor(scrolled / estimateSize) - overscan);
      const visible = Math.ceil(vh / estimateSize) + overscan * 2;
      const end = Math.min(count, start + visible);
      setRange((prev) =>
        prev.start === start && prev.end === end ? prev : { start, end },
      );
    }

    function onScrollOrResize() {
      if (frame) return;
      frame = window.requestAnimationFrame(measure);
    }

    measure();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [count, enabled, estimateSize, overscan]);

  // Reset window when the list shrinks/grows (filters).
  useEffect(() => {
    if (!enabled) return;
    setRange({ start: 0, end: Math.min(count, overscan * 2 + 20) });
  }, [count, enabled, overscan]);

  const totalSize = count * estimateSize;
  const paddingTop = enabled ? range.start * estimateSize : 0;
  const paddingBottom = enabled
    ? Math.max(0, (count - range.end) * estimateSize)
    : 0;

  const virtualItems: VirtualItem[] = useMemo(() => {
    if (!enabled) {
      const all: VirtualItem[] = [];
      for (let i = 0; i < count; i++) {
        all.push({ index: i, start: i * estimateSize, size: estimateSize });
      }
      return all;
    }
    const items: VirtualItem[] = [];
    for (let i = range.start; i < range.end; i++) {
      items.push({ index: i, start: i * estimateSize, size: estimateSize });
    }
    return items;
  }, [count, enabled, estimateSize, range.end, range.start]);

  return {
    enabled,
    containerRef: setContainerRef,
    virtualItems,
    totalSize,
    paddingTop,
    paddingBottom,
  };
}

/** IndexRow-ish hairline row (badge + title + optional description). */
export const LIST_ROW_ESTIMATE = 72;
/** Compact table row with title + badges. */
export const TABLE_ROW_ESTIMATE = 68;
