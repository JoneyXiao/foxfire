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
- 150 道 AI 应用岗高频面试题，含可展开的参考作答（直接答案 + 知识点）
- 搜索、分类与难度筛选
- 本地进度：已练、收藏
- 夜间（默认）与日间界面

## 技术栈

- Next.js App Router、TypeScript、Tailwind CSS 4
- 题目数据在仓库内，构建时打进页面
- 进度仅存在本机

题库按极客知识库「AI 面试」专题结构整理入库，供个人练习使用。


## GitHub Pages

合并到 `main` 后，Actions 会构建静态站并发布。

1. 仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**
2. 站点地址：https://joneyxiao.github.io/foxfire/

本地预览静态导出：

```bash
GITHUB_PAGES=true npm run build
npx serve out
```
