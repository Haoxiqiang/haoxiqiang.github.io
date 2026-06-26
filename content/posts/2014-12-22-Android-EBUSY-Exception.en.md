---
title: "Android EBUSY Exception"
date: 2014-12-22 15:35:07
author: "haoxiqiang"
tags: ["android", "java"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

While working on an image upload feature, I encountered a runtime exception on certain devices:

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

## Root Cause

The EBUSY error is related to Android's filesystem behavior, particularly on FAT32 volumes. A common scenario: you delete a file and immediately try to create a new file with the same name. Even though the file has been removed, the filesystem's dentry cache or file lock hasn't been released yet, causing the new file creation to fail.

## Solution

The simplest fix: rename the file or directory before deleting it.

```java
final File to = new File(
    file.getAbsolutePath() + System.currentTimeMillis());
file.renameTo(to);
to.delete();
```

Why this works: `renameTo()` changes the file's name reference in the filesystem. The original filename is freed, and the data blocks are now referenced by the new temporary name. Deleting the renamed file succeeds because the original filename is no longer locked.

## Additional Notes

EBUSY typically occurs in these scenarios:

- Multiple processes referencing the same file
- A file is deleted but its reference is not released
- FAT32 filesystems on external SD cards (most commonly reported)

## References

- [StackOverflow: open failed EBUSY](http://stackoverflow.com/questions/11539657/open-failed-ebusy-device-or-resource-busy)
