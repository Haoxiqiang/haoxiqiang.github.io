# 已有文章清单与分类

> 共计 55 篇文章，时间跨度 2013-12 至 2022-08

## 按年份统计

| 年份 | 篇数 | 备注 |
|------|------|------|
| 2013 | 1 | 博客开通 |
| 2014 | 14 | Android 开发为主 |
| 2015 | 23 | 最高产年份，Android/工具/算法 |
| 2016 | 4 | RxJava/HTTPS/问题整理 |
| 2017 | 2 | Android MediaStore/问题整理 |
| 2019 | 2 | 网络代理配置 |
| 2022 | 4 | 基础设施/AOSP/安全 |

## 按主题分类

### Android 开发 (约 25 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2014-10-01 | CustomView(1) | android |
| 2014-10-01 | CustomView(2) | android |
| 2014-10-02 | Android Canvas(1) | android |
| 2014-10-03 | Android Canvas(2) | android |
| 2014-11-01 | Android RecyclerView | android |
| 2014-11-02 | Android RecyclerView(2) 视差滚动 | android |
| 2014-11-03 | Android Palette | android |
| 2014-12-01 | Android SQLite | android |
| 2014-12-05 | Android使用Wireless调试 | android |
| 2014-12-22 | Android EBUSY Exception | android |
| 2015-01-07 | Android Fragment InstantiationException | android |
| 2015-01-16 | 轻松搞定Android的环境源码工具 | android |
| 2015-01-26 | Android学习资料指南 | android |
| 2015-01-29 | Android Notification | android |
| 2015-02-28 | Limits In SQLite | android |
| 2015-03-03 | Android Property Animation | android |
| 2015-03-04 | Bezier Curve Practice | android |
| 2015-04-01 | Android App Widgets | android |
| 2015-04-01 | Android Developer Requirements | android |
| 2015-04-08 | Android Data Storage | android |
| 2015-06-04 | Android源码下载 | android |
| 2015-12-23 | Resource Shrinking 资源清理 | android |
| 2016-01-07 | 使用 RxJava 写应用 | android |
| 2017-03-31 | Android MediaStore | android |
| 2022-08-15 | Build AOSP for Pixel 3 XL | aosp, android |

### Java (4 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2014-12-07 | Java 8 的 Lambda | java |
| 2014-12-27 | Java HashMap的实现原理 | java |
| 2015-06-08 | Gson Examples | java |
| 2015-06-16 | JAVA Reflection | java |

### Web/前端 (3 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2014-12-26 | CSS Box Shadows | css |
| 2015-03-24 | Remote Debugging on Android with Chrome | chrome |
| 2015-12-04 | Lorem ipsum 乱数假文 | web |

### 安全/加密 (2 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2016-01-20 | HTTPS | https |
| 2022-08-08 | openssl rsa 新的认知 | openssl, rsa |

### DevOps/基础设施 (4 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2019-12-30 | Shadowsocks | proxy |
| 2019-12-31 | Nexus | nexus |
| 2022-05-06 | ShadowSocks Rust配置与优化 | shadowsocks |
| 2022-06-06 | Jenkins配置 | jenkins |

### 语言学习/其他 (5 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2015-02-10 | Go1 | go |
| 2015-05-05 | Dart Web Apps on Android | dart |
| 2015-03-30 | Design Patterns | design-patterns |
| 2015-05-05 | Cache Algorithms | algorithms |
| 2015-09-10 | Git的一些操作 | git |

### 问题记录/杂项 (7 篇)

| 日期 | 标题 | 标签 |
|------|------|------|
| 2013-12-21 | Welcome | - |
| 2014-12-08 | Tencent Interview | interview |
| 2015-04-21 | Recent Strange Problem | - |
| 2015-05-11 | 最近发现的几个注意点 | - |
| 2015-05-18 | Default App | - |
| 2015-12-29 | 问题整理 | - |
| 2016-01-19 | 问题整理二 | - |
| 2017-04-04 | 问题整理三 | - |
| 2015-12-16 | TreeView 树形菜单 | android |
| 2015-06-09 | Volley自定义中的几个问题 | android |
| 2015-07-28 | 如何根据错误日志解决问题 | android |

## Front Matter 格式现状

### 早期格式 (2013-2016)
```yaml
---
layout: post
title: 标题
date: 2015-01-01 12:00:00
author: haoxiqiang
categories: blog
tags: [android]
---
```

### 后期格式 (2022)
```yaml
---
title: 标题
description:
author: haoxiqiang
layout: post
date: 2022-08-15 20:53:06
categories: [Blogging]
tags: [aosp, android, pixel3xl]
---
```

## 内容特点

1. **语言**: 中英混合，部分文章全中文，部分全英文
2. **代码量大**: 大多数文章包含代码片段 (Java/Kotlin/Bash/Python/C)
3. **图片引用**: 早期文章引用 `/images/` 路径下的图片（可能已丢失）
4. **外部链接**: 部分引用的外部资源已失效
5. **更新频率**: 2015年高频 → 2016-2021年几乎停更 → 2022年恢复少量

## 需要清理的问题

- [ ] `2016-01-20-Https.markdown.markdown` — 重复文件名
- [ ] 文件名含空格和特殊字符 — 可能影响 URL 生成
- [ ] 图片引用路径 `/images/` — 需要确认图片是否还存在
- [ ] categories 值不统一 (`blog` vs `Blogging`)
- [ ] 部分文章缺少 description 字段
