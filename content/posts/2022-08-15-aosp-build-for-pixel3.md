---
title: "Build AOSP for Pixel 3 XL"
date: 2022-08-15 20:53:06
author: "haoxiqiang"
tags: ["aosp", "android", "pixel3", "lineageos"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

AOSP 的构建流程已经比较清晰，大致分为：同步代码、添加对应设备的驱动和内核、构建目标镜像。之前尝试构建 AOSP 来排查一些问题，但 Pixel 3 XL 的官方适配只到 Android 12。最近在 Chromium 开发中需要测试 WebView，因此使用 LineageOS 21 的适配来方便构建。

## 前提条件

默认已安装 AOSP 构建环境：

- [AOSP 环境准备](https://source.android.com/docs/setup)
- [Codenames, Tags, and Build Numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds)

## 同步 AOSP 源码

```shell
mkdir ~/aosp
cd ~/aosp
repo init --partial-clone -b android-12.0.0_r34 -u https://android.googlesource.com/platform/manifest
repo sync -c -j8
```

## 获取驱动

1. 在 [Codenames, Tags, and Build Numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds) 页面搜索 Pixel 3 XL（代号 `crosshatch`），获取最新 Build ID，示例：`SP1A.210812.016.C2`
2. 在 [Google Drivers](https://developers.google.com/android/drivers) 页面下载对应 Build ID 的驱动

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

## 构建并刷机

参考 [Building AOSP](https://source.android.com/docs/setup/build/building) 文档：

```bash
cd ~/aosp
source build/envsetup.sh
# 选择 Pixel 3 XL (crosshatch) 构建目标
# user/userdebug/eng 对应不同的构建类型
lunch aosp_crosshatch-userdebug

# 开始构建
m

# 刷机
export ANDROID_PRODUCT_OUT='/home/haoxiqiang/workspace/aosp/out/target/product/crosshatch'
adb reboot fastboot
fastboot flashall -w
```

> `user`、`userdebug`、`eng` 三种构建类型的区别参见 [官方文档](https://source.android.com/docs/setup/build/building)。

## 使用 LineageOS 构建

对于需要更高版本 Android 的场景，可以使用 LineageOS 的适配：

```shell
repo init --partial-clone -u https://github.com/LineageOS/android.git -b lineage-21.0 --git-lfs
repo sync -c -j8
```

具体步骤参见 [LineageOS Build Wiki](https://wiki.lineageos.org/devices/crosshatch/build/)。

## 参考资源

- [AOSP 环境准备](https://source.android.com/docs/setup)
- [AOSP 构建指南](https://source.android.com/docs/setup/build/building)
- [Build Numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds)
- [Google Drivers for Pixel](https://developers.google.com/android/drivers)
- [AOSP 源码下载](https://source.android.com/docs/setup/download)
- [LineageOS Build Wiki — crosshatch](https://wiki.lineageos.org/devices/crosshatch/build/)
- [Building Pixel Kernels](https://source.android.com/docs/setup/build/building-pixel-kernels)
