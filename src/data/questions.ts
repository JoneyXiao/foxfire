import { categories } from "@/lib/categories";
import type { CategoryId, Difficulty, Question, QuestionFilters } from "@/lib/types";

export const questions: Question[] = [
  {
    id: "q-001",
    title: "怎么给一个业务场景选 LLM？选型要考虑哪些维度？如何量化决策？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["选型", "量化", "LLM", "通识"],
    prompt: "面试官让你给客服摘要场景选模型。你会列哪些维度，并怎么用一张简单打分表做决策？",
    answer: `先定任务约束：延迟、成本、多语言、是否要强推理、数据是否可出域。再列候选模型，用统一评测集比正确率与拒答率。

决策可写成加权表：质量 × 权重 + 成本/请求 + P95 延迟惩罚。先小流量验证，再锁默认模型与降级模型。`,
  },
  {
    id: "q-002",
    title: "BPE、WordPiece、Unigram 三种分词算法有什么区别？词表大小怎么权衡？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["分词", "LLM", "通识"],
    prompt: "用「词表变大」和「稀有词切碎」两个极端，说明 BPE、WordPiece、Unigram 各自在优化什么，以及线上怎么选词表大小。",
    answer: `三者都在学子词切分，差别在训练目标：BPE 贪心合并频次；WordPiece 偏似然；Unigram 从大词表剪枝。

词表太小则序列变长、算力涨；太大则稀有 token 学不稳、embedding 参数膨胀。业务语料先估平均 token 数与 OOV，再在 32k–100k 量级做消融。`,
  },
  {
    id: "q-003",
    title: "上下文窗口（Context Window）是什么？窗口大就一定好吗？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["上下文", "上下文窗口", "LLM", "通识"],
    prompt: "有人说『窗口开到 128k 就不用 RAG』。你怎么解释 Context Window，并反驳这个说法？",
    answer: `上下文窗口是单次前向能吃下的 token 上限，含系统提示、历史、检索块与输出预留。

窗口大不等于有效利用：中间遗忘、费用与延迟线性涨，噪声文档还会稀释信号。长文档归档仍常配合检索；窗口是能力上限，不是质量保证。`,
  },
  {
    id: "q-004",
    title: "为什么 LLM 会算错 3.11 和 3.9 谁大、数不清 \"strawberry\" 有几个 r？根因是什么？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["LLM", "通识"],
    prompt: "为什么模型会把 3.11 和 3.9 比错，或数不清 strawberry 的 r？根因指向哪一层？",
    answer: `根因多半在 **tokenization + 下一词预测**：数字被切成不稳定片段，字符级计数也不是训练目标。模型在「像正确答案的文本」上优化，不在精确算术电路上。

生产上：计算器/代码工具、规范化输入、对数字任务降温度并校验。`,
  },
  {
    id: "q-005",
    title: "Prompt、RAG、微调三种手段，如何按问题类型选型？决策优先级是什么？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["选型", "Prompt", "微调", "RAG", "LLM"],
    prompt: "面对事实过期、格式不稳、领域口吻三类问题，Prompt / RAG / 微调的优先级怎么排？",
    answer: `默认顺序：**能 Prompt 就先 Prompt → 缺外部事实用 RAG → 稳定风格/格式/领域词再考虑微调**。

事实常变、要引用出处 → RAG；任务格式固定且量大 → 结构化输出或轻量微调；安全与权限永远不靠「再写一句 prompt」。`,
  },
  {
    id: "q-006",
    title: "幻觉产生的根因是什么？生产环境如何系统性地降低它？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["幻觉", "LLM", "通识"],
    prompt: "请用「训练目标」解释幻觉从哪来，并给生产环境一套降幻觉清单。",
    answer: `LLM 在补全高概率续写，不是在查数据库；检索缺失或冲突时仍会「圆完」一句话，表现为幻觉。

降法：检索接地 + 强制引用、拒答策略、结构化校验、工具查真源、抽检忠实度。把幻觉当系统指标，而不是偶发 bug。`,
  },
  {
    id: "q-007",
    title: "temperature、top-p、top-k 有什么区别？怎么调？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["解码参数", "LLM", "通识"],
    prompt: "temperature、top-p、top-k 分别动的是采样的哪一步？客服与创意写作怎么设？",
    answer: `temperature 拉平/锐化整表概率；top-k 只保留前 k；top-p 按累计概率截断动态集合。三者叠加时先理解裁剪再缩放。

客服/抽取：低温 + 较小 top-p；头脑风暴：略升温。改参数前先固定种子与评测集，避免凭体感拧旋钮。`,
  },
  {
    id: "q-008",
    title: "Function Calling 和 Structured Output 都让模型\"返回 JSON\"，它们本质区别是什么？怎么选？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["Function Calling", "结构化输出", "JSON", "LLM", "通识"],
    prompt: "Function Calling 和 Structured Output 都能「吐 JSON」，本质差在哪，怎么选？",
    answer: `Structured Output 约束 **最终回答形态**；Function Calling 是模型发起 **工具侧通道**，由运行时执行后再决定是否继续生成。

只要参数、不要副作用 → Schema 结构化输出；要查库、下单、算数 → 工具调用，并在服务端做鉴权与校验。`,
  },
  {
    id: "q-009",
    title: "为什么大模型需要\"结构化输出\"？和\"在 prompt 里说返回 JSON\"有什么区别？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["JSON", "Prompt", "LLM", "通识"],
    prompt: "为什么不能只在 prompt 里写『请返回 JSON』？结构化输出到底多提供了什么？",
    answer: `纯 prompt 约束是软的：偶发缺字段、多段废话、Markdown 围栏。结构化输出把 Schema 编进解码约束或校验重试，失败可自动修复。

落地：Schema 要短、枚举要封死、解析失败走有限次修复，而不是无限让模型「再试一次」。`,
  },
  {
    id: "q-010",
    title: "静态 Embedding 和上下文相关 Embedding 有什么区别？选 embedding 模型看什么？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["上下文", "Embedding", "LLM", "通识"],
    prompt: "静态词向量和上下文 Embedding 差在哪？选 embedding 模型看哪些指标？",
    answer: `静态向量一词一义；上下文 embedding 随句子变化，适合检索与聚类。选模型看：领域语言、最大长度、维度与延迟、非对称 query/doc 是否匹配、MTEB/业务集召回。

务必用自己的 query-doc 对打分，公开榜只作初筛。`,
  },
  {
    id: "q-011",
    title: "多模态模型的\"多模态\"是怎么实现的？为什么不能简单把图片转文字再喂给文本模型？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["多模态", "LLM", "通识"],
    prompt: "多模态是怎么把图像接进语言模型的？为何「先 OCR 再文本模型」往往不够？",
    answer: `常见路径：视觉编码器 → 投影/适配器 → 与文本 token 一起进 LLM。保留空间与视觉特征，而不只是抽成文字摘要。

纯 OCR 会丢布局、图标、图表趋势；需要理解版面或图表时，原生多模态或版面解析更合适。`,
  },
  {
    id: "q-012",
    title: "开源模型和闭源 API 怎么选？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["开源模型", "闭源API", "LLM", "通识"],
    prompt: "开源自托管和闭源 API，你怎么在合规、成本、迭代速度之间拍板？",
    answer: `闭源：接入快、能力强，数据出域与单价要算清。开源：可控、可私有化，但要承担显卡、工程与安全补丁。

拍板看：数据能否出域、峰值 QPS、是否要深度定制、团队有没有推理运维。很多团队是「默认 API + 敏感链路自托管」。`,
  },
  {
    id: "q-013",
    title: "RoPE 位置编码如何支撑长上下文外推？为什么\"标称窗口\"常大于\"有效窗口\"？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["上下文", "位置编码", "长上下文", "LLM", "通识"],
    prompt: "RoPE 如何支持长度外推？为什么标称 128k 窗口不等于 128k 都好用？",
    answer: `RoPE 用旋转注入相对位置，通过插值/缩放可把训练长度外推到更长。但注意力稀释、位置外推误差、长程依赖变难，使「有效窗口」常小于标称值。

评测要用「针在干草堆」类任务与真实文档位次，而不是只看配置项。`,
  },
  {
    id: "q-014",
    title: "RLHF 和 DPO 有什么区别？为什么现在很多团队改用 DPO？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["对齐", "LLM", "通识"],
    prompt: "RLHF 和 DPO 在数据与优化上差在哪？为何很多应用团队更爱 DPO？",
    answer: `RLHF：奖励模型 + 强化学习，管线重、不稳定。DPO：直接用偏好对优化策略，省掉 RL 环。

应用团队要的是可控微调与更少基础设施，DPO/类似偏好优化更轻；仍需质量偏好数据与过拟合监控。`,
  },
  {
    id: "q-015",
    title: "流式输出用 SSE 还是 WebSocket？大模型场景怎么选协议？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["流式", "LLM", "通识"],
    prompt: "大模型流式输出，SSE 和 WebSocket 怎么选？",
    answer: `单向 token 推送、HTTP 友好、穿透代理简单 → **SSE** 通常够用。需要双向低延迟控制（取消、打断、协同）再上 WebSocket。

无论协议：心跳、断线续传、客户端背压都要设计，别只开个 EventSource 就上线。`,
  },
  {
    id: "q-016",
    title: "\"参数记忆\"和\"检索记忆\"怎么分工？什么知识该微调进模型、什么该走 RAG？",
    category: "llm-basics",
    difficulty: "foundation",
    tags: ["记忆", "RAG", "微调", "LLM", "通识"],
    prompt: "什么知识该进参数（微调），什么该留在检索？给出分工原则。",
    answer: `稳定、通用、要改变模型「口吻/格式」的 → 可考虑参数化。易变、需溯源、权限隔离的事实 → 检索记忆。

口诀：参数记技能，检索记事实。两者重叠时优先 RAG，避免每周微调追新闻。`,
  },
  {
    id: "q-017",
    title: "流式输出和结构化解析有矛盾，怎么兼顾？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["流式", "API", "结构化输出"],
    prompt: "既要 SSE 流式，又要最终 JSON 可解析，你怎么设计协议与客户端状态机？",
    answer: `流式阶段推「可见文本或增量事件」，结束时再发完整结构化对象或用缓冲做一次 Schema 校验。不要边流边把半截 JSON 当最终态。

可用：先自然语言草稿流式，工具/字段在结束事件里落地；或增量字段事件 + 最终 checksum。`,
  },
  {
    id: "q-018",
    title: "多轮对话的上下文会越滚越大，怎么设计\"截断 + 摘要\"策略？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["上下文", "上下文管理", "API", "结构化输出"],
    prompt: "多轮会话 token 爆炸，截断和摘要如何组合，才不丢掉工具结果里的关键事实？",
    answer: `分层：系统提示固定；近期原文保留；更早轮次压缩成「决策+事实」摘要；工具结果只留结构化要点与 id。

截断优先丢礼貌寒暄，不丢订单号、错误码。摘要模型单独版本化，并抽样人工校对。`,
  },
  {
    id: "q-019",
    title: "为什么一次带工具的回答会触发两次模型调用？成本该怎么估？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["工具调用", "成本", "API", "结构化输出"],
    prompt: "带一次工具的回答为何常变成两次模型调用？成本怎么估？",
    answer: `典型轨迹：模型生成 tool_call → 运行时执行 → 再带着 tool 结果调用模型生成最终回答。计费按两次输入/输出分别算，工具结果也会占上下文。

估成本：平均工具轮次 ×（prompt+completion 单价）+ 工具自身费用。用缓存与较短工具回包降第二次输入。`,
  },
  {
    id: "q-020",
    title: "用 Pydantic / JSON Schema 做结构化输出，怎么落地？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["Schema", "JSON", "API", "结构化输出"],
    prompt: "用 Pydantic/JSON Schema 做结构化输出，最小落地步骤是什么？",
    answer: `定义模型 → 导出 Schema → 请求开启结构化/强制 JSON → 校验失败则有限次修复或降级人工。字段用枚举与默认值收紧，避免自由字符串。

把 Schema 当 API 合同版本化，前后端共用同一份。`,
  },
  {
    id: "q-021",
    title: "API 返回的 JSON 不合法怎么办？有哪些兜底手段？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["JSON", "API", "结构化输出"],
    prompt: "模型返回的 JSON 括号不闭合或类型错了，有哪些兜底？",
    answer: `顺序：本地修复（截断补全、去围栏）→ Schema 校验 → 同 Schema 重试（低温）→ 换模型/规则抽取 → 人工队列。记录失败率作质量指标。

绝不要对破坏性动作「解析失败也继续执行」。`,
  },
  {
    id: "q-022",
    title: "批量调用 LLM 有什么坑？怎么优化吞吐？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["吞吐", "API", "结构化输出"],
    prompt: "批量打 LLM 时常见坑是什么？如何抬吞吐又控失败？",
    answer: `坑：无界并发触发 429、重试风暴、连接池耗尽、提示未去重。手段：有界队列、令牌桶、指数退避+抖动、结果缓存、分片幂等键。

先定 SLO：成功率和 P95，再调并发；吞吐不是越大越好。`,
  },
  {
    id: "q-023",
    title: "多轮 Function Calling 里，怎么避免模型\"反复调同一个工具\"死循环？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["Function Calling", "工具调用", "工具循环", "API", "结构化输出"],
    prompt: "多轮 Function Calling 里模型反复调同一工具，怎么打断死循环？",
    answer: `执行层硬限制：同工具+同参数指纹冷却、全局步数上限、重复调用熔断并改写提示「换策略或结束」。返回明确错误而非空白。

观测上按 trace 统计循环率，把案例放进回归集。`,
  },
  {
    id: "q-024",
    title: "工具结果如何正确注入多轮对话？tool_call_id 配错会怎样？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["工具调用", "提示注入", "API", "结构化输出"],
    prompt: "工具结果如何正确塞回多轮消息？tool_call_id 配错会怎样？",
    answer: `每条 tool 消息必须对应一次 call 的 id，角色与顺序按厂商协议。配错会导致模型忽略结果、重复调用或上下文错位。

封装时用类型把 call 与 result 绑死，单测覆盖乱序与缺失。`,
  },
  {
    id: "q-025",
    title: "调用 LLM API 时，超时时间怎么设？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["超时", "API", "结构化输出"],
    prompt: "调用 LLM API 的超时怎么设？流式和非流式一样吗？",
    answer: `非流式：按 P99 完成时间 + 缓冲。流式：区分连接超时与「首 token / 帧间隔」超时，避免长生成被误杀。

超时后策略要分类：可重试的网络错 vs 取消用户请求；与幂等键一起设计。`,
  },
  {
    id: "q-026",
    title: "如何统一封装多家 LLM 的 API，避免厂商锁定？",
    category: "api-structured",
    difficulty: "applied",
    tags: ["多厂商", "API", "结构化输出"],
    prompt: "如何封装多家 LLM，减少厂商锁定？",
    answer: `统一：消息角色、工具 schema、流式事件、错误码与用量字段。适配器翻译差异，业务只依赖自有接口。

评测与路由放在适配器之上，换模型不改业务分支；密钥与区域配置外置。`,
  },
  {
    id: "q-027",
    title: "few-shot 的示例数量和顺序会影响效果吗？怎么科学地挑示例？",
    category: "prompting",
    difficulty: "applied",
    tags: ["few-shot", "提示工程", "Prompt"],
    prompt: "few-shot 的条数和顺序会改变结果吗？怎么挑示例？",
    answer: `会。过近示例造成刻板模仿，过远或噪声示例会带偏。顺序上模型对靠近问题的例子更敏感。

挑例：覆盖主路径+边界，标签均衡，定期用固定集做消融，删掉不增益的例子。`,
  },
  {
    id: "q-028",
    title: "如何用对照实验选择 few-shot，而不是凭感觉加示例？",
    category: "prompting",
    difficulty: "applied",
    tags: ["few-shot", "提示工程", "Prompt"],
    prompt: "如何用对照实验选 few-shot，而不是拍脑袋加例子？",
    answer: `固定评测集与解码参数，只改示例集合；比较准确率、格式合法率与成本。用小规模正交实验（加减某类例子）。

记录每次变更，避免「同时改 prompt 开头和例子」导致无法归因。`,
  },
  {
    id: "q-029",
    title: "思维链（CoT）在什么任务上才真正有效？如何用数据判断该不该加？",
    category: "prompting",
    difficulty: "applied",
    tags: ["CoT", "提示工程", "Prompt"],
    prompt: "CoT 在什么任务上值得开？如何用数据决定加不加？",
    answer: `多步推理、数学、需要中间约束的任务常受益；简单抽取可能变慢且更啰嗦。用带/不带 CoT 的 A/B 看正确率与延迟。

需要可解析最终答案时，要求「推理过程 + 最终字段」分离，避免污染结构化输出。`,
  },
  {
    id: "q-030",
    title: "为什么说 \"System Prompt 优先级最高\" 是危险的误解？怎么正确看待它的作用？",
    category: "prompting",
    difficulty: "applied",
    tags: ["System Prompt", "Prompt", "提示工程"],
    prompt: "为什么说『System Prompt 优先级最高』是危险误解？",
    answer: `系统提示只是上下文的一部分，后续用户消息、工具返回、检索文档都能覆盖或诱导模型。安全边界不能只写在 system 里。

正确看法：system 放稳定人设与格式；权限、预算、危险操作必须在运行时强制。`,
  },
  {
    id: "q-031",
    title: "怎么让模型\"只根据给定资料回答，不编造\"？",
    category: "prompting",
    difficulty: "applied",
    tags: ["提示工程", "Prompt"],
    prompt: "怎么约束模型只根据给定资料回答、不编造？",
    answer: `材料分段编号；要求句级引用；允许「资料不足」；禁止外部常识补全。再用忠实度抽检与规则：无引用则拒答。

资料为空时走空召回策略，而不是让模型「凭印象」。`,
  },
  {
    id: "q-032",
    title: "怎么让模型稳定输出特定格式？Prompt 文字要求 vs 结构化输出 API 谁更可靠？",
    category: "prompting",
    difficulty: "applied",
    tags: ["Prompt", "提示工程"],
    prompt: "稳定输出格式：Prompt 文字要求 vs 结构化输出 API，谁更可靠？",
    answer: `API/解码约束显著更可靠；Prompt 只能作补充说明。关键字段用 Schema，展示文案可另路生成。

迁移时把「请输出 JSON」逐步替换成强制结构化，并保留校验。`,
  },
  {
    id: "q-033",
    title: "Prompt 注入的攻击面在哪？为什么纯 Prompt 层防不住？（概要，详见分类 12）",
    category: "prompting",
    difficulty: "applied",
    tags: ["提示注入", "Prompt", "提示工程"],
    prompt: "Prompt 注入的攻击面在哪？为何纯 Prompt 防不住？（点到为止）",
    answer: `攻击面：用户输入、检索文档、网页工具回包、上传文件。 assailant 用自然语言改写指令。

纯提示层可绕过，必须配合：输入隔离、工具鉴权、输出过滤、最小权限。详见安全分类题。`,
  },
  {
    id: "q-034",
    title: "怎么调试和迭代一条 Prompt？有没有科学方法？",
    category: "prompting",
    difficulty: "applied",
    tags: ["Prompt", "提示工程"],
    prompt: "调试一条 Prompt 有没有可重复的方法？",
    answer: `基线集 → 改一处 → 跑回归 → 看失败案例模式 → 再改。把变量（角色、约束、例子）拆开，禁止一次改十处。

版本化 prompt，与应用发布绑定；线上坏案例回流成集。`,
  },
  {
    id: "q-035",
    title: "few-shot 示例里，怎么处理\"边界情况\"和\"反例\"？",
    category: "prompting",
    difficulty: "applied",
    tags: ["few-shot", "提示工程", "Prompt"],
    prompt: "few-shot 里如何放边界情况和反例？",
    answer: `正面例子教格式，反例教「何时拒答/如何纠错」。反例要短、标签清晰，避免模型模仿错误输出本身。

数量上反例少于主路径，并在评测集里单独统计边界召回。`,
  },
  {
    id: "q-036",
    title: "角色设定 Prompt 什么时候真有用、什么时候是\"伪增益\"？怎么判断？",
    category: "prompting",
    difficulty: "applied",
    tags: ["角色设定", "Prompt", "提示工程"],
    prompt: "角色设定何时有用、何时是伪增益？",
    answer: `有用：需要稳定口吻、专业术语边界、输出风格。伪增益：事实正确性、权限、数学——角色拯救不了缺工具与缺检索。

用消融：去掉角色段若指标不变，就删掉以省 token。`,
  },
  {
    id: "q-037",
    title: "长上下文里，Prompt 该怎么组织才能让模型抓住重点？",
    category: "prompting",
    difficulty: "applied",
    tags: ["上下文", "长上下文", "Prompt", "提示工程"],
    prompt: "长上下文里如何组织 Prompt 让模型抓住重点？",
    answer: `重要指令放开头与结尾；中间放资料并加标题/编号；用「先列提纲再作答」减少迷失。关键约束重复一次但保持短。

监控：超长请求的引用命中率，过低就改结构或回调检索。`,
  },
  {
    id: "q-038",
    title: "如何让模型在信息不足时\"主动说不知道\"而不是硬编？",
    category: "prompting",
    difficulty: "applied",
    tags: ["拒答", "提示工程", "Prompt"],
    prompt: "如何让模型在信息不足时主动说不知道？",
    answer: `明确拒答模板与触发条件；奖励「不确定」的 few-shot；无检索命中则短路。评估时把胡编计为严重缺陷。

产品上提供澄清问题按钮，把「不知道」变成可继续的对话。`,
  },
  {
    id: "q-039",
    title: "RAG 的基本流程是什么？每一环节的\"质量杠杆\"分别是什么？",
    category: "rag",
    difficulty: "applied",
    tags: ["RAG", "检索"],
    prompt: "简述 RAG 主链路，并指出每环节最值得撬的质量杠杆。",
    answer: `解析→切片→向量化→索引→检索→（重排）→组装提示→生成→引用。

杠杆：切片边界、混合检索、重排、空结果策略、忠实度评测。生成模型往往不是第一瓶颈。`,
  },
  {
    id: "q-040",
    title: "为什么纯向量检索不够用？混合检索 + 重排序如何补足？RRF 是怎么融合的？",
    category: "rag",
    difficulty: "applied",
    tags: ["混合检索", "重排", "向量检索", "RAG", "检索"],
    prompt: "为何纯向量不够？混合检索 + 重排 + RRF 如何补？",
    answer: `向量擅长语义近似，弱于精确编号、专有名词。关键词/稀疏检索补字面匹配；重排用交叉编码器精修；RRF 按名次融合多路，不依赖分数校准。

线上用召回@k 与人工抽检验证融合权重。`,
  },
  {
    id: "q-041",
    title: "如何评估一个 RAG 系统？为什么检索和生成必须分开评？",
    category: "rag",
    difficulty: "applied",
    tags: ["RAG", "检索"],
    prompt: "评估 RAG 为何要把检索和生成拆开？",
    answer: `检索差会导致生成「忠实但无用」；生成差会「资料对却写飞」。分开看 Recall/nDCG 与 Faithfulness/答案正确，才能知道改哪一层。

端到端分只作总分，定位必须分层。`,
  },
  {
    id: "q-042",
    title: "分块（Chunking）有哪些策略？各自的适用场景和代价是什么？",
    category: "rag",
    difficulty: "applied",
    tags: ["切片", "RAG", "检索"],
    prompt: "常见分块策略及代价？",
    answer: `固定长度、按标题/段落、语义切、滑动窗口、父子块。过长稀释，过短断裂；重叠增召回也增冗余与成本。

按文档类型选：法规按条，百科按小标题，代码按函数。`,
  },
  {
    id: "q-043",
    title: "怎么选 embedding 模型？维度、语言、长度、以及\"非对称检索\"分别考虑什么？",
    category: "rag",
    difficulty: "applied",
    tags: ["Embedding", "RAG", "检索"],
    prompt: "选 embedding 要看维度、语言、长度、非对称检索哪些点？",
    answer: `维度影响存储与速度；语言与领域决定语义；超长需截断策略；query 与 doc 不对称时用专用双塔或指令型 embedding。

用自家点击/标注对做评测，关注尾部 query。`,
  },
  {
    id: "q-044",
    title: "向量数据库怎么选？Milvus、Pinecone、pgvector 怎么取舍？",
    category: "rag",
    difficulty: "applied",
    tags: ["向量检索", "向量库", "RAG", "检索"],
    prompt: "Milvus、Pinecone、pgvector 怎么取舍？",
    answer: `pgvector：已有 Postgres、体量中等。Milvus：大规模、运维可控。Pinecone：托管省心、成本与锁定需算。

看 QPS、过滤元数据能力、多租户、备份与合规区域。`,
  },
  {
    id: "q-045",
    title: "Rerank 为什么是性价比最高的 RAG 提升手段？和向量检索的本质区别是什么？",
    category: "rag",
    difficulty: "applied",
    tags: ["重排", "向量检索", "RAG", "检索"],
    prompt: "为何说 Rerank 常是性价比最高的提升？与向量检索本质差？",
    answer: `双塔向量是近似召回；Rerank 是 query-doc 交叉打分，精度高但贵，故只对 TopN 用。常能显著抬最终上下文质量。

把重排模型版本与阈值纳入回归。`,
  },
  {
    id: "q-046",
    title: "Query 改写解决什么问题？多轮对话里的指代消解怎么落地？",
    category: "rag",
    difficulty: "applied",
    tags: ["Query改写", "指代消解", "RAG", "检索"],
    prompt: "Query 改写解决什么？多轮指代如何落地？",
    answer: `解决口语省略、同义改写、多意图拆分。多轮先做指代消解得到独立查询，再检索，避免「它/上面那个」进索引。

改写失败要可回退到原 query，并记录改写前后召回对比。`,
  },
  {
    id: "q-047",
    title: "不同类型的 query 该走哪种检索？多路召回和查询路由怎么设计？",
    category: "rag",
    difficulty: "applied",
    tags: ["模型路由", "RAG", "检索"],
    prompt: "不同类型 query 如何路由到多路召回？",
    answer: `规则+小分类器：精确编号走关键词；概念解释走向量；对比类多路并行。路由要可观测，错误路由进坏案例集。

先简单路由跑通，再上复杂策略。`,
  },
  {
    id: "q-048",
    title: "GraphRAG 相比传统 RAG 补上了什么能力？什么时候才值得上它？",
    category: "rag",
    difficulty: "applied",
    tags: ["GraphRAG", "RAG", "检索"],
    prompt: "GraphRAG 补了什么？何时值得上？",
    answer: `补实体关系与全局概括，利好多跳推理与主题综述；建设与维护成本高。文档关系密集、要多跳答案时再考虑。

先证明传统 RAG 的失败模式确实是「缺结构」，再立项。`,
  },
  {
    id: "q-049",
    title: "RAG 里怎么处理\"检索不到\"的情况？（空召回兜底）",
    category: "rag",
    difficulty: "applied",
    tags: ["空召回", "RAG", "检索"],
    prompt: "检索为空时怎么兜底？",
    answer: `扩大召回、改写 query、放宽过滤；仍空则拒答或澄清，不生成假装有据的答案。可降级到站内搜索链接。

空召回率是独立 KPI。`,
  },
  {
    id: "q-050",
    title: "增量更新知识库时，怎么避免检索到过期内容？",
    category: "rag",
    difficulty: "applied",
    tags: ["增量更新", "RAG", "检索"],
    prompt: "增量更新如何避免过期内容被检索到？",
    answer: `文档版本号/生效时间写入元数据；检索过滤过期；更新时先写新后删旧或别名切换；缓存键含版本。

定期用「已知变更」探针测是否仍召回旧块。`,
  },
  {
    id: "q-051",
    title: "多轮对话的 RAG 怎么处理上下文和指代？",
    category: "rag",
    difficulty: "applied",
    tags: ["上下文", "指代消解", "RAG", "检索"],
    prompt: "多轮对话 RAG 如何处理上下文与指代？",
    answer: `每轮生成独立检索查询；会话摘要仅作辅助；避免把整段聊天记录无脑塞进检索器。工具与权限按轮次校验。

回归集要含指代、话题切换两类对话。`,
  },
  {
    id: "q-052",
    title: "RAG 和长上下文模型怎么选？什么时候不需要 RAG？",
    category: "rag",
    difficulty: "applied",
    tags: ["上下文", "长上下文", "RAG", "检索"],
    prompt: "RAG 与超长上下文模型如何选？何时可不做 RAG？",
    answer: `语料小、可全塞且更新少 → 长上下文可能更简单。语料大、要权限隔离与引用 → RAG。成本与缓存也要算。

混合：检索 Top 片段再进长窗口模型。`,
  },
  {
    id: "q-053",
    title: "一个 RAG 系统上线后效果不好，你怎么排查？",
    category: "rag",
    difficulty: "applied",
    tags: ["RAG", "检索"],
    prompt: "上线后效果差，你的排障顺序？",
    answer: `先看检索：命中率、过滤是否过严、切片坏了没。再看组装：噪声块、超长截断。最后看生成与提示。分层指标比端到端瞎调快。

保留 trace：query、召回列表、最终 prompt。`,
  },
  {
    id: "q-054",
    title: "忠实度（Faithfulness）和答案相关性（Relevance）为何要分开评？各自暴露什么问题？",
    category: "rag",
    difficulty: "applied",
    tags: ["忠实度", "相关性", "RAG", "检索"],
    prompt: "忠实度与答案相关性为何分家？",
    answer: `忠实度：是否仅依据资料。相关性：是否回答了用户问题。高相关低忠实=胡编；高忠实低相关=答非所问或堆砌引用。

两者分开才能决定改检索还是改生成指令。`,
  },
  {
    id: "q-055",
    title: "怎么构建 RAG 的评测集（Golden Set）？",
    category: "rag",
    difficulty: "applied",
    tags: ["评测集", "RAG", "检索"],
    prompt: "怎么建 RAG Golden Set？",
    answer: `真实日志抽样 + 难例（专有名词、多跳、空答案）；标注应引用的文档 id 与标准答；定期刷新防过拟合旧集。

集合要版本化，和模型/索引发布一起跑。`,
  },
  {
    id: "q-056",
    title: "分块太大\"语义稀释\"、太小\"语义断裂\"，小到大检索如何两全？（Parent-Child）",
    category: "rag",
    difficulty: "applied",
    tags: ["切片", "父子块", "RAG", "检索"],
    prompt: "父子块（小到大）如何缓解稀释与断裂？",
    answer: `子块用于精确召回，命中后上提父块/相邻块进上下文，兼顾定位与完整语义。注意父块去重与长度预算。

评测比较「仅子块」vs「子召父」。`,
  },
  {
    id: "q-057",
    title: "从原始文档到向量库，哪一步最容易\"悄悄毁掉\" RAG 质量？怎么防？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["向量检索", "RAG", "知识工程", "数据"],
    prompt: "从原始文档到向量库，哪一步最容易悄悄毁掉质量？怎么防？",
    answer: `解析与切片最危险：乱码、丢表、错标题会导致后面全错。防：解析抽检、结构断言、坏页隔离队列、切片可视回放。

入库流水线要有质量门禁，不是「脚本跑完即绿」。`,
  },
  {
    id: "q-058",
    title: "PDF 解析为什么特别难？有哪些坑和对策？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["PDF解析", "知识工程", "数据"],
    prompt: "PDF 解析难在哪？对策？",
    answer: `双栏、扫描件、公式、页眉页脚、文本顺序错乱。对策：版面分析、OCR 分流、表格专用模型、人工抽检关键文档。

按来源分通道，别用单一解析器打天下。`,
  },
  {
    id: "q-059",
    title: "表格数据在 RAG 里怎么处理？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["表格", "RAG", "知识工程", "数据"],
    prompt: "表格在 RAG 里怎么处理？",
    answer: `保留为结构化（CSV/Markdown 表）+ 行列说明；问答可走 Text2SQL/表检索；切分避免拆散表头。必要时表摘要与原表双存。

评测要含「读数/对比」类问题。`,
  },
  {
    id: "q-060",
    title: "RAG 里\"去重\"为什么重要？重复内容会怎样破坏检索质量？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["去重", "RAG", "知识工程", "数据"],
    prompt: "去重为何重要？重复如何破坏检索？",
    answer: `重复块霸占 TopK，多样性下降，重排也被同质内容占满。按内容哈希+近似去重，引用合并到规范文档。

更新时同步清理旧副本。`,
  },
  {
    id: "q-061",
    title: "Embedding 的批量生成怎么做？有什么注意点？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["Embedding", "吞吐", "知识工程", "数据"],
    prompt: "Embedding 批量生成注意点？",
    answer: `有界并发、失败重试、长度截断策略一致、模型版本写入元数据；大规模用队列与检查点，避免中断重来。

监控失败率与平均延迟，成本按 token 估算。`,
  },
  {
    id: "q-062",
    title: "向量库的元数据（Metadata）怎么设计？为什么重要？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["向量检索", "元数据", "知识工程", "数据"],
    prompt: "向量库元数据怎么设计？为何重要？",
    answer: `必备：doc_id、版本、时间、权限租户、类型、标题路径。用于过滤、审计、过期与引用展示。没有元数据就只能「裸向量大海捞针」。

过滤字段要建索引，热更新策略预先定义。`,
  },
  {
    id: "q-063",
    title: "文档的层级结构为何不能丢？切分和检索时怎么利用它补足上下文？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["上下文", "文档结构", "知识工程", "数据"],
    prompt: "文档层级结构如何在切分与检索中利用？",
    answer: `保留标题路径作前缀；按章切片；召回后拼接祖先标题。层级丢失会导致断章取义。

导航型问题可先检索目录再定位正文。`,
  },
  {
    id: "q-064",
    title: "知识库规模很大（千万级文档），数据侧怎么设计？",
    category: "knowledge",
    difficulty: "applied",
    tags: ["大规模", "知识工程", "数据"],
    prompt: "千万级文档数据侧怎么设计？",
    answer: `分层索引、分区（租户/时间）、增量管道、冷热分离、定期重建与质量抽样。检索侧限时与限候选。

先证明查询模式，再选分布式方案，避免过早大集群。`,
  },
  {
    id: "q-065",
    title: "一个 Agent 的\"规划能力\"是怎么来的？ReAct 和 Plan-and-Execute 的本质区别是什么？",
    category: "agent",
    difficulty: "applied",
    tags: ["ReAct", "规划", "Agent", "工具"],
    prompt: "Agent 规划能力从哪来？ReAct 与 Plan-and-Execute 差在哪？",
    answer: `规划来自提示模式+工具反馈闭环，不是魔法模块。ReAct 步步思考-行动；Plan-and-Execute 先计划再执行，计划可重规划。

任务短且环境多变偏 ReAct；步骤清晰、可并行偏计划式。`,
  },
  {
    id: "q-066",
    title: "工具职责怎么划分？\"工具太多\"和\"工具职责重叠\"会带来什么问题？",
    category: "agent",
    difficulty: "applied",
    tags: ["工具调用", "Agent", "工具"],
    prompt: "工具太多或职责重叠会怎样？如何划分？",
    answer: `模型选择困难、误调用上升。按领域收敛工具，命名清晰、参数少而严，重叠工具合并或显式互斥。

用调用分布与失败案例反向删工具。`,
  },
  {
    id: "q-067",
    title: "遇到中途变化，ReAct 与 Plan-and-Execute 如何取舍？",
    category: "agent",
    difficulty: "applied",
    tags: ["ReAct", "规划", "Agent", "工具"],
    prompt: "中途环境变化时，两种规划范式如何取舍？",
    answer: `变化频繁：ReAct 或短计划+频繁重规划。变化少、步骤贵：详细计划并设检查点。失败时明确「作废计划」信号。

关键路径加人工确认。`,
  },
  {
    id: "q-068",
    title: "Agent 的记忆（Memory）怎么设计？短期和长期怎么分？",
    category: "agent",
    difficulty: "applied",
    tags: ["记忆", "Agent", "工具"],
    prompt: "Agent 记忆如何分短期与长期？",
    answer: `短期：当前 trace 内消息与工具结果。长期：用户偏好、项目事实，写入可检索存储并设权限与过期。防把密钥写进长期记忆。

读写都要审计。`,
  },
  {
    id: "q-069",
    title: "Agent 为什么容易陷入死循环？怎么防？",
    category: "agent",
    difficulty: "applied",
    tags: ["工具循环", "Agent", "工具"],
    prompt: "Agent 为何易死循环？怎么防？",
    answer: `同一失败策略反复试、目标含糊、无停止条件。防：步数/时间/费用预算、重复指纹、强制总结退出、错误分类后换策略。

循环 trace 进回归。`,
  },
  {
    id: "q-070",
    title: "多 Agent 什么时候是刚需、什么时候是过度设计？判断标准是什么？",
    category: "agent",
    difficulty: "applied",
    tags: ["多Agent", "Agent", "工具"],
    prompt: "多 Agent 何时刚需、何时过度？",
    answer: `刚需：角色冲突明显、需隔离权限或并行专业域。过度：单线程工具调用就能完成却硬上消息总线。

判断：单 Agent 失败模式是否真是「缺角色」而非「缺工具/缺数据」。`,
  },
  {
    id: "q-071",
    title: "何时需要人工审批？怎样避免审批恢复后重复执行？",
    category: "agent",
    difficulty: "applied",
    tags: ["人机协同", "Agent", "工具"],
    prompt: "何时人工审批？恢复后如何避免重复执行？",
    answer: `外部副作用、高金额、删改、发信。审批前后用幂等键与状态机：已执行步骤不重放，从 checkpoint 继续。

超时审批要有取消与补偿策略。`,
  },
  {
    id: "q-072",
    title: "Agent 的工具调用失败了怎么处理？错误怎么回传？",
    category: "agent",
    difficulty: "applied",
    tags: ["工具调用", "Agent", "工具"],
    prompt: "工具失败如何回传才有用？",
    answer: `返回结构化错误：类型、是否可重试、建议下一步；避免巨大堆栈。模型据此改参或换工具，执行层限制重试次数。

把常见错误码映射成短提示。`,
  },
  {
    id: "q-073",
    title: "Agent 的上下文会越滚越大，怎么管理？（衔接分类 7）",
    category: "agent",
    difficulty: "applied",
    tags: ["上下文", "Agent", "工具"],
    prompt: "Agent 上下文膨胀怎么管？（衔接到 Harness）",
    answer: `预算 token、压缩旧步骤、工具结果摘要化、分区存放大块到可检索存储。细节策略见运行工程分类。

先有硬预算，再谈聪明压缩。`,
  },
  {
    id: "q-074",
    title: "ReAct 的 \"Thought\" 和 CoT 有什么区别？它们各自解决了什么问题？",
    category: "agent",
    difficulty: "applied",
    tags: ["CoT", "ReAct", "Agent", "工具"],
    prompt: "ReAct 的 Thought 与普通 CoT 差在哪？",
    answer: `CoT 多在单次生成里推理；ReAct 的 Thought 服务于与环境交互的下一步行动选择，并交替出现 Observation。

评价时看行动是否必要，而不只看推理文采。`,
  },
  {
    id: "q-075",
    title: "并行工具调用（Parallel Tool Calls）怎么做才真正省延迟？有哪些坑？",
    category: "agent",
    difficulty: "applied",
    tags: ["工具调用", "并行调用", "Agent", "工具"],
    prompt: "并行工具调用如何真省延迟？有哪些坑？",
    answer: `仅当工具无依赖时可并行；汇总后再生成。坑：竞态写同一资源、错误部分失败难回滚、上下文突然变长。

依赖分析 + 有界并行 + 部分失败策略。`,
  },
  {
    id: "q-076",
    title: "怎么评估一个 Agent 好不好？（衔接分类 10）",
    category: "agent",
    difficulty: "applied",
    tags: ["Agent", "工具"],
    prompt: "如何评估 Agent 好不好？",
    answer: `任务成功率、步数、费用、违规率、人工介入率；分层看工具选择正确与最终目标。用固定场景脚本回归。

只看最终自然语言「像不像」不够。`,
  },
  {
    id: "q-077",
    title: "Agent 的\"权限\"怎么控制？为什么写操作要审批？",
    category: "agent",
    difficulty: "applied",
    tags: ["人机协同", "权限", "Agent", "工具"],
    prompt: "Agent 权限怎么控？为何写操作要审批？",
    answer: `工具级 RBAC、参数白名单、环境沙箱；读宽写严。写操作不可逆或有外部影响，必须审批或二次确认。

最小权限默认拒绝。`,
  },
  {
    id: "q-078",
    title: "模型会\"幻觉式\"调用不存在的工具或捏造参数，怎么从源头和执行层双重防御？",
    category: "agent",
    difficulty: "applied",
    tags: ["幻觉", "工具调用", "Agent", "工具"],
    prompt: "模型幻觉出不存在的工具或参数，如何双防？",
    answer: `源头：只下发真实工具 schema。执行层：未知工具名拒绝；参数 Schema 校验失败不执行。

监控「未知工具」率。`,
  },
  {
    id: "q-079",
    title: "Agent 编排器该不该用 LLM 当调度核心？确定性和智能怎么分离？",
    category: "agent",
    difficulty: "applied",
    tags: ["编排", "Agent", "工具"],
    prompt: "编排器该不该用 LLM 当调度核心？",
    answer: `确定性流程（支付、合规）用状态机/工作流；不确定的子问题再调 LLM。混用时 LLM 建议、代码裁决。

别让模型直接掌握所有副作用开关。`,
  },
  {
    id: "q-080",
    title: "一个 Agent 项目，你怎么从 0 设计到上线？",
    category: "agent",
    difficulty: "system",
    tags: ["Agent", "工具"],
    prompt: "从 0 设计一个 Agent 到上线，你的里程碑？",
    answer: `场景与成功标准 → 工具与权限 → 单路径 MVP → trace/评测集 → 预算与熔断 → 灰度 → 反馈闭环。每阶段有可演示脚本。

文档化失败模式比堆框架重要。`,
  },
  {
    id: "q-081",
    title: "Agent 框架和 Harness 工程的分工边界在哪？为什么 Harness 才决定生产可用性？",
    category: "harness",
    difficulty: "system",
    tags: ["Harness", "上下文"],
    prompt: "Agent 框架与 Harness 的边界？为何 Harness 决定能否上生产？",
    answer: `框架提供图/工具抽象；Harness 管预算、权限、持久化、重试、观测与人机环。生产事故多出在后者。

选型先看 Harness 能力，再看 DSL 好不好看。`,
  },
  {
    id: "q-082",
    title: "Agent 对话太长、上下文爆了怎么办？",
    category: "harness",
    difficulty: "system",
    tags: ["上下文", "Harness"],
    prompt: "对话太长上下文爆了怎么办？",
    answer: `硬限额、摘要折叠、工具结果外置、开启新 session 并继承要点。爆窗前告警，而不是 OOM 后才发现。

按任务类型设不同预算。`,
  },
  {
    id: "q-083",
    title: "\"中间遗忘效应\"是什么？怎么缓解？",
    category: "harness",
    difficulty: "system",
    tags: ["中间遗忘", "Harness", "上下文"],
    prompt: "什么是中间遗忘效应？如何缓解？",
    answer: `超长上下文中，模型对中间段利用变差。缓解：重要信息前置/后置、检索代替堆历史、分段总结、针测回归。

不要假设「塞进去就一定看得到」。`,
  },
  {
    id: "q-084",
    title: "三种上下文管理策略（固定窗口/滑动窗口/压缩）怎么选？",
    category: "harness",
    difficulty: "system",
    tags: ["上下文", "上下文管理", "上下文压缩", "Harness"],
    prompt: "固定窗口 / 滑动窗口 / 压缩三种策略怎么选？",
    answer: `短任务固定窗口；持续会话滑动保留近况；超长任务周期性压缩。可组合：滑窗 + 异步摘要。

用任务长度分布做策略表。`,
  },
  {
    id: "q-085",
    title: "无关信息如何\"污染\"上下文并稀释关键信号？怎么动态清理？",
    category: "harness",
    difficulty: "system",
    tags: ["上下文", "Harness"],
    prompt: "无关信息如何污染上下文？怎么动态清理？",
    answer: `噪声块降低信噪比，诱导跑题。按相关性打分裁剪、过期工具结果删除、用户更正覆盖旧假设。

清理策略要可配置并打点。`,
  },
  {
    id: "q-086",
    title: "Agent 的中断恢复怎么做？为什么需要 Checkpoint？",
    category: "harness",
    difficulty: "system",
    tags: ["Checkpoint", "Harness", "上下文"],
    prompt: "中断恢复为何需要 Checkpoint？",
    answer: `保存已确认状态、已执行副作用幂等键、下一步意图。进程挂了可从检查点继续，避免重复下单。

checkpoint 要版本兼容与加密敏感字段。`,
  },
  {
    id: "q-087",
    title: "为什么 Agent 调试和评估必须以 Trace 为主键？没有 trace 会怎样？",
    category: "harness",
    difficulty: "system",
    tags: ["Trace", "Harness", "上下文"],
    prompt: "为何调试评估必须以 Trace 为主键？",
    answer: `没有 trace 无法复现工具序、提示与费用。统一 request/trace id 贯穿日志、评测与用户反馈。

缺失 trace 的环境等于无法做事故复盘。`,
  },
  {
    id: "q-088",
    title: "Agent 的权限边界怎样落实到执行层？",
    category: "harness",
    difficulty: "system",
    tags: ["权限", "Harness", "上下文"],
    prompt: "权限边界如何落实到执行层？",
    answer: `每个工具调用过策略引擎：身份、租户、动作、资源。模型输出只是意图，默认拒绝。

审计日志不可被模型改写。`,
  },
  {
    id: "q-089",
    title: "Agent 的状态持久化在哪一层？为什么不能只存 Redis？",
    category: "harness",
    difficulty: "system",
    tags: ["状态持久化", "Harness", "上下文"],
    prompt: "状态持久化放哪一层？为何不能只放 Redis？",
    answer: `Redis 适合热状态与锁；权威状态进持久库，含审计与恢复。重启、丢缓存、主从切换都会打穿「只靠 Redis」。

大对象放对象存储，库中存指针。`,
  },
  {
    id: "q-090",
    title: "资源有限时，Agent 的优化顺序是什么？",
    category: "harness",
    difficulty: "system",
    tags: ["Harness", "上下文"],
    prompt: "资源有限时 Agent 优化顺序？",
    answer: `先砍无效工具轮次与上下文长度 → 缓存 → 小模型路由 → 再考虑推理侧加速。用费用与成功率双指标。

过早上多 Agent 往往浪费资源。`,
  },
  {
    id: "q-091",
    title: "LangChain 如何解决厂商锁定和状态管理？LCEL 管道和 LangGraph 怎么分工？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["多厂商", "LangChain", "LCEL", "LangGraph", "框架"],
    prompt: "LangChain 如何减轻厂商锁定与状态问题？LCEL 与 LangGraph 怎么分工？",
    answer: `统一接口适配多模型；LCEL 适合线性可组合管道；有环、分支、持久化状态用 LangGraph。

简单链勿上图，复杂代理勿硬塞 LCEL。`,
  },
  {
    id: "q-092",
    title: "Chain 和 Agent 的区别是什么？什么时候用哪个？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["框架", "抽象"],
    prompt: "Chain 和 Agent 区别？何时用哪个？",
    answer: `Chain：预定义步骤。Agent：模型动态选工具。步骤稳定用 Chain，探索式任务用 Agent，并可在 Chain 内嵌有限 Agent。

能量化成功率再选复杂度。`,
  },
  {
    id: "q-093",
    title: "LangGraph 是什么？核心概念有哪些？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["LangGraph", "框架", "抽象"],
    prompt: "LangGraph 核心概念有哪些？",
    answer: `状态、节点、边、条件路由、checkpoint、可能的人机节点。用图显式化控制流，便于恢复与调试。

先画状态机，再写代码。`,
  },
  {
    id: "q-094",
    title: "Spring AI 相比直接调 SDK 有什么优势？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["Spring AI", "框架", "抽象"],
    prompt: "Spring AI 相对直接调 SDK 的优势？",
    answer: `与 Spring 生态集成：配置、观测、Bean 注入、统一顾问/工具抽象，适合已有 Java 企业栈。直接 SDK 更轻但样板多。

看团队栈与运维一致性。`,
  },
  {
    id: "q-095",
    title: "用 Spring AI 实现 RAG 的流程？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["Spring AI", "RAG", "框架", "抽象"],
    prompt: "用 Spring AI 做 RAG 的典型流程？",
    answer: `文档摄入 → 向量存储抽象 → 检索顾问组装提示 → 调用聊天客户端 → 返回带引用结果。注意同一套 Metadata 过滤。

与语言无关的评测集仍要自建。`,
  },
  {
    id: "q-096",
    title: "Spring AI 的 Function Calling 原理？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["Function Calling", "Spring AI", "框架", "抽象"],
    prompt: "Spring AI Function Calling 原理简述？",
    answer: `注册函数描述 → 模型返回调用请求 → 框架执行 Bean/函数 → 结果回灌对话。本质仍是工具循环，框架帮你接线。

权限与校验仍要自己做。`,
  },
  {
    id: "q-097",
    title: "用框架（LangChain/Spring AI）和直接调 SDK，怎么选？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["LangChain", "Spring AI", "框架", "抽象"],
    prompt: "框架 vs 直调 SDK 怎么选？",
    answer: `原型、少依赖 → SDK。多模型、复杂编排、团队约定统一 → 框架。也可以「核心直调 + 薄封装」。

避免为用框架而用框架。`,
  },
  {
    id: "q-098",
    title: "Runnable 接口为什么是 LangChain 的\"统一抽象\"？它带来什么组合能力？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["LangChain", "Runnable", "框架", "抽象"],
    prompt: "Runnable 为何是 LangChain 统一抽象？组合能力？",
    answer: `统一 invoke/stream/batch 接口，便于管道串联、并行扇出、统一回调与重试装饰。业务把步骤都变成 Runnable 即可组装。

抽象泄漏时仍要懂底层 API。`,
  },
  {
    id: "q-099",
    title: "各 Agent 框架的 Tool 抽象有何共性？工具描述写不好为什么模型就不调用？",
    category: "frameworks",
    difficulty: "applied",
    tags: ["工具调用", "框架", "抽象"],
    prompt: "各框架 Tool 抽象共性？描述写差为何不调用？",
    answer: `共性：名称、描述、JSON 参数、执行回调。描述含糊或与其他工具撞车，模型会拒调或乱调。

写工具文档像写给新人看的 API。`,
  },
  {
    id: "q-100",
    title: "一个 AI 应用框架的核心组件有哪些？你如何设计一个最小框架？",
    category: "frameworks",
    difficulty: "system",
    tags: ["框架", "抽象"],
    prompt: "若设计最小 AI 应用框架，核心组件？",
    answer: `模型客户端、消息类型、工具注册与执行、检索接口、trace、配置与限流。先做这六块，再加图编排。

示例应用驱动设计，拒绝大而全。`,
  },
  {
    id: "q-101",
    title: "量化为什么能加速推理？精度损伤集中在哪？如何按场景选量化方案？",
    category: "deployment",
    difficulty: "system",
    tags: ["量化", "推理", "部署"],
    prompt: "量化为何加速？精度损伤在哪？如何选型？",
    answer: `降位宽减显存与带宽压力，抬吞吐。损伤常在异常值通道与尾部任务。按场景：延迟优先 INT8/FP8，极致压缩再看更低比特+校准。

用业务集看质量跌幅，不只看困惑度。`,
  },
  {
    id: "q-102",
    title: "KV Cache 节省了哪些计算？长文本下又有哪些瓶颈？",
    category: "deployment",
    difficulty: "system",
    tags: ["KV Cache", "推理", "部署"],
    prompt: "KV Cache 省了什么？长文本瓶颈？",
    answer: `省去重复前缀的 K/V 重算，降 TTFT/步进成本。长文本下 KV 显存线性涨，带宽吃紧，需要分页、压缩或限制并发。

容量规划按「并发 × 上下文 × 层 × 精度」。`,
  },
  {
    id: "q-103",
    title: "vLLM 是什么？它为什么快？",
    category: "deployment",
    difficulty: "system",
    tags: ["vLLM", "推理", "部署"],
    prompt: "vLLM 是什么？为何快？",
    answer: `高吞吐推理服务，核心常见于 PagedAttention、连续批处理、高效调度。面向多请求共享 GPU。

适合 API 形服务；不是所有端侧场景的最优解。`,
  },
  {
    id: "q-104",
    title: "自部署开源模型，Ollama、vLLM、llama.cpp 三者的定位和适用场景怎么区分？",
    category: "deployment",
    difficulty: "system",
    tags: ["开源模型", "vLLM", "Ollama", "llama.cpp", "推理"],
    prompt: "Ollama、vLLM、llama.cpp 定位差异？",
    answer: `Ollama：本地易用。llama.cpp：CPU/端侧友好。vLLM：服务器高吞吐。按部署形态选，勿混用评测口径。`,
  },
  {
    id: "q-105",
    title: "冷启动为什么是弹性伸缩的痛点？一张显卡能跑多大模型怎么估算？",
    category: "deployment",
    difficulty: "system",
    tags: ["冷启动", "推理", "部署"],
    prompt: "冷启动为何痛？如何估一张卡能跑多大模型？",
    answer: `权重加载、编译/捕获、显存碎片导致扩容慢。估算：参数量×字节/参数 + KV + 框架开销，留余量。

弹性策略：常驻最小副本、预热池、量化减小足迹。`,
  },
  {
    id: "q-106",
    title: "为什么\"解码（decode）阶段是内存带宽受限\"？这对优化有什么指导意义？",
    category: "deployment",
    difficulty: "system",
    tags: ["Decode", "推理", "部署"],
    prompt: "为何 decode 常是内存带宽受限？优化启示？",
    answer: `每步生成要读大量 KV/权重，算力吃不饱带宽。启示：量化、融合核、减少层通信量、合理批大小，而不是只堆 FLOPs。

profile 再优化。`,
  },
  {
    id: "q-107",
    title: "Continuous Batching 解决了静态批处理的什么问题？为什么能显著提吞吐？",
    category: "deployment",
    difficulty: "system",
    tags: ["Continuous Batching", "推理", "部署"],
    prompt: "Continuous Batching 解决静态批的什么问题？",
    answer: `静态批等待最长请求拖累；连续批处理动态插入/退出请求，提高 GPU 利用率与吞吐。

需配合分页 KV 等，注意公平性与尾延迟。`,
  },
  {
    id: "q-108",
    title: "应用岗需要了解哪些\"模型服务化\"的基础设施？",
    category: "deployment",
    difficulty: "system",
    tags: ["模型服务", "推理", "部署"],
    prompt: "应用岗要懂哪些模型服务化基础设施？",
    answer: `网关鉴权、队列、自动扩缩、显存/KV 指标、多模型路由、金丝雀、降级开关。能读懂延迟直方图与 429 来源。

不必从零写引擎，但要会提需求与排障。`,
  },
  {
    id: "q-109",
    title: "应用侧怎么评估一个 LLM 应用？和跑 benchmark 有什么区别？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["Benchmark", "评估", "评测"],
    prompt: "应用侧评估与跑公开 benchmark 差在哪？",
    answer: `应用侧对齐真实用户任务、工具与资料；benchmark 测通用能力。要用日志抽样与业务 KPI，公开榜只能参考。

建立自己的黄金集。`,
  },
  {
    id: "q-110",
    title: "线上出错的案例怎么系统性归因，并把它变成改进信号？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["归因", "评估", "评测"],
    prompt: "线上错误如何系统性归因并变成改进信号？",
    answer: `按层打标签：检索/工具/提示/模型/产品预期。每周主题归类，进评测集与修复队列，闭环看复发率。

没有标签的反馈难沉淀。`,
  },
  {
    id: "q-111",
    title: "怎么构建 LLM 应用的评测集（Golden Set）？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["评测集", "评估", "评测"],
    prompt: "怎么构建应用 Golden Set？",
    answer: `分层抽样、难例过采样、标注标准答与允许拒答；版本冻结；防泄漏到提示。规模够支撑分维度置信。

与发布流水线绑定。`,
  },
  {
    id: "q-112",
    title: "LLM-as-Judge 为什么不能直接替代人工评估？它的偏见和校准怎么做？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["LLM-as-Judge", "评估", "评测"],
    prompt: "LLM-as-Judge 局限与校准？",
    answer: `有位置偏见、长度偏见、讨好性。应用：双盲、交换顺序、与人工小样本校准、多法官投票，关键决策仍要人工。

Judge 提示也要回归。`,
  },
  {
    id: "q-113",
    title: "评测分数提高两分，如何判断是否值得发布？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["评估", "评测"],
    prompt: "分数提高两分是否该发版？",
    answer: `看置信区间、分片是否只涨易例、延迟成本是否恶化、安全指标有无跌。小流量验证后再全量。

分数服务决策，不是决策本身。`,
  },
  {
    id: "q-114",
    title: "用户反馈（thumbs up/down）怎么用于评估？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["评估", "评测"],
    prompt: "点赞点踩如何用于评估？",
    answer: `作弱标签：纠偏采样、发现新失败模式；注意选择偏差与噪声。结合事后标注与归因，不单靠比率做门禁。`,
  },
  {
    id: "q-115",
    title: "LLM 应用怎么做 A/B 测试？为什么必须先离线评测再小流量？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["A/B测试", "评估", "评测"],
    prompt: "LLM 应用 A/B 注意什么？为何先离线再小流量？",
    answer: `先离线门禁防明显退化；小流量看体验与成本；注意用户间干扰与工具副作用。指标预先注册。

随机化与记录版本。`,
  },
  {
    id: "q-116",
    title: "LLM 应用为什么必须配回归测试门禁？非确定性输出下怎么防退化？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["回归测试", "评估", "评测"],
    prompt: "非确定性下如何做回归门禁？",
    answer: `固定种子仍不全稳：用多次运行统计、允许波动带宽、对关键案例要求「必须通过」。格式类可用确定性校验器。

门禁失败阻断发布。`,
  },
  {
    id: "q-117",
    title: "怎么让 Agent 持续变好？完整反馈闭环怎么设计？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["反馈闭环", "评估", "评测"],
    prompt: "Agent 持续变好的反馈闭环？",
    answer: `trace → 标注 → 评测集 → 改工具/提示 → 再跑回归 → 灰度。产品反馈进同一漏斗。

专人看周报指标。`,
  },
  {
    id: "q-118",
    title: "评估 LLM 应用时，怎么平衡\"质量、延迟、成本\"三个维度？",
    category: "evaluation",
    difficulty: "applied",
    tags: ["成本", "评估", "评测"],
    prompt: "质量、延迟、成本如何平衡？",
    answer: `设可发布的帕累托边界：底线质量、P95、单请求成本。路由与缓存换成本；复杂题走强模型。看板三线一起看。`,
  },
  {
    id: "q-119",
    title: "LLM 调用该怎么重试？哪些状态码能重试、哪些绝不能？",
    category: "reliability",
    difficulty: "system",
    tags: ["重试", "可靠性", "工程"],
    prompt: "LLM 调用重试原则？哪些绝不能盲重试？",
    answer: `可重试：超时、429、5xx（带退避抖动）。不重试：4xx 业务错、已可能产生副作用且无幂等键的请求。

重试预算计入总超时。`,
  },
  {
    id: "q-120",
    title: "为什么要把\"模型调用\"和\"副作用\"分离？幂等键怎么用？",
    category: "reliability",
    difficulty: "system",
    tags: ["幂等", "可靠性", "工程"],
    prompt: "为何分离模型调用与副作用？幂等键怎么用？",
    answer: `模型可重试，转账/发信不可盲目重试。先计划后执行，执行带幂等键，状态机记录完成。

回调与巡检对账。`,
  },
  {
    id: "q-121",
    title: "怎么防止\"单个 bug 把账单烧穿\"？成本熔断器该在哪一层、按什么指标触发？",
    category: "reliability",
    difficulty: "system",
    tags: ["成本熔断", "成本", "可靠性", "工程"],
    prompt: "如何防单 bug 烧穿账单？熔断放哪？",
    answer: `按用户/租户/全局的 token 与费用配额；异常倍率告警；钥匙限额。熔断在网关与编排层双保险。

演练「失控循环」剧本。`,
  },
  {
    id: "q-122",
    title: "模型返回的工具参数不合法，怎么处理？",
    category: "reliability",
    difficulty: "system",
    tags: ["工具调用", "可靠性", "工程"],
    prompt: "工具参数不合法怎么处理？",
    answer: `Schema 拒绝执行 → 结构化错误回模型有限次修复 → 仍失败则结束并提示用户。不把脏参数送下游。`,
  },
  {
    id: "q-123",
    title: "流式输出的分片怎么拼接和解析？（衔接分类 2）",
    category: "reliability",
    difficulty: "system",
    tags: ["流式", "可靠性", "工程"],
    prompt: "流式分片如何拼接解析？",
    answer: `按事件缓冲，处理不完整 UTF-8/JSON；最终再校验。工具调用增量要状态机组装。单测截断帧。`,
  },
  {
    id: "q-124",
    title: "LLM 应用怎么降级（Degradation）？降级策略有哪些？",
    category: "reliability",
    difficulty: "system",
    tags: ["降级", "可靠性", "工程"],
    prompt: "降级策略有哪些？",
    answer: `换小模型、关工具、只检索不生成、返回缓存/模板、只读模式。分级开关，与 SLO 联动。`,
  },
  {
    id: "q-125",
    title: "LLM 应用的双层限流怎么设计？上游 429 和自身限流各怎么应对？",
    category: "reliability",
    difficulty: "system",
    tags: ["限流", "可靠性", "工程"],
    prompt: "双层限流怎么设计？",
    answer: `自身令牌桶保护后端；尊重上游 429 的 retry-after。用户级与全局级分离，公平排队。`,
  },
  {
    id: "q-126",
    title: "LLM 应用怎么做缓存？缓存什么、怎么失效？",
    category: "reliability",
    difficulty: "system",
    tags: ["缓存", "可靠性", "工程"],
    prompt: "缓存什么、如何失效？",
    answer: `缓存：嵌入、检索结果、幂等完成的生成（注意个性化）。失效：文档版本、提示版本、用户偏好变更。键设计防串租户。`,
  },
  {
    id: "q-127",
    title: "LLM 应用的可观测性怎么做？要监控哪些指标？",
    category: "reliability",
    difficulty: "system",
    tags: ["可观测性", "可靠性", "工程"],
    prompt: "可观测性监控哪些指标？",
    answer: `请求量、错误码、TTFT、总延迟、token、费用、工具失败率、检索空率。日志含 trace id，隐私脱敏。`,
  },
  {
    id: "q-128",
    title: "异步处理里，怎么保证 LLM 任务的\"不丢、不重、不卡死\"？",
    category: "reliability",
    difficulty: "system",
    tags: ["异步任务", "可靠性", "工程"],
    prompt: "异步 LLM 任务如何不丢不重不卡死？",
    answer: `持久队列、消费幂等、可见性超时、死信队列、心跳与租约。状态对外可查询。`,
  },
  {
    id: "q-129",
    title: "多个 LLM 调用怎么编排？串行、并行、DAG 怎么选？",
    category: "reliability",
    difficulty: "system",
    tags: ["编排", "可靠性", "工程"],
    prompt: "多调用串行/并行/DAG 怎么选？",
    answer: `有依赖串行；无依赖并行；复杂用 DAG 并设超时与取消。扇出要有界。`,
  },
  {
    id: "q-130",
    title: "流式场景下游消费不过来怎么办？背压机制如何防止内存被拖垮？",
    category: "reliability",
    difficulty: "system",
    tags: ["流式", "背压", "可靠性", "工程"],
    prompt: "流式下游慢如何背压？",
    answer: `有界缓冲、暂停拉取、丢弃策略仅用于可降级场景；避免无限队列撑爆内存。协议层支持取消。`,
  },
  {
    id: "q-131",
    title: "LLM 应用怎么做灰度发布和回滚？",
    category: "reliability",
    difficulty: "system",
    tags: ["灰度发布", "回滚", "可靠性", "工程"],
    prompt: "灰度与回滚怎么做？",
    answer: `按用户百分比切模型/提示版本；关键指标守护；一键回切。数据面与配置面版本一致。`,
  },
  {
    id: "q-132",
    title: "怎么保证 LLM 输出的\"确定性\"和\"可复现\"？",
    category: "reliability",
    difficulty: "system",
    tags: ["可复现", "可靠性", "工程"],
    prompt: "输出确定性与可复现如何尽量保证？",
    answer: `低温、种子、关采样随机；仍受实现影响。评测多次取众数；审计存完整输入输出。`,
  },
  {
    id: "q-133",
    title: "LLM 应用的\"超时、重试、幂等\"三者怎么协同设计？",
    category: "reliability",
    difficulty: "system",
    tags: ["超时", "重试", "幂等", "可靠性", "工程"],
    prompt: "超时、重试、幂等如何协同？",
    answer: `总时限包住重试；每试带同一幂等键；超时取消下游。文档写清「最多执行一次」语义。`,
  },
  {
    id: "q-134",
    title: "一个高并发 LLM 应用，你会怎么设计架构？",
    category: "reliability",
    difficulty: "system",
    tags: ["高并发", "可靠性", "工程"],
    prompt: "高并发 LLM 应用架构要点？",
    answer: `接入层限流 → 队列 → 模型池/路由 → 缓存 → 异步化长任务；隔离租户；熔断降级；全链路 trace。容量按 GPU/API 配额规划。`,
  },
  {
    id: "q-135",
    title: "直接注入 vs 间接注入，哪个更难防？为什么间接注入更隐蔽？",
    category: "safety",
    difficulty: "applied",
    tags: ["提示注入", "间接注入", "安全", "合规"],
    prompt: "直接注入与间接注入谁更难防？为何？",
    answer: `间接注入藏在文档/网页里，用户无恶意也中招，更难防。需检索内容隔离、指令与数据分通道、工具输出过滤。`,
  },
  {
    id: "q-136",
    title: "为什么\"提示词里写安全规则\"防不住攻击？正确的防御是什么？",
    category: "safety",
    difficulty: "applied",
    tags: ["安全", "合规"],
    prompt: "为何提示词安全规则不够？正确防御？",
    answer: `模型可被说服忽略规则。正确：执行层鉴权、沙箱、输出过滤、监控。提示只是辅助。`,
  },
  {
    id: "q-137",
    title: "LLM 应用有哪些常见安全风险？（OWASP LLM Top 10）",
    category: "safety",
    difficulty: "applied",
    tags: ["OWASP", "安全", "合规"],
    prompt: "常见 LLM 应用安全风险（对照 OWASP 思路）？",
    answer: `提示注入、数据泄露、不安全插件、模型拒绝服务（刷 token）、供应链、过度代理权限等。按威胁建模列资产与信任边界。`,
  },
  {
    id: "q-138",
    title: "怎么防止模型泄露敏感信息（system prompt、训练数据、用户数据）？",
    category: "safety",
    difficulty: "applied",
    tags: ["System Prompt", "数据泄露", "Prompt", "安全", "合规"],
    prompt: "防泄露 system prompt、训练数据、用户数据？",
    answer: `最小上下文、脱敏、隔离租户、禁止回显密钥、出站 DLP、检索权限过滤。监控异常长输出与重复系统句。`,
  },
  {
    id: "q-139",
    title: "LLM 应用怎么做内容审核（Content Moderation）？",
    category: "safety",
    difficulty: "applied",
    tags: ["内容审核", "安全", "合规"],
    prompt: "内容审核怎么做？",
    answer: `输入输出双检、分级策略、人审队列；与业务标签对齐。延迟敏感路径用异步复审+回溯。`,
  },
  {
    id: "q-140",
    title: "LLM 应用的合规要注意什么？（数据安全、备案、跨境）",
    category: "safety",
    difficulty: "applied",
    tags: ["合规", "安全"],
    prompt: "合规注意点？",
    answer: `数据驻留、同意与目的限制、日志保存周期、行业备案/跨境评估。法务早介入，技术留审计开关。`,
  },
  {
    id: "q-141",
    title: "怎么估算一个 LLM 应用的成本？",
    category: "product-cost",
    difficulty: "applied",
    tags: ["成本", "产品"],
    prompt: "如何估算 LLM 应用成本？",
    answer: `量：日请求 × 平均输入/输出 token × 单价 + 工具/检索/人工。加峰值余量与失败重试。做成表格随版本更新。`,
  },
  {
    id: "q-142",
    title: "怎么降低 LLM 应用的成本？有哪些手段？",
    category: "product-cost",
    difficulty: "applied",
    tags: ["成本", "产品"],
    prompt: "降本手段有哪些？",
    answer: `缓存、短提示、小模型路由、检索减噪、批处理、限流滥用、量化自托管。先量再砍。`,
  },
  {
    id: "q-143",
    title: "什么场景\"不该用 LLM\"？怎么判断？",
    category: "product-cost",
    difficulty: "applied",
    tags: ["成本", "产品"],
    prompt: "什么场景不该用 LLM？",
    answer: `规则稳定可确定、延迟/成本极敏、必须百分百正确的合规计算。能用检索+模板就别生成。`,
  },
  {
    id: "q-144",
    title: "模型路由怎样降低成本，如何验证质量没有退化？",
    category: "product-cost",
    difficulty: "applied",
    tags: ["成本", "模型路由", "产品"],
    prompt: "模型路由如何降本且不损质量？",
    answer: `简单题小模型，难例大模型；用分类器/启发式；离线集与小流量验证质量不掉。监控误路由。`,
  },
  {
    id: "q-145",
    title: "怎么判断一个 AI 功能\"值不值得做\"？（ROI 与场景判断）",
    category: "product-cost",
    difficulty: "applied",
    tags: ["ROI", "成本", "产品"],
    prompt: "如何判断 AI 功能值不值得做？",
    answer: `用户痛点频率 × 可自动化收益 − 成本与风险。先手写原型测意愿，再投资工程。`,
  },
  {
    id: "q-146",
    title: "一个 AI 应用从想法到上线，你会怎么推进？",
    category: "product-cost",
    difficulty: "system",
    tags: ["成本", "产品"],
    prompt: "从想法到上线如何推进？",
    answer: `问题定义 → 手工/脚本验证 → MVP 指标 → 评测集 → 安全审查 → 灰度 → 运营闭环。周节奏演示。`,
  },
  {
    id: "q-147",
    title: "大模型预训练为什么叫\"自监督学习\"？它和传统监督学习有什么本质区别？",
    category: "ml-basics",
    difficulty: "foundation",
    tags: ["预训练", "机器学习", "深度学习"],
    prompt: "为何说大模型预训练是自监督？与传统监督差在哪？",
    answer: `用数据自身构造目标（如下一词），无需人工逐条标注类别。监督依赖外部标签。自监督可吃大规模文本，再对齐到人类偏好。`,
  },
  {
    id: "q-148",
    title: "微调 LLM 时，\"过拟合\"具体表现为哪些现象？怎么在微调中避免？",
    category: "ml-basics",
    difficulty: "foundation",
    tags: ["过拟合", "微调", "机器学习", "深度学习"],
    prompt: "微调过拟合有哪些现象？如何避免？",
    answer: `训练集背答案、泛化差、对提示极敏感。避免：少步数、正则/Dropout、早停、更多样数据、LoRA 降容量、保留通用评测。`,
  },
  {
    id: "q-149",
    title: "LoRA 为什么能\"只改一点点参数\"就完成微调？它解决了什么痛点？",
    category: "ml-basics",
    difficulty: "foundation",
    tags: ["LoRA", "微调", "机器学习", "深度学习"],
    prompt: "LoRA 为何改一点点参数就能微调？痛点？",
    answer: `在侧路低秩矩阵上适配，主权重冻结，省显存与存储多适配器。痛点是全参微调贵、难多租户切换。`,
  },
  {
    id: "q-150",
    title: "自注意力的 Q、K、V 分别扮演什么角色？为什么说\"注意力是软性检索\"？",
    category: "ml-basics",
    difficulty: "foundation",
    tags: ["角色设定", "注意力", "机器学习", "深度学习"],
    prompt: "自注意力里 Q、K、V 角色？为何说注意力是软性检索？",
    answer: `Q 问、K 被匹配、V 被聚合。相似度权重对 V 加权求和，像可微的检索/查表。多头并行不同子空间。`,
  },
];

