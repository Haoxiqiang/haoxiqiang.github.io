# 重构博客文章

重构并改进现有博客文章 — 输出中英文两个版本。

## 输入

用户指定文章路径，如 `content/posts/2022-08-08-openssl-rsa.md`

可选：来自 `/review-post` 的评审报告作为额外上下文。如果有评审意见，将每条改进点视为硬性要求逐一落实。重构后不再触发评审 — 流程为：评审 → 重构 → 结束。

## 目标

1. **改进结构** — 重新组织为清晰的章节，逻辑流畅
2. **充实内容** — 搜索补充技术背景，仅使用高置信度信息填补知识空白
3. **精炼语言** — 简洁直接，无废话，每句话都有信息量
4. **体现深度** — 不只是 "怎么做"，更要解释 "为什么"
5. **规范格式** — 正确的 Markdown、统一的代码块、规范的 front matter
6. **添加引用** — 收集关键引用和延伸阅读链接置于文末

## 流程

### 第一步：分析现有文章

- 通读全文
- 识别：主题、目标读者、当前质量水平、内容缺口

### 第二步：搜索补充资料

- 搜索相关的最新技术参考资料
- 仅使用权威来源的高置信度信息（官方文档、RFC、知名工程博客）
- 不添加推测性或不确定的内容
- 收集所有有价值的参考链接用于 References 区域

### 第三步：重构中文版本

遵循以下原则：

**结构：**
- 开头用 1-2 句话点明问题/背景
- 使用清晰的 H2/H3 层级
- 最有价值的洞察放在前面
- 结尾简洁收束，然后是 References

**语言：**
- 简练 — 去除冗余词句、口水话、显而易见的陈述
- 直接 — 先说结论，再做解释
- 精确 — 使用准确的技术术语，不含糊

**内容：**
- 补充读者需要的缺失上下文
- 在相关处标注版本号、添加官方文档链接
- 移除过时信息或明确标记
- 对非显而易见的技术决策添加简要解释
- 如有代码示例，确保正确且完整
- 正文中关键引用使用行内链接（`[文字](url)`），方便读者直接跳转

**格式：**
- 统一 front matter 为项目规范
- 代码块标注语言
- 用表格做对比
- `>` 引用块用于重要提示（适度使用）

**References 区域：**
- 在文章末尾添加 `## References`
- 列出所有值得深入阅读的链接
- 格式：`- [标题或描述](url) — 一句话说明为什么值得读`
- 优先级：官方文档 > RFC/规范 > 权威工程博客 > 其他
- 仅收录有高置信度的有效链接

### 第四步：生成英文版本

- 在中文版本旁创建 `.en.md` 文件
- 自然翻译，不逐字对照
- 代码块、URL、技术术语保持不变
- 翻译 front matter 中的 `title` 和 `description`
- References 区域保持一致（链接语言无关）

### 第五步：验证

- 重构后的文章必须仍然代表作者的经验和视角
- 不改变根本主题或结论
- 不添加作者未表达的观点
- 保留所有原始代码示例（可调整格式但不改逻辑）

## 输出

写入两个文件：
1. 覆写原文：`content/posts/YYYY-MM-DD-slug.md`（中文重构版）
2. 创建/覆写：`content/posts/YYYY-MM-DD-slug.en.md`（英文翻译版）

报告：
- 改了什么（简要总结）
- 添加了哪些引用
- 删除了什么及原因

## 转换示例

改进前：
```
我本来很清楚不同加密方式的区别和使用,今天在写一个RSA的时候发现公钥加密出来的结果每次都不一样,这就触发了盲点,很奇怪这里的实现,去看了一下原理
```

改进后（中文）：
```
RSA 公钥加密的输出每次不同 — 这不是 bug，是 PKCS 填充机制的设计。记录一下排查过程和原理。
```

改进后（英文）：
```
RSA public key encryption produces different output each time — this isn't a bug, it's by design in the PKCS padding scheme. Here's the investigation and the underlying mechanism.
```

## References 区域示例

```markdown
## References

- [RFC 8017 - PKCS #1 v2.2](https://www.rfc-editor.org/rfc/rfc8017) — RSA 加密标准，定义了 OAEP 和 PSS 填充
- [OAEP - Wikipedia](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding) — OAEP 填充原理图解
- [OpenSSL EVP_PKEY_encrypt](https://www.openssl.org/docs/man3.0/man3/EVP_PKEY_encrypt.html) — 代码中使用的 API 官方文档
```
