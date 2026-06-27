---
title: "博客迁移：从 Jekyll Chirpy 到 Hugo PaperMod"
date: 2026-06-26
slug: "blog-migration-to-hugo"
description: "记录博客从 Jekyll + Chirpy 主题迁移到 Hugo + PaperMod 的过程、选型分析和 2026 年 GitHub Pages 最佳实践"
author: "haoxiqiang"
tags: ["hugo", "github-pages", "blog", "jekyll"]
categories: ["Blog"]
ShowToc: true
TocOpen: true
---

## 背景

这个博客从 2013 年底开始，使用 Jekyll 托管在 GitHub Pages 上，经历了几次主题变更。最近一次使用的是 [jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 7.1.1。

积累了 55 篇文章后，决定重新审视技术栈选型，期望找到一个**简单、优雅、有技术范**的方案。

## 2026 年静态博客生态

在选型之前，整理了当前主流的静态站点生成器（SSG）对比：

| SSG | 语言 | 构建速度 | 特点 |
|-----|------|----------|------|
| Jekyll | Ruby | 中等 | GitHub Pages 原生支持，生态最成熟 |
| Hugo | Go | 极快 (<1ms/页) | 单二进制，零依赖 |
| Astro | JS/TS | 快 | 默认零 JS 输出，Island Architecture |
| 11ty | JS | 快 | 灵活，多模板引擎 |
| Zola | Rust | 极快 | 单二进制，内置 Sass/语法高亮 |

### 为什么选 Hugo + PaperMod

经过评估，最终选择 Hugo + PaperMod：

1. **构建速度** — 54 篇文章构建时间 <100ms，Jekyll 需要数秒
2. **PaperMod 主题** — 极简优雅，专注内容，暗色模式完美
3. **零 Ruby 依赖** — `hugo` 单个二进制文件，装完即用
4. **多语言原生支持** — Hugo 内置 i18n 机制，对中英双语友好
5. **活跃维护** — PaperMod 社区活跃，2026 年仍在持续更新

## 迁移过程

### 1. 项目结构变化

```
# Jekyll 结构                    # Hugo 结构
├── _config.yml                  ├── hugo.yaml
├── _posts/                      ├── content/posts/
├── _data/                       ├── static/
├── _plugins/                    ├── themes/PaperMod/
├── _tabs/                       ├── archetypes/
├── Gemfile                      └── layouts/
└── assets/
```

### 2. Front Matter 标准化

Jekyll 时期 front matter 格式不统一，迁移时统一为：

```yaml
---
title: "文章标题"
date: 2026-06-26
description: "简短描述"
author: "haoxiqiang"
tags: ["tag1", "tag2"]
categories: ["Category"]
ShowToc: true
TocOpen: false
---
```

### 3. 多语言配置

Hugo 的多语言支持通过文件名后缀区分，非常直观：

```
content/posts/
├── my-post.md        # 中文（默认语言）
└── my-post.en.md     # English
```

在 `hugo.yaml` 中设置 `defaultContentLanguage: zh`，英文版本通过 `/en/` 前缀访问。

### 4. GitHub Actions 部署

利用 [peaceiris/actions-hugo](https://github.com/peaceiris/actions-hugo) 和 GitHub 官方的 Pages 部署 action：

```yaml
name: Deploy Hugo site to Pages
on:
  push:
    branches: ["master"]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0
      - name: Setup Hugo
        uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: 'latest'
          extended: true
      - name: Build
        run: hugo --minify
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./public
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
```

## PaperMod 特性

选择 PaperMod 后获得的开箱即用功能：

- 深色/浅色模式自动切换
- 站内搜索（基于 Fuse.js）
- 代码块一键复制
- 阅读时间估计
- 文章目录（TOC）
- 面包屑导航
- RSS 订阅
- SEO 优化（Open Graph、Twitter Cards）
- 响应式设计
- 归档页面
- 多语言支持

## GitHub Pages 2026 最佳实践

总结一些当前 GitHub Pages 的使用建议：

### 部署方式

**推荐使用 GitHub Actions**，不再使用旧的分支部署模式。Actions 方式的优势：
- 不限于 Jekyll，可使用任何 SSG
- 构建环境完全可控
- 始终使用最新版本的工具

### 性能优化

- 启用 `minify` 压缩输出
- 利用 CDN（GitHub Pages 自带 Fastly CDN）
- 图片使用 WebP 格式
- 启用 PWA 缓存支持离线访问

### 自定义域名

1. 仓库根目录放置 `CNAME` 文件
2. DNS 配置 CNAME 指向 `<username>.github.io`
3. GitHub 自动签发 HTTPS 证书

### 内容管理

- Markdown 写作，git push 即部署
- 使用 `archetypes` 模板快速创建新文章
- 利用 `draft: true` 管理草稿

## 迁移总结

| 维度 | 之前（Jekyll） | 之后（Hugo） |
|------|---------------|-------------|
| 构建时间 | ~5s | <100ms |
| 依赖安装 | Ruby + Bundler | 单个 binary |
| 主题 | Chirpy 7.1.1 | PaperMod |
| 多语言 | 不支持 | 原生支持 |
| 搜索 | 无 | Fuse.js 全文搜索 |
| 文章数 | 55 | 54（去除 1 个重复） |

迁移工作量约半天，主要花在统一 front matter 格式上。结果很满意——构建速度从秒级变成毫秒级，主题简洁优雅，多语言也准备就绪。

## 参考资源

- [Hugo 官方文档](https://gohugo.io/documentation/)
- [Hugo 多语言配置](https://gohugo.io/configuration/languages/)
- [PaperMod 主题 GitHub 仓库](https://github.com/adityatelange/hugo-PaperMod)
- [PaperMod 主题文档](https://adityatelange.github.io/hugo-PaperMod/)
- [Hugo GitHub Pages 部署指南](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
- [peaceiris/actions-hugo](https://github.com/peaceiris/actions-hugo)
