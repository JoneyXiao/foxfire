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

- 九个分类：Python、PyTorch、Transformer、多模态、Agent、RAG、部署、观测、行为面
- 50 道原创样例题，含可展开的参考作答
- 搜索、分类与难度筛选
- 本地进度：已练、收藏
- 夜间（默认）与日间界面

## 技术栈

- Next.js App Router、TypeScript、Tailwind CSS 4
- 题目数据在仓库内，构建时打进页面
- 进度仅存在本机

样例题为原创面试提纲，不是任何课程或付费专栏的原文。


## GitHub Pages

合并到 `main` 后，Actions 会构建静态站并发布。

1. 仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**
2. 站点地址：https://joneyxiao.github.io/foxfire/

本地预览静态导出：

```bash
GITHUB_PAGES=true npm run build
npx serve out
```
