---
title: "Android Developer Requirements"
date: 2015-04-01 09:50:52
slug: "AndroidDeveloperRequirements"
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

> **注意**:本文写于 2015 年,部分工具链和版本信息已过时,仅供历史参考。当前 Android 开发请直接使用 [Android Studio](https://developer.android.com/studio) 和 [Android Developers 官方文档](https://developer.android.com/)。

<!--more-->

给他人总结的一份 Android 开发环境配置清单(未提及版本号的均使用最新版本):

## 工具下载

- **Google Android Developer** (官网): [https://developer.android.com/sdk/index.html](https://developer.android.com/sdk/index.html)(链接可能已失效,请访问新版入口)
- **AndroidDevTools** (国内镜像,方便无法翻墙的用户): [http://www.androiddevtools.cn/](http://www.androiddevtools.cn/)(链接可能已失效)

## 必需工具

- **JDK**:建议安装 1.7+,搜索安装即可。(注:2019 年起 Android 已要求 JDK 11+)
- **Gradle**:Android 构建系统的核心。建议下载离线 Gradle 发行版,可在 IDE 中配置本地路径以加速构建
- **Android SDK Tools**:最新版 SDK 通常已自带代理配置;如果下载失败,可使用国内镜像
- **Android Studio**:使用最新版本即可
- **其他工具**:根据实际需要自行选择

## 注意事项

> 现在(2015 年)非常不建议使用 Eclipse。单从生产效率上讲,Android Studio 优势非常大。

这个判断至今依然成立——Android Studio 作为官方 IDE,在代码编辑、调试、性能分析、构建管理等方面远超 Eclipse ADT。

![android_dev_sdk_01](/images/android_dev_sdk_01.png)

## 参考

- [Android Studio 官方下载](https://developer.android.com/studio)
- [Android SDK 文档](https://developer.android.com/studio/command-line/sdkmanager)
- [Gradle 官方下载](https://gradle.org/releases/)
