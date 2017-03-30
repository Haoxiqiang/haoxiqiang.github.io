---
layout: post
title:  最近遇到的一些奇怪的问题
date:   2015-04-21 14:41:34
author: haoxiqiang
categories: blog
tags: [android]
image:
  feature:
  teaser:
  credit:
  creditlink:
---
* `Android Studio`新创建的工程直接报错,不能正常编译
* 魅蓝note不能连接adb,或者其他不能连接的错误
* 手机上某一个应用死活安装不上了,卸载了也不行,报报过签名错误,空间不足乱七八糟的
<!-- more -->

### 1.`Android Studio`新创建的工程直接报错,不能正常编译

	Error:Execution failed for task :app:mergeDebugResources. > Crunching Cruncher ic_launcher.png failed, see logs

	解决办法:
	创建一个drawable-hdpi或者drawable-xhdpi就好了
	
### 2.魅蓝note不能连接adb,或者其他不能连接的错误
	有些手机,注意是其他一切条件正常的时候,不能连接到电脑,需要考虑是不是需要加一下`vendor id`,提供`mac os`解决办法:
	
* 找到vendor id,一般在设备管理中可以看到对应的usb的vendor id
* vi ~/.android/adb_usb.ini 最后增加0x2a45//这里是你找到的vendor id,我的是0x2a45,魅族厂商的
* adb kill-server dab start-server,然后重新连接usb就可以了

### 3.手机上某一个应用死活安装不上了,卸载了也不行,报报过签名错误,空间不足乱七八糟的

	Package com.yuexue.tifenapp signatures do not match the previously installed version; ignoring!

	最开始看到一个这样的错误,一直不明白,试着这么做了一次,问题解决

	adb -e uninstall com.yuexue.tifenapp//不带-e 也可以
