![狐火 Foxfire](docs/foxfire-readme-hero.jpg)

# 狐火 Foxfire

**狐火** 是一套给 AI 应用工程师用的面试练习工具。英文名 Foxfire。两套入口：

- **150 题刷题**：十四分类，打开一题先自己答，再展开参考作答（Markdown）；已练 / 收藏 / 掌握度间隔复习写在浏览器 localStorage，不经过服务器。
- **Agent 导图复习**：专栏第 15–20 章原文只有思维导图。站点做成 React Flow 可拖、可缩放画布（`/mindmaps`），只复习、不入题库、不进 SRS。

## 本地运行

```bash
npm install && npm run dev
```

可选登录需要公开环境变量。复制 `.env.example` 为 `.env.local`，填写 `NEXT_PUBLIC_SUPABASE_URL` 和 `NEXT_PUBLIC_SUPABASE_ANON_KEY`（只放可公开的 publishable / anon key，不要写入 `service_role`）。不配置也可以照常刷题和复习导图。

浏览器打开 [http://localhost:3000](http://localhost:3000)。生产构建：

```bash
npm run build && npm start
```

## 功能

### 150 题刷题

- 十四个分类：大模型通识、API/结构化输出、提示工程、RAG、数据与知识工程、Agent、Harness+Loop、应用框架、部署与推理、评估、生产可靠性、安全合规、产品与成本、ML/DL 扫盲
- 150 道 AI 应用岗高频面试题，含可展开的参考作答（直接答案 + 知识点），每题 3 条可复述面试金句
- 搜索、分类/难度/标签筛选；可选搜参考作答关键词；未练优先与难度排序；标签云可折叠
- 本地进度：已练、收藏、掌握度间隔复习（今日待复习）；可选登录不改变这一点，进度仍只留在本机
- 练习会话与模拟面试（15–30 分钟计时、可选录音、对照要点 checklist）

### Agent 导图复习

- `/mindmaps`：第 15–20 章 React Flow 节点大纲画布（可折叠、搜索高亮、拖拽缩放）
- 原文只有导图、没有问答页 → **不拆题入库**，不计入 150 题，不进入练习会话 / SRS / 进度
- 打开章节默认展开到二级概览；节点层级对齐原图，不嵌入 JPG 原图当画布

### 界面

- 夜间（默认）与日间界面
- 可选登录（邮箱魔法链接 / 验证码，或 GitHub）；未登录可使用全部刷题与导图功能。退出不会清除本机进度。当前没有云端进度同步。

## 技术栈

- Next.js App Router、TypeScript、Tailwind CSS 4
- 题目数据在仓库内，构建时打进页面
- 题库源文件按分类分片在 `src/data/bank/*.json`；`npm run sync:questions` 生成列表摘要，并把每题完整内容写成 `public/data/questions/<id>.json`（详情页按路由读取，展开参考时再拉取；`predev` / `prebuild` 会自动跑）
- 导图数据在 `src/data/mindmaps/`（ch15–ch20 JSON + 索引）；与 bank 分离，构建时打进 `/mindmaps` 页
- 进度仅存在本机（仅刷题侧；导图画布无进度写入）。可选登录用浏览器里的 `@supabase/supabase-js`（PKCE），站点仍是 `output: "export"` 的 GitHub Pages 静态站。

## 来源与公开说明

- **用途**：个人 AI 应用岗面试练习工具；进度仅保存在本机浏览器（与是否登录无关）。
- **题库来源**：参考极客知识库「AI 面试」专题等公开学习资料的结构与选题思路，整理、改写入库；表述与编排可能已调整，**并非官方原文转载**。
- **导图来源**：第 15–20 章 Agent 相关思维导图做成复习画布；节点文案对齐原图层级，**不**当作题库条目收录。
- **关系声明**：本项目与极客时间、极客知识库**无隶属、合作或授权关系**，不代表其官方立场；不对题库完整性、时效性或面试结果作任何保证。
- **公开仓库**：仓库与 GitHub Pages 站点**继续保持公开**，便于个人分享与静态部署。若你 fork 或二次分发，请自行评估版权与合规边界，并保留来源说明。

## GitHub Pages

合并到 `main` 后，Actions 会构建静态站并发布。

1. 仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**
2. 站点地址：https://joneyxiao.github.io/foxfire/

本地预览静态导出：

```bash
GITHUB_PAGES=true npm run build
npx serve out
```
