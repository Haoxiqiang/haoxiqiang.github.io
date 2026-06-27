---
title: "Android 的自定义 View（二）：测量模式"
date: 2014-10-01 19:19:06
slug: "CustomView2"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

<!--more-->

在 `ViewGroup` 为子 View 测量时，会通过 `MeasureSpec` 指定测量模式。理解这三种模式是自定义 View 布局的基础。

## 测量模式详解

| 模式 | 含义 | 触发条件 |
|------|------|----------|
| `EXACTLY` | 精确值 | 子 View 宽高为精确值或 `match_parent` |
| `AT_MOST` | 最大值限制 | 子 View 宽高为 `wrap_content` |
| `UNSPECIFIED` | 无限制 | 常见于 `AdapterView`、`ScrollView` 的子 View 高度 |

### EXACTLY

ViewGroup 为子 View 指定了精确的尺寸。当子 View 的 `layout_width` 或 `layout_height` 设置为具体数值或 `match_parent` 时，父容器会传递此模式。子 View 必须在给定大小内完成绘制。

### AT_MOST

子 View 被限制在一个最大值内。当设置为 `wrap_content` 时，父容器会传递此模式。子 View 需要根据自身内容计算尺寸，但不能超过父容器给的上限。

### UNSPECIFIED

不做任何限制。父容器对子 View 没有任何大小约束，子 View 可以按需取任意尺寸。常见于可滚动的容器（如 `ScrollView`、`ListView`）中。

## 参考

- [源码 BlogCode01](https://github.com/Haoxiqiang/BlogCode)
- [Creating Custom Views - Android Developers](https://developer.android.com/training/custom-views/index.html)
- [View.MeasureSpec - Android Developers](https://developer.android.com/reference/android/view/View.MeasureSpec)
