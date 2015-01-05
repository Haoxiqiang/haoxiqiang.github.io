---
layout: post
title:  Android EBUSY Exception
date:   2014-12-22 15:35:07
author: 郝锡强
categories: blog
letex: false
tags: [java]
---
最近写一个图片上传的东西,在一些手机出现了这个样的Runtime Exception:
{% highlight java%}
java.io.FileNotFoundException: /mnt/sdcard/Android/data/com.xxxxxx.android/files/xxxx open failed: EBUSY (Device or resource busy) 
 at libcore.io.IoBridge.open(IoBridge.java:406) 
 at java.io.FileOutputStream.<init>(FileOutputStream.java:88) 
 at java.io.FileOutputStream.<init>(FileOutputStream.java:73) 
 at com.xxxxx.android.util.io.ZipHelper.uncompressEntry(ZipHelper.java:35) 
 at com.xxxxx.android.task.PrepareMagTask.doInBackground(PrepareMagTask.java:271) 
 at com.xxxxx.android.task.PrepareMagTask.doInBackground(PrepareMagTask.java:1) 
 Caused by: libcore.io.ErrnoException: open failed: EBUSY (Device or resource busy) 
 at libcore.io.Posix.open(Native Method) 
 at libcore.io.BlockGuardOs.open(BlockGuardOs.java:110) 
 at libcore.io.IoBridge.open(IoBridge.java:390) 
 ... 11 more
{% endhighlight %}
<!-- more -->
在`stackover`查到原因:
>The Problem comes from the Android System or / and the FAT32 system. I can not explain how the system get the error, it has something to do with deleting files and the FAT32 System.
But the solution is really easy: Before you delete a Directory or File: rename it!
解决的代码如下:
{% highlight java%}
final File to = new File(file.getAbsolutePath() + System.currentTimeMillis()); file.renameTo(to); 
to.delete();
{% endhighlight %}

>参考<br />
[Lambda-QuickStart](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/Lambda-QuickStart/index.html)<br />
[LambdaExpressions](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)