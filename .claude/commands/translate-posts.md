# Translate Blog Posts

Translate Chinese blog posts to English for the Hugo multilingual blog.

## Rules

1. Only translate posts that need translation. A post needs translation when:
   - It has no corresponding `.en.md` file, OR
   - The Chinese source file (`.md`) has been modified since the last time the `.en.md` was generated (compare via git log)

2. To check if a post has changed since its English version was created:
   ```bash
   # Get last modified time of the Chinese source
   git log -1 --format="%aI" -- "content/posts/<post>.md"
   # Get last modified time of the English version (if exists)
   git log -1 --format="%aI" -- "content/posts/<post>.en.md"
   ```
   If the Chinese source is newer than the English version, or the English version doesn't exist, translate it.

3. Translation guidelines:
   - Preserve all front matter fields, translate `title` and `description` to English
   - Keep `date`, `author`, `tags`, `categories`, `ShowToc`, `TocOpen` unchanged
   - Translate the body content naturally — not word-by-word, but convey the same meaning
   - Keep all code blocks, URLs, and technical terms unchanged
   - Keep markdown formatting intact
   - Replace `<!--more-->` markers as-is

4. Output file naming: for `content/posts/YYYY-MM-DD-slug.md`, create `content/posts/YYYY-MM-DD-slug.en.md`

## Workflow

1. List all `.md` files in `content/posts/` (excluding `.en.md` files)
2. For each file, check if translation is needed (no `.en.md` or source is newer)
3. Translate only the ones that need it
4. Report what was translated and what was skipped

## Example

Input: `content/posts/2026-06-26-blog-migration-to-hugo.md`
Output: `content/posts/2026-06-26-blog-migration-to-hugo.en.md`
