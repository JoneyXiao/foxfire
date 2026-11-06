"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MindmapFlowNode } from "@/lib/mindmap-layout";

function MindmapNodeViewInner({ data, selected, id }: NodeProps<MindmapFlowNode>) {
  const {
    label,
    kind,
    expandable,
    collapsed,
    childCount,
    match,
    dimmed,
    onToggleCollapse,
  } = data;

  return (
    <div
      className={cn(
        "rounded-md border px-3 py-2 shadow-none transition-[border-color,background-color,opacity,box-shadow]",
        "max-w-[15rem] text-left leading-snug",
        kind === "root" &&
          "max-w-[12rem] border-primary/70 bg-primary text-primary-foreground",
        kind === "branch" &&
          "max-w-[11rem] border-border bg-card text-sm font-medium text-foreground",
        kind === "leaf" &&
          "border-border/80 bg-background text-xs text-foreground",
        selected && "ring-2 ring-ring/50",
        match &&
          "border-primary bg-primary/15 text-foreground ring-2 ring-primary/40",
        match && kind === "root" && "bg-primary text-primary-foreground",
        dimmed && "opacity-35",
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

      <div className="flex items-start gap-1.5">
        {expandable ? (
          <button
            type="button"
            className={cn(
              "mt-0.5 inline-flex size-6 shrink-0 items-center justify-center rounded-md",
              "border border-transparent text-current",
              "hover:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              kind === "root" && "hover:bg-primary-foreground/15",
            )}
            aria-expanded={!collapsed}
            aria-label={collapsed ? `展开（${childCount}）` : "收起"}
            onClick={(event) => {
              event.stopPropagation();
              onToggleCollapse?.(id);
            }}
            onPointerDown={(event) => event.stopPropagation()}
          >
            {collapsed ? (
              <ChevronRight className="size-3.5" aria-hidden="true" />
            ) : (
              <ChevronDown className="size-3.5" aria-hidden="true" />
            )}
          </button>
        ) : null}

        <div className="min-w-0 flex-1">
          <p className={cn(kind === "root" && "text-sm font-medium")}>{label}</p>
          {expandable && collapsed ? (
            <p
              className={cn(
                "mt-0.5 font-mono text-[0.65rem] tabular-nums",
                kind === "root"
                  ? "text-primary-foreground/80"
                  : "text-muted-foreground",
              )}
            >
              {childCount} 项已收起
            </p>
          ) : null}
        </div>
      </div>

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
