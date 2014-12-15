---
layout: post
title:  Android's RecyclerView(2) 视差滚动
date:   2014-11-02 14:01:22
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
RecyclerView的视差滚动<br />
![parallaxrecycler](../img/parallaxrecycler.gif)
<!-- more -->
实现的这个需求的话,需要知道当前滚动的距离,这里可以通过设置监听`setOnScrollListener`的方式获取,这样就有视差滚动的视差效果了,但是
{% highlight java %}
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
            	...
        	}
        }
    }
});
{% endhighlight %}

因为这个View虽然移动的,占据的位置没有变化,我们应该切掉这部分多余的,于是对于header 部分剪掉多余的

{% highlight java %}
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
{% endhighlight %}


当前的滚动的进度就是`startTop/mHeader.getHeight()`.

>源码地址<br />
[AndroidRecyclerViewDemo](https://github.com/Haoxiqiang/AndroidRecyclerViewDemo)
>参考<br />
[android-parallax-recyclerview](https://github.com/kanytu/android-parallax-recyclerview)