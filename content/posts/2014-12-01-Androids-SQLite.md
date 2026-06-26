---
title: "Android's SQLite"
date: 2014-12-01 22:11:22
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

SQLite 是一个轻量级的关系型数据库引擎，Android 内置对其支持，非常适合本地数据持久化。无需额外配置，通过 `android.database.sqlite` 包下的 API 即可使用。

<!--more-->

## SQLiteOpenHelper 的基本用法

创建和打开数据库只需继承 `SQLiteOpenHelper`。构造方法中指定数据库名和版本号，系统会自动判断：如果数据库已存在则打开，否则创建新库并回调 `onCreate`。

```java
public class DBHelper extends SQLiteOpenHelper {
    private static final String TAG = "DBHelper";
    private static final String DATABASE_NAME = "contacts.db";
    private static final int DATABASE_VERSION = 1;

    public DBHelper(Context context) {
        super(context, DATABASE_NAME, null, DATABASE_VERSION);
    }

    /**
     * Called when the database is created for the first time.
     */
    @Override
    public void onCreate(SQLiteDatabase sqLiteDatabase) {
        Log.i(TAG, "[" + DATABASE_NAME + " v." + DATABASE_VERSION + "]");
        // TODO: Create tables here
    }

    /**
     * Called when the DATABASE_VERSION is increased.
     */
    @Override
    public void onUpgrade(SQLiteDatabase sqLiteDatabase,
                          int oldVersion, int newVersion) {
        Log.i(TAG, "Upgrading database[" + DATABASE_NAME +
              " v." + newVersion + "]");
    }
}
```

需要注意的是，数据库直到首次调用 `getWritableDatabase()` 或 `getReadableDatabase()` 时才会真正创建或打开。`onUpgrade` 在版本号递增时触发，应在此处执行表结构变更逻辑。

## 单例模式与线程安全

`SQLiteOpenHelper` 的子类会返回同一个 `SQLiteDatabase` 实例。这意味着在任何线程调用 `close()` 都会关闭应用中所有的数据库实例。因此需要格外注意打开和关闭的时机。

建议的实践：

- 使用单例模式管理 `SQLiteOpenHelper` 实例
- 避免在多处频繁开关数据库连接
- 除非数据量特别大，否则尽量将数据合并到一个数据库中，避免多个 `SQLiteOpenHelper` 实例带来的混乱

## 数据库文件的存储位置与安全性

数据库文件对应用来说是私有的，默认存储在 `/data/data/(packageName)/database/` 路径下。但需要注意：

- 数据库文件**没有加密**，Root 过的设备上任何人都可以直接读取
- 如需在非 Root 设备上导出数据库文件，需要在应用中先将其复制到公共目录
- 敏感数据建议使用 `EncryptedDatabase` 或 SQLCipher 等方案加密

## 参考

- [SQLiteOpenHelper | Android Developers](https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper)
- [Save data using SQLite | Android Developers](https://developer.android.com/training/data-storage/sqlite)
- [SQLite 官方文档](https://www.sqlite.org/docs.html)
- [Using the SQLite Database on Android and SQLiteOpenHelper](http://kylewbanks.com/blog/Tutorial-Implementing-a-Client-Side-Cache-using-the-SQLite-Database-on-Android-and-SQLiteOpenHelper)
