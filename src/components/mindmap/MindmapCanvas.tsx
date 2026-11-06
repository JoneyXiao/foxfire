"use client";

import { useEffect, useMemo, useSyncExternalStore } from "react";
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
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Button } from "@/components/ui/button";
import { layoutMindmap } from "@/lib/mindmap-layout";
import type { MindmapTreeNode } from "@/lib/mindmap-types";
import { cn } from "@/lib/utils";
import { MindmapNodeView } from "./MindmapNodeView";

const nodeTypes: NodeTypes = {
  mindmap: MindmapNodeView,
};

const defaultEdgeOptions: DefaultEdgeOptions = {
  type: "smoothstep",
  style: { stroke: "var(--border)", strokeWidth: 1.25 },
};

type MindmapCanvasProps = {
  tree: MindmapTreeNode;
  title: string;
  className?: string;
};

function MindmapCanvasInner({ tree, title, className }: MindmapCanvasProps) {
  const { fitView } = useReactFlow();
  const laidOut = useMemo(() => layoutMindmap(tree), [tree]);
  const [nodes, setNodes, onNodesChange] = useNodesState(laidOut.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(laidOut.edges);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    setNodes(laidOut.nodes);
    setEdges(laidOut.edges);
  }, [laidOut, setNodes, setEdges]);

  useEffect(() => {
    if (!mounted) return;
    const id = window.setTimeout(() => {
      void fitView({ padding: 0.16, duration: 200 });
    }, 40);
    return () => window.clearTimeout(id);
  }, [mounted, fitView, tree]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-[min(70svh,42rem)] w-full items-center justify-center rounded-lg border border-border/80 bg-card/40",
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

  return (
    <div
      className={cn(
        "h-[min(70svh,42rem)] w-full overflow-hidden rounded-lg border border-border/80 bg-background",
        "touch-none",
        className,
      )}
      role="application"
      aria-label={`${title} 导图画布`}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        fitView
        fitViewOptions={{ padding: 0.16 }}
        minZoom={0.05}
        maxZoom={1.75}
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
        <MiniMap
          pannable
          zoomable
          nodeStrokeWidth={2}
          className="!overflow-hidden !rounded-md !border !border-border/80 !bg-card !shadow-none"
          maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
        />
        <Panel position="top-right" className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="min-h-9 bg-card/90"
            onClick={() => void fitView({ padding: 0.16, duration: 200 })}
          >
            适应画布
          </Button>
        </Panel>
        <Panel position="top-left">
          <p className="rounded-md border border-border/80 bg-card/90 px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground">
            拖拽节点 · 滚轮缩放 · 空白处平移
          </p>
        </Panel>
      </ReactFlow>
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
