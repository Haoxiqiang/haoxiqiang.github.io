---
layout: post
title:  Android的自定义View
date:   2014-10-01 19:19:06
author: haoxiqiang
categories: blog
tags: [android]
---

<!-- more -->

### ViewGroup会为`ChildView`指定测量模式

* EXACTLY：精确的值，一般当`ChildView`设置其宽高为精确值或者`match_parent`时，`ViewGroup`会将其设置为`EXACTLY`；

* AT_MOST：表示子布局被限制在一个最大值内，`ChildView`设置其宽高为`wrap_content`时，`ViewGroup`会将其设置为`AT_MOST`；

* UNSPECIFIED：不限制`ChildView`，一般出现在AadapterView,ScrollView的`ChildView`的`HeightMode`中。


>源码地址<br />
[BlogCode01](https://github.com/Haoxiqiang/BlogCode)


>参考<br />
[Creating Custom Views](http://developer.android.com/training/custom-views/index.html)
