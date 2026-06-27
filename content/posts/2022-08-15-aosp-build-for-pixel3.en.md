---
title: "Build AOSP for Pixel 3 XL"
date: 2022-08-15 20:53:06
slug: "aosp-build-for-pixel3"
author: "haoxiqiang"
tags: ["aosp", "android", "pixel3", "lineageos"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

The AOSP build process is fairly well understood by now: sync the source code, add device-specific drivers and kernel, and build the target image. I had built AOSP before to debug certain issues, but official support for Pixel 3 XL only goes up to Android 12. Recently, while working on Chromium development, I needed to test WebView on a newer platform, so I used LineageOS 21 for the build instead.

## Prerequisites

Assumes a configured AOSP build environment:

- [AOSP Setup Guide](https://source.android.com/docs/setup)
- [Codenames, Tags, and Build Numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds)

## Syncing AOSP Source

```shell
mkdir ~/aosp
cd ~/aosp
repo init --partial-clone -b android-12.0.0_r34 -u https://android.googlesource.com/platform/manifest
repo sync -c -j8
```

## Obtaining Drivers

1. Look up the Pixel 3 XL (codename `crosshatch`) on the [Build Numbers page](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds) to find the latest Build ID, e.g., `SP1A.210812.016.C2`
2. Download the corresponding drivers from [Google Drivers](https://developers.google.com/android/drivers)

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

## Building and Flashing

Refer to the [Building AOSP](https://source.android.com/docs/setup/build/building) documentation:

```bash
cd ~/aosp
source build/envsetup.sh
# Choose Pixel 3 XL (crosshatch) as the build target
# user/userdebug/eng select different build types
lunch aosp_crosshatch-userdebug

# Start the build
m

# Flash the device
export ANDROID_PRODUCT_OUT='/home/haoxiqiang/workspace/aosp/out/target/product/crosshatch'
adb reboot fastboot
fastboot flashall -w
```

> For differences between `user`, `userdebug`, and `eng` build types, see the [official documentation](https://source.android.com/docs/setup/build/building).

## Building with LineageOS

For newer Android versions, LineageOS provides excellent device support:

```shell
repo init --partial-clone -u https://github.com/LineageOS/android.git -b lineage-21.0 --git-lfs
repo sync -c -j8
```

See the [LineageOS Build Wiki](https://wiki.lineageos.org/devices/crosshatch/build/) for detailed instructions.

## References

- [AOSP Setup Guide](https://source.android.com/docs/setup)
- [AOSP Build Guide](https://source.android.com/docs/setup/build/building)
- [Build Numbers](https://source.android.com/docs/setup/reference/build-numbers#source-code-tags-and-builds)
- [Google Drivers for Pixel](https://developers.google.com/android/drivers)
- [Downloading the Android Source](https://source.android.com/docs/setup/download)
- [LineageOS Build Wiki — crosshatch](https://wiki.lineageos.org/devices/crosshatch/build/)
- [Building Pixel Kernels](https://source.android.com/docs/setup/build/building-pixel-kernels)
