---
layout: post
title:  Android Fragment$InstantiationException
date:   2015-01-07 08:35:07
author: haoxiqiang
categories: blog
tags: [android]

---

android.support.v4.app.Fragment$InstantiationException: Unable to instantiate fragment 
make sure class name exists, is public, and has an empty constructor that is public

以前其实也有这个问题,但是发生量不大,没有引起注意,最近突然增加了很多这个错误,仔细研究了一下,弄明白了一些解决办法.
可能产生这个错误的原因有:

* `fragment`存在内部类但是不是`static`的
* `fragment`通过构造方法传递的参数
* `fragment`没有一个`public`的构造方法
<!-- more -->
重现的这些问题的手段就是让`activity`的状态发生一些改变就可以了,比如横竖向切换`portrait<->landscape`.所以大部分的`InstantiationException`都在屏幕变化或者接打电话后切回来的时候发生.
解决的方法经实践我是这么解决的:
``` java
//保证存在public
public class CourseFragment extends BaseThemeFragment{
    public CourseFragment() {
        super();
    }
}
//需要参数的通过setArguments解决
public static PageFragment newInstance(int currentResId) {
    PageFragment fragment = new PageFragment();
    Bundle args = new Bundle();
    args.putInt(CURRENT_RES, currentResId);
    fragment.setArguments(args);
    return fragment;
}
```

在查阅过程中发现,这个`public constructor`最好还是写上
原因如下:

>You will see the instantiate(..) method in the Fragment class calls the newInstance method. http://docs.oracle.com/javase/6/docs/api/java/lang/Class.html#newInstance() Explains why, upon instantiation it checks that the accessor is public and that that class loader allows access to it.


>参考<br />
[fragments-really-need-an-empty-constructor](http://stackoverflow.com/questions/10450348/do-fragments-really-need-an-empty-constructor)<br />
[fragment-instantiationexception](http://stackoverflow.com/questions/16062923/fragment-instantiationexception-no-empty-constructor-google-maps-v2/16064418#16064418)