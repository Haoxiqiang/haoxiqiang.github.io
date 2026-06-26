---
title: "Android Data Storage"
date: 2015-04-08 11:38:49
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Android provides several options for persisting data, each suited to different use cases. Choosing the right storage method is critical for your app's performance, security, and user experience.

<!--more-->

## Storage Options Overview

| Storage Method | Best For | Private? | Removed on Uninstall? |
|----------------|----------|----------|------------------------|
| SharedPreferences | Simple key-value data | Yes | Yes |
| Internal Storage | App-private files | Yes | Yes |
| External Storage | Shareable files | No | Only `getExternalFilesDir()` |
| SQLite Databases | Structured data | Yes | Yes |
| Network Connection | Server-side data | — | No |
| Content Providers | Cross-app data sharing | Varies | Varies |

---

## SharedPreferences

Used for storing simple key-value pairs in an XML file. Supports basic data types and String.

### Writing

`commit()` writes synchronously to disk, while `apply()` updates the in-memory cache immediately and writes to disk asynchronously — prefer `apply()`:

```java
SharedPreferences.Editor editor = settings.edit();
editor.putBoolean("silentMode", mSilentMode);
editor.apply(); // use apply instead of commit
```

### Reading

Use `getXX(key, defaultValue)`:

```java
boolean silentMode = settings.getBoolean("silentMode", false);
String name = settings.getString("name", "");
```

> **Note**: In 2019, Google introduced [Jetpack DataStore](https://developer.android.com/topic/libraries/architecture/datastore), a modern, type-safe, asynchronous replacement for SharedPreferences built on Kotlin Coroutines and Flow.

---

## Internal Storage vs External Storage

### Key Differences

**Internal Storage**
- Always available
- Private to your app by default
- Removed when the user uninstalls the app
- Best for data that should not be accessed by other apps

**External Storage**
- Not always available (may be removed when mounted as USB storage)
- Files are world-readable
- Only files in `getExternalFilesDir()` are removed on uninstall
- Best for files that need to be shared or accessed via a computer

### Internal Storage Operations

```java
// Method 1: getFilesDir()
File file = new File(context.getFilesDir(), filename);

// Method 2: openFileOutput()
String filename = "myfile";
FileOutputStream outputStream;
try {
    outputStream = openFileOutput(filename, Context.MODE_PRIVATE);
    outputStream.write("Hello world!".getBytes());
    outputStream.close();
} catch (Exception e) {
    e.printStackTrace();
}

// Method 3: Cache files
public File getTempFile(Context context, String url) {
    File file;
    try {
        String fileName = Uri.parse(url).getLastPathSegment();
        file = File.createTempFile(fileName, null, context.getCacheDir());
    } catch (IOException e) {
        // Error while creating file
    }
    return file;
}
```

### External Storage Operations

Always check the storage state before operating:

```java
// Check if external storage is available for read and write
public boolean isExternalStorageWritable() {
    String state = Environment.getExternalStorageState();
    return Environment.MEDIA_MOUNTED.equals(state);
}

// Check if external storage is at least readable
public boolean isExternalStorageReadable() {
    String state = Environment.getExternalStorageState();
    return Environment.MEDIA_MOUNTED.equals(state) ||
        Environment.MEDIA_MOUNTED_READ_ONLY.equals(state);
}
```

### Querying Free Space

API 8+ provides `File.getFreeSpace()` and `File.getTotalSpace()`. Checking available space before writing can prevent out-of-space errors. However, the system doesn't guarantee you can actually use all the space `getFreeSpace()` reports — if you need significantly less than the free space, or the system is under 90% capacity, it's generally safe.

> You aren't required to check available space before saving. An alternative approach is to write the file and catch an `IOException`. This is useful when you don't know the exact file size in advance (e.g., converting a PNG to JPEG changes the size unpredictably).

---

## SQLite Databases

Android includes a built-in SQLite database engine for structured data. Use `SQLiteOpenHelper` to manage database creation and version migration.

> Modern Android development recommends [Room](https://developer.android.com/training/data-storage/room) — a persistence library that provides compile-time query validation, automatic migration, and Coroutine support on top of SQLite.

---

## Network Connection

Store data on a remote server via network connections, suitable for cross-device access and cloud synchronization. Use libraries like Retrofit or OkHttp for network operations.

---

## Content Providers

ContentProvider is Android's cross-app data sharing mechanism. It encapsulates the underlying storage (SQLite, files, network, etc.) and exposes data through a URI-based interface.

---

## References

- [Data and file storage overview — Android Developers](https://developer.android.com/training/data-storage)
- [Shared storage overview — Android Developers](https://developer.android.com/training/data-storage/shared)
- [Jetpack DataStore — Android Developers](https://developer.android.com/topic/libraries/architecture/datastore)
- [Room Persistence Library — Android Developers](https://developer.android.com/training/data-storage/room)
- [Content Provider Basics — Android Developers](https://developer.android.com/guide/topics/providers/content-providers)
