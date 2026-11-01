import { categories } from "@/lib/categories";
import type { CategoryId, Difficulty, Question, QuestionFilters } from "@/lib/types";

export const questions: Question[] = [
  {
    id: "py-01",
    title: "GIL 到底限制了什么，什么时候可以忽略它",
    category: "python",
    difficulty: "foundation",
    tags: ["并发", "CPython"],
    prompt: "面试官问：CPython 的 GIL 会让多线程变慢吗？什么计算能绕开它？请用工程语言回答，不要背定义。",
    answer: `GIL 保护的是**解释器状态**，不是用户的业务锁。同一时刻只有一个线程在执行 Python 字节码，所以 **CPU 密集的纯 Python 循环**无法靠多线程吃满多核。

可以忽略或绕开的情况：

- **I/O 等待**（网络、磁盘、sleep）：线程在等待时会释放 GIL，多线程仍然有用。
- **C 扩展在计算时主动释放 GIL**：NumPy、部分加解密、压缩库常见。
- **多进程或子解释器**：进程各有一份解释器；代价是序列化与内存。

回答里补一句取舍：线程适合 I/O 扇出，进程适合 CPU 扇出，asyncio 适合海量套接字。不要说“GIL 所以 Python 不能并发”。`,
  },
  {
    id: "py-02",
    title: "生成器、迭代器、可迭代对象差在哪",
    category: "python",
    difficulty: "foundation",
    tags: ["迭代"],
    prompt: "用一个读大日志的例子，说明 iterable、iterator、generator 各自出现在哪一层，以及为什么不能对生成器做两次 \`for\`。",
    answer: `分层：

- **可迭代（iterable）**：实现 \`__iter__\`，每次调用可以交出**新的**迭代器。\`list\`、打开方式正确的文件对象、自定义数据集都是。
- **迭代器（iterator）**：同时有 \`__iter__\` 和 \`__next__\`，状态向前走，耗尽后停。
- **生成器**：用 \`yield\` 写出的迭代器，暂停帧在函数里。

读大日志时，函数里 \`yield line\` 是生成器：只占一行缓冲。生成器是一次性的，第二次 \`for\` 立刻结束，因为帧已经关闭。若调用方需要重扫，要么重新打开文件，要么物化成列表（并承认内存代价）。`,
  },
  {
    id: "py-03",
    title: "什么时候用 dataclass，什么时候不要",
    category: "python",
    difficulty: "applied",
    tags: ["数据建模"],
    prompt: "配置对象、训练样本、以及一个要放进 set 的缓存键，这三处你会怎么建模？说明 \`frozen\`、\`slots\`、和普通 class 的分界。",
    answer: `经验分界：

- **配置 / DTO**：\`@dataclass(frozen=True)\`。不可变，能当字典键，字段一目了然。
- **高频样本对象**（DataLoader 里每条都建）：考虑 \`slots=True\`，少 \`__dict__\`，降内存。
- **有不变量、要校验、有多种构造路径**：普通 class 或 \`pydantic\`，不要把校验藏进 \`__post_init__\` 堆成意大利面。

不要用 dataclass 的情况：真正的行为中心（仓库、客户端）、需要自定义 \`__new__\` 的单例、以及字段集合会在运行时乱长的“袋子对象”。缓存键一定要 \`frozen\` 且所有字段可哈希。`,
  },
  {
    id: "py-04",
    title: "asyncio 和线程池怎么分工",
    category: "python",
    difficulty: "applied",
    tags: ["asyncio"],
    prompt: "一个 Agent 运行时要同时：打 40 个 HTTP 工具、跑一段 CPU 分词、再写一行本地日志。事件循环里怎么摆，才不会把 loop 堵死？",
    answer: `原则：**loop 里只放等 I/O 的协程**。

- 40 个 HTTP：\`asyncio.TaskGroup\` 或有界信号量包 \`httpx.AsyncClient\`，限制并发，避免把对端打满。
- CPU 分词：\`asyncio.to_thread\` 或进程池。分词是 CPU，丢进协程只会卡住所有超时器。
- 本地日志：短同步写可以直接在协程里；批量或旋转文件用线程，避免 fsync 抖。

补充：不要在协程里调阻塞的 SDK（老 boto、某些嵌入客户端）。先看文档有没有 async，没有就 \`to_thread\`，并给线程池设上限。`,
  },
  {
    id: "py-05",
    title: "类型标注怎样才算帮到了训练代码",
    category: "python",
    difficulty: "applied",
    tags: ["typing"],
    prompt: "有人在模型仓库里写满 \`Any\`，有人给每个张量都标 \`Tensor\`。你觉得“刚好够用”的标注长什么样？",
    answer: `标注的目标是**挡住形状和模式弄错**，不是装饰。

值得标的：

- 公共函数的参数与返回：路径、\`Literal["train", "eval"]\`、配置 TypedDict。
- 张量用 \`FloatTensor\` 仍不够时，用 \`NewType\` 或注释约定 \`[B, T, C]\`，并在断言里检查。
- \`Optional\` 只留给真的可能缺的值；不要把 \`None\` 当默认配置。

不必标的：一目了然的局部 \`i\`、\`loss\`。\`Any\` 出现时旁边要有原因（动态模块、第三方无 stub）。CI 用 \`ty\` 或 \`mypy --pretty\` 卡公共模块即可，别追求 100% 覆盖率当 KPI。`,
  },
  {
    id: "py-06",
    title: "contextmanager 比 try/finally 多给了什么",
    category: "python",
    difficulty: "foundation",
    tags: ["资源"],
    prompt: "临时改随机种子、占一张 GPU、打开评测集，这三件事为什么更适合做成上下文管理器？",
    answer: `\`try/finally\` 能保证释放，但**入口和出口拆在两处**，调用方容易漏。上下文管理器把“进入时借、离开时还”绑成一个对象。

三例：

- 随机种子：进入时记下 \`random\` / \`numpy\` / \`torch\` 状态，离开时恢复，避免评测污染训练。
- GPU：进入时 \`set_device\` 并记录旧设备，离开时还原，防止库函数偷偷占 0 号卡。
- 评测集：进入时打开只读句柄或 mmap，离开时关，异常路径也不会挂文件。

\`@contextmanager\` 适合短逻辑；需要复用或继承时写 class，实现 \`__enter__\` / \`__exit__\`，并决定异常是否吞掉（通常不吞）。`,
  },
  {
    id: "pt-01",
    title: "autograd 图是什么时候建的，什么时候必须断开",
    category: "pytorch",
    difficulty: "foundation",
    tags: ["autograd"],
    prompt: "解释 \`requires_grad\`、\`detach\`、\`torch.no_grad\` 分别切断哪一层。推理和把特征塞进另一条损失时各用哪个？",
    answer: `只有 \`requires_grad=True\` 的张量参与的运算才会挂到图上。

- \`detach()\`：留下值，**丢掉这段历史**。把编码器特征当另一头的常量目标时用它。
- \`torch.no_grad()\`：整段不建图，省内存。验证、打印、写 summary 用它。
- \`inference_mode()\`：比 \`no_grad\` 更狠，禁止从这段再反传回去，推理服务优先。

训练中常见错误：在 \`no_grad\` 里算完又期望 \`backward\`；或对仍挂着图的张量 \`into numpy\`。需要 numpy 时先 \`detach().cpu()\`。`,
  },
  {
    id: "pt-02",
    title: "为什么 validation 要用 eval 和 no_grad 两道",
    category: "pytorch",
    difficulty: "foundation",
    tags: ["训练循环"],
    prompt: "只开 \`model.eval()\` 或只开 \`no_grad\`，分别会在 Dropout、BN、显存上出什么问题？",
    answer: `两道开关管的不是一件事：

- \`eval()\`：切 **层行为**。Dropout 关闭，BN 用 running 统计。只关梯度但留在 train，验证指标会抖，BN 还会被验证 batch 污染。
- \`no_grad()\`：切 **图**。eval 却仍建图，验证集会把显存堆上去，长期跑会 OOM。

正确顺序：\`model.eval()\`，\`with torch.no_grad():\`，跑完再 \`model.train()\`。不要在验证里误调 \`optimizer.step\`。`,
  },
  {
    id: "pt-03",
    title: "AMP 混合精度你会怎么守住数值",
    category: "pytorch",
    difficulty: "applied",
    tags: ["AMP"],
    prompt: "打开 \`torch.autocast\` 之后 loss 变成 NaN。你按什么顺序查：缩放、类型、归约、位置编码？",
    answer: `顺序：

1. **GradScaler**：有无跳过 \`step\`？\`unscale_\` 后有没有无限梯度？先看 scaler 是否真的在工作。
2. **落在 FP16 的敏感点**：softmax 前的 logits、\`exp\`、大 reduction。对这些算子保持 FP32（autocast 对部分 CUDA 核已处理，自己写的核不会）。
3. **损失归约**：先在 FP32 里 mean。极小 loss 乘大 scaler 也可能翻。
4. **位置 / 归一化**：RMSNorm、RoPE 在半精度下容易炸，常见做法是 autocast 外算，或用 BF16。

硬件支持 BF16 时优先 BF16，少一次动态缩放。不要用“全部改 FP32”当第一反应。`,
  },
  {
    id: "pt-04",
    title: "DDP 和单卡训练差在哪几处必须改",
    category: "pytorch",
    difficulty: "applied",
    tags: ["分布式"],
    prompt: "把单卡脚本改成 DDP，除了包 \`DistributedDataParallel\`，还有哪些不改就会静默错？",
    answer: `必须改的：

- **Sampler**：\`DistributedSampler\`，每个 epoch \`set_epoch\`，否则各卡吃同一份数据。
- **Batch 语义**：global batch = 单卡 batch × world size。学习率、warmup 要不要线性缩放，要写进实验记录。
- **BN**：普通 BN 各卡统计不同；SyncBN 或冻结 BN 要显式选。
- **保存**：只在 rank 0 写盘；加载时 \`map_location\` 到本地 rank。
- **日志与随机种子**：种子 + rank，避免增强完全同步或完全重复。

不要在每张卡都推 WandB 跑出四条假曲线。不要在 forward 里做只在 rank 0 才有的 I/O 而不设 barrier。`,
  },
  {
    id: "pt-05",
    title: "Dataset 和 DataLoader 的边界怎么划",
    category: "pytorch",
    difficulty: "applied",
    tags: ["数据"],
    prompt: "解码图片、随机裁剪、堆 batch、预取到 GPU，这四步各应落在哪一层？为什么不要在 \`__getitem__\` 里做 \`to(device)\`？",
    answer: `划分：

- \`Dataset.__getitem__\`：读一条、解码、**样本级**变换。保持可复现，返回 CPU 张量或 PIL。
- \`collate_fn\`：堆叠、pad、做 mask。变长序列的 pad 放这里，不要在样本里提前 pad 到全局最大。
- \`DataLoader\`：多进程预取、shuffle、pin_memory。
- GPU 搬移：在训练循环里 \`batch.to(device, non_blocking=True)\`，和计算重叠。

\`__getitem__\` 里 \`to(device)\` 会把工作进程绑到 GPU，难复用、难测，也让 pin_memory 失效。增强要区分“每 epoch 变”和“一次定死”。`,
  },
  {
    id: "pt-06",
    title: "保存 checkpoint 时你坚持写下哪些字段",
    category: "pytorch",
    difficulty: "system",
    tags: ["checkpoint"],
    prompt: "线上要把一个中断三周的实验续上。state_dict 之外还缺什么，会让你续不动？",
    answer: `最低集合：

- \`model\` 与 \`optimizer\` 的 \`state_dict\`（有 scaler 就带 scaler）。
- **scheduler 状态**、全局 step、epoch。
- **RNG**：Python、NumPy、Torch CPU/CUDA。
- 数据位置：sampler 的 epoch、若用 IterableDataset 则记录偏移。
- 代码身份：git hash、配置快照、世界大小。

只存权重能做推理，不能保证续训曲线接得上。加载时用 \`strict=False\` 要打印 missing / unexpected，避免 silently 丢掉新加的头。`,
  },
  {
    id: "xf-01",
    title: "自注意力的计算量卡在哪两项",
    category: "transformer",
    difficulty: "foundation",
    tags: ["注意力"],
    prompt: "写出 QK 和 AV 的形状，指出长度 T 和维度 d 谁在平方项里。什么时候该动长度，什么时候该动头数？",
    answer: `标准点积注意力：\(Q,K,V \\in \\mathbb{R}^{T \\times d}\\)。

- \(QK^\\top\)：\(T \\times T\)，**对长度平方**。
- 再乘 \(V\)：仍与 \(T^2 d\) 同阶。

长上下文先动 \(T\)：滑窗、分块、线性注意力、检索压缩。模型容量不够再动 \(d\) 或头数。多头把 \(d\) 切开，总计算大约不变，变的是子空间。面试里画一次形状，比背“注意力很贵”有用。`,
  },
  {
    id: "xf-02",
    title: "KV cache 省的是什么，坑在哪里",
    category: "transformer",
    difficulty: "applied",
    tags: ["推理"],
    prompt: "逐 token 生成时，为什么不要每步重算全部 K、V？cache 的显存怎么估，和 batch、层数、精度怎么乘？",
    answer: `解码第 \(t\) 步，过去 \(t-1\) 的 K、V 不变。缓存后每步只算当前行，把 prefill 的平方成本留在第一次。

粗估：\`2 * layers * heads * head_dim * seq * batch * bytes\`。半精度 2 字节，8K 上下文、大 batch 时 cache 往往大于权重。

坑：

- 左 pad / 右 pad 和 cache 下标不一致，会脏读。
- 动态 batch 要做 cache 压缩或分页（vLLM paged attention）。
- 温度采样改变的是 logits，不该让你误清 cache。`,
  },
  {
    id: "xf-03",
    title: "RoPE 解决了绝对位置的哪一类失败",
    category: "transformer",
    difficulty: "applied",
    tags: ["位置编码"],
    prompt: "绝对可学习位置在超长外推时发生什么？RoPE 把位置放进了哪一步运算，外推仍然要小心什么？",
    answer: `绝对 embedding 在训练长度以外没有见过的下标，外推等于查一张没填的表。RoPE 把位置做成 **Q、K 的旋转**，相对位移对应相对相位，内积带上相对位置。

仍然要小心：

- 训练 4K 直接推 32K，高频旋转会挤在一起，需要 NTK / YaRN / 插值。
- 和 ALiBi 不同，RoPE 不自带“越远越淡”，长距离噪声要靠数据或窗。
- 缓存时每步的旋转角必须和绝对位置对齐，不要用“当前块内下标”。`,
  },
  {
    id: "xf-04",
    title: "Pre-LN 和 Post-LN 训练时差在梯度",
    category: "transformer",
    difficulty: "foundation",
    tags: ["归一化"],
    prompt: "深模型用 Post-LN 容易残差支路消失。你怎么向面试官画一条残差，说明 Pre-LN 为什么好训，又为什么推理分布可能漂？",
    answer: `Post-LN：\`x + Attn(x)\` 之后再 Norm，残差被压在 Norm 里，深层梯度小，要 warmup 和小心初始化。

Pre-LN：\`x + Attn(Norm(x))\`，主路是恒等，梯度能直走，深栈好训。代价是输出尺度随层数涨，最后一层或 logits 前往往再挂一层 Norm。

换结构等于换训练配方，不要只抄 dropout 数。已经训好的 Post-LN 权重不能当 Pre-LN 用。`,
  },
  {
    id: "xf-05",
    title: "MoE 省的是算力还是显存",
    category: "transformer",
    difficulty: "system",
    tags: ["MoE"],
    prompt: "8 专家、top-2 路由，参数量和每次前向激活量分别怎么变？负载不均衡时你会看哪几个数？",
    answer: `参数量近似按专家数加（共享部分除外），**激活量只跟 top-k 走**。所以 MoE 是“存得多、算得少”，不是免费午餐。

要看的数：

- 每个专家的 token 占比，有没有塌成 1 个专家。
- 容量因子：溢出 token 被丢还是进共享专家。
- 通信：专家并行时 all-to-all 延迟，往往比算子本身贵。

辅助损失、噪声路由、专家 dropout 都是在买均衡。评测要报平均与尾部，不要只报“总参数 100B”。`,
  },
  {
    id: "xf-06",
    title: "因果掩码写错会表现出什么",
    category: "transformer",
    difficulty: "applied",
    tags: ["掩码"],
    prompt: "训练 loss 正常偏低，生成却泄漏下文或反复自指。你怎么用一两个形状检查把掩码问题坐实？",
    answer: `先印 \`attn_mask\` 的形状：\`[B, 1, T, T]\` 或 \`[B, H, T, T]\`，下三角为允许。再看 pad：pad 位置应是禁止，而不是“对所有人可见的 0”。

泄漏下文：上三角没遮住，模型在训练里看见了答案，loss 会虚低。生成自指：有时是 shift 错位（logits 与 label 没对齐一格），不是掩码。

用一小段已知文本，比较“全可见”和“因果”的 token 准确率；两者接近就该怀疑掩码没生效。`,
  },
  {
    id: "mm-01",
    title: "CLIP 对齐的是向量空间还是生成能力",
    category: "multimodal",
    difficulty: "foundation",
    tags: ["CLIP"],
    prompt: "为什么 CLIP 很会做零样本分类，却不能直接当 caption 模型？接到 VLM 里时，你还缺哪一块？",
    answer: `CLIP 训的是 **图文检索式对齐**：一对图文在同一空间里靠近。它没有自回归解码器去写句子，所以不会“说话”。

接到 VLM 通常还要：

- 视觉 token 投射（线性、Q-Former、perceiver）。
- 语言模型侧的指令数据，教会“看见之后如何说”。
- 对位置和分辨率的处理：任意分辨率切块会改变 token 数。

把 CLIP 当冻结编码器是常见做法；期望它单独做开放生成，是把检索模型当成生成模型。`,
  },
  {
    id: "mm-02",
    title: "视觉 token 太多时你砍哪里",
    category: "multimodal",
    difficulty: "applied",
    tags: ["视觉token"],
    prompt: "一张高分辨率图编出 2000 个 token，对话上下文被挤爆。列举三种压缩，并说各自伤的是什么。",
    answer: `三条路：

- **空间降采样 / 自适应池化**：便宜，伤小字和远处物体。
- **可学习查询（Q-Former）**：把图压到固定 N 个 query，伤的是 query 没问到的区域。
- **重采样 + 局部裁剪**：先低分辨率看全局，再按问题裁补丁。实现复杂，对 OCR 和定位更友好。

和文本 RAG 一样，砍 token 就是在做检索。要按任务选：caption 能狠压，GUI 定位和公式不能。`,
  },
  {
    id: "mm-03",
    title: "图文幻觉和纯文本幻觉差在证据链",
    category: "multimodal",
    difficulty: "applied",
    tags: ["幻觉"],
    prompt: "模型坚称图里有一只不存在的猫。你会从数据、对齐、解码哪三层拆，而不是只调温度？",
    answer: `三层：

- **数据**：图文对本身在说谎（库存照片配了营销文案）。先抽一批人工看。
- **对齐**：视觉特征弱，语言模型用先验补全。“猫”在语料里太常见。对比：把图换成空白或打乱，看它是否仍说猫。
- **解码**：提示词逼它“详细描述”，它会填细节。要求引用区域或先做检测再描述。

温度只改变花样。真正的缓解是：证据（框、短语接地）、拒绝句、以及把视觉编码器解冻一点。`,
  },
  {
    id: "mm-04",
    title: "多模态指令微调最容易毁掉什么",
    category: "multimodal",
    difficulty: "system",
    tags: ["微调"],
    prompt: "只灌 2 万条图生文，模型变得会形容图片，但不会跟用户把话说完。发生了什么？",
    answer: `灾难性偏向：**视觉描述头**挤掉了原来的对话与工具先验。指令分布太窄（全是“描述这张图”），语言模型把所有问题理解成看图作文。

做法：

- 混纯文本对话、工具调用、拒答，比例写进配方。
- 冻结或部分解冻 LLM，用 LoRA 控制容量。
- 评测不要只报 CIDEr：加上纯文本 MMLU 子集和“无图问题时是否仍要图”。

多模态能力是加上去的，不是覆盖原模型。`,
  },
  {
    id: "mm-05",
    title: "音频或视频进模型时时钟怎么对齐",
    category: "multimodal",
    difficulty: "system",
    tags: ["时序"],
    prompt: "视频 2 fps 抽帧，音频 20 ms 一帧。跨模态注意力如果直接相加会怎样？你怎么给时间戳？",
    answer: `采样率不同，**同一时刻的索引对不上**。直接 concat 或加，等于让模型自己猜时间。

常见做法：

- 统一到一个时间网格（例如 50 ms），音频池化、视频帧重复或插值。
- 给每个模态自己的时间 RoPE 或时间 embedding，再在融合层做交叉注意。
- 任务需要唇形或击打点时，保留更高分辨率的旁路，不要先全局池化。

写进设计的是“1 个视觉 token 等于多少毫秒”，而不是“我们加了视频”。`,
  },
  {
    id: "ag-01",
    title: "ReAct 循环里观察失败该停在哪",
    category: "agent",
    difficulty: "foundation",
    tags: ["ReAct"],
    prompt: "工具返回 429 或空结果，Agent 开始换说法重试同一调用。你设哪些硬停止，避免烧光配额？",
    answer: `硬停止要比“再想想”先写好：

- **同一工具 + 同一参数** 最多 N 次（例如 2）。
- **总步数** 和 **总 token / 费用** 上限。
- 可重试错误（429）走退避；不可重试（400 参数）要改参数或换工具，不允许原样再打。
- 观察为空：换查询，而不是换同义废话。

把这些做成运行时策略，而不是写在提示词里盼它听话。提示词可以解释策略，但不能当计数器。`,
  },
  {
    id: "ag-02",
    title: "工具 schema 怎样写才不容易被乱用",
    category: "agent",
    difficulty: "applied",
    tags: ["工具"],
    prompt: "给一个 \`search_docs(query, top_k)\`。哪些字段要枚举，哪些要默认，描述里该禁止什么？",
    answer: `schema 是合约：

- \`query\`：必填字符串，描述写“用户原话中的检索短语”，不要写“任意想法”。
- \`top_k\`：整数，给范围和默认（如 1 到 8，默认 4），避免 1000。
- 枚举比自由字符串好：环境、模式、语言。
- 描述里写清**副作用**（会发邮件、会写库）和禁止项（不要把整页 HTML 塞进来）。

少而硬的工具优于二十个重叠工具。名字用动词，避免 \`do_stuff\`。校验放在执行器，模型再漂亮也不能跳过。`,
  },
  {
    id: "ag-03",
    title: "短记忆和长记忆各放什么",
    category: "agent",
    difficulty: "applied",
    tags: ["记忆"],
    prompt: "会话摘要、工具原始返回、用户偏好、系统提示，这四类分别进窗口、向量库还是键值配置？为什么？",
    answer: `分开放，才会少污染：

- **系统提示**：键值 / 配置，版本化，不进检索。
- **当前工具返回**：短记忆，只留最近 k 次，过长先摘再进窗口。
- **会话摘要**：滚动摘要进窗口；原文进日志，需要时再捞。
- **用户偏好**：结构化档案（语言、时区、忌口），不要当普通文本块检索。

向量库只放**将来可能被问到的稳定事实**。把每次 429 的堆栈推进长记忆，检索会变成噪声。`,
  },
  {
    id: "ag-04",
    title: "规划式 Agent 和 ReAct 怎么选",
    category: "agent",
    difficulty: "applied",
    tags: ["规划"],
    prompt: "任务是“对比三家供应商并写邮件”对比“查一下这张发票今天能不能付”。哪一个值得先出计划？",
    answer: `**多约束、多产物、可回滚**的任务值得先规划：对比三家要收集、对齐字段、再写邮件，计划能暴露缺的工具。

**单点查询**用 ReAct：查发票状态，两步内应结束，计划反成仪式。

混合：先生成不超过五步的提纲，每步仍是 ReAct，失败则改提纲而不是盲重试。评价规划质量看“有没有未绑定的步骤”，而不是看句子是否像项目经理。`,
  },
  {
    id: "ag-05",
    title: "Agent 评测为什么不能只看最终答案",
    category: "agent",
    difficulty: "system",
    tags: ["评测"],
    prompt: "两个 Agent 都答对了城市天气，一个调用了三次错误城市。你的记分板还缺哪几列？",
    answer: `至少再记：

- **工具正确率**：名字、参数、是否多余。
- **步数与费用**。
- **是否越权**（读了不该读的表）。
- **可复现轨迹**：同一种子下路径稳不稳。

只看最终答案，会选出“乱打工具碰巧撞对”的策略。离线集要有故意的工具失败。线上抽样看轨迹，不要只看点赞。`,
  },
  {
    id: "ag-06",
    title: "权限应该在模型里还是在执行器里",
    category: "agent",
    difficulty: "system",
    tags: ["安全"],
    prompt: "产品说“模型不会删除生产数据，我们在提示词里写了”。你怎么把这句话拆掉，并给出最小权限设计？",
    answer: `模型是不可信的调用方。权限在**执行器**：身份、作用域、审批、审计。

最小设计：

- 工具按环境挂载：生产没有 \`drop_table\`。
- 高副作用要人批或双人。
- 参数白名单：表名、收件人域。
- 每条调用写审计（谁、哪次会话、哪条工具、回执）。

提示词可以降低误用，不能当授权层。越狱成功时，执行器仍应拒绝。`,
  },
  {
    id: "rg-01",
    title: "切片策略错了，检索再强也救不回来",
    category: "rag",
    difficulty: "foundation",
    tags: ["切片"],
    prompt: "把一份 80 页设计文档按 512 token 硬切。问“超时怎么配”时总答非所问。切片上你先改哪三件事？",
    answer: `先改切，不先换模型：

1. **按结构切**：标题、列表、表格成块，而不是固定 512。超时配置往往在“部署”一节的列表里。
2. **重叠**：相邻块重叠一点，避免句子从中断开。
3. **块上带路径**：\`部署 > 超时\` 写进 metadata，检索和引用都能用。

表格不要切成半行。代码与散文分开。切完用真实问题抽 20 条看块里是否自足，这是最便宜的评测。`,
  },
  {
    id: "rg-02",
    title: "稠密检索和关键词检索各补对方什么",
    category: "rag",
    difficulty: "applied",
    tags: ["混合检索"],
    prompt: "用户搜错误码 \`E_TIMEOUT_44\`，纯向量搜经常丢掉。混合检索你怎么融合分数？",
    answer: `向量擅长同义与转述，**对标识符弱**。关键词（BM25）抓住错误码、函数名、版本号。

融合：

- 各自取 top n，**倒数排名融合（RRF）**，少调两个分数的量纲。
- 或把 BM25 与向量分做加权，先在验证集上定权重，不要拍脑袋。
- 标识符检测：查询像代码或错误码时提高关键词权重。

混合不是两次检索各展示一半，而是合成一份候选再重排。`,
  },
  {
    id: "rg-03",
    title: "重排模型放在哪一层才值",
    category: "rag",
    difficulty: "applied",
    tags: ["重排"],
    prompt: "召回 50 条再上 Cross-Encoder。什么时候这钱该花，什么时候应该先修召回？",
    answer: `重排是 **精排**：对“查询 + 文档”打相关性，贵，所以只吃召回已经大致对的列表。

该花：召回 50 里常有正确答案，但排在 15 名之后，生成看不见。  
不该花：正确答案根本不在 50 里，先修切片、索引、混合检索。

实践：召回宽（30 到 80），重排留 3 到 8 条进提示。用 nDCG 或“答案是否在进模的 k 条里”来决定 k。不要把重排当生成前的修辞步骤。`,
  },
  {
    id: "rg-04",
    title: "引用要怎样才算可点回",
    category: "rag",
    difficulty: "applied",
    tags: ["引用"],
    prompt: "产品要求每句有出处。模型常编一个看起来像路径的编号。你怎么在接口层卡住？",
    answer: `出处必须是 **检索返回的 ID 集合的子集**。

- 提示词要求 \`[doc:12]\` 这种封闭形式。
- 解析后再校验 ID 是否在本次检索集合；不在就丢掉或改写成“未找到出处”。
- 展示用原文片段，不要让模型复述后再当引用。

句子级对齐很难一次完美，可以先做到“每段至少一个合法引用”。没有检索到的问题应走拒答，而不是空引用。`,
  },
  {
    id: "rg-05",
    title: "RAG 失败时你如何分类而不是重试",
    category: "rag",
    difficulty: "system",
    tags: ["故障"],
    prompt: "用户说“答错了”。把失败分成检索空、检索偏、生成漂、过期四类，并各给一个修复动作。",
    answer: `四类：

- **检索空**：索引没这块知识。补文档或说不知道。不要换提示词硬编。
- **检索偏**：有库但切错或 query 错。改写查询、混合检索、修切片。
- **生成漂**：证据在，模型没看。缩短上下文、加引用约束、降温度。
- **过期**：库是旧版。加时间 metadata，过滤或提示“截至某日”。

日志里存 query、命中 ID、最终引用，才能事后分类。只存最终句子，下个月还是猜。`,
  },
  {
    id: "rg-06",
    title: "要不要先让模型改写查询",
    category: "rag",
    difficulty: "applied",
    tags: ["查询改写"],
    prompt: "多轮对话里用户说“那它支持流式吗”。直接拿这句去向量检索会怎样？改写时你保留哪些锚点？",
    answer: `代词和“那它”在向量空间里几乎没有实体，检索会漂到随机“流式”段落。改写要把 **指称还原**：上轮的产品名、版本、接口。

保留锚点：专有名词、错误码、版本，不要被同义改写吞掉。改写模型应输出“检索查询”，不是再答一遍用户。

多查询（原句 + 改写 + 假设答案 Hyde）可以，但每条都要花检索。先对一批对话量收益，再决定是否常开。`,
  },
  {
    id: "dp-01",
    title: "动态 batch 为什么能涨吞吐也会涨尾延迟",
    category: "deployment",
    difficulty: "applied",
    tags: ["批处理"],
    prompt: "推理服务把 1 秒内的请求拼成一个 batch。QPS 上去了，P99 却坏了。权衡怎么讲清楚？",
    answer: `拼 batch 提高 GPU 利用率，但 **有人要等窗口关**。窗口越大，平均吞吐越好，队头等待越长。短请求被长请求拖住（队头阻塞）会进一步伤 P99。

手段：

- 限制最大等待和最大 batch。
- 按长度分桶，避免 8 和 8K 同批。
- 连续批处理（in-flight batching）让完成的序列先走。

报数时同时给 QPS 与 P95/P99。只报吞吐是在藏用户痛。`,
  },
  {
    id: "dp-02",
    title: "权重量化到 8bit 你先做哪项检查",
    category: "deployment",
    difficulty: "applied",
    tags: ["量化"],
    prompt: "INT8 后某个分类头全错，生成任务看起来还行。你怎么判断是校准数据问题还是层不该量化？",
    answer: `先分层看：

- **分类头、lm_head、 embedding**：对精度敏感，常保持 16bit。
- 校准数据要覆盖线上域；用维基校准客服模型，激活分布不对。
- 看每个层的量化误差和输出 KL，而不是只看一个总分。

生成“看起来还行”是因为语言先验能补；分类头没有这份冗余。先做逐层禁用实验，再决定 AWQ / GPTQ / 动态量化。`,
  },
  {
    id: "dp-03",
    title: "vLLM 一类引擎吃的是 KV 还是算子",
    category: "deployment",
    difficulty: "applied",
    tags: ["推理引擎"],
    prompt: "为什么换了分页 KV 之后，同样的 7B 能撑更大并发？和“写了更快的 attention 核”有什么不同？",
    answer: `分页 KV 解决的是 **内存碎片**：每个请求一条连续 cache 时，不同长度造成巨大浪费，并发上不去。分页后按块分配，像虚拟内存。

更快的 attention 核解决的是 **算子时间**。两者正交：没有块管理，核再快也被 OOM 卡住；只有分页、核很慢，延迟仍差。

面试里把“吞吐受限于显存布局”和“受限于 FLOPs”分开，能说明你读过服务端，而不只是调用了框架名。`,
  },
  {
    id: "dp-04",
    title: "模型发布你怎样做金丝雀",
    category: "deployment",
    difficulty: "system",
    tags: ["发布"],
    prompt: "新权重在离线集持平。你仍只切 5% 流量。对照哪些线上信号才能决定加到 100% 或回滚？",
    answer: `离线持平只说明旧题没退。金丝雀看：

- **技术**：延迟、OOM、5xx、tokenize 失败。
- **产品**：点赞、重试、人工接管、任务完成率。
- **安全**：拒答率、越权工具、敏感命中。
- **成本**：每成功任务的 token。

样本要按关键意图分层，不要全球随机 5% 却漏掉付费路径。回滚条件预先写数字，不要会上现场表决。`,
  },
  {
    id: "dp-05",
    title: "GPU 显存不够时的裁剪顺序",
    category: "deployment",
    difficulty: "system",
    tags: ["显存"],
    prompt: "一张 24 GB 卡要跑 13B 对话。权重、激活、KV 你先砍谁，为什么不是先砍 batch 到 1 就结束？",
    answer: `先算三块占比，再砍最大的那块：

- **权重**：量化、把部分层放 CPU（会伤延迟）。
- **KV**：短上下文、分页、量化 KV。对话场景 KV 常是元凶。
- **激活**：梯度检查点只属于训练；推理侧减层间残留、减并发。

batch=1 是最后的投降，因为吞吐会塌。先把上下文上限和 KV 精度讲清楚，再谈要不要换卡。`,
  },
  {
    id: "mo-01",
    title: "推理服务的黄金信号怎么落到 token",
    category: "monitoring",
    difficulty: "foundation",
    tags: ["黄金信号"],
    prompt: "延迟、流量、错误、饱和，用在 LLM 网关上各对应哪几个具体指标？",
    answer: `可以这样落：

- **延迟**：首 token 时间、整句时间，按输出长度分段。
- **流量**：请求 QPS 与 **输出 token / 秒**，两者趋势可以分叉。
- **错误**：4xx 参数、5xx 引擎、超时、内容安全拒答（拒答不一定是故障，要单独序列）。
- **饱和**：GPU 利用率、KV 占用、队列深度。

只看 GPU 利用率会漏掉“队列里堆着人”。只看 QPS 会漏掉突然变长的输出。`,
  },
  {
    id: "mo-02",
    title: "一次问答的追踪要串哪些跨度",
    category: "monitoring",
    difficulty: "applied",
    tags: ["追踪"],
    prompt: "RAG + 工具 Agent 的一笔请求，最少要有哪些 span，事后才能回答“慢在哪、用了哪篇文档”？",
    answer: `一条 trace，若干 span：

- 网关接入（鉴权、限流）。
- 查询改写。
- 检索（含索引版本、命中 ID）。
- 重排。
- 模型 prefill / decode。
- 每个工具调用（参数哈希、状态码）。
- 引用校验。

统一 \`trace_id\` 写进日志和用户可复制的反馈号。没有文档 ID 的慢查询，等于没有观测。`,
  },
  {
    id: "mo-03",
    title: "质量漂移你用什么当金标",
    category: "monitoring",
    difficulty: "applied",
    tags: ["漂移"],
    prompt: "上周开始客服模型“语气变硬”。没有新的人工标注时，你还能量什么？",
    answer: `没有金标也能做**代理量**：

- 固定影子集每天跑，看与上周输出的语义距离和拒答率。
- 用户侧：重问率、转人工、短会话。
- 检索侧：命中文档的平均新鲜度是否变了。
- 安全侧：敏感词与越权。

代理量不能定责到“变硬”，但能报警。报警后再抽 50 条给人看。不要等一个完美裁判模型上线才观测。`,
  },
  {
    id: "mo-04",
    title: "token 成本怎样归因到功能而不是模型",
    category: "monitoring",
    difficulty: "system",
    tags: ["成本"],
    prompt: "账单涨了 40%。模型单价没变。你怎么拆到检索、重试、系统提示膨胀、用户变长？",
    answer: `每笔请求记：功能开关、提示 token、补全 token、检索条数、重试次数、工具轮数。

然后按功能聚合：

- 系统提示是否被某次改版加了两千字。
- 失败重试是否在某一工具上爆炸。
- 用户侧平均问题长度是否变了（活动、新入口）。

成本是产品指标。只盯模型单价，会错过“多轮默认开了思考模式”。给每个实验标一个预算 ID。`,
  },
  {
    id: "mo-05",
    title: "线上幻觉能做成什么告警而不是事后新闻",
    category: "monitoring",
    difficulty: "system",
    tags: ["幻觉"],
    prompt: "你不能对每条回答做人工。设计一个低成本的幻觉探针，说明误报会怎样。",
    answer: `探针要便宜、可抽样：

- RAG：生成引用不在检索集合的比例。
- 数字与日期：和检索片段对不上的正则。
- 自相矛盾：对同一会话隔轮抽问。
- 已知题影子集：每天固定 30 题。

误报：合法概括会被当成“无引用”。所以探针只报警趋势，不自动惩罚用户。高风险域（医疗、金额）才提高抽样率或阻断。`,
  },
  {
    id: "bh-01",
    title: "上线前发现评测集被训进模型了，你怎么办",
    category: "behavioral",
    difficulty: "applied",
    tags: ["诚信"],
    prompt: "周五要给业务演示，有人发现验证集和训练日志有重叠。演示数字会很好看。你怎么处理，跟谁说？",
    answer: `先停用这份数字。重叠等于泄漏，演示会变成虚假承诺。

动作：

- 立刻告诉直接上级和这次演示的产品对接，说明影响面：哪项指标不可信。
- 用未污染的子集或人工 20 条给一个**带误差条**的临时数，不给虚假的一位小数。
- 事后修划分、加检查（哈希去重），写进复盘，不把责任推成“大家都这样”。

这题看的是你会不会为了周五的面子把债留给周一的用户。`,
  },
  {
    id: "bh-02",
    title: "产品和你对延迟目标谈不拢",
    category: "behavioral",
    difficulty: "applied",
    tags: ["取舍"],
    prompt: "产品要 P99 300 ms 的流式首包，模型组说质量还要再加 2 秒思考。你会把冲突变成什么决策材料？",
    answer: `把口号变成一张表：首包、整句、质量代理、成本，**两到三档方案**，而不是立场。

例如：

- 快：无思考，旧模型，300 ms，影子集质量 0.71。
- 中：短思考，800 ms，0.76。
- 慢：长思考，2.5 s，0.79。

让产品在表上选路径，并指定哪一类意图走慢档（可路由）。冲突未变成材料时，不要在会上用“做不到”或“必须做”收场。`,
  },
  {
    id: "bh-03",
    title: "一次误检索导致错误对外回复，复盘你写什么",
    category: "behavioral",
    difficulty: "system",
    tags: ["事故"],
    prompt: "索引配错环境，用户拿到了别的租户文档摘要。已经撤回。复盘纪要里你坚持写哪四段？",
    answer: `四段：

1. **时间线**：发现、阻断、通知、修复，用钟点。
2. **影响**：多少租户、是否真的读到原文、是否出域。
3. **根因**：配错环境是直接原因；缺隔离测试、缺检索审计是根。
4. **改动**：索引带租户前缀、发布检查单、抽样告警。每条有人和日期。

不写“加强责任心”。不在复盘里评价人。用户沟通与技术修复分开，前者由对接人用明白的话去说。`,
  },
  {
    id: "bh-04",
    title: "你怎样证明自己学会了一个新栈",
    category: "behavioral",
    difficulty: "foundation",
    tags: ["学习"],
    prompt: "简历写“熟悉 vLLM”。面试官问你上周真正做过什么。怎样回答才不像背文档？",
    answer: `用一条自己踩过的路径：现象、假设、测量、结论。

例如：把并发从 8 提到 32 后 KV 碎片化，P99 从 1.2 s 到 4 s，换成分页后回来，并报你当时的显存图。这比背“支持 continuous batching”强。

不会的部分直接说边界：没做过量化 KV，计划怎么补。面试官要的是你怎么学，不是你覆盖过多少名词。`,
  },
  {
    id: "bh-05",
    title: "和评测同学对指标口径不一致",
    category: "behavioral",
    difficulty: "applied",
    tags: ["协作"],
    prompt: "你报的准确率 0.81，评测同学报 0.67。两天后天要对齐。你第一步做什么？",
    answer: `第一步不是重跑更大的数，而是 **对齐定义**：集合、切分、是否含拒答、是否大小写、是否只看最终句。

把两边的 20 条差异 case 摊开，通常会发现一边丢掉了空检索样本。口径写成十行，再重跑。数字冲突时对人客气，对定义较真。

如果两边目标本来不同（研究准确率 vs 线上可发布率），就并列两列，不要合成一个让双方都不认的平均数。`,
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
