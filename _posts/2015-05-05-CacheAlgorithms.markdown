---
layout: post
title:  Cache algorithms
date:   2015-05-05 16:31:28
author: haoxiqiang
categories: blog
tags: [java]
image:
  feature:
  teaser:
  credit:
  creditlink:
---

这几天在看一些缓存算法,先熟悉熟悉

* Bélády's Algorithm
* Least Recently Used (LRU)
* Most Recently Used (MRU)
* Pseudo-LRU (PLRU)
<!-- more -->
* Random Replacement (RR)
* Segmented LRU (SLRU)
* 2-way set associative
* Direct-mapped cache
* Least-Frequently Used (LFU)
* Low Inter-reference Recency Set (LIRS)
* Adaptive Replacement Cache (ARC)
* Clock with Adaptive Replacement (CAR)
* Multi Queue (MQ)

## Least Recently Used (LRU)

LRU的缓存方案是在加入一个新的文件,这时如果缓存空间已满且不包含这个文件,移除掉最近最少使用的文件.实现起来也很简单,只说几个关键点:

* 取值的时候把key更新到最新
* 放入值的时候先检查key,不存在的话判断大小
	* 可以直接放入,放入到第一个
	* 空间不足,移除最后一个,判断大小,不行就继续移除直到可以容下文件
	
链表的理解起来感觉好理解一点,原文查看 [懒惰的肥兔](http://www.cnblogs.com/lzrabbit/p/3734850.html)   [pdf 版本](/source/pdf/LRU缓存实现-Java-.pdf)



//待编辑
