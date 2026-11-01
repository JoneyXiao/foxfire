import type { Category, CategoryId, Difficulty } from "@/lib/types";

export const categories: Category[] = [
  { id: "python", name: "Python", summary: "语言、并发、类型与工程习惯" },
  { id: "pytorch", name: "PyTorch", summary: "张量、反传、分布式与训练细节" },
  { id: "transformer", name: "Transformer", summary: "注意力、位置、缓存与结构变体" },
  { id: "multimodal", name: "多模态", summary: "图文对齐、视觉 token 与幻觉" },
  { id: "agent", name: "Agent", summary: "工具、记忆、规划与权限" },
  { id: "rag", name: "RAG", summary: "切片、检索、重排与引用" },
  { id: "deployment", name: "部署", summary: "推理服务、量化、发布与容量" },
  { id: "monitoring", name: "观测", summary: "延迟、漂移、成本与线上质量" },
  { id: "behavioral", name: "行为面", summary: "取舍、事故、协作与判断" },
];

export const difficultyLabel: Record<Difficulty, string> = {
  foundation: "基础",
  applied: "应用",
  system: "系统设计",
};

export function categoryById(id: string): Category | undefined {
  return categories.find((item) => item.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((item) => item.id === value);
}
