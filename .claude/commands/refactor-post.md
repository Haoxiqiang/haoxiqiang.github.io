# Refactor Blog Post

Refactor and improve an existing blog post — output both Chinese and English versions.

## Input

The user will specify a post file path, e.g. `content/posts/2022-08-08-openssl-rsa.md`

## Goals

1. **Improve structure** — Reorganize into clear sections with logical flow
2. **Enhance content** — Search for additional technical context, fill knowledge gaps with high-confidence information only
3. **Sharpen language** — Concise, to the point, no filler. Every sentence should carry weight
4. **Show depth** — Surface the "why" behind technical decisions, not just the "how"
5. **Fix formatting** — Proper markdown, consistent code blocks, clean front matter
6. **Add references** — Collect all key citations and further reading links at the end

## Process

### Step 1: Analyze Current Post

- Read the post fully
- Identify: topic, target audience, current quality level, gaps

### Step 2: Research

- Search for relevant, up-to-date technical references on the topic
- Only use high-confidence information from authoritative sources (official docs, RFCs, reputable engineering blogs)
- Do NOT add speculative or uncertain content
- Collect all valuable reference URLs for the References section

### Step 3: Refactor (Chinese version)

Apply these principles:

**Structure:**
- Lead with context/problem statement (1-2 sentences max)
- Use clear H2/H3 hierarchy
- Put the most valuable insight early
- End with concise takeaway, then References section

**Language:**
- 简练 — Remove redundant words, filler phrases, obvious statements
- 直接 — State conclusions first, then explain
- 精确 — Use exact technical terms, no vague language

**Content:**
- Add missing context that a reader would need
- Include version numbers, links to official docs where relevant
- Remove outdated information or mark it clearly
- Add brief explanations for non-obvious technical decisions
- If code samples exist, ensure they are correct and complete
- Inline links for key references that are worth reading in context (use `[text](url)` inline)

**Format:**
- Standardize front matter to project convention
- Ensure proper code block language annotations
- Use tables for comparisons
- Use `>` blockquotes for important callouts sparingly

**References Section:**
- Add `## References` at the end of the post
- List all key links that are worth further reading
- Format: `- [Title or Description](url) — one-line note on why it's relevant`
- Prioritize: official docs > RFCs/specs > authoritative engineering blogs > others
- Only include links you have high confidence are valid and valuable

### Step 4: Create English Version

- Create `.en.md` file alongside the Chinese version
- Translate naturally, not word-by-word
- Keep all code blocks, URLs, technical terms unchanged
- Translate `title` and `description` in front matter
- Keep the same References section (links are language-neutral)

### Step 5: Validate

- The refactored post must still represent the author's experience and perspective
- Do not change the fundamental topic or conclusions
- Do not add opinions the author didn't express
- Preserve all original code samples (may reformat but not alter logic)

## Output

Write two files:
1. Overwrite original: `content/posts/YYYY-MM-DD-slug.md` (Chinese, refactored)
2. Create/overwrite: `content/posts/YYYY-MM-DD-slug.en.md` (English translation)

Report:
- What was changed (brief summary)
- What references were added
- What was removed and why

## Example Transformation

Before:
```
我本来很清楚不同加密方式的区别和使用,今天在写一个RSA的时候发现公钥加密出来的结果每次都不一样,这就触发了盲点,很奇怪这里的实现,去看了一下原理
```

After (Chinese):
```
RSA 公钥加密的输出每次不同 — 这不是 bug，是 PKCS 填充机制的设计。记录一下排查过程和原理。
```

After (English):
```
RSA public key encryption produces different output each time — this isn't a bug, it's by design in the PKCS padding scheme. Here's the investigation and the underlying mechanism.
```

## Example References Section

```markdown
## References

- [RFC 8017 - PKCS #1 v2.2](https://www.rfc-editor.org/rfc/rfc8017) — RSA 加密标准，定义了 OAEP 和 PSS 填充
- [OAEP - Wikipedia](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding) — OAEP 填充原理图解
- [OpenSSL EVP_PKEY_encrypt](https://www.openssl.org/docs/man3.0/man3/EVP_PKEY_encrypt.html) — 代码中使用的 API 官方文档
```
