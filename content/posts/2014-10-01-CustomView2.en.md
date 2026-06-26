---
title: "Android Custom View (Part 2): Measurement Modes"
date: 2014-10-01 19:19:06
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

<!--more-->

When a `ViewGroup` measures its child views, it specifies a measurement mode through `MeasureSpec`. Understanding these three modes is fundamental to custom View layout.

## Measurement Modes

| Mode | Description | Trigger |
|------|-------------|---------|
| `EXACTLY` | Precise value | Child View width/height is a specific value or `match_parent` |
| `AT_MOST` | Maximum bound | Child View width/height is `wrap_content` |
| `UNSPECIFIED` | No constraint | Common in `AdapterView`, `ScrollView` child height |

### EXACTLY

The parent specifies an exact size for the child. This occurs when the child's `layout_width` or `layout_height` is a fixed value or `match_parent`. The child must render within the given dimensions.

### AT_MOST

The child is constrained to a maximum value. This occurs when `wrap_content` is set. The child should calculate its own size based on content, but cannot exceed the parent's upper bound.

### UNSPECIFIED

No constraints at all. The parent imposes no size restrictions, and the child can take any dimensions it needs. This is common in scrollable containers like `ScrollView` and `ListView`.

## References

- [Source code BlogCode01](https://github.com/Haoxiqiang/BlogCode)
- [Creating Custom Views - Android Developers](https://developer.android.com/training/custom-views/index.html)
- [View.MeasureSpec - Android Developers](https://developer.android.com/reference/android/view/View.MeasureSpec)
