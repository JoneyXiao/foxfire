![狐火 Foxfire](docs/foxfire-readme-hero.jpg)

# 狐火 Foxfire

**狐火** 是一套给 AI 应用工程师用的面试练习工具。英文名 Foxfire。按分类浏览题目，打开一题先自己答，再展开参考作答（Markdown）。已练和收藏写在浏览器的 localStorage，不经过服务器。

## 本地运行

```bash
npm install && npm run dev
```

浏览器打开 [http://localhost:3000](http://localhost:3000)。生产构建：

```bash
npm run build && npm start
```

## 功能

- 十四个分类：大模型通识、API/结构化输出、提示工程、RAG、数据与知识工程、Agent、Harness+Loop、应用框架、部署与推理、评估、生产可靠性、安全合规、产品与成本、ML/DL 扫盲
- 150 道 AI 应用岗高频面试题，含可展开的参考作答（直接答案 + 知识点），每题 3 条可复述面试金句
- 搜索、分类/难度/标签筛选；可选搜参考作答关键词；未练优先与难度排序；标签云可折叠
- 本地进度：已练、收藏、掌握度间隔复习（今日待复习）
- 夜间（默认）与日间界面

## 技术栈

- Next.js App Router、TypeScript、Tailwind CSS 4
- 题目数据在仓库内，构建时打进页面
- 题库源文件按分类分片在 `src/data/bank/*.json`；`npm run sync:questions` 生成列表用摘要与含答案的完整模块（`predev` / `prebuild` 会自动跑）
- 进度仅存在本机

## 来源与公开说明

- **用途**：个人 AI 应用岗面试练习工具；进度仅保存在本机浏览器。
- **题库来源**：参考极客知识库「AI 面试」专题等公开学习资料的结构与选题思路，整理、改写入库；表述与编排可能已调整，**并非官方原文转载**。
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
