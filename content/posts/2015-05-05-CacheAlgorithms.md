---
title: "Cache Algorithms"
date: 2015-05-05 16:31:28
author: "haoxiqiang"
tags: ["java", "cache", "algorithms"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

缓存算法（Cache Replacement Policies）决定缓存空间满时哪些数据被淘汰，对系统性能有直接影响。以下是常见的缓存淘汰算法概览。

<!--more-->

## 算法一览

| 算法 | 全称 | 核心思路 |
|------|------|----------|
| **Belady** | Bélády's Algorithm | 淘汰**未来最久不会使用**的项（理论最优，不可实现） |
| **LRU** | Least Recently Used | 淘汰最久未访问的项 |
| **MRU** | Most Recently Used | 淘汰最近刚访问的项 |
| **PLRU** | Pseudo-LRU | LRU 的近似实现，用 bitset 替代链表，减少开销 |
| **RR** | Random Replacement | 随机淘汰 |
| **SLRU** | Segmented LRU | 将缓存分为 probation 和 protected 两段 |
| **2-way** | 2-Way Set Associative | 每个缓存组有两个槽位的集合关联映射 |
| **Direct-mapped** | Direct-Mapped Cache | 每个内存地址只能映射到一个固定缓存行 |
| **LFU** | Least-Frequently Used | 淘汰访问频率最低的项 |
| **LIRS** | Low Inter-reference Recency Set | 区分近期高/低重用距离，性能优于 LRU |
| **ARC** | Adaptive Replacement Cache | 自适应地在 LRU 和 LFU 之间平衡 |
| **CAR** | Clock with Adaptive Replacement | ARC 的 Clock 近似实现 |
| **MQ** | Multi Queue | 多队列分级管理，各有独立的替换策略 |

## Least Recently Used (LRU)

LRU 是最常用的缓存淘汰策略：当缓存满且需要插入新项时，淘汰**最久未被使用**的项。

### 实现要点

- **查询**：将访问的 key 移动到链表头部
- **插入**：如果 key 不存在且空间不足，从尾部移除最近最少使用的项，重复直到空间满足

### 常见实现方式

- **LinkedHashMap**：Java 中 `LinkedHashMap` 开启 `accessOrder` 即可实现 LRU
- **Linked List + HashMap**：双向链表 + 哈希表实现 O(1) 的读写
- **LruCache**：Android 提供的 `LruCache<K, V>` 类

### 优缺点

- **优点**：利用时间局部性，实现简单
- **缺点**：遍历型访问模式（working set 略大于缓存）会导致频繁缓存抖动

### 参考资料

- [Wikipedia: Cache Replacement Policies - LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))
- [懒惰的肥兔 - LRU缓存实现(Java)](http://www.cnblogs.com/lzrabbit/p/3734850.html)
- [PDF: LRU缓存实现(Java)](/source/pdf/LRU缓存实现-Java-.pdf)

## ARC (Adaptive Replacement Cache)

ARC 由 IBM 研究院提出，**自适应**地在 LRU（近期性）和 LFU（频率性）之间动态调整，通常能在多种负载下取得比单纯 LRU 更好的命中率。

- [Wikipedia: Adaptive Replacement Cache](https://en.wikipedia.org/wiki/Adaptive_replacement_cache)
- [原始论文：ARC: A Self-Tuning, Low Overhead Replacement Cache](https://www.usenix.org/legacy/events/fast03/tech/megiddo.html)

## LIRS (Low Inter-reference Recency Set)

LIRS 区分"热"数据和"冷"数据，用重用间隔（inter-reference recency）而非简单的时间顺序来做淘汰决策，在数据库和存储系统中应用广泛。

- [Wikipedia: LIRS](https://en.wikipedia.org/wiki/LIRS)
- [原始论文: LIRS: An Efficient Low Inter-reference Recency Set](https://www.cs.utah.edu/~dongyoon/fall2020-cs6960/papers/lirs.pdf)

---

> 注：本文最初写于学习缓存算法时的笔记整理，内容将持续完善。