const questionById = new Map(questions.map((item) => [item.id, item]));

export function getQuestion(id: string): Question | undefined {
  return questionById.get(id);
}

export function questionsByCategory(category: CategoryId): Question[] {
  return questions.filter((item) => item.category === category);
}

export function countByCategory(): Record<CategoryId, number> {
  return categories.reduce(
    (acc, category) => {
      acc[category.id] = questionsByCategory(category.id).length;
      return acc;
    },
    {} as Record<CategoryId, number>,
  );
}

export function adjacentQuestions(id: string): { prev?: Question; next?: Question } {
  const current = getQuestion(id);
  if (!current) {
    return {};
  }

  const siblings = questionsByCategory(current.category);
  const index = siblings.findIndex((item) => item.id === id);
  return {
    prev: index > 0 ? siblings[index - 1] : undefined,
    next: index >= 0 && index < siblings.length - 1 ? siblings[index + 1] : undefined,
  };
}

function matchesQuery(question: Question, q: string): boolean {
  const haystack = [question.title, question.prompt, question.tags.join(" "), question.id]
    .join("\n")
    .toLowerCase();
  return haystack.includes(q);
}

export function filterQuestions(
  filters: QuestionFilters,
  marks?: { done: Set<string>; starred: Set<string> },
): Question[] {
  const q = filters.q?.trim().toLowerCase() ?? "";

  return questions.filter((item) => {
    if (filters.category && filters.category !== "all" && item.category !== filters.category) {
      return false;
    }
    if (filters.difficulty && filters.difficulty !== "all" && item.difficulty !== filters.difficulty) {
      return false;
    }
    if (q && !matchesQuery(item, q)) {
      return false;
    }
    if (marks && filters.mark && filters.mark !== "all") {
      if (filters.mark === "done" && !marks.done.has(item.id)) {
        return false;
      }
      if (filters.mark === "open" && marks.done.has(item.id)) {
        return false;
      }
      if (filters.mark === "starred" && !marks.starred.has(item.id)) {
        return false;
      }
    }
    return true;
  });
}

export const totalQuestions = questions.length;

