---
layout: post
title:  Android Data Storage
date:   2015-04-08 11:38:49
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
`Android`存储一些持久数据的方式一般有:

* `Shared Preferences` `key-value`形式存储一些简单的数据,存储在`xml`,直接支持的只有一些基本数据类型
* `Internal Storage` 内部存储.能够存储一些私有的数据
* `External Storage` 扩展存储.在外部存储上存储一些`public`的数据
* `SQLite Databases` 数据库.通过数据库存储一些结构化的数据
* `Network Connection` 通过网络连接存储在网络服务器上面
* `Content Providers` 这个是一个可以跨应用存储
<!-- more -->

## SharedPreferences

写值,`commit`现在可以使用`apply`替代,会直接刷新内存然后异步写入数据:

SharedPreferences.Editor editor = settings.edit();
editor.putBoolean("silentMode", mSilentMode);
// Commit the edits!
editor.commit();

读取,直接调用`getXX(key)`即可,比如`getBoolean()`` getString()`

## Internal Storage && External Storage
**区别**

* Internal Storage
	总是可用
	默认是只有本应用可以访问
	如果用户卸载了应用,这些数据一并会被移除
	如果你不想其他应用读取你的文件,这个是最好的保存方式
	
* External storage
	不保证始终可用,比如作为`USB storage`的时候这部分会被移掉
	这部分文件可能会脱离你的控制,因为这里的文件权限都是公开的
	如果用户卸载了应用,只用`getExternalFilesDir()`的文件会被删除
	如果你希望这些数据能够被分享,或者希望用户可以在电脑上访问这些文件,那么就用外部存储吧
	
**Internal Storage**

//1
File file = new File(context.getFilesDir(), filename);
//2
String filename = "myfile";
FileOutputStream outputStream;
try {
  outputStream = openFileOutput(filename, Context.MODE_PRIVATE);
  outputStream.write("Hello world!".getBytes());
  outputStream.close();
} catch (Exception e) {
  e.printStackTrace();
}
//3 如果是缓存,建议使用这个
public File getTempFile(Context context, String url) {
    File file;
    try {
        String fileName = Uri.parse(url).getLastPathSegment();
        file = File.createTempFile(fileName, null, context.getCacheDir());
    catch (IOException e) {
        // Error while creating file
    }
    return file;
}

**External Storage**
如果是外部存储要先判断是否存在和是否可以读写

//Checks if external storage is available for read and write
public boolean isExternalStorageWritable() {
    String state = Environment.getExternalStorageState();
    if (Environment.MEDIA_MOUNTED.equals(state)) {
        return true;
    }
    return false;
}
//Checks if external storage is available to at least read
public boolean isExternalStorageReadable() {
    String state = Environment.getExternalStorageState();
    if (Environment.MEDIA_MOUNTED.equals(state) ||
        Environment.MEDIA_MOUNTED_READ_ONLY.equals(state)) {
        return true;
    }
    return false;
}

**Query Free Space**
如果你想知道你现在的存储控件大小,在API 8 以上可以使用`getFreeSpace()`,`getTotalSpace()`两个方法来计算,这样在写入前先判断空间大小可以避免空间不足.但是系统不能保证你一定能够使用`getFreeSpace()`获取的大小,如果返回的大小比你需要的多的多,或者系统还没有使用了90%,那么一般是安全的,否则你就不应该继续写入了.


Note: You aren't required to check the amount of available space before you save your file. You can instead try writing the file right away, then catch an IOException if one occurs. You may need to do this if you don't know exactly how much space you need. For example, if you change the file's encoding before you save it by converting a PNG image to JPEG, you won't know the file's size beforehand.