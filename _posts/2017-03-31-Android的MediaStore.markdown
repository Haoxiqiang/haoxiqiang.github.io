---
layout: post
title:  Android 的 MediaStore
date:   2017-03-31 11:19:26
author: haoxiqiang
categories: blog
tags: [android]
image:
  feature:
  teaser:
  credit:
  creditlink:
---

最近在写一个类似微信的相册功能,能读取到照片和视频,能够实现多个不同文件夹切换,速度比现在的微信速度快一些,感觉起来实现的方案比较合适的是MediaStore,以前使用的比较少,特此记录一下

### ContentResolver 对于GROUP_BY在编译过程中有特殊处理
``` sql
 WHERE (1=1) AND (group by bucket_display_name) ORDER BY
```
对selection会自动加上`(`所以我们加入GROUP_BY的时候要特殊处理一下,比如这样
``` java
MediaStore.Images.ImageColumns.MIME_TYPE+ " IS NOT NULL "
                  + ") GROUP BY (" + MediaStore.Images.ImageColumns.BUCKET_DISPLAY_NAME;
```

