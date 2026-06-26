---
title: "Android 的 RecyclerView（二）：视差滚动"
date: 2014-11-02 14:01:22
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

视差滚动（Parallax Scrolling）是一种常见的 UI 效果：滚动时不同层次的元素以不同速度移动，营造立体感。

![parallaxrecycler](/images/parallaxrecycler.gif)

<!--more-->

## 实现原理

核心思路是监听 RecyclerView 的滚动事件，根据滚动距离动态调整 Header 的位移，同时裁剪超出部分以保证布局正确。

### 1. 监听滚动并移动 Header

通过 `setOnScrollListener` 获取滚动距离，然后对 Header 施加 `translationY` 偏移：

```java
RecyclerView.setOnScrollListener(new RecyclerView.OnScrollListener() {
    @Override
    public void onScrolled(RecyclerView recyclerView, int dx, int dy) {
        super.onScrolled(recyclerView, dx, dy);
        if (mHeader != null) {
            RecyclerView.ViewHolder holder = RecyclerView.findViewHolderForPosition(0);
            if (holder != null) {
                int startTop = holder.itemView.getTop();
                float ofCalculated = startTop * SCROLL_MULTIPLIER;
                ViewCompat.setTranslationY(mHeader, -ofCalculated);
                // ...
            }
        }
    }
});
```

这里的关键在于 `SCROLL_MULTIPLIER` 控制视差速度——值小于 1 时 Header 移动比内容慢，实现分层效果。

### 2. 裁剪溢出部分

由于 Header 虽然视觉上移动了，但实际占位没有变化，需要裁剪掉溢出的部分：

```java
@Override
protected void dispatchDraw(Canvas canvas) {
    Log.i("dispatchDraw", "mOffset=" + mOffset + " ;getLeft()=" + getLeft()
            + " ;getRight()=" + getRight() + " ;getTop()=" + getTop() + " ;getBottom()="
            + getBottom());
    canvas.clipRect(new Rect(getLeft(), getTop(), getRight(), getBottom() + mOffset));
    super.dispatchDraw(canvas);
}

public void setClipY(int offset) {
    mOffset = offset;
    invalidate();
}
```

通过重写 `dispatchDraw`，在绘制前裁剪 Canvas，确保 Header 超出容器范围的部分被隐藏。

### 3. 计算滚动进度

当前滚动进度可通过 `startTop / mHeader.getHeight()` 计算，用于驱动其他联动效果（如透明度渐变动画）。

## 参考

- [源码 AndroidRecyclerViewDemo](https://github.com/Haoxiqiang/AndroidRecyclerViewDemo)
- [android-parallax-recyclerview](https://github.com/kanytu/android-parallax-recyclerview)
- [RecyclerView - Android Developers](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView)
