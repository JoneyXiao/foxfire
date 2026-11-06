"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import {
  Background,
  BackgroundVariant,
  Controls,
  MiniMap,
  Panel,
  PanOnScrollMode,
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
import { Input } from "@/components/ui/input";
import {
  ancestorsToExpand,
  collectExpandableIds,
  findMatchingNodeIds,
  indexMindmapTree,
  layoutMindmap,
} from "@/lib/mindmap-layout";
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

function subscribeCoarsePointer(onStoreChange: () => void) {
  if (typeof window === "undefined" || !window.matchMedia) {
    return () => {};
  }
  const mq = window.matchMedia("(pointer: coarse)");
  const handler = () => onStoreChange();
  mq.addEventListener("change", handler);
  return () => mq.removeEventListener("change", handler);
}

function getCoarsePointerSnapshot() {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(pointer: coarse)").matches;
}

function MindmapCanvasInner({ tree, title, className }: MindmapCanvasProps) {
  const { fitView, setCenter, getNode } = useReactFlow();
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(() => new Set());
  const [query, setQuery] = useState("");
  const isCoarse = useSyncExternalStore(
    subscribeCoarsePointer,
    getCoarsePointerSnapshot,
    () => false,
  );

  const { parentOf } = useMemo(() => indexMindmapTree(tree), [tree]);
  const expandableIds = useMemo(() => collectExpandableIds(tree), [tree]);

  const matchIds = useMemo(
    () => findMatchingNodeIds(tree, query),
    [tree, query],
  );
  const hasQuery = query.trim().length > 0;

  const onToggleCollapse = useCallback((id: string) => {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // When searching, force-expand ancestors of matches so hits stay visible.
  const effectiveCollapsed = useMemo(() => {
    if (!hasQuery || matchIds.size === 0) return collapsedIds;
    const keepOpen = ancestorsToExpand(matchIds, parentOf);
    const next = new Set(collapsedIds);
    for (const id of keepOpen) next.delete(id);
    return next;
  }, [collapsedIds, hasQuery, matchIds, parentOf]);

  const laidOut = useMemo(
    () =>
      layoutMindmap(tree, {
        collapsedIds: effectiveCollapsed,
        matchIds,
        hasQuery,
        onToggleCollapse,
      }),
    [tree, effectiveCollapsed, matchIds, hasQuery, onToggleCollapse],
  );

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
  }, [mounted, fitView, tree, effectiveCollapsed]);

  useEffect(() => {
    if (!mounted || !hasQuery || matchIds.size === 0) return;
    const firstId = [...matchIds][0];
    const id = window.setTimeout(() => {
      const node = getNode(firstId);
      if (!node) {
        void fitView({ padding: 0.2, duration: 220 });
        return;
      }
      const w = node.measured?.width ?? 160;
      const h = node.measured?.height ?? 40;
      void setCenter(node.position.x + w / 2, node.position.y + h / 2, {
        zoom: Math.max(0.55, isCoarse ? 0.7 : 0.85),
        duration: 220,
      });
    }, 60);
    return () => window.clearTimeout(id);
  }, [
    mounted,
    hasQuery,
    matchIds,
    getNode,
    setCenter,
    fitView,
    isCoarse,
    effectiveCollapsed,
  ]);

  const expandAll = useCallback(() => {
    setCollapsedIds(new Set());
  }, []);

  const collapseBranches = useCallback(() => {
    // Keep root open; collapse every other expandable node.
    const next = new Set(expandableIds.filter((id) => id !== tree.id));
    setCollapsedIds(next);
  }, [expandableIds, tree.id]);

  if (!mounted) {
    return (
      <div
        className={cn(
          "flex h-[min(78svh,48rem)] w-full items-center justify-center rounded-lg border border-border/80 bg-card/40 sm:h-[min(70svh,42rem)]",
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

  const matchCount = matchIds.size;

  return (
    <div
      className={cn(
        "relative h-[min(78svh,48rem)] w-full overflow-hidden rounded-lg border border-border/80 bg-background sm:h-[min(70svh,42rem)]",
        "touch-none overscroll-none",
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
        fitViewOptions={{ padding: isCoarse ? 0.2 : 0.16 }}
        minZoom={0.05}
        maxZoom={1.75}
        proOptions={{ hideAttribution: true }}
        nodesConnectable={false}
        edgesReconnectable={false}
        elementsSelectable
        nodesDraggable={!isCoarse}
        nodesFocusable
        panOnScroll
        panOnScrollMode={PanOnScrollMode.Free}
        zoomOnScroll={!isCoarse}
        zoomOnPinch
        panOnDrag
        selectionOnDrag={false}
        preventScrolling
        noWheelClassName="nowheel"
        noPanClassName="nopan"
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
        {!isCoarse ? (
          <MiniMap
            pannable
            zoomable
            nodeStrokeWidth={2}
            className="!overflow-hidden !rounded-md !border !border-border/80 !bg-card !shadow-none foxfire-mindmap-minimap"
            maskColor="color-mix(in oklab, var(--background) 70%, transparent)"
          />
        ) : null}

        <Panel
          position="top-left"
          className="flex max-w-[min(100%,22rem)] flex-col gap-2 sm:max-w-md"
        >
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-border/80 bg-card/95 p-2 shadow-none backdrop-blur-sm">
            <label className="sr-only" htmlFor="mindmap-search">
              搜索节点
            </label>
            <Input
              id="mindmap-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索节点…"
              className="nowheel nopan h-9 min-h-9 min-w-[10rem] flex-1 bg-background text-sm md:text-sm"
              autoComplete="off"
              enterKeyHint="search"
            />
            {hasQuery ? (
              <span className="font-mono text-[0.65rem] tabular-nums text-muted-foreground">
                {matchCount} 命中
              </span>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="nowheel nopan min-h-9 bg-card/95"
              onClick={expandAll}
            >
              全部展开
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="nowheel nopan min-h-9 bg-card/95"
              onClick={collapseBranches}
            >
              收起分支
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="nowheel nopan min-h-9 bg-card/95"
              onClick={() => void fitView({ padding: 0.16, duration: 200 })}
            >
              适应画布
            </Button>
          </div>
          <p className="hidden rounded-md border border-border/80 bg-card/90 px-2.5 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.12em] text-muted-foreground sm:block">
            点击 ▾ 折叠 · 搜索高亮 · {isCoarse ? "单指平移 · 双指缩放" : "拖拽 · 滚轮缩放"}
          </p>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export function MindmapCanvas(props: MindmapCanvasProps) {
  return (
    <ReactFlowProvider key={props.tree.id}>
      <MindmapCanvasInner {...props} />
    </ReactFlowProvider>
  );
}
