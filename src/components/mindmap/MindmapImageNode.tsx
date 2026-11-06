"use client";

import { memo } from "react";
import { type NodeProps } from "@xyflow/react";
import type { Node } from "@xyflow/react";

export type MindmapImageNodeData = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type MindmapImageFlowNode = Node<MindmapImageNodeData, "mindmapImage">;

function MindmapImageNodeInner({ data }: NodeProps<MindmapImageFlowNode>) {
  return (
    <div className="overflow-hidden rounded-md border border-border/60 bg-card shadow-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={data.src}
        alt={data.alt}
        width={data.width}
        height={data.height}
        className="block max-w-none select-none"
        draggable={false}
      />
    </div>
  );
}

export const MindmapImageNode = memo(MindmapImageNodeInner);
