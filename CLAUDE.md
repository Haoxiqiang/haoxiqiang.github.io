# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Hugo static site (PaperMod theme) — bilingual tech blog hosted at https://blog.substitute.tech.
Default branch is `master`; pushes to `master` auto-deploy via GitHub Actions to GitHub Pages.

## Build & Dev Commands

```bash
# Dev server with drafts visible
hugo server -D

# Production build
hugo --minify

# Create a new post (Chinese default)
hugo new content posts/slug.md

# Create English variant (manually copy and translate)
# content/posts/slug.md          → Chinese
# content/posts/slug.en.md       → English
```

No test/lint framework exists; no Makefile or package.json.

## Architecture

- **Theme**: [PaperMod](https://github.com/adityatelange/hugo-PaperMod) (git submodule at `themes/PaperMod/`).
- **Multilingual**: Chinese (`zh`, default) and English (`en`). Chinese posts `slug.md`, English `slug.en.md` in same directory.
- **Pages**: `content/about.md`, `content/archives.md`, `content/search.md` — each has `.en.md` counterpart.
- **Comments**: Giscus (GitHub Discussions), configured in `hugo.yaml` under `params.giscus`.
- **Search**: Fuse.js (client-side), search index built via Hugo JSON output.
- **No custom layouts yet** — `layouts/` is empty; all customization is via `hugo.yaml`.
- **CI/CD**: `.github/workflows/hugo.yml` — builds with `--minify`, deploys to Pages.

## Content Conventions

Posts in `content/posts/` follow this front matter pattern:

```yaml
---
title: "Post Title"
date: 2026-06-26
description: "Short description"
author: "haoxiqiang"
tags: ["tag1", "tag2"]
categories: ["Category"]
ShowToc: true
TocOpen: false
---
```

Categories use singular PascalCase: `Android`, `Java`, `Chromium`, `Web`, `DevOps`, `Security`, `Blog`.

## Claude Code Skills

Available slash commands (defined in `.claude/commands/`):
- `/refactor-post` — Improve structure, content, and language of a blog post; outputs Chinese (overwrite) and English (create `.en.md`).
- `/translate-posts` — Translate Chinese posts to English, preserving front matter, code blocks, and technical terms.

## Git Workflow

- Branch from `master` for changes.
- Commit messages ending with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- No PR workflow enforced (direct push to `master` triggers deploy).
