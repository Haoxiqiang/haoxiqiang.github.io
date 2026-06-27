---
title: "Android RecyclerView"
date: 2014-11-01 17:03:26
slug: "Androids-RecyclerView"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

RecyclerView is a more flexible replacement for ListView. According to the official documentation, it efficiently maintains a limited collection of scrolling data items, and is recommended when your Views need to interact with user gestures and network data.

![RecyclerView01](/images/RecyclerView01.png)

<!--more-->

## Key Advantages

RecyclerView simplifies View display and data handling in two main areas:

- **Layout positioning** — Managed by LayoutManager
- **Item animations** — Built-in add/remove animations with customization support

## Basic Usage

RecyclerView requires a LayoutManager and an Adapter (extending `RecyclerView.Adapter`). The LayoutManager handles item positioning, recycling, and reuse, avoiding unnecessary overhead like `findViewById`.

Built-in LayoutManagers:

| LayoutManager | Effect |
|--------------|--------|
| `LinearLayoutManager` | Vertical or horizontal scrolling list |
| `GridLayoutManager` | Grid layout |
| `StaggeredGridLayoutManager` | Staggered grid layout |

## Animations

RecyclerView enables add/remove animations by default. To customize, extend `RecyclerView.ItemAnimator` and call `RecyclerView.setItemAnimator()`.

Reference implementation: [RecyclerViewItemAnimators](https://github.com/gabrielemariotti/RecyclerViewItemAnimators)

## Click Handling

RecyclerView does not have an `onItemClickListener` like ListView. The reason is that the original `onItemClickListener` was often confusing — RecyclerView has no strict row or column concept, so each Item View handles its own click events.

Further discussion: [Why doesn't RecyclerView have onItemClickListener()?](http://stackoverflow.com/questions/24885223/why-doesnt-recyclerview-have-onitemclicklistener)

![RecyclerView02](/images/RecyclerView02.png)

## LayoutManager Details

### LinearLayoutManager

Behaves like ListView by default, with additional configuration options:

```java
LinearLayoutManager(Context context, int orientation, boolean reverseLayout)
```

`orientation` is `HORIZONTAL` or `VERTICAL`; `reverseLayout` controls reverse ordering.

```java
mLayoutManager.setStackFromEnd(true);
```

`setStackFromEnd(true)` displays items starting from the bottom, but has no effect when the data set changes.

### GridLayoutManager

```java
mLayoutManager = new GridLayoutManager(this, 2, GridLayoutManager.VERTICAL, false);
mRecyclerView.setLayoutManager(mLayoutManager);
dataSet.addAll(Arrays.asList(LETTERS));
```

Two constructors:
- `GridLayoutManager(Context context, int spanCount)` — default vertical layout, `spanCount` controls columns
- `GridLayoutManager(Context context, int spanCount, int orientation, boolean reverseLayout)` — same options as `LinearLayoutManager`

## References

- [Source code AndroidRecyclerViewDemo](https://github.com/Haoxiqiang/AndroidRecyclerViewDemo)
- [Create dynamic lists with RecyclerView - Android Developers](https://developer.android.com/develop/ui/views/layout/recyclerview)
- [RecyclerView API Reference](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView)
