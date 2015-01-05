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




{% highlight java %}

{% endhighlight %}

>参考<br/> [roamer' blog](http://blog.csdn.net/lonelyroamer/article/details/8349601)