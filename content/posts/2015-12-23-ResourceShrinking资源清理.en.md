---
title: "Android Resource Shrinking"
date: 2015-12-23 17:43:07
slug: "ResourceShrinking资源清理"
author: "haoxiqiang"
tags: ["android", "gradle", "build", "optimization"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

While building a project, I discovered the `shrinkResources` attribute, which removes unused resources from the APK. Here is how to configure it and what to watch out for.

<!--more-->

## Basic Configuration

`shrinkResources` requires `minifyEnabled` to be true, because resource shrinking runs after ProGuard/R8 removes unused code:

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

## Inspecting Results

Use `--info` logging to see overall reduction:

```bash
./gradlew clean assembleRelease --info  > build-output.txt

...
:android:shrinkDebugResources
Removed unused resources: Binary resource data reduced from 2570KB to 1711KB: Removed 33%
...
```

View which specific files were skipped:

```bash
$ ./gradlew clean assembleDebug --info | grep "Skipped unused resource"
Skipped unused resource res/anim/abc_fade_in.xml: 396 bytes
Skipped unused resource res/anim/abc_fade_out.xml: 396 bytes
Skipped unused resource res/anim/abc_slide_in_bottom.xml: 400 bytes
```

## Keeping or Discarding Specific Resources

Resources referenced via reflection (common in third-party SDKs) can be mistakenly removed. Modern versions support `keep.xml` for fine-grained control.

### Strict Mode

In `res/raw/keep.xml`:

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="strict" />
```

### Keeping Specific Resources

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:keep="@layout/umeng_*, @drawable/umeng_*, @anim/umeng_*" />
```

### Forcing Removal

```xml
<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="safe"
    tools:discard="@layout/unused2" />
```

The build system also skips resources referenced via URLs like `file:///android_res/drawable/ic_plus.png`.

## Language and Density Configuration

For apps that do not need multi-language support, use `resConfigs` to keep only specific languages or densities:

```gradle
android {
    defaultConfig {
        ...
        resConfigs "en", "zh"
    }
}
```

You can also restrict to specific densities like `"nodpi"`, `"hdpi"`.

## Summary

Enable `shrinkResources` even if your app is relatively clean. The log output helps you understand which resources are in use and which might be incorrectly removed.

## References

- [Customize which resources to keep](https://developer.android.com/topic/performance/app-optimization/customize-which-resources-to-keep)
- [Enable app optimization](https://developer.android.com/topic/performance/app-optimization/enable-app-optimization)
