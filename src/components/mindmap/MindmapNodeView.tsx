"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { cn } from "@/lib/utils";
import type { MindmapFlowNode } from "@/lib/mindmap-layout";

function MindmapNodeViewInner({ data, selected }: NodeProps<MindmapFlowNode>) {
  const { label, kind } = data;

  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 shadow-none transition-[border-color,background-color]",
        "max-w-[15rem] text-left leading-snug",
        kind === "root" &&
          "max-w-[12rem] border-primary/70 bg-primary text-primary-foreground",
        kind === "branch" &&
          "max-w-[11rem] border-border bg-card text-sm font-medium text-foreground",
        kind === "leaf" &&
          "border-border/80 bg-background text-xs text-foreground",
        selected && "ring-2 ring-ring/50",
      )}
      title={label}
    >
      {kind !== "root" ? (
        <Handle
          type="target"
          position={Position.Left}
          className="!size-1.5 !border-0 !bg-muted-foreground/50"
          isConnectable={false}
        />
      ) : null}
      <p className={cn(kind === "root" && "text-sm font-medium")}>{label}</p>
      {kind !== "leaf" ? (
        <Handle
          type="source"
          position={Position.Right}
          className="!size-1.5 !border-0 !bg-muted-foreground/50"
          isConnectable={false}
        />
      ) : null}
    </div>
  );
}

export const MindmapNodeView = memo(MindmapNodeViewInner);
