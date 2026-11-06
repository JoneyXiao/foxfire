import type { MindmapChapter, MindmapIndexEntry } from "@/lib/mindmap-types";
import indexJson from "./index.json";
import ch15 from "./ch15.json";
import ch16 from "./ch16.json";
import ch17 from "./ch17.json";
import ch18 from "./ch18.json";
import ch19 from "./ch19.json";
import ch20 from "./ch20.json";

const CHAPTERS: Record<string, MindmapChapter> = {
  ch15: ch15 as MindmapChapter,
  ch16: ch16 as MindmapChapter,
  ch17: ch17 as MindmapChapter,
  ch18: ch18 as MindmapChapter,
  ch19: ch19 as MindmapChapter,
  ch20: ch20 as MindmapChapter,
};

export const mindmapIndex = indexJson as MindmapIndexEntry[];

export function getMindmapChapter(id: string): MindmapChapter | undefined {
  return CHAPTERS[id];
}

export function isMindmapId(id: string): boolean {
  return id in CHAPTERS;
}

export function allMindmapIds(): string[] {
  return mindmapIndex.map((item) => item.id);
}
