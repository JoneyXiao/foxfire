import { mindmapIndex } from "@/data/mindmaps";
import { categories } from "@/lib/categories";

export type SidebarLink = {
  href: string;
  label: string;
  /** Optional mono badge (chapter no., category index). */
  badge?: string;
  /**
   * exact (default): pathname === href only — e.g. `/mindmaps` vs `/mindmaps/ch15`.
   * prefix: also match nested paths — e.g. `/practice` + `/practice/summary`.
   */
  match?: "exact" | "prefix";
};

export type SidebarGroup = {
  id: string;
  label: string;
  links: SidebarLink[];
  /** Categories group starts collapsed unless a child route is active. */
  collapsible?: boolean;
};

export const DRILL_LINKS: SidebarLink[] = [
  { href: "/practice", label: "练习会话", match: "prefix" },
  { href: "/mock", label: "模拟面试", match: "prefix" },
  { href: "/search", label: "搜索题库", match: "prefix" },
  { href: "/progress", label: "练习进度", match: "prefix" },
];

export function getMindmapLinks(): SidebarLink[] {
  return [
    { href: "/mindmaps", label: "全部导图", match: "exact" },
    ...mindmapIndex.map((item) => ({
      href: `/mindmaps/${item.id}`,
      label: item.shortTitle,
      badge: String(item.chapter),
      match: "exact" as const,
    })),
  ];
}

export function getCategoryLinks(): SidebarLink[] {
  return categories.map((category, index) => ({
    href: `/category/${category.id}`,
    label: category.name,
    badge: String(index + 1).padStart(2, "0"),
    match: "exact" as const,
  }));
}

/** Shared nav groups for desktop sidebar + mobile drawer. */
export function getSidebarGroups(): SidebarGroup[] {
  return [
    { id: "drill", label: "刷题", links: DRILL_LINKS },
    { id: "mindmaps", label: "导图", links: getMindmapLinks() },
    {
      id: "categories",
      label: "分类",
      links: getCategoryLinks(),
      collapsible: true,
    },
  ];
}

export function isSidebarLinkActive(pathname: string, link: SidebarLink): boolean {
  if (link.match === "prefix") {
    return pathname === link.href || pathname.startsWith(`${link.href}/`);
  }
  // Default exact — prevents `/mindmaps` and `/mindmaps/ch*` both lighting up.
  return pathname === link.href;
}
