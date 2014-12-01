---
layout: post
title:  Android's RecyclerView
date:   2014-11-02 17:03:26
author: 郝锡强
categories: blog
letex: false
tags: [java,android]
---
RecyclerView 是一个更加灵活的ListView.在google的文档中说,这个控件能非常有效的维护数量有限的滚动数据集合,当你的View有用户行为和网络数据交互的需求的时候都建议使用RecyclerView.
### RecyclerView简化了View的显示和数据的处理:

* 布局的定位
* Item项的公共动画,比如增加或者删除的动画

![RecyclerView01](../img/RecyclerView01.png)
<!-- more -->
要使用RecyclerView你必须指定一个布局管理器和一个适配器(从RecyclerView.Adapter扩展).布局管理器的作用就是提供一个一个位置信息来确定Item的复用与回收,避免了不必要的错误和执行昂贵的性能浪费(findViewById).
RecyclerView提供这些内置的布局管理器:

* LinearLayoutManager 示出了在垂直或水平滚动列表项。
* GridLayoutManager 网格展示的布局。
* StaggeredGridLayoutManager 交错网格展示。

### RecyclerView的动画:
RecyclerView默认启用添加和删除的动画.要自定义这些动画，扩展RecyclerView.ItemAnimator类，并使用RecyclerView.setItemAnimator().

### RecyclerView的点击事件
RecyclerView没有类似ListView中的onItemClickListener,原因是原来的onItemClickListener事件容易让人难以理解,现在的RecyclerView其实并没有严格的行或者列的概念,所以我们在这里使用的是每一个View的点击事件.[Why doesn't RecyclerView have onItemClickListener()?](http://stackoverflow.com/questions/24885223/why-doesnt-recyclerview-have-onitemclicklistener)

![RecyclerView02](../img/RecyclerView02.png)

