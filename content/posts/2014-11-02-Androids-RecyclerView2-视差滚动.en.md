---
title: "Android RecyclerView (Part 2): Parallax Scrolling"
date: 2014-11-02 14:01:22
slug: "Androids-RecyclerView2-视差滚动"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Parallax scrolling is a common UI effect where different layers move at different speeds during scrolling, creating a sense of depth.

![parallaxrecycler](/images/parallaxrecycler.gif)

<!--more-->

## Implementation

The core idea is to listen for RecyclerView scroll events, dynamically translate the Header based on scroll distance, and clip the overflow to maintain correct layout.

### 1. Listen to Scroll and Translate Header

Use `setOnScrollListener` to capture scroll distance, then apply a `translationY` offset to the Header:

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

`SCROLL_MULTIPLIER` controls the parallax speed — values less than 1 make the Header move slower than the content, achieving the layered effect.

### 2. Clip the Overflow

The Header visually moves but its layout bounds remain unchanged, so we need to clip the overflow:

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

By overriding `dispatchDraw`, we clip the Canvas before drawing, hiding the portion of the Header that extends beyond the container.

### 3. Calculate Scroll Progress

The current scroll progress can be computed as `startTop / mHeader.getHeight()`, useful for driving other coordinated effects like opacity transitions.

## References

- [Source code AndroidRecyclerViewDemo](https://github.com/Haoxiqiang/AndroidRecyclerViewDemo)
- [android-parallax-recyclerview](https://github.com/kanytu/android-parallax-recyclerview)
- [RecyclerView - Android Developers](https://developer.android.com/reference/androidx/recyclerview/widget/RecyclerView)
