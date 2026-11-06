"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
  type DefaultEdgeOptions,
  type Edge,
  type Node,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { layoutMindmap } from "@/lib/mindmap-layout";
import type { MindmapTreeNode } from "@/lib/mindmap-types";
import { cn } from "@/lib/utils";
import { MindmapImageNode } from "./MindmapImageNode";
import { MindmapNodeView } from "./MindmapNodeView";

const treeNodeTypes: NodeTypes = {
  mindmap: MindmapNodeView,
};

const imageNodeTypes: NodeTypes = {
  mindmapImage: MindmapImageNode,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: "var(--border)", strokeWidth: 1.25 },
};

export type MindmapViewMode = "original" | "outline";

type MindmapCanvasProps = {
  tree: MindmapTreeNode;
  title: string;
  imageSrc?: string;
  /** Intrinsic pixel size of the source mindmap image (for RF node sizing). */
  imageWidth?: number;
  imageHeight?: number;
  className?: string;
};

function MindmapCanvasInner({
  tree,
  title,
  imageSrc,
  imageWidth = 1500,
  imageHeight = 4000,
  className,
}: MindmapCanvasProps) {
  const hasOriginal = Boolean(imageSrc);
  const [mode, setMode] = useState<MindmapViewMode>(
    hasOriginal ? "original" : "outline",
  );
  const { fitView } = useReactFlow();

  const treeLayout = useMemo(() => layoutMindmap(tree), [tree]);
  const imageLayout = useMemo(() => {
    if (!imageSrc) return { nodes: [], edges: [] };
    return {
      nodes: [
        {
          id: "original-image",
          type: "mindmapImage" as const,
          position: { x: 0, y: 0 },
          data: {
            src: imageSrc,
            alt: `${title} 原图`,
            width: imageWidth,
            height: imageHeight,
          },
          draggable: true,
        },
      ],
      edges: [],
    };
  }, [imageSrc, title, imageWidth, imageHeight]);

  const active = mode === "original" && hasOriginal ? imageLayout : treeLayout;
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>(active.nodes as Node[]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(active.edges as Edge[]);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    setNodes(active.nodes);
    setEdges(active.edges);
  }, [active, setNodes, setEdges]);

  useEffect(() => {
    if (!mounted) return;
    const id = window.setTimeout(() => {
      void fitView({
        padding: mode === "original" ? 0.08 : 0.16,
        duration: 200,
      });
    }, 40);
    return () => window.clearTimeout(id);
  }, [mounted, fitView, tree, mode, imageSrc]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-[min(78svh,48rem)] w-full items-center justify-center rounded-lg border border-border/80 bg-card/40",
          className,
        )}
        aria-busy="true"
      >
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground">
          加载导图…
        </p>
      </div>
    );
  }

  const usingOriginal = mode === "original" && hasOriginal;

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {hasOriginal ? (
          <div
            className="inline-flex rounded-md border border-border/80 p-0.5"
            role="tablist"
            aria-label="导图视图"
          >
            <Button
              type="button"
              role="tab"
              aria-selected={usingOriginal}
              variant={usingOriginal ? "secondary" : "ghost"}
              size="sm"
              className="min-h-9"
              onClick={() => setMode("original")}
            >
              原图
            </Button>
            <Button
              type="button"
              role="tab"
              aria-selected={!usingOriginal}
              variant={!usingOriginal ? "secondary" : "ghost"}
              size="sm"
              className="min-h-9"
              onClick={() => setMode("outline")}
            >
              节点大纲
            </Button>
          </div>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {usingOriginal
            ? "极客时间原图：滚轮缩放、拖动画布；与专栏 Wiki 导图一致。"
            : "按原图层级整理的节点树：可拖节点、滚轮缩放（讲解气泡未收录）。"}
        </p>
      </div>

      <div
        className={cn(
          "h-[min(78svh,48rem)] w-full overflow-hidden rounded-lg border border-border/80 bg-background",
          "touch-none",
        )}
        role="application"
        aria-label={`${title} 导图画布`}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={usingOriginal ? imageNodeTypes : treeNodeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          fitViewOptions={{ padding: usingOriginal ? 0.08 : 0.16 }}
          minZoom={0.02}
          maxZoom={2.5}
          proOptions={{ hideAttribution: true }}
          nodesConnectable={false}
          edgesReconnectable={false}
          elementsSelectable
          panOnScroll
          zoomOnScroll
          zoomOnPinch
          panOnDrag
          selectionOnDrag={false}
          className="foxfire-mindmap"
        >
          <Background
            id="foxfire-dots"
            variant={BackgroundVariant.Dots}
            gap={18}
            size={1}
            color="var(--border)"
          />
          <Controls
            showInteractive={false}
            className="!overflow-hidden !rounded-md !border !border-border/80 !bg-card !shadow-none"
          />
          {!usingOriginal ? (
            <MiniMap
              pannable
              zoomable
              nodeStrokeWidth={2}
              className="!overflow-hidden !rounded-md !border !border-border/80 !bg-card !shadow-none"
              maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
            />
          ) : null}
          <Panel position="top-right" className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="min-h-9 bg-card/90"
              onClick={() =>
                void fitView({
                  padding: usingOriginal ? 0.08 : 0.16,
                  duration: 200,
                })
              }
            >
              适应画布
            </Button>
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

export function MindmapCanvas(props: MindmapCanvasProps) {
  return (
    <ReactFlowProvider>
      <MindmapCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
