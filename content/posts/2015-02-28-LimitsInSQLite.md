---
title: "SQLite 限制详解：从一次 SQLiteFullException 说起"
date: 2015-02-28 22:48:55
author: "haoxiqiang"
tags: ["android", "sqlite", "database"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

最近排查一个 BUG 时遇到一个奇怪的问题：`android.database.sqlite.SQLiteFullException: database or disk is full (code 13)`。查阅了很多资料也没能完全弄清楚根因，这里把整理的资料分享出来，希望遇到类似问题的朋友共同探讨。

![limitsinsqlite01](/images/limitsinsqlite01.png)

<!--more-->

最开始怀疑是磁盘空间满了，但从上图信息来看应该不是。然后猜测是 SQLite 存在大小限制。Stack Overflow 上有一个经典的讨论：[maximum-number-of-rows-in-a-sqlite-table](http://stackoverflow.com/questions/1546947/maximum-number-of-rows-in-a-sqlite-table)：

> In July 2011 the sqlite3 limits page was updated to define the practical limits...The theoretical maximum number of rows in a table is 2^64 (about 1.8e+19). This limit is unreachable since the maximum database size of 14 terabytes will be reached first. A 14 terabytes database can hold no more than approximately 1e+13 rows...So with a max database size of 14 terabytes you'd be lucky to get ~1 Trillion rows since if you actually had a useful table with data in it the number of rows would be constrained by the size of the data.

论行数、论体积，我这边的情况都排不上号。接着怀疑是平台相关，查了 [Comparison of relational database management systems](http://en.wikipedia.org/wiki/Comparison_of_relational_database_management_systems#Limits) 也不对。于是逐一排查官方文档 [Limits In SQLite](https://www.sqlite.org/limits.html)，以下是整理出的关键限制清单。

## SQLite 关键限制汇总

### 字符串 / BLOB 长度
最大支持 2^31 - 1 字节，即 2147483647 字节（约 2 GB）。

### 列数
默认最多 2000 列，可在编译时调整为 32767。

### SQL 语句长度
默认限制 1000000 字节，可上调至 1073741824 字节（1 GB）。

### JOIN 中的表数
最多支持 64 个表的连接查询。

### 表达式树深度
默认限制 1000，设为 0 则不强制限制。

### 函数参数
默认最多 100 个参数。

### 复合 SELECT 的项数
默认值 500。

### LIKE / GLOB 模式长度
默认 50000 字节。官方特别标注了时间复杂度为 O(N^2)，N 为字符总数。

### SQL 语句中的宿主参数
默认 999 个。

### 触发器递归深度
从 v3.6.18 开始支持，v3.7.0 起默认值为 1000。

### 附加的数据库数
默认最多附加 10 个数据库，最大不超过 125 个。

### 数据库文件页数
一般设置为 1073741823，最大为 2147483646。配合最大页大小 65536 字节，最大数据库体积约为 140 TB（新版 SQLite 的理论上限已达 281 TB）。

### 表中的行数
理论上限为 2^64（约 1.8e+19），实际上在此之前会先达到文件大小上限。

### 数据库最大体积
每个数据库由一个或多个"页"组成。页大小可以是 512 到 65536 字节之间（2 的幂）。数据库文件最大为 2147483646 页。在最大页大小 65536 字节下，最大数据库体积约 140 TB（或 128 TiB）。**注**：自 SQLite 3.45.0 起，页数上限提升至 2^32 - 2，对应最大体积约 281 TB。

## 排查方向

从以上限制来看，SQLite 自身的上限远高于实际场景，所以方向需要调整。以下两个方向值得关注。

### 数据库体积与 VACUUM

如果你删除了大量数据但数据库文件大小没有减小——这不是 BUG。SQLite 将被释放的空间放入内部的"空闲列表"（free-list），下一次插入数据时优先复用，但不会返还给操作系统。

如果希望缩小数据库文件，可以执行 VACUUM 命令：

```sql
VACUUM;
```

VACUUM 会从头重建数据库，生成一个空闲列表为空的最小体积文件。但需要注意，VACUUM 执行时需要最多 2 倍于原文件的临时磁盘空间，且耗时较长。

作为替代方案，可以启用自动清理模式：

```sql
PRAGMA auto_vacuum = FULL;   -- 1: fully auto-vacuum
```

需要权衡的是，auto_vacuum 虽然自动回收空闲页，但可能导致更严重的碎片化，且不会像 VACUUM 那样压缩未完全使用的页。

### 数据库最大容量限制（Android 平台）

如果数据库来自第三方或底层框架，可能显式限制了最大体积。可以通过以下方式检查：

```java
SQLiteDatabase db = getWritableDatabase();
long maxSize = db.getMaximumSize(); // 获取当前最大容量
```

确认限制后，可以酌情调用 `setMaximumSize()` 放宽限制，或做兼容处理。

相关讨论：[Bugly SQLiteFullException](http://bugly.qq.com/bbs/forum.php?mod=viewthread&tid=1010)（链接可能已失效）

---

如果你有类似经验或知道其他可能的原因，请多指教。

## 参考资料

- [Limits In SQLite (sqlite.org)](https://www.sqlite.org/limits.html)
- [VACUUM Command (sqlite.org)](https://www.sqlite.org/lang_vacuum.html)
- [Maximum number of rows in a SQLite table (Stack Overflow)](http://stackoverflow.com/questions/1546947/maximum-number-of-rows-in-a-sqlite-table)
- [Comparison of relational database management systems (Wikipedia)](http://en.wikipedia.org/wiki/Comparison_of_relational_database_management_systems#Limits)
- [SQLiteFullException (Android Developers)](https://developer.android.com/reference/android/database/sqlite/SQLiteFullException)
- [Performance characteristics of SQLite with very large database files (Stack Overflow)](http://stackoverflow.com/questions/784173/what-are-the-performance-characteristics-of-sqlite-with-very-large-database-files)
