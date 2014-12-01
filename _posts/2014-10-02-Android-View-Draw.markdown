---
layout: post
title:  Android View 的Draw
date:   2014-10-02 13:19:06
author: 郝锡强
categories: blog
letex: false
tags: [java,android]
---
View能够显示出来内容,都是通过"画"出来的,所谓画是因为我们操作View仿佛画画一样,在画板上使用画笔来绘制,这里的画布是Canvas,画笔是Paint.Canvas可使用的地方有很多,通过onDraw方法获取到的Canvas内容可以直接反应到View上.

Canvas很强大,能绘制几何图像,填充颜色,绘制文本,绘制Bitmap,还又一些位置转换的方法,挨个写一遍吧


<!-- more -->

{% highlight java %}
@Override
protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);
    int x = position == 0 ? radius : width - 2 * radius;
    x = x < 0 ? 0 : x;
    canvas.drawCircle(x, 100, radius, mCirclePaint);
    if (showContent) {
        canvas.drawText("SimpleView", x, 100, mTextPaint);
    }
}
{% endhighlight %}