---
title: "Android Custom View (Part 1)"
date: 2014-10-01 17:19:06
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

When you first start writing custom Views in Android, it's common to feel unsure where to begin. Generally, there are two approaches:

1. **From scratch**: Extend `View` and implement the appearance entirely through calculation and drawing.
2. **Extend an existing View**: Add child views to an existing component, or override methods to change its behavior.

<!--more-->

## Subclassing View

Here is the simplest example of extending `View`:

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

If you don't need XML attributes, you can omit the `AttributeSet` constructor — but then the View cannot be used in XML layouts.

## Custom Attributes

`AttributeSet` parses XML attributes into an array for code access. Attribute types must be declared in advance, typically in `res/values/attrs.xml`:

```xml
<declare-styleable name="SimpleView">
    <attr name="showContent" format="boolean" />
    <attr name="showPosition" format="enum">
        <enum name="left" value="0" />
        <enum name="right" value="1" />
    </attr>
</declare-styleable>
```

Supported types: `boolean`, `string`, `dimension`, `enum`, `fraction`, `reference`, `color`. You can also use `|` to specify multiple types.

### Using Custom Attributes in XML

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

The namespace format: `http://schemas.android.com/apk/res/[your package name]` or `http://schemas.android.com/apk/res/auto`.

## Complete Example: View with Circle and Text

This custom View draws a blue circle with optional text. `showContent` toggles the text, and `showPosition` controls whether it draws on the left or right side of the screen.

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

The next part will discuss how `onMeasure` works.

## References

- [Source code BlogCode01](https://github.com/Haoxiqiang/BlogCode)
- [Creating Custom Views - Android Developers](https://developer.android.com/training/custom-views/index.html)
- [Create custom view components - Android Developers](https://developer.android.com/develop/ui/views/layout/custom-views/custom-components)
