---
title: "Android Resource Shrinking 资源清理"
date: 2015-12-23 17:43:07
author: "haoxiqiang"
tags: ["android", "gradle", "build", "optimization"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

构建项目时发现 `shrinkResources` 这个属性，用于删除项目中未使用的资源文件。记录一下使用中的问题和配置方法。

<!--more-->

## 基本配置

`shrinkResources` 需要配合 `minifyEnabled` 一起使用，因为资源清理是在 ProGuard/R8 去除无用代码之后进行的：

```gradle
android {
    ...
    buildTypes {
        release {
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

## 查看清理结果

通过 `--info` 日志查看整体缩减效果：

```bash
./gradlew clean assembleRelease --info  > build-output.txt

...
:android:shrinkDebugResources
Removed unused resources: Binary resource data reduced from 2570KB to 1711KB: Removed 33%
...
```

查看具体跳过了哪些文件：

```bash
$ ./gradlew clean assembleDebug --info | grep "Skipped unused resource"
Skipped unused resource res/anim/abc_fade_in.xml: 396 bytes
Skipped unused resource res/anim/abc_fade_out.xml: 396 bytes
Skipped unused resource res/anim/abc_slide_in_bottom.xml: 400 bytes
```

## 保留或排除特定资源

有些资源通过反射引用（常见于第三方 SDK），会被构建系统误删。现在的版本已经支持通过 `keep.xml` 配置保留规则。

### Strict Mode

在 `res/raw/keep.xml` 中设置 `shrinkMode="strict"` 启用严格模式：

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="strict" />
```

### 保留特定资源

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:keep="@layout/umeng_*, @drawable/umeng_*, @anim/umeng_*" />
```

### 强制删除

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="safe"
    tools:discard="@layout/unused2" />
```

另外，构建系统也会跳过看起来像被引用的资源 URL，例如 `file:///android_res/drawable/ic_plus.png` 这类形式。

## 按需配置语言和密度

国内很多应用不需要多语言支持，可以通过 `resConfigs` 保留指定语言或密度资源：

```gradle
android {
    defaultConfig {
        ...
        resConfigs "en", "zh"
    }
}
```

也可以配置 `"nodpi"`、`"hdpi"` 等来限定密度资源。

## 总结

建议尝试启用 `shrinkResources`，即使应用本身比较"干净"、效果不明显，日志信息也能帮你了解项目中哪些资源被使用、哪些可能被误删。

## 参考

- [Customize which resources to keep](https://developer.android.com/topic/performance/app-optimization/customize-which-resources-to-keep)
- [Enable app optimization](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization)
