export type MindmapKind = "root" | "branch" | "leaf";

export type MindmapTreeNode = {
  id: string;
  label: string;
  kind: MindmapKind;
  children?: MindmapTreeNode[];
};

export type MindmapChapter = {
  id: string;
  chapter: number;
  sectionId: string;
  title: string;
  shortTitle: string;
  /** Original Geekbang mindmap image under /public */
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  tree: MindmapTreeNode;
};

export type MindmapIndexEntry = {
  id: string;
  chapter: number;
  sectionId: string;
  title: string;
  shortTitle: string;
  branchCount: number;
  stemCount: number;
  imageSrc?: string;
};
