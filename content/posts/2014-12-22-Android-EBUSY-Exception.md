---
title: "Android EBUSY Exception"
date: 2014-12-22 15:35:07
author: "haoxiqiang"
tags: ["android", "java"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

最近写一个图片上传功能时，在某些手机上遇到了运行时异常：

```java
java.io.FileNotFoundException: /mnt/sdcard/Android/data/com.xxxxxx.android/files/xxxx
    open failed: EBUSY (Device or resource busy)
    at libcore.io.IoBridge.open(IoBridge.java:406)
    at java.io.FileOutputStream.<init>(FileOutputStream.java:88)
    ...
    Caused by: libcore.io.ErrnoException: open failed: EBUSY (Device or resource busy)
    at libcore.io.Posix.open(Native Method)
    at libcore.io.BlockGuardOs.open(BlockGuardOs.java:110)
    ...
```

<!--more-->

## 原因分析

这个 EBUSY 错误与 Android 文件系统（特别是 FAT32）的行为有关。常见场景：删除文件后立即重新创建同名文件，此时文件虽然已被删除，但文件系统的 dentry cache 或文件锁尚未释放，导致新文件创建失败。

## 解决方案

最简单的解决办法：删除文件或目录之前先重命名。

```java
final File to = new File(
    file.getAbsolutePath() + System.currentTimeMillis());
file.renameTo(to);
to.delete();
```

原理：`renameTo()` 改变了文件名在文件系统中的引用，原文件名被释放，新的临时文件名承载了实际数据块。此时再删除临时文件，就不会因为原文件名被占用而失败。

## 补充说明

EBUSY 通常出现在以下场景：

- 多个进程引用了同一个文件
- 文件已被删除，但引用未被释放
- 外部 SD 卡上的 FAT32 文件系统（此类问题在该系统上尤为常见）

## 参考

- [StackOverflow: open failed EBUSY](http://stackoverflow.com/questions/11539657/open-failed-ebusy-device-or-resource-busy)
