---
title: "Android 的 MediaStore"
date: 2017-03-31 11:19:26
author: "haoxiqiang"
tags: ["android", "mediastore", "contentresolver"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

最近在写一个类似微信的相册功能，需要读取照片和视频，支持多文件夹切换，且速度要比微信快。调研后发现基于 `MediaStore` 的方案最为合适。以前用得不多，特此记录。

## ContentResolver 对 GROUP BY 的特殊处理

`ContentResolver.query()` 没有提供 `groupBy` 参数（与 `SQLiteQueryBuilder.query()` 不同），但可以通过在 `selection` 参数中嵌入 `GROUP BY` 来实现类似效果。

原理是 `ContentResolver` 会在编译 SQL 时给 `selection` 自动加上括号包裹，形成 `WHERE ( ... )`。利用这一点，可以在 selection 中提前闭合括号，然后追加 `GROUP BY` 子句。

```java
// 常规写法 — selection 会被包装成 WHERE (mime_type IS NOT NULL)
MediaStore.Images.ImageColumns.MIME_TYPE + " IS NOT NULL "

// Hack 写法 — 利用闭合括号注入 GROUP BY
MediaStore.Images.ImageColumns.MIME_TYPE + " IS NOT NULL "
    + ") GROUP BY (" + MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME;
```

生成的 SQL 变为：

```sql
WHERE (1=1) AND (mime_type IS NOT NULL) GROUP BY (bucket_display_name) ORDER BY ...
```

> **注意：** 这种方式在 Android 10（API 29）之后可能失效。系统 `MediaProvider` 会额外注入 `is_pending=0`、`is_trashed=0`、`volume_name IN (...)` 等条件，可能导致 `GROUP BY` 被错误地放入 WHERE 子句内部。**在 Android 14+ 上该 hack 已确定不可用。**

## 现代方案：Android 11+ Bundle 参数

从 Android 11（API 30）开始，`ContentResolver.query()` 支持通过 `Bundle` 传递结构化查询参数，无需再使用上述 hack。

```java
Bundle queryArgs = new Bundle();
queryArgs.putStringArray(
    ContentResolver.QUERY_ARG_GROUP_COLUMNS,
    new String[]{MediaStore.Images.Media.BUCKET_DISPLAY_NAME}
);

Cursor cursor = contentResolver.query(
    MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
    projection,
    queryArgs,
    null
);
```

推荐使用 `QUERY_ARG_GROUP_COLUMNS`（结构化参数）而非 `QUERY_ARG_SQL_GROUP_BY`（原始 SQL），以保证向前兼容。Provider 会通过 Cursor 的 `EXTRA_HONORED_ARGS` 告知哪些参数已生效。

### 补充：Android 10 的临时方案

如果仍需支持 API 29，可以考虑以下方案：

1. **使用 `ContentResolver.query(uri, projection, selection, selectionArgs, sortOrder)` 配合原始 SQL** — 在 selection 中内联子查询
2. **客户端分组** — 不使用 GROUP BY，全部查询后在内存中手动分组
3. **使用自定义 ContentProvider** — 自行控制 SQL 查询逻辑

## 注意事项

- 传统的 selection hack 在不同 OEM 和 Android 版本上行为可能不一致，务必充分测试。
- 如果目标 API 30+，应优先使用 Bundle 方案。
- 自定义 `ContentProvider` 时，可直接使用 `SQLiteQueryBuilder.query()`，它原生支持 `groupBy` 和 `having` 参数。

## 参考资料

- [Android Developers: Access media files from shared storage](https://developer.android.com/training/data-storage/shared/media)
- [Android Developers: ContentResolver](https://developer.android.com/reference/android/content/ContentResolver#query(android.net.Uri,%20java.lang.String[],%20android.os.Bundle,%20android.os.CancellationSignal))
- [StackOverflow: How to query from MEDIA provider with "group by" option?](https://stackoverflow.com/questions/2965216/how-to-query-from-media-provider-with-group-by-option/23955822#23955822)
- [Android Source: SQLiteQueryBuilder.java](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/database/sqlite/SQLiteQueryBuilder.java)
- [Android Source: MediaProvider](https://android.googlesource.com/platform/packages/providers/MediaProvider/)
