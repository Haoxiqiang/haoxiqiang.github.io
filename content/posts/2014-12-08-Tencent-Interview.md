---
title: "Tencent Interview"
date: 2014-12-08 10:35:07
slug: "Tencent-Interview"
author: "haoxiqiang"
tags: ["android", "java", "interview"]
categories: ["Blog"]
ShowToc: true
TocOpen: false
---

前几天看到 [stormzhang 的腾讯面试题](http://stormzhang.com/android/other/2014/05/03/tencent-interview/)，拿来做一遍，记录下自己的解答思路。

面试题涉及的主要领域：
- Android 基础（进程、Activity、Handler）
- 屏幕适配（dp、dpi、资源目录）
- 多线程同步
- 系统设计（断点续传、网络请求架构）

<!--more-->

<!-- 以下是题干汇总 -->
> 面试题清单：
> 1. 如何画出一个印章的图案
> 2. 如何实现一个字体的描边与阴影效果
> 3. 同一个应用程序的不同 Activity 可以运行在不同的进程中么？如果可以，举例说明
> 4. Java 中的线程同步有哪几种方式，举例说明
> 5. 说说对 Handler、Looper 以及 HandlerThread 的理解
> 6. dp、dip、dpi、px、sp 是什么意思以及它们的换算公式？layout-sw600dp、layout-h600dp 分别代表什么意思
> 7. 写出 Activity 的几种启动方式，并简单说说自己的理解或者使用场景
> 8. 如何设计一个文件的断点续传系统
> 9. 一个关于 xml 的布局问题，大概意思就是如何让两个 TextView 在一个 RelativeLayout 水平居中显示
> 10. 设计一个从网络请求数据、图片并加载到列表的系统，画出客户端架构并简单分析

---

### 3. 同一个应用程序的不同 Activity 可以运行在不同的进程中吗？

可以。一般情况下，同一个应用程序的 Activity 都运行在同一个进程中。但如果 Activity 配置了 `android:process` 属性，它就会运行在独立的进程中。

`android:process` 的命名规则：

- 以 `:` 开头（如 `:first.process`）：表示私有进程，进程名前缀为应用包名
- 以小写字母开头（如 `com.example.shared`）：表示全局进程，允许其他应用组件也在此进程中运行

```xml
<application android:icon="@drawable/icon"
             android:label="@string/app_name">
    <activity android:name=".MainActivity"
              android:process=":first.process" />
    <activity android:name=".SubActivity"
              android:process=":second.process" />
</application>
```

两个 Activity 虽然属于同一应用且在同一任务中，却运行在不同的进程中——这正是 Android 任务管理器的强大之处。它让我们可以将相对独立的模块放入独立的进程，降低模块耦合，同时不必关心跨进程通信的细节。具体实现涉及 ActivityRecord 和 ProcessRecord 的调度，由 ActivityManagerService 统一管理。

> 参考：[Android 应用程序在新的进程中启动新的 Activity 的方法和过程分析](http://blog.csdn.net/luoshengyang/article/details/6720261)
> 官方文档：[android:process | Android Developers](https://developer.android.com/guide/topics/manifest/activity-element#proc)

---

### 6. dp、dip、dpi、px、sp 的含义与换算

| 单位 | 含义 | 说明 |
|------|------|------|
| px | 像素点 | 屏幕物理像素 |
| in | 英寸 | 物理尺寸 |
| mm | 毫米 | 物理尺寸 |
| pt | 磅 | 1/72 英寸 |
| dp / dip | 密度无关像素 | 160dpi 屏幕下 1dp = 1px |
| sp | 缩放无关像素 | 同 dp，但会跟随用户字体大小偏好缩放 |

dp 与 px 的换算：

```java
public static int dip2px(Context context, float dipValue) {
    final float scale = context.getResources()
        .getDisplayMetrics().density;
    return (int)(dipValue * scale + 0.5f);
}

public static int px2dip(Context context, float pxValue) {
    final float scale = context.getResources()
        .getDisplayMetrics().density;
    return (int)(pxValue / scale + 0.5f);
}
```

建议：文本使用 sp，其他使用 dp。

#### 资源目录的限制条件

- **sw<N>dp**（如 `layout-sw600dp`）：最小宽度（smallest width），取屏幕宽高中的较小值。不会随屏幕方向变化，固定不变。
- **w<N>dp**（如 `layout-w600dp`）：当前屏幕宽度，随横竖屏切换变化。
- **h<N>dp**（如 `layout-h600dp`）：当前屏幕高度，随横竖屏切换变化。官方文档建议尽量少用，因为纵向滚动导致高度变化频繁，不像宽度那样稳定。

---

## 参考

- [Tencent Interview - stormzhang](http://stormzhang.com/android/other/2014/05/03/tencent-interview/)
- [android:process | Android Developers](https://developer.android.com/guide/topics/manifest/activity-element#proc)
- [Android 应用程序在新的进程中启动新的 Activity 的方法和过程分析 - CSDN](http://blog.csdn.net/luoshengyang/article/details/6720261)
- [Android 屏幕适配小技巧 - CSDN](http://blog.csdn.net/chenzujie/article/details/9874859)
- [Processes and threads overview | Android Developers](https://developer.android.com/guide/components/processes-and-threads)
