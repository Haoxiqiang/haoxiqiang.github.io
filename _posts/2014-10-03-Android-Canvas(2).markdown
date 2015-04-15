---
layout: post
title:  Android的Canvas(2)
date:   2014-10-03 14:19:06
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
Canvas的裁剪Clip，即裁剪Canvas图层，我们绘制的东西，只能在裁剪区域的范围能才能显示出来。

* DIFFERENCE(0), //最终区域为region1 与 region2不同的区域  
* INTERSECT(1), // 最终区域为region1 与 region2相交的区域  
* UNION(2),      //最终区域为region1 与 region2组合一起的区域  
* XOR(3),        //最终区域为region1 与 region2相交之外的区域  
* REVERSE_DIFFERENCE(4), //最终区域为region2 与 region1不同的区域  
* REPLACE(5); //最终区域为为region2的区域 
<!-- more -->
<br />
![Canvas05](/source/images/blog/android_canvas05.png)

{% highlight java %}
 private void drawScene(Canvas canvas) {
    canvas.clipRect(0, 0, 100 * factor, 100 * factor);

    canvas.drawColor(Color.WHITE);

    mPaint.setColor(Color.RED);
    canvas.drawLine(0, 0, 100 * factor, 100 * factor, mPaint);

    mPaint.setColor(Color.GREEN);
    canvas.drawCircle(30 * factor, 70 * factor, 30 * factor, mPaint);

    mPaint.setColor(Color.BLUE);
    canvas.drawText("Clipping", 100 * factor, 30 * factor, mPaint);
}

@Override
protected void onDraw(Canvas canvas) {

    canvas.drawColor(Color.GRAY);

    canvas.save();
    canvas.translate(10 * factor, 10 * factor);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(160 * factor, 10 * factor);
    // 切去一圈
    canvas.clipRect(10 * factor, 10 * factor, 90 * factor, 90 * factor);
    // 中间切去一圈,保留region1 与 region2不同的区域
    canvas.clipRect(30 * factor, 30 * factor, 70 * factor, 70 * factor, Region.Op.DIFFERENCE);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(10 * factor, 160 * factor);
    mPath.reset();
    // canvas.clipPath(mPath); // makes the clip empty
    mPath.addCircle(50 * factor, 50 * factor, 50 * factor, Path.Direction.CCW);
    canvas.clipPath(mPath, Region.Op.REPLACE);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(160 * factor, 160 * factor);
    canvas.clipRect(0, 0, 60 * factor, 60 * factor);
    canvas.clipRect(40 * factor, 40 * factor, 100 * factor, 100 * factor, Region.Op.UNION);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(10 * factor, 310 * factor);
    canvas.clipRect(0, 0, 60 * factor, 60 * factor);
    canvas.clipRect(40 * factor, 40 * factor, 100 * factor, 100 * factor, Region.Op.XOR);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(160 * factor, 310 * factor);
    canvas.clipRect(0, 0, 60 * factor, 60 * factor);
    canvas.clipRect(40 * factor, 40 * factor, 100 * factor, 100 * factor,
            Region.Op.REVERSE_DIFFERENCE);
    drawScene(canvas);
    canvas.restore();
}
{% endhighlight %}

>参考<br/> [roamer' blog](http://blog.csdn.net/lonelyroamer/article/details/8349601)
<br/>[源码  Blog02](https://github.com/Haoxiqiang/BlogCode/tree/master/Blog02)
