---
title: "Blog Migration: From Jekyll Chirpy to Hugo PaperMod"
date: 2026-06-26
description: "Documenting the migration from Jekyll + Chirpy to Hugo + PaperMod, including selection analysis and GitHub Pages best practices in 2026"
author: "haoxiqiang"
tags: ["hugo", "github-pages", "blog", "jekyll"]
categories: ["Blog"]
ShowToc: true
TocOpen: true
---

## Background

This blog started in late 2013, hosted on GitHub Pages with Jekyll. After several theme changes, the most recent setup was [jekyll-theme-chirpy](https://github.com/cotes2020/jekyll-theme-chirpy) 7.1.1.

After accumulating 55 articles, I decided to reassess the tech stack, looking for something **simple, elegant, and developer-oriented**.

## Static Blog Ecosystem in 2026

Before making a choice, I compared the current mainstream static site generators (SSGs):

| SSG | Language | Build Speed | Highlights |
|-----|----------|-------------|------------|
| Jekyll | Ruby | Moderate | Native GitHub Pages support, most mature ecosystem |
| Hugo | Go | Extremely fast (<1ms/page) | Single binary, zero dependencies |
| Astro | JS/TS | Fast | Zero JS by default, Island Architecture |
| 11ty | JS | Fast | Flexible, multi-template engine |
| Zola | Rust | Extremely fast | Single binary, built-in Sass/highlighting |

### Why Hugo + PaperMod

After evaluation, Hugo + PaperMod was the winner:

1. **Build speed** — 54 posts built in <100ms, Jekyll takes seconds
2. **PaperMod theme** — Minimal, elegant, content-focused, perfect dark mode
3. **Zero Ruby dependency** — Single `hugo` binary, ready to go
4. **Native multilingual support** — Hugo's built-in i18n works great for Chinese/English
5. **Actively maintained** — PaperMod community is active, still receiving updates in 2026

## Migration Process

### 1. Project Structure Change

```
# Jekyll structure                # Hugo structure
├── _config.yml                   ├── hugo.yaml
├── _posts/                       ├── content/posts/
├── _data/                        ├── static/
├── _plugins/                     ├── themes/PaperMod/
├── _tabs/                        ├── archetypes/
├── Gemfile                       └── layouts/
└── assets/
```

### 2. Front Matter Standardization

Front matter was inconsistent during the Jekyll era. During migration, everything was unified to:

```yaml
---
title: "Post Title"
date: 2026-06-26
description: "Brief description"
author: "haoxiqiang"
tags: ["tag1", "tag2"]
categories: ["Category"]
ShowToc: true
TocOpen: false
---
```

### 3. Multilingual Configuration

Hugo's multilingual support is intuitive — differentiated by filename suffix:

```
content/posts/
├── my-post.md        # Chinese (default)
└── my-post.en.md     # English
```

With `defaultContentLanguage: zh` in config, English versions are accessible via the `/en/` prefix.

### 4. GitHub Actions Deployment

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

## PaperMod Features

Out-of-the-box features with PaperMod:

- ✅ Auto dark/light mode switching
- ✅ Site search (Fuse.js-based)
- ✅ One-click code copy
- ✅ Reading time estimation
- ✅ Table of contents (TOC)
- ✅ Breadcrumb navigation
- ✅ RSS feed
- ✅ SEO optimization (Open Graph, Twitter Cards)
- ✅ Responsive design
- ✅ Archives page
- ✅ Multilingual support

## GitHub Pages Best Practices in 2026

Key recommendations for using GitHub Pages today:

### Deployment Method

**Use GitHub Actions** — branch-based deployment is outdated. Actions advantages:
- Not limited to Jekyll, use any SSG
- Full control over build environment
- Always use the latest tool versions

### Performance Optimization

- Enable `minify` for compressed output
- Leverage CDN (GitHub Pages includes Fastly CDN)
- Use WebP format for images
- Enable PWA caching for offline access

### Custom Domain

1. Place a `CNAME` file in the repository root
2. Configure DNS CNAME pointing to `<username>.github.io`
3. GitHub auto-provisions HTTPS certificates

### Content Management

- Write in Markdown, git push to deploy
- Use `archetypes` templates for quick post creation
- Use `draft: true` to manage drafts

## Migration Summary

| Dimension | Before (Jekyll) | After (Hugo) |
|-----------|-----------------|--------------|
| Build time | ~5s | <100ms |
| Dependencies | Ruby + Bundler | Single binary |
| Theme | Chirpy 7.1.1 | PaperMod |
| Multilingual | Not supported | Native support |
| Search | None | Fuse.js full-text search |
| Post count | 55 | 54 (removed 1 duplicate) |

The migration took about half a day, mostly spent standardizing front matter. The result is satisfying — build speed went from seconds to milliseconds, the theme is clean and elegant, and multilingual is ready.

## References

- [Hugo Official Documentation](https://gohugo.io/documentation/)
- [PaperMod Theme Documentation](https://adityatelange.github.io/hugo-PaperMod/)
- [Hugo GitHub Pages Deployment Guide](https://gohugo.io/hosting-and-deployment/hosting-on-github/)
- [2026 SSG Comparison Review](https://www.jekyllpad.com/blog/best-static-site-generator) (jekyllpad.com)
