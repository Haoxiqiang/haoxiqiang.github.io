---
title: "Android 的 RecyclerView"
date: 2014-11-01 17:03:26
slug: "Androids-RecyclerView"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

RecyclerView 是一个比 ListView 更灵活的滚动列表控件。官方文档指出，它能高效维护数量有限的滚动数据集合，当 View 需要与用户行为和网络数据交互时，推荐使用 RecyclerView。

![RecyclerView01](/images/RecyclerView01.png)

<!--more-->

## RecyclerView 的核心优势

RecyclerView 简化了 View 的显示和数据处理，主要体现在：

- **布局定位** — 通过 LayoutManager 管理 Item 的位置
- **Item 动画** — 内置增删动画，支持自定义

## 基本使用

使用 RecyclerView 必须指定一个布局管理器（LayoutManager）和一个适配器（继承 `RecyclerView.Adapter`）。LayoutManager 负责确定 Item 的位置信息、复用与回收，避免不必要的性能开销（如 `findViewById`）。

内置的布局管理器：

| 布局管理器 | 效果 |
|-----------|------|
| `LinearLayoutManager` | 垂直或水平滚动的列表 |
| `GridLayoutManager` | 网格布局 |
| `StaggeredGridLayoutManager` | 交错网格布局 |

## 动画

RecyclerView 默认启用添加和删除的动画。如需自定义动画，可扩展 `RecyclerView.ItemAnimator` 类，并通过 `RecyclerView.setItemAnimator()` 设置。

参考示例：[RecyclerViewItemAnimators](https://github.com/gabrielemariotti/RecyclerViewItemAnimators)

## 点击事件

RecyclerView 没有类似 ListView 的 `onItemClickListener`。原因是原来的 `onItemClickListener` 容易让人误解——RecyclerView 并没有严格的行或列概念，因此推荐使用每个 Item View 自身的点击事件。

更多讨论见：[Why doesn't RecyclerView have onItemClickListener()?](http://stackoverflow.com/questions/24885223/why-doesnt-recyclerview-have-onitemclicklistener)

![RecyclerView02](/images/RecyclerView02.png)

## LayoutManager 详解

### LinearLayoutManager

默认效果类似 ListView，额外提供以下配置：

```java
// 方向与逆序排列
LinearLayoutManager(Context context, int orientation, boolean reverseLayout)
```

`orientation` 可选 `HORIZONTAL` 或 `VERTICAL`，`reverseLayout` 表示是否逆序排列。

```java
mLayoutManager.setStackFromEnd(true);
```

`setStackFromEnd(true)` 表示从底部开始显示，但在数据集改变时不起作用。

### GridLayoutManager

```java
mLayoutManager = new GridLayoutManager(this, 2, GridLayoutManager.VERTICAL, false);
mRecyclerView.setLayoutManager(mLayoutManager);
dataSet.addAll(Arrays.asList(LETTERS));
```

`GridLayoutManager` 有两种构造方式：
- `GridLayoutManager(Context context, int spanCount)` — 默认垂直布局，`spanCount` 控制列数
- `GridLayoutManager(Context context, int spanCount, int orientation, boolean reverseLayout)` — 同 `LinearLayoutManager` 可指定方向

## 参考

- [源码 AndroidRecyclerViewDemo](https://github.com/Haoxiqiang/AndroidRecyclerViewDemo)
- [Create dynamic lists with RecyclerView - Android Developers](https://developer.android.com/develop/ui/views/layout/recyclerview)
- [RecyclerView API Reference](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView)
