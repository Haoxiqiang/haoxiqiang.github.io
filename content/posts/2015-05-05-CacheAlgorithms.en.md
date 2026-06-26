---
title: "Cache Algorithms"
date: 2015-05-05 16:31:28
author: "haoxiqiang"
tags: ["java", "cache", "algorithms"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

Cache replacement policies determine which entries to evict when the cache is full. They have a direct impact on system performance. Here is an overview of common cache eviction algorithms.

<!--more-->

## Algorithm Overview

| Algorithm | Full Name | Core Idea |
|-----------|-----------|-----------|
| **Belady** | Belady's Algorithm | Evict the item **not needed for the longest time** in the future (theoretical optimum, not realizable) |
| **LRU** | Least Recently Used | Evict the least recently accessed item |
| **MRU** | Most Recently Used | Evict the most recently accessed item |
| **PLRU** | Pseudo-LRU | Approximate LRU using bitsets instead of linked lists for lower overhead |
| **RR** | Random Replacement | Random eviction |
| **SLRU** | Segmented LRU | Split cache into probation and protected segments |
| **2-way** | 2-Way Set Associative | Each cache set has two slots |
| **Direct-mapped** | Direct-Mapped Cache | Each memory address maps to exactly one cache line |
| **LFU** | Least-Frequently Used | Evict the least frequently accessed item |
| **LIRS** | Low Inter-reference Recency Set | Distinguish hot/cold data by reuse distance, outperforms LRU in many workloads |
| **ARC** | Adaptive Replacement Cache | Dynamically balances between LRU (recency) and LFU (frequency) |
| **CAR** | Clock with Adaptive Replacement | Clock-based approximation of ARC |
| **MQ** | Multi Queue | Multi-level queue management, each with its own replacement policy |

## Least Recently Used (LRU)

LRU is the most widely used cache eviction strategy: when the cache is full and a new item must be inserted, evict the item that has gone the longest without being accessed.

### Implementation Key Points

- **Get**: Move the accessed key to the head of the list
- **Put**: If the key doesn't exist and space is insufficient, evict from the tail until space is available, then insert at the head

### Common Implementations

- **LinkedHashMap**: Java's `LinkedHashMap` with `accessOrder=true` provides a ready-made LRU cache
- **Linked List + HashMap**: Doubly-linked list + hash map for O(1) read/write
- **LruCache**: Android's `LruCache<K, V>` class

### Trade-offs

- **Pros**: Exploits temporal locality, simple to implement
- **Cons**: Sequential/looping access patterns with a working set slightly larger than the cache cause thrashing

### References

- [Wikipedia: Cache Replacement Policies - LRU](https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU))
- [PDF: LRU Cache Implementation in Java](/source/pdf/LRU缓存实现-Java-.pdf)

## ARC (Adaptive Replacement Cache)

Proposed by IBM Research, ARC **adaptively** balances between recency (LRU) and frequency (LFU) to achieve better hit rates across diverse workloads.

- [Wikipedia: Adaptive Replacement Cache](https://en.wikipedia.org/wiki/Adaptive_replacement_cache)
- [Original Paper: ARC - A Self-Tuning, Low Overhead Replacement Cache](https://www.usenix.org/legacy/events/fast03/tech/megiddo.html)

## LIRS (Low Inter-reference Recency Set)

LIRS distinguishes between "hot" and "cold" data using reuse distance rather than simple access time for eviction decisions, widely used in databases and storage systems.

- [Wikipedia: LIRS](https://en.wikipedia.org/wiki/LIRS)
- [Original Paper: LIRS - An Efficient Low Inter-reference Recency Set](https://www.cs.utah.edu/~dongyoon/fall2020-cs6960/papers/lirs.pdf)

---

> Note: Originally written as study notes while learning cache algorithms. Content will be continuously improved.
