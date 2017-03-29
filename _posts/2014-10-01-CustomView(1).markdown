---
layout: post
title:  Android的自定义View
date:   2014-10-01 17:19:06
author: haoxiqiang
categories: blog
tags: [android]
image:
  feature:
  teaser:
  credit:
  creditlink:
---

在第一部分写一些自定义View的规则吧,说实话,其实我也挺菜比的.刚开始写自定义的View的时候,难免不知道如何下手.一般说来有两种

* 一种是自己从View开始自己去通过计算,绘制出来自己需要的样子.
* 另外一种就是,扩展现有的View，比如再增加几个View进去,或者复写一些方法来改变原有的逻辑.
<!-- more -->
我们先写一个继承View的,看看View都需要写什么:

public class SimpleView extends View {

    public SimpleView(Context context) {
        super(context);
    }

    public SimpleView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
}

如果你不需要xml配置属性的话AttributeSet这个构造方法可以不写,当然这个时候你不能把这个View写到xml中了,AttributeSet的使用方法其实就是把一堆xml的属性解析成了一个Array来方便你的使用,xml的属性的类型需要你事先声明,我们一般写到这个里面`res/values/attrs.xml`,称之为`<declare-styleable>`,这里面的数据类型支持的有:`boolean`,`string`,`dimension`,`enum`,`fraction`,`reference`,`color`.在这当中我们也可以使用`|`来制定多种类型


<declare-styleable name="SimpleView">
	<attr name="showContent" format="boolean" />
	<attr name="showPosition" format="enum">
		<enum name="left" value="0" />
		<enum name="right" value="1" />
	</attr>
</declare-styleable>


现在我们写好了一个带参数的View,在xml中可以设置一个自定义的命名空间,这个命名空间的写法`http://schemas.android.com/apk/res/[your package name]` 或者 `http://schemas.android.com/apk/res/auto`,举个例子:

<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools"
    xmlns:hxq="http://schemas.android.com/apk/res/blog.haoxiqiang"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context="blog.haoxiqiang.MainActivity" >

    <blog.haoxiqiang.SimpleView
        android:layout_width="wrap_content"
        android:layout_height="wrap_content"
        hxq:showContent="true"
        hxq:showPosition="right"
        android:text="@string/hello_world" />

</RelativeLayout>


我这里使用的是包名的形式,我现在想要做这样一个View,画一个圆,配上文字,`showContent`控制文字的显示与否,`showPosition`控制在屏幕的左半部分还是右半部分绘制,View的完整代码如下


package blog.haoxiqiang;

public class SimpleView extends View {
    // attr
    private boolean showContent = false;
    private int position = 0;
    // param
    private Paint mCirclePaint;
    private Paint mTextPaint;
    private final int radius = 100;
    private int width = 0;
    private boolean initLayout = false;

    public SimpleView(Context context) {
        super(context);
        init(context);
    }

    public SimpleView(Context context, AttributeSet attrs) {
        super(context, attrs);
        TypedArray typedArray = context.obtainStyledAttributes(attrs, R.styleable.SimpleView);
        if (typedArray != null) {
            showContent = typedArray.getBoolean(R.styleable.SimpleView_showContent, false);
            position = typedArray.getInt(R.styleable.SimpleView_showPosition, 0);
        }
        typedArray.recycle();
        init(context);
    }

    private void init(Context context) {
        mCirclePaint = new Paint();
        mCirclePaint.setColor(Color.BLUE);
        mCirclePaint.setStrokeWidth(8);
        mTextPaint = new Paint();
        mTextPaint.setColor(Color.RED);
        mTextPaint.setStrokeWidth(5);
        mTextPaint.setTextSize(35.0f);

        this.getViewTreeObserver().addOnGlobalLayoutListener(new OnGlobalLayoutListener() {

            @Override
            public void onGlobalLayout() {
                if (!initLayout) {
                    width = SimpleView.this.getWidth();
                    Log.i("onGlobalLayout", "initLayout:" + width);
                    SimpleView.this.invalidate();
                    initLayout = true;
                }
            }
        });
    }

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
}


在第二部分中,准备写一下Measure

>源码地址<br />
[BlogCode01](https://github.com/Haoxiqiang/BlogCode)


>参考<br />
[Creating Custom Views](http://developer.android.com/training/custom-views/index.html)
