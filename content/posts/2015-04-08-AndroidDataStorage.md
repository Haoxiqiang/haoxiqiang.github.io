---
title: "Android Data Storage"
date: 2015-04-08 11:38:49
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Android 提供了多种数据持久化方案,不同的方案适用于不同的场景。选择合适的存储方式对于应用的性能、安全性和用户体验至关重要。

<!--more-->

## 存储方案概览

| 存储方式 | 适用场景 | 数据私有 | 卸载时移除 |
|----------|----------|----------|------------|
| SharedPreferences | 键值对简单数据 | 是 | 是 |
| Internal Storage | 应用私有文件 | 是 | 是 |
| External Storage | 可分享的文件 | 否 | 仅 `getExternalFilesDir()` |
| SQLite Databases | 结构化数据 | 是 | 是 |
| Network Connection | 服务端数据 | — | 否 |
| Content Providers | 跨应用数据共享 | 取决于实现 | 取决于实现 |

---

## SharedPreferences

用于存储 key-value 形式的简单数据,存储在 XML 文件中。直接支持基本数据类型和 String。

### 写值

`commit()` 会同步写入磁盘,而 `apply()` 直接刷新内存然后异步写入磁盘——推荐优先使用 `apply()`:

```java
SharedPreferences.Editor editor = settings.edit();
editor.putBoolean("silentMode", mSilentMode);
editor.apply(); // 使用 apply 替代 commit
```

### 读取

直接调用 `getXX(key, defaultValue)`:

```java
boolean silentMode = settings.getBoolean("silentMode", false);
String name = settings.getString("name", "");
```

> **注意**:2019 年 Google 推出了 [Jetpack DataStore](https://developer.android.com/topic/libraries/architecture/datastore),使用 Kotlin Coroutines 和 Flow 实现了类型安全的异步存储,是 SharedPreferences 的现代替代方案。

---

## Internal Storage && External Storage

### 区别

**Internal Storage (内部存储)**
- 始终可用
- 默认仅本应用可访问
- 用户卸载应用时数据一并移除
- 适合存储不希望被其他应用读取的私有数据

**External Storage (外部存储)**
- 不保证始终可用(如作为 USB 存储时可能被移除)
- 文件权限公开,可能被其他应用读取
- 仅 `getExternalFilesDir()` 创建的文件会在卸载时删除
- 适合需要分享或用户通过电脑访问的文件

### Internal Storage 操作

```java
// 方法1: 使用 getFilesDir()
File file = new File(context.getFilesDir(), filename);

// 方法2: 使用 openFileOutput()
String filename = "myfile";
FileOutputStream outputStream;
try {
    outputStream = openFileOutput(filename, Context.MODE_PRIVATE);
    outputStream.write("Hello world!".getBytes());
    outputStream.close();
} catch (Exception e) {
    e.printStackTrace();
}

// 方法3: 缓存文件
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

### External Storage 操作

操作前需要先判断存储状态:

```java
// 检查外部存储是否可读写
public boolean isExternalStorageWritable() {
    String state = Environment.getExternalStorageState();
    return Environment.MEDIA_MOUNTED.equals(state);
}

// 检查外部存储至少可读
public boolean isExternalStorageReadable() {
    String state = Environment.getExternalStorageState();
    return Environment.MEDIA_MOUNTED.equals(state) ||
        Environment.MEDIA_MOUNTED_READ_ONLY.equals(state);
}
```

### 查询可用空间

API 8+ 可使用 `File.getFreeSpace()` 和 `File.getTotalSpace()` 查询存储空间。在写入前判断空间大小可以避免空间不足。但系统不能保证你一定能够使用 `getFreeSpace()` 返回的大小——如果所需空间远小于剩余空间,或者系统使用率未达 90%,一般是安全的;否则应当谨慎写入。

> 实际上,你并不需要在保存文件前一定检查可用空间。另一种做法是直接尝试写入,捕获 IOException。这在不确定所需空间大小时尤其有用(例如将 PNG 转为 JPEG 后文件大小无法预知)。

---

## SQLite Databases

Android 内置 SQLite 数据库引擎,适合存储结构化数据。推荐通过 SQLiteOpenHelper 管理数据库的创建和版本迁移。

> 现代 Android 开发推荐使用 [Room](https://developer.android.com/training/data-storage/room) 持久化库,它在 SQLite 基础上提供了编译时验证、自动迁移、协程支持等便利功能。

---

## Network Connection

通过网络连接将数据存储到远程服务器,适用于需要跨设备访问或云端同步的场景。通常配合 Retrofit、OkHttp 等网络库使用。

---

## Content Providers

ContentProvider 是 Android 组件级别的数据共享机制,允许跨应用访问和操作数据。它封装了底层存储(可以是 SQLite、文件、网络等),通过 URI 接口对外暴露数据。

---

## 参考

- [Data and file storage overview — Android Developers](https://developer.android.com/training/data-storage)
- [Shared storage overview — Android Developers](https://developer.android.com/training/data-storage/shared)
- [Jetpack DataStore — Android Developers](https://developer.android.com/topic/libraries/architecture/datastore)
- [Room Persistence Library — Android Developers](https://developer.android.com/training/data-storage/room)
- [Content Provider Basics — Android Developers](https://developer.android.com/guide/topics/providers/content-providers)
