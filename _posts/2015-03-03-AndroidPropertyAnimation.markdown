---
layout: post
title:  Android Property Animation
date:   2015-03-03 10:31:21
author: haoxiqiang
categories: blog
tags: [android]
image:
  feature:
  teaser:
  credit:
  creditlink:
---
`Property Animation`是一个非常强大的架构,它可以在任何时候改变一个可见或者不可见的View的属性,你能使用它把一个View的属性变化做成动画.
属性动画允许你定义动画的属性包括:

* Duration,持续时间,不设定的话默认是300毫秒.
* Time interpolation,插值器,你可以通过插值器来根据时间设定一些经过特殊计算的值
* Repeat count and behavior,你可以设定这个动画的持续次数,也可以设定反转执行动画,设定反转执行就会成为一个正常播放反转播放的循环,一直到完成动画次数
* Animator sets,你可以一起播放一组动画,或者作为一个动画序列,或者通过设定不同的延迟来设计一个动画效果
* Frame refresh delay,设定帧刷新延迟,默认是10毫秒,这个是用来设定刷新动画的的帧的时间,具体结果不光是设定的值的影响,也取决于当前的系统性能,资源占用影响
<!-- more -->

官方文档`API Guides`,不翻译了:
[http://developer.android.com/guide/topics/graphics/prop-animation.html#how](http://developer.android.com/guide/topics/graphics/prop-animation.html#how)

## API Overview
	
* ObjectAnimator
``` java
ObjectAnimator anim = ObjectAnimator.ofFloat(foo, "alpha", 0f, 1f);
anim.setDuration(1000);
anim.start();
```
