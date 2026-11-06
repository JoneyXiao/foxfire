import type { Edge, Node } from "@xyflow/react";
import type { MindmapKind, MindmapTreeNode } from "@/lib/mindmap-types";

export type MindmapFlowNodeData = {
  label: string;
  kind: MindmapKind;
  expandable: boolean;
  collapsed: boolean;
  childCount: number;
  match: boolean;
  dimmed: boolean;
  onToggleCollapse?: (id: string) => void;
};

export type MindmapFlowNode = Node<MindmapFlowNodeData, "mindmap">;

export type MindmapLayoutOptions = {
  collapsedIds?: ReadonlySet<string>;
  matchIds?: ReadonlySet<string>;
  hasQuery?: boolean;
  onToggleCollapse?: (id: string) => void;
};

const X_GAP = 280;
const Y_GAP = 10;
const BRANCH_EXTRA = 28;

function estimateHeight(kind: MindmapKind, label: string): number {
  if (kind === "root") return 56;
  if (kind === "branch") return 48;
  const charsPerLine = 18;
  const lines = Math.max(1, Math.ceil(label.length / charsPerLine));
  return Math.min(128, 30 + lines * 18);
}

function subtreeHeight(
  node: MindmapTreeNode,
  collapsedIds: ReadonlySet<string>,
): number {
  const self = estimateHeight(node.kind, node.label);
  const children = node.children ?? [];
  if (!children.length || collapsedIds.has(node.id)) return self;
  const kids = children.reduce((sum, child, i) => {
    const h = subtreeHeight(child, collapsedIds);
    return sum + h + (i > 0 ? Y_GAP : 0);
  }, 0);
  return Math.max(self, kids + (node.kind === "root" ? BRANCH_EXTRA : 0));
}

/**
 * Left-to-right tree layout for review canvases.
 * Honors collapsed branches so descendants are omitted until expanded.
 */
export function layoutMindmap(
  tree: MindmapTreeNode,
  options: MindmapLayoutOptions = {},
): {
  nodes: MindmapFlowNode[];
  edges: Edge[];
} {
  const collapsedIds = options.collapsedIds ?? new Set<string>();
  const matchIds = options.matchIds ?? new Set<string>();
  const hasQuery = Boolean(options.hasQuery);
  const onToggleCollapse = options.onToggleCollapse;

  const nodes: MindmapFlowNode[] = [];
  const edges: Edge[] = [];

  function place(node: MindmapTreeNode, depth: number, top: number): number {
    const children = node.children ?? [];
    const expandable = children.length > 0;
    const collapsed = expandable && collapsedIds.has(node.id);
    const height = subtreeHeight(node, collapsedIds);
    const selfH = estimateHeight(node.kind, node.label);
    const x = depth * X_GAP;
    const y = top + (height - selfH) / 2;
    const match = matchIds.has(node.id);

    nodes.push({
      id: node.id,
      type: "mindmap",
      position: { x, y },
      data: {
        label: node.label,
        kind: node.kind,
        expandable,
        collapsed,
        childCount: children.length,
        match,
        dimmed: hasQuery && !match,
        onToggleCollapse,
      },
      draggable: true,
    });

    if (!expandable || collapsed) return height;

    let cursor = top;
    if (node.kind === "root") cursor += BRANCH_EXTRA / 2;

    children.forEach((child, index) => {
      if (index > 0) cursor += Y_GAP;
      const childH = place(child, depth + 1, cursor);
      edges.push({
        id: `${node.id}->${child.id}`,
        source: node.id,
        target: child.id,
        type: "smoothstep",
        animated: false,
      });
      cursor += childH;
    });

    return height;
  }

  place(tree, 0, 0);
  return { nodes, edges };
}


/** Ids to collapse for an overview: expand through `keepExpandedThroughDepth` (0 = root only). */
export function collectCollapsedBeyondDepth(
  tree: MindmapTreeNode,
  keepExpandedThroughDepth: number,
): Set<string> {
  const collapsed = new Set<string>();
  function walk(node: MindmapTreeNode, depth: number) {
    const children = node.children ?? [];
    if (!children.length) return;
    if (depth > keepExpandedThroughDepth) collapsed.add(node.id);
    children.forEach((child) => walk(child, depth + 1));
  }
  walk(tree, 0);
  return collapsed;
}

/** Default chapter open: root expanded, level-2 branches visible but collapsed. */
export function collectOverviewCollapsedIds(tree: MindmapTreeNode): Set<string> {
  return collectCollapsedBeyondDepth(tree, 0);
}

/** Collect every node id that has children (eligible for collapse). */
export function collectExpandableIds(tree: MindmapTreeNode): string[] {
  const ids: string[] = [];
  function walk(node: MindmapTreeNode) {
    if (node.children?.length) {
      ids.push(node.id);
      node.children.forEach(walk);
    }
  }
  walk(tree);
  return ids;
}

/** Parent map + flat list for search / auto-expand ancestors. */
export function indexMindmapTree(tree: MindmapTreeNode): {
  byId: Map<string, MindmapTreeNode>;
  parentOf: Map<string, string>;
} {
  const byId = new Map<string, MindmapTreeNode>();
  const parentOf = new Map<string, string>();

  function walk(node: MindmapTreeNode, parentId?: string) {
    byId.set(node.id, node);
    if (parentId) parentOf.set(node.id, parentId);
    node.children?.forEach((child) => walk(child, node.id));
  }

  walk(tree);
  return { byId, parentOf };
}

export function findMatchingNodeIds(
  tree: MindmapTreeNode,
  query: string,
): Set<string> {
  const q = query.trim().toLowerCase();
  const matches = new Set<string>();
  if (!q) return matches;

  function walk(node: MindmapTreeNode) {
    if (node.label.toLowerCase().includes(q)) matches.add(node.id);
    node.children?.forEach(walk);
  }
  walk(tree);
  return matches;
}

/** Ancestors of matches that must be expanded for matches to show. */
export function ancestorsToExpand(
  matchIds: ReadonlySet<string>,
  parentOf: ReadonlyMap<string, string>,
): Set<string> {
  const needed = new Set<string>();
  for (const id of matchIds) {
    let cur = parentOf.get(id);
    while (cur) {
      needed.add(cur);
      cur = parentOf.get(cur);
    }
  }
  return needed;
}
