import type { Category, CategoryId, Difficulty } from "@/lib/types";

export const categories: Category[] = [
  { id: "llm-basics", name: "大模型通识（LLM基础）", summary: "选型、分词、上下文、幻觉与对齐基础" },
  { id: "api-structured", name: "API调用与结构化输出", summary: "流式、Schema、工具调用与多厂商封装" },
  { id: "prompting", name: "提示工程", summary: "few-shot、思维链、约束回答与迭代评测" },
  { id: "rag", name: "RAG（检索增强生成）", summary: "切片、混合检索、重排、评测与排障" },
  { id: "knowledge", name: "数据与知识工程", summary: "解析、去重、元数据与大规模入库" },
  { id: "agent", name: "人工智能智能体", summary: "规划、工具、记忆、权限与多 Agent" },
  { id: "harness", name: "智能体运行工程（Harness+Loop）", summary: "上下文管理、checkpoint、trace 与资源优化" },
  { id: "frameworks", name: "AI应用开发框架", summary: "LangChain、LangGraph、Spring AI 与抽象选型" },
  { id: "deployment", name: "模型部署与推理优化", summary: "量化、KV Cache、批处理与推理服务" },
  { id: "evaluation", name: "模型评估（应用侧）", summary: "离线集、Judge、线上反馈与发布门禁" },
  { id: "reliability", name: "工程实现细节（生产可靠性）", summary: "重试、幂等、限流、缓存与灰度回滚" },
  { id: "safety", name: "安全与合规", summary: "注入、泄露、内容审核与合规边界" },
  { id: "product-cost", name: "AI产品与成本意识", summary: "成本估算、路由、ROI 与推进节奏" },
  { id: "ml-basics", name: "机器学习与深度学习基础扫盲", summary: "预训练、微调、LoRA 与注意力直觉" },
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
