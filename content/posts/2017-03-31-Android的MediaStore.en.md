---
title: "Android MediaStore: GROUP BY via ContentResolver"
date: 2017-03-31 11:19:26
author: "haoxiqiang"
tags: ["android", "mediastore", "contentresolver"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

When building a photo album feature similar to WeChat, I needed to read photos and videos with multi-folder switching — and it had to be faster than WeChat. After some research, the `MediaStore` approach proved most suitable. Since I hadn't used it much before, this post serves as a record.

## The GROUP BY Hack in ContentResolver

`ContentResolver.query()` does not expose a `groupBy` parameter (unlike `SQLiteQueryBuilder.query()`), but you can achieve a similar effect by embedding `GROUP BY` directly into the `selection` argument.

The trick relies on the fact that `ContentResolver` wraps the `selection` in parentheses during SQL compilation, producing `WHERE ( ... )`. By closing the parenthesis early in the selection string, you can append a `GROUP BY` clause.

```java
// Normal — selection becomes WHERE (mime_type IS NOT NULL)
MediaStore.Images.ImageColumns.MIME_TYPE + " IS NOT NULL "

// Hack — close the parenthesis and inject GROUP BY
MediaStore.Images.ImageColumns.MIME_TYPE + " IS NOT NULL "
    + ") GROUP BY (" + MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME;
```

The resulting SQL looks like:

```sql
WHERE (1=1) AND (mime_type IS NOT NULL) GROUP BY (bucket_display_name) ORDER BY ...
```

> **Warning:** This approach may break on Android 10 (API 29) and above. The system `MediaProvider` injects additional conditions such as `is_pending=0`, `is_trashed=0`, and `volume_name IN (...)`, which can incorrectly place the `GROUP BY` inside the WHERE clause. **As of Android 14+, this hack is confirmed broken.**

## Modern Approach: Android 11+ Bundle Parameters

Starting with Android 11 (API 30), `ContentResolver.query()` supports structured query parameters via `Bundle`, eliminating the need for the hack above.

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

Prefer `QUERY_ARG_GROUP_COLUMNS` (structured) over `QUERY_ARG_SQL_GROUP_BY` (raw SQL) for forward compatibility. The Provider indicates which arguments were honored via the Cursor's `EXTRA_HONORED_ARGS`.

### Workaround for Android 10

If you still need to support API 29, consider these alternatives:

1. **Use `ContentResolver.query(uri, projection, selection, selectionArgs, sortOrder)`** with a subquery inline in the selection
2. **Client-side grouping** — fetch all results and group in memory
3. **Custom ContentProvider** — take full control of the SQL query logic

## Caveats

- The traditional selection hack behaves inconsistently across OEMs and Android versions — test thoroughly.
- If your `minSdkVersion` is 30+, prioritize the Bundle approach.
- When implementing a custom `ContentProvider`, use `SQLiteQueryBuilder.query()` directly — it natively supports `groupBy` and `having` parameters.

## References

- [Android Developers: Access media files from shared storage](https://developer.android.com/training/data-storage/shared/media)
- [Android Developers: ContentResolver](https://developer.android.com/reference/android/content/ContentResolver#query(android.net.Uri,%20java.lang.String[],%20android.os.Bundle,%20android.os.CancellationSignal))
- [StackOverflow: How to query from MEDIA provider with "group by" option?](https://stackoverflow.com/questions/2965216/how-to-query-from-media-provider-with-group-by-option/23955822#23955822)
- [Android Source: SQLiteQueryBuilder.java](https://android.googlesource.com/platform/frameworks/base/+/refs/heads/main/core/java/android/database/sqlite/SQLiteQueryBuilder.java)
- [Android Source: MediaProvider](https://android.googlesource.com/platform/packages/providers/MediaProvider/)
