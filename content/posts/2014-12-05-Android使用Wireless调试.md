---
title: "Android 使用 Wireless 调试"
date: 2014-12-05 11:35:07
slug: "Android使用Wireless调试"
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

自从换了 Nexus 设备，就不太想用 USB 连电脑了。Android 支持通过 WiFi 进行 ADB 调试，完全可以摆脱数据线的束缚。

<!--more-->

## 前提条件

- 手机和电脑（Mac）在同一个局域网
- 手机开启「开发者模式」和「USB 调试」
- 电脑装有 ADB 工具

## 传统方式（Android 10 及以下）

先用 USB 连接手机，执行以下命令切换到 TCP/IP 模式：

```bash
# 确认 adb 运行在 USB 模式
$ adb usb
restarting in USB mode

# 查看设备是否已连接
$ adb devices
List of devices attached
######## device

# 将 adb 切换到 TCP/IP 模式，端口 5555
$ adb tcpip 5555
restarting in TCP mode port: 5555
```

然后查看手机的 IP 地址（`设置 > 关于手机 > 状态 > IP 地址`），通过无线连接：

```bash
# 连接设备
$ adb connect 你的IP地址
connected to #.#.#.#:5555

# 拔掉 USB，确认设备仍在
$ adb devices
List of devices attached
#.#.#.#:5555 device
```

到此就可以愉快地无线调试了。

## 故障排查

如果连接断开或失败，检查以下几点：

1. 确认手机和电脑在同一个网段
2. 重启 ADB 服务，重新执行一遍流程：

```bash
$ adb kill-server
$ adb start-server
$ adb tcpip 5555
$ adb connect 你的IP地址
```

如果仍然不行，插回 USB 重新走一遍完整流程。

## Android 11+ 原生无线调试

Android 11 及以上版本已支持**无线调试**功能，无需 USB 初始连接：

1. 开启「开发者选项」和「无线调试」
2. 选择「配对码配对」
3. 在电脑上执行：

```bash
$ adb pair IP地址:配对端口
# 输入配对码
$ adb connect IP地址:连接端口
```

此方式通过 TLS 加密通信，安全性比传统 `adb tcpip` 方式更高。

## 参考

- [Run apps on a hardware device | Android Developers](https://developer.android.com/studio/run/device.html)
- [Android Debug Bridge (adb) | Android Developers](https://developer.android.com/tools/adb)
- [ADB over Wi-Fi and Ethernet | ChromeOS Developers](https://chromeos.dev/en/android-environment/adb-over-wifi-and-ethernet)
- [ADB Wifi Architecture | AOSP](https://android.googlesource.com/platform/packages/modules/adb/+/main/docs/dev/adb_wifi.md)
