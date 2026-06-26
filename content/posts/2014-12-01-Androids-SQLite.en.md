---
title: "Android's SQLite"
date: 2014-12-01 22:11:22
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

SQLite is a lightweight relational database engine built into Android, ideal for local data persistence. The `android.database.sqlite` package provides everything you need without additional setup.

<!--more-->

## SQLiteOpenHelper Basics

To create and open a database, extend `SQLiteOpenHelper`. The constructor takes a database name and version number. The system checks if the database already exists — if so, it opens it; otherwise, it creates a new one and calls `onCreate`.

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

Note that the database is not created or opened until `getWritableDatabase()` or `getReadableDatabase()` is called. `onUpgrade` is triggered when the version number increases — handle schema migrations here.

## Singleton Pattern and Thread Safety

A `SQLiteOpenHelper` subclass returns the **same** `SQLiteDatabase` instance. This means calling `close()` from any thread closes all database instances in your app. Be mindful of open/close timing.

Best practices:

- Use a singleton pattern to manage your `SQLiteOpenHelper` instance
- Avoid opening and closing database connections frequently across different parts of your app
- Unless data volume is enormous, consolidate data into a single database rather than managing multiple `SQLiteOpenHelper` instances

## File Location and Security

Database files are private to your app, stored at `/data/data/(packageName)/database/`. However:

- The database file is **not encrypted** — anyone with root access can read it
- To export the database on a non-rooted device, copy it to a public location from your app
- For sensitive data, consider SQLCipher or Android's `EncryptedDatabase`

## References

- [SQLiteOpenHelper | Android Developers](https://developer.android.com/reference/android/database/sqlite/SQLiteOpenHelper)
- [Save data using SQLite | Android Developers](https://developer.android.com/training/data-storage/sqlite)
- [SQLite Official Documentation](https://www.sqlite.org/docs.html)
- [Using the SQLite Database on Android and SQLiteOpenHelper](http://kylewbanks.com/blog/Tutorial-Implementing-a-Client-Side-Cache-using-the-SQLite-Database-on-Android-and-SQLiteOpenHelper)
