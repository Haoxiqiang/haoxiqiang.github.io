---
title: "Android 的自定义 View（一）"
date: 2014-10-01 17:19:06
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

刚开始编写自定义 View 时，难免不知道如何下手。一般说来有两种实现方式：

1. **从零开始**：继承 `View`，通过计算和绘制实现所需的外观。
2. **扩展现有 View**：在已有控件基础上增加子 View，或重写方法改变原有逻辑。

<!--more-->

## 继承 View 实现自定义控件

先看一个继承 `View` 的最简示例：

```java
public class SimpleView extends View {

    public SimpleView(Context context) {
        super(context);
    }

    public SimpleView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }
}
```

如果不需要 XML 配置属性，`AttributeSet` 构造方法可以不写——但这样一来此 View 也不能在 XML 中使用。

## 自定义属性

`AttributeSet` 将 XML 属性解析为数组供代码使用。属性类型需要事先声明，通常定义在 `res/values/attrs.xml` 中：

```xml
<declare-styleable name="SimpleView">
    <attr name="showContent" format="boolean" />
    <attr name="showPosition" format="enum">
        <enum name="left" value="0" />
        <enum name="right" value="1" />
    </attr>
</declare-styleable>
```

支持的数据类型：`boolean`、`string`、`dimension`、`enum`、`fraction`、`reference`、`color`，也可用 `|` 指定多种类型。

### 在 XML 中使用自定义命名空间

```xml
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
```

命名空间写法：`http://schemas.android.com/apk/res/[your package name]` 或 `http://schemas.android.com/apk/res/auto`。

## 完整示例：带圆和文字的 View

下面实现一个自定义 View，绘制一个蓝色圆形并配上文字。`showContent` 控制文字显示，`showPosition` 控制在屏幕左半部分还是右半部分绘制。

```java
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
```

下一篇将讨论 `onMeasure` 的工作原理。

## 参考

- [源码 BlogCode01](https://github.com/Haoxiqiang/BlogCode)
- [Creating Custom Views - Android Developers](https://developer.android.com/training/custom-views/index.html)
- [Create custom view components - Android Developers](https://developer.android.com/develop/ui/views/layout/custom-views/custom-components)
