---
layout: post
title:  Android使用Wireless调试
date:   2014-12-05 11:35:07
author: haoxiqiang
categories: blog
tags: [android]
image:
  feature:
  teaser:
  credit:
  creditlink:
---
自从换了我心爱的Nexus,再也不想用USB来爆Nexus的菊花,好在可以直接支持`adb`通过`WiFi`来直接调试,别和说360神马的都有这个功能,为了躲这些个手机助手,我都把电脑换成`Mac`了,你还想怎样!
首先保证手机和同样心爱的`Mac`在一个局域网下,然后用USB连接上,开启`开发者模式`,`USB调试模式`,打开命令行

```
//Make sure adb is running in USB mode on host.
$ adb usb
restarting in USB mode

//Connect to the device over USB.
$ adb devices
List of devices attached
######## device

//Restart host adb in tcpip mode.
$ adb tcpip 5555
restarting in TCP mode port: 5555

```

<!-- more -->
现在你需要查看一下你的手机IP地址,`Settings -> About tablet -> Status -> IP address.`,然后就可以愉快的使用了

```
//Connect adb host to device:
$ adb connect your ip
connected to #.#.#.#:5555
//Remove USB cable from device, and confirm you can still access device:
$ adb devices
List of devices attached
#.#.#.#:5555 device
```

如果连接断掉或者失败的话.检查一下网段是不是在一个下面,没问题的话就使用重启大法,然后插一次USB在搞一下就行了

```
$adb kill-server
$adb start-server
$adb tcpip 5555
$adb connect your ip
```