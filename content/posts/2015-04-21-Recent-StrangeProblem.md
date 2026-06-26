---
title: "最近遇到的一些奇怪的问题"
date: 2015-04-21 14:41:34
author: "haoxiqiang"
tags: ["android", "troubleshooting"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Android 开发中偶尔会遇到一些看似莫名其妙的问题，记录在这里，方便以后查阅。

<!--more-->

## 1. Android Studio 新建工程直接报编译错误

```
Error:Execution failed for task :app:mergeDebugResources.
> Crunching Cruncher ic_launcher.png failed, see logs
```

**原因**：早期 Android Studio 版本中，资源目录结构不完整时可能触发此问题。

**解决方法**：创建一个 `drawable-hdpi` 或 `drawable-xhdpi` 文件夹即可。

## 2. 魅蓝 Note 无法连接 ADB（或其它 USB 连接问题）

当所有常规条件都正常时，手机仍然无法连接电脑，可能需要添加 USB **Vendor ID**。

**macOS 下的解决方法**：

1. 通过系统信息或 `system_profiler SPUSBDataType` 找到设备的 Vendor ID
2. 编辑 `~/.android/adb_usb.ini`，在末尾添加 `0x2a45`（魅族厂商 ID）
3. 重启 ADB 服务并重新连接：
   ```bash
   adb kill-server
   adb start-server
   ```

详细参考：[Android 官方 ADB 文档](https://developer.android.com/studio/command-line/adb)

## 3. 应用签名冲突无法安装

```
Package com.yuexue.tifenapp signatures do not match the previously installed version; ignoring!
```

**原因**：手机上已安装的版本与新安装的版本签名不一致。这在调试与正式签名切换时经常出现。

**解决方法**：先卸载冲突版本：

```bash
adb uninstall com.yuexue.tifenapp
```

关键要点：
- `adb -e` 指定模拟器设备，不带设备参数则会匹配唯一连接设备
- 应用在谷歌 Play 中的包名卸载需要用 `adb shell pm uninstall -k --user 0 <pkg>`（需 root）
