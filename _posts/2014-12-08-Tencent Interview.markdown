---
layout: post
title:  Tencent Interview
date:   2014-12-08 10:35:07
author: 郝锡强
categories: blog
letex: false
tags: [java]
---
前几天看到[stormzhang](http://stormzhang.com/android/other/2014/05/03/tencent-interview/)发出的一些腾讯的面试题,拿来做一遍看看:

* 如何画出一个印章的图案
* 如何实现一个字体的描边与阴影效果
* 同一个应用程序的不同Activity可以运行在不同的进程中么？如果可以，举例说明
* Java中的线程同步有哪几种方式，举例说明
* 说说对Handler, Looper, 以及HandlerThread的理解
* dp, dip, dpi, px, sp是什么意思以及他们的换算公式？layout-sw600dp, layout-h600dp分别代表什么意思
* 写出Activity的几中启动方式，并简单说说自己的理解或者使用场景
<!-- more -->
* 如何设计一个文件的断点续传系统
* 一个关于xml的布局问题，大概意思就是如何让两个TextView在一个RelativeLayout水平居中显示
* 设计一个从网络请求数据，图片，并加载到列表的系统，画出客户端架构并简单的分析下

--------------

3. 同一个应用程序的不同Activity可以运行在不同的进程中么？如果可以，举例说明
<br />可以.[Android应用程序在新的进程中启动新的Activity的方法和过程分析](http://blog.csdn.net/luoshengyang/article/details/6720261);一般情况下，同一个应用程序的Activity组件都是运行在同一个进程中，但是，如果`Activity`配置了`android:process`这个属性，那么，它就会运行在自己的进程中。如果`android:process`属性的值以":"开头，则表示这个进程是私有的；如果`android:process`属性的值以小写字母开头，则表示这是一个全局进程，允许其它应用程序组件也在这个进程中运行。如果两个`Activity`同一个应用程序并且运行在同一个任务中，然而，它们却是运行在两个不同的进程中，这就可以看到Android系统中任务这个概念的强大之处了，它使得我们在开发应用程序的时候，可以把相对独立的模块放在独立的进程中运行，以降低模块之间的耦合性，同时，我们又不必去考虑一个应用程序在两个进程中运行的细节的问题，Android系统中的任务会为我们打点好一切。决定一个`Activity`是在新的进程中启动还是在原有的进程中启动的因素有两个，一个是看这个`Activity`的`process`属性的值，另一个是这个`Activity`所在的应用程序的uid。应用程序的UID是由系统分配的，而`Activity`的`process`属性值，如前所述，是可以在`AndroidManifest.xml`文件中进行配置的，如果没有配置，它默认就为`application`标签的`process`属性值，如果`application`标签的`process`属性值也没有配置，那么，它们就默认为应用程序的package名。

	> 如果proc的第一个字符是":"，则只需要调用validateName函数来验证proc字符串里面的字符都是合法组成就可以了，即以大小写字母或者"."开头，后面可以跟数字或者"_"字符；如果proc的第一个字符不是":"，除了保证	proc字符里面的字符都是合法组成外，还要求至少有一个"."字符。
	{% highlight xml %}
	<application android:icon="@drawable/icon" android:label="@string/app_name">      
        <activity android:name=".MainActivity"
                  android:process=":first.process" />      
        <activity android:name=".SubActivity"       
                  android:process=":second.process" />
    </application>    
	{% endhighlight %}
6. dp, dip, dpi, px, sp是什么意思以及他们的换算公式？layout-sw600dp, layout-h600dp分别代表什么意思<br />
	* px   ：是屏幕的像素点
	* in    ：英寸
	* mm ：毫米
	* pt    ：磅，1/72 英寸
	* dp   ：一个基于density的抽象单位，如果一个160dpi的屏幕，1dp=1px
	* dip  ：等同于dp
	* sp   ：同dp相似，但还会根据用户的字体大小偏好来缩放。建议使用sp作为文本的单位，其它用dip

	若是换算就是分辨率相乘是像素数,密度是指手机水平或垂直方向上每英寸距离有多少个像素点.`DisplayMetrics`也可以直接获取大小,但是取出来的只是近似值.
	
	>
	{% highlight java %}
	//dp与px转换的方法
	public static int dip2px(Context context, float dipValue){
　　		final float scale = context.getResources().getDisplayMetrics().density;
　　		return (int)(dipValue * scale +0.5f);
	}
	public static int px2dip(Context context, float pxValue){
　　		final float scale = context.getResource().getDisplayMetrics().density;
　　		return (int)(pxValue / scale +0.5f);
	}
	{% endhighlight %}
	* 第一种后缀：sw<N>dp,如layout-sw600dp, values-sw600dp:这里的sw代表smallwidth的意思，当你所有屏幕的最小宽度都大于600dp时,屏幕就会自动到带sw600dp后缀的资源文件里去寻找相关资源文件，这里的最小宽度是指屏幕宽高的较小值，每个屏幕都是固定的，不会随着屏幕横向纵向改变而改变。
	* 第二种后缀w<N>dp 如layout-w600dp, values-w600dp:带这样后缀的资源文件的资源文件制定了屏幕宽度的大于Ndp的情况下使用该资源文件，但它和sw<N>dp不同的是，当屏幕横向纵向切换时，屏幕的宽度是变化的，以变化后的宽度来与N相比，看是否使用此资源文件下的资源。
	* 第三种后缀h<N>dp 如layout-h600dp, values-h600dp:这个后缀的使用方式和w<N>dp一样，随着屏幕横纵向的变化，屏幕高度也会变化，根据变化后的高度值来判断是否使用h<N>dp ，但这种方式很少使用，因为屏幕在纵向上通常能够滚动导致长度变化，不像宽度那样基本固定，因为这个方法灵活性不是很好，google官方文档建议尽量少使用这种方式。

>参考<br />
[Tencent Interview](http://stormzhang.com/android/other/2014/05/03/tencent-interview/)
<br />[android:process](http://developer.android.com/guide/topics/manifest/activity-element.html)
<br />[Android应用程序在新的进程中启动新的Activity的方法和过程分析](http://blog.csdn.net/luoshengyang/article/details/6720261)
<br />[Android屏幕适配小技巧](http://blog.csdn.net/chenzujie/article/details/9874859)
