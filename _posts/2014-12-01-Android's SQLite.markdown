---
layout: post
title:  Android's SQLite
date:   2014-12-01 22:11:22
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
SQLite数据库是一个非常小并且比较简单的数据库引擎,我们能够方便的使用它来做数据存储.Android 上创建和打开数据库只需要继承`SQLiteOpenHelper`, 默认的构造方法中，你要制定数据库名和版本,如果该数据库已经存在，则打开,否则会被创建。如果有许多单独的数据库文件。每个数据库都必须表示为单独的 `SQLiteOpenHelper`。但是这样使用的时候是有坑的, `SQLiteOpenHelper` 子类返回同样的 `SQLiteDatabase` 实例。这意味着在任何线程调用 `SQLiteDatabase.close()` 都会关闭你应用中所有的 `SQLiteDatabase` 实例。所以要格外注意打开和关闭时机,同时我觉得这样做容易混乱,不如合并到一个里面,除非数据巨大.
数据库文件对你的应用来说是私有的，数据库文件没有加密,一般在`/data/data/(packageName)/database/`路径下面,如果是root的手机任何人都可以读取的.如果在不root的情况下读取,就得在你的应用中拷贝出来db文件放置到public路径中的位置.
<!-- more -->

{% highlight java %}
public class DBHelper extends SQLiteOpenHelper {
    private static final String TAG = "DBHelper";
   	private static final String DATABASE_NAME = "contacts.db";
   	private static final int DATABASE_VERSION = 1;

   	public DBHelper(Context context) {
       	super(context, DATABASE_NAME, null, DATABASE_VERSION);    	
    }

   	//if the database named DATABASE_NAME doesn't exist in order to create it.    	
   	public void onCreate(SQLiteDatabase sqLiteDatabase) {
       	Log.i(TAG, "["+DATABASE_NAME+"v."+DATABASE_VERSION+"]");
    	//TODO: Create the Database
    }

    //Called when the DATABASE_VERSION is increased.
   	public void onUpgrade(SQLiteDatabase sqLiteDatabase, int oldVersion, int newVersion) {
       	Log.i(TAG, "Upgrading database["+DATABASE_NAME+" v." + newVersion+"]");
    }
}
{% endhighlight %}

>源码地址<br />

>参考<br />
[Android 中的 SQLite 数据库支持](http://objccn.io/issue-11-5/)<br />
[using the SQLite Database on Android and SQLiteOpenHelper](http://kylewbanks.com/blog/Tutorial-Implementing-a-Client-Side-Cache-using-the-SQLite-Database-on-Android-and-SQLiteOpenHelper)
