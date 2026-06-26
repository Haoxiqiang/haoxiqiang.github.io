# 翻译博客文章

将中文博客文章翻译为英文，用于 Hugo 多语言博客。

## 规则

1. 只翻译需要翻译的文章。需要翻译的条件：
   - 没有对应的 `.en.md` 文件，或者
   - 中文源文件（`.md`）在英文版本生成之后有过修改（通过 git log 对比）

2. 判断文章是否需要翻译：
   ```bash
   # 获取中文源文件最后修改时间
   git log -1 --format="%aI" -- "content/posts/<post>.md"
   # 获取英文版本最后修改时间（如存在）
   git log -1 --format="%aI" -- "content/posts/<post>.en.md"
   ```
   如果中文源比英文版新，或英文版不存在，则需要翻译。

3. 翻译准则：
   - 保留所有 front matter 字段，将 `title` 和 `description` 翻译为英文
   - `date`、`author`、`tags`、`categories`、`ShowToc`、`TocOpen` 保持不变
   - 自然翻译正文内容 — 传达相同含义，不逐字翻译
   - 代码块、URL、技术术语保持不变
   - Markdown 格式保持不变
   - `<!--more-->` 标记原样保留

4. 输出文件命名：`content/posts/YYYY-MM-DD-slug.md` → `content/posts/YYYY-MM-DD-slug.en.md`

## 工作流程

1. 列出 `content/posts/` 下所有 `.md` 文件（排除 `.en.md`）
2. 逐个检查是否需要翻译（无 `.en.md` 或源文件更新）
3. 只翻译需要处理的文章
4. 报告翻译了哪些、跳过了哪些

## 示例

输入：`content/posts/2026-06-26-blog-migration-to-hugo.md`
输出：`content/posts/2026-06-26-blog-migration-to-hugo.en.md`
