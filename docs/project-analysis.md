# 当前博客项目现状分析

> 分析时间：2026-06-26

## 基本信息

| 项目 | 详情 |
|------|------|
| 仓库 | `haoxiqiang/haoxiqiang.github.io` |
| 部署地址 | https://haoxiqiang.github.io |
| 自定义域名 | `blog.substitute.tech` (CNAME) |
| 默认分支 | `master` |
| 静态生成器 | Jekyll 4.3.4 |
| 主题 | jekyll-theme-chirpy 7.1.1 |
| 部署方式 | GitHub Actions → GitHub Pages |
| Ruby 版本 | 3.3 (CI) |

## 技术栈

### Jekyll + Chirpy 主题

- **Chirpy** 是一个面向技术写作的 Jekyll 主题，特性包括：
  - 响应式侧边栏导航
  - 深色/浅色模式切换
  - 文章 TOC (目录)
  - 分类 & 标签归档
  - PWA 支持
  - SEO 优化 (jekyll-seo-tag)
  - 代码高亮 (Rouge)
  - 评论系统支持 (Disqus/Utterances/Giscus，当前未启用)
  - 站点地图自动生成

### 部署流水线

```yaml
# .github/workflows/jekyll.yml
触发: push to master
步骤:
  1. checkout 代码
  2. setup Ruby 3.3 + bundler cache
  3. configure Pages
  4. bundle exec jekyll build
  5. upload artifact
  6. deploy to GitHub Pages
```

### 插件

- `jekyll-archives` — 分类/标签归档页
- `jekyll-paginate` — 分页
- `jekyll-seo-tag` — SEO meta
- `jekyll-sitemap` — sitemap.xml
- `jekyll-redirect-from` — 重定向
- `jekyll-include-cache` — include 缓存
- `posts-lastmod-hook.rb` — 通过 git log 自动获取文章最后修改时间

### 配置亮点

- 标题: 郝锡强的博客
- 副标题: Chromium/Android/Server 都搞了一点
- 头像: `assets/commons/avatar.jpg`
- 社交: GitHub (haoxiqiang), Email (haoxiqiang@live.com)
- 分析: 未配置 (Google Analytics 等字段为空)
- 评论: 未启用
- PWA: 已启用

## 存在的问题

1. **主题版本较旧** — Chirpy 7.1.1，最新已有更新版本
2. **文章 front matter 不统一** — 早期文章使用 `layout: post`，后期使用 `categories: [Blogging]`，格式不一致
3. **分类混乱** — 有 `blog`、`Blogging` 两种写法
4. **about 页面为空** — 只有模板提示文字
5. **评论系统未启用** — 可考虑 Giscus (基于 GitHub Discussions)
6. **分析未配置** — 无流量统计
7. **部分文章有重复文件** — `2016-01-20-Https.markdown.markdown`
8. **文件名含特殊字符** — 如空格、括号、中文，可能影响 URL
9. **Submodule 引用** — `template` 子模块指向 `haoxiqiang-template`，用途不明确
10. **无 RSS/Newsletter** — 虽然有 feed.xml 模板，但未见集成订阅

## 目录结构

```
.
├── _config.yml          # Jekyll 配置
├── _data/               # 作者、联系方式等数据
├── _plugins/            # 自定义插件 (lastmod hook)
├── _posts/              # 55 篇博文 (2013-2022)
├── _tabs/               # 导航标签页 (about/archives/categories/tags)
├── assets/              # 静态资源 (头像/favicon/图片)
├── .github/workflows/   # CI/CD
├── Gemfile              # Ruby 依赖
├── CNAME                # 自定义域名
└── docs/                # 本文档目录
```
