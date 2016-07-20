---
layout: post
title:  Resource Shrinking
date:   2015-12-23 17:43:07
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
构建项目过程中发现这样一个属性shrinkResources,用来删除一个项目中没有使用的资源文件,我把自己遇到的问题记录一下

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


<!-- more -->
随着项目的越来越大,维护过程中难免疏漏掉一些没有使用的资源,现在通过 `Gradle`构建项目的时候可以配置 `shrinkResources true`,过滤掉这些没有被直接引用的资源,原理也就是查看这个文件是不是被其他文件引用.目前来看也只能在打包的时候删除掉 res中的无用文件(这个属性设置的时候这个`minifyenabled`也必须使用 true 才能生效,因为整个过程是在 proguard 去除掉无用代码之后才进行的任务,具体不讲构建流程了).我们可以直接看到究竟减少了多少体积和去除了那些文件,这部分操作需要我们记录下日志信息,一般我的做法就是在开发过程中,保存下来日志,然后分析一下,当然不同的构建版本可能看到的信息并不一样,我这里列出来的是官方的一个文档的内容,我们的应用比较干净这个属性已经看不出来什么效果了,不过具体信息大同小异

./gradlew clean assembleRelease --info  > /Users/haoxiqiang/Documents/tifen-android-lib/app/build/build-output.txt

...
:android:shrinkDebugResources
Removed unused resources: Binary resource data reduced from 2570KB to 1711KB: Removed 33%
Note: If necessary, you can disable resource shrinking by adding
android {
    buildTypes {
        debug {
            shrinkResources false
        }
    }
}
:android:validateDebugSigning
...

$ ./gradlew clean assembleDebug --info | grep "Skipped unused resource"
Skipped unused resource res/anim/abc_fade_in.xml: 396 bytes
Skipped unused resource res/anim/abc_fade_out.xml: 396 bytes
Skipped unused resource res/anim/abc_slide_in_bottom.xml: 400 bytes

有些时候可能有一些特殊需求,比如利用反射去取资源文件,就容易被删除掉(特别某些第三方的 sdk 也用这种方式,感觉坑逼的不行),现在的版本已经支持 `keep` 操作了,主要有两种形式,组合起来基本能满足大部分需求了

* `Strict Versus Safe` 在对应的xml 文件中可以增加`shrinkMode="strict"`就可以保留这个文件

<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="strict" />

* `Keeping Resources` 在 raw 文件夹内建立 `keep.xml` 可以配置一些信息

<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools" tools:discard="@layout/unused2"
    tools:keep="@layout/umeng_*,  @drawable/umeng_*, @anim/umeng_*" />

这里有一个特殊的用法指定一定删除掉某个资源

<?xml version="1.0" encoding="utf-8"?>
<resources xmlns:tools="http://schemas.android.com/tools"
    tools:shrinkMode="safe"
    tools:discard="@layout/unused2" />


另外构建系统在去除资源的时候也会跳过一些看起来像是被引用的资源,比如`file:///android_res/drawable/ic_plus.png`这种形式的资源的 URL

国内很多应用不需要多语言支持的可以配置一个 `ResConfig `的东西,这样可以保留指定的语言,也可以配置`"nodpi", "hdpi"`来限定一些指定的资源

android {
    defaultConfig {
        ...
        resConfigs "en", "zh"
        }
}

总的建议的可以试一试,起码可以根据日志信息来手动过滤一下