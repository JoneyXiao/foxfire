import type { Edge, Node } from "@xyflow/react";
import type { MindmapKind, MindmapTreeNode } from "@/lib/mindmap-types";

export type MindmapFlowNodeData = {
  label: string;
  kind: MindmapKind;
};

export type MindmapFlowNode = Node<MindmapFlowNodeData, "mindmap">;

const X_GAP = 280;
const Y_GAP = 10;
const BRANCH_EXTRA = 28;

function estimateHeight(kind: MindmapKind, label: string): number {
  if (kind === "root") return 56;
  if (kind === "branch") return 44;
  const charsPerLine = 18;
  const lines = Math.max(1, Math.ceil(label.length / charsPerLine));
  return Math.min(128, 30 + lines * 18);
}

function subtreeHeight(node: MindmapTreeNode): number {
  const self = estimateHeight(node.kind, node.label);
  if (!node.children?.length) return self;
  const kids = node.children.reduce((sum, child, i) => {
    const h = subtreeHeight(child);
    return sum + h + (i > 0 ? Y_GAP : 0);
  }, 0);
  return Math.max(self, kids + (node.kind === "root" ? BRANCH_EXTRA : 0));
}

/**
 * Left-to-right tree layout for review canvases.
 * Positions are absolute; React Flow handles pan/zoom.
 */
export function layoutMindmap(tree: MindmapTreeNode): {
  nodes: MindmapFlowNode[];
  edges: Edge[];
} {
  const nodes: MindmapFlowNode[] = [];
  const edges: Edge[] = [];

  function place(node: MindmapTreeNode, depth: number, top: number): number {
    const height = subtreeHeight(node);
    const selfH = estimateHeight(node.kind, node.label);
    const x = depth * X_GAP;
    const y = top + (height - selfH) / 2;

    nodes.push({
      id: node.id,
      type: "mindmap",
      position: { x, y },
      data: { label: node.label, kind: node.kind },
      draggable: true,
    });

    if (!node.children?.length) return height;

    let cursor = top;
    if (node.kind === "root") cursor += BRANCH_EXTRA / 2;

    node.children.forEach((child, index) => {
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
