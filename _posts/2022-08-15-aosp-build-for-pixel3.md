---
title:  Build AOSP for Pixel 3 XL
description:
author: haoxiqiang
layout: post
date: 2022-08-15 20:53:06
categories: [Blogging]
tags: [aosp, android, pixel3xl]
---

对于AOSP的构建拆分已经比较清晰, 步骤大致分为同步代码,添加对应不同设备的驱动以及内核, 构建对应的target, 之前尝试了构建 `AOSP` 用来排查一些问题, 但是现在放出的`Pixle 3XL`适配只有到 `Android 12`, 最近Chromium的开发想测试一下`WebView`, 暂时使用 `LineageOS` 的`21`的适配来方便构建

* 默认已拉取AOSP源码并同步完成 
    - [AOSP Prepare](https://source.android.com/docs/setup)
    - [Codenames, tags, and build numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds)

```shell
mkdir ~/aosp
cd ~/aosp
repo init --partial-clone -b android-12.0.0_r34 -u https://android.googlesource.com/platform/manifest
repo sync -c -j8
```

* 查找对应型号的BuildID [Codenames, tags, and build numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds) 搜索 Pixel 3 XL 获取最新BuildId `SP1A.210812.016.C2`

* 搜索下载对应BuildID的驱动 [Drivers](https://developers.google.com/android/drivers/)
    
* 解压提取驱动

```bash
mkdir vendor_backup && cd vendor_backup
wget https://dl.google.com/dl/android/aosp/google_devices-crosshatch-sp1a.210812.016.c2-a4e274b7.tgz
wget https://dl.google.com/dl/android/aosp/qcom-crosshatch-sp1a.210812.016.c2-00a7f1f3.tgz
tar xvf qcom-crosshatch-*.tgz
tar xvf google_devices-crosshatch-*.tgz
./extract-google_devices-crosshatch.sh
./extract-qcom-crosshatch.sh
mv vendor/ ../
```

* Build [Doc](https://source.android.com/docs/setup/build/building)

以上为AOSP构建,对于其他也是类似,以`LineageOS`为例

```shell
repo init --partial-clone -u https://github.com/LineageOS/android.git -b lineage-21.0 --git-lfs
repo sync -c -j8
```

具体参见
[Build WIKI](https://wiki.lineageos.org/devices/crosshatch/build/)

