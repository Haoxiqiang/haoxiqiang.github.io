---
title: "Android 的 Canvas（一）"
date: 2014-10-02 13:19:06
slug: "Android-Canvas1"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

View 能将内容显示出来，本质上是"画"出来的——在画板上使用画笔绘制。这里的画布是 `Canvas`，画笔是 `Paint`。通过 `onDraw` 方法获取到的 Canvas 内容可以直接反映到 View 上。

![Canvas01](/images/android_canvas01.png)

<!--more-->

## 获取 Canvas 对象

有三种方式获取 Canvas 实例：

1. **重写 `View.onDraw` 方法** — Canvas 对象由系统作为参数传入
2. **直接构造** — `Canvas c = new Canvas(Bitmap)` 或构造后调用 `setBitmap`
3. **Surface 锁定** — 调用 `SurfaceHolder.lockCanvas()`

## Canvas 变换方法

Canvas 提供了一系列位置变换方法，用于实现平移、旋转、缩放等效果：

- `rotate` — 旋转
- `scale` — 缩放
- `translate` — 平移
- `skew` — 倾斜

![Canvas02](/images/android_canvas02.png)

## Canvas 图层（Layer）机制

> 以下内容引用自 [roamer' blog](http://blog.csdn.net/lonelyroamer/article/details/8264189)

Canvas 在一般情况下可看作一张画布，所有绘图操作（如 `drawBitmap`、`drawCircle`）都发生在这张画布上。画布还定义了 Matrix、颜色等属性。

如果需要实现相对复杂的绘图操作（如多层动画、地图图层叠加），Canvas 提供了图层（Layer）支持。缺省情况下只有一个图层 Layer。可以按层次绘图，使用 `saveLayerXXX` 创建中间层、`restore` 恢复。

图层按"栈结构"管理：

![Canvas03](/images/android_canvas03.png)

> 引用自 [roamer' blog](http://blog.csdn.net/lonelyroamer/article/details/8264189)

创建新的 Layer 入栈使用 `saveLayer`、`savaLayerAlpha`；出栈使用 `restore`、`restoreToCount`。Layer 入栈后，后续的 `DrawXXX` 操作都在这个 Layer 上进行；Layer 退栈时，将本层图像"绘制"到上层或 Canvas 上。复制到 Canvas 时可指定透明度。

![Canvas04](/images/android_canvas04.png)

## 完整绘制示例

下面是一个综合示例，展示了 Canvas 支持的各种绘制操作：

```java
public class CanvasView extends View {

    private Paint arcPaint;
    private RectF rectF;
    private Shader mShader;
    private Path mPath;
    private Bitmap bitmap;

    public CanvasView(Context context) {
        super(context);
    }

    public CanvasView(Context context, AttributeSet attrs) {
        super(context, attrs);
        init();
    }

    private void init() {
        arcPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        arcPaint.setColor(Color.BLUE);
        rectF = new RectF(260, 70, 290, 115);
        // 设置渐变色
        mShader =
                new LinearGradient(0, 0, 100, 100, new int[] {Color.RED, Color.GREEN, Color.BLUE,
                        Color.YELLOW, Color.LTGRAY}, null, Shader.TileMode.REPEAT);

        mPath = new Path();
        mPath.reset();
        bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.ic_launcher);
    }

    @Override
    protected void onDraw(Canvas canvas) {
        super.onDraw(canvas);
        // 填充背景
        canvas.drawARGB(255, 0, 180, 255);
        canvas.drawColor(Color.RED);
        // TODO PorterDuff.Mode 待深入了解
        canvas.drawColor(Color.BLACK, PorterDuff.Mode.CLEAR);
        canvas.drawRGB(255, 255, 255);
        // 创建画笔
        arcPaint.setColor(Color.RED);

        canvas.drawText("画圆：", 10, 50, arcPaint);
        canvas.drawCircle(100, 45, 10, arcPaint);
        arcPaint.setAntiAlias(true);
        canvas.drawCircle(150, 45, 20, arcPaint);

        canvas.drawText("画线及弧线：", 10, 100, arcPaint);
        arcPaint.setColor(Color.GREEN);
        canvas.drawLine(160, 90, 210, 90, arcPaint);
        canvas.drawLine(210, 75, 270, 55, arcPaint);

        arcPaint.setStyle(Paint.Style.STROKE);
        canvas.drawCircle(300, 100, 50, arcPaint);

        canvas.drawArc(rectF, 180, 180, false, arcPaint);
        rectF.set(310, 70, 340, 115);
        canvas.drawArc(rectF, 180, 180, false, arcPaint);
        rectF.set(290, 110, 310, 125);
        canvas.drawArc(rectF, 0, 180, false, arcPaint);

        canvas.drawText("画矩形：", 50, 150, arcPaint);
        arcPaint.setColor(Color.GRAY);
        arcPaint.setStyle(Paint.Style.FILL);
        canvas.drawRect(160, 135, 210, 185, arcPaint);
        canvas.drawRect(215, 150, 260, 210, arcPaint);

        canvas.drawText("画扇形和椭圆：", 10, 250, arcPaint);

        arcPaint.setShader(mShader);
        rectF.set(150, 190, 290, 310);
        canvas.drawArc(rectF, 200, 130, true, arcPaint);
        rectF.set(300, 200, 420, 300);
        canvas.drawOval(rectF, arcPaint);

        canvas.drawText("画三角形：", 10, 380, arcPaint);
        mPath.moveTo(100, 330);
        mPath.lineTo(150, 430);
        mPath.lineTo(180, 350);
        mPath.close();
        canvas.drawPath(mPath, arcPaint);

        // 六边形
        arcPaint.reset();
        arcPaint.setColor(Color.LTGRAY);
        arcPaint.setStyle(Paint.Style.STROKE);
        mPath.reset();
        mPath.moveTo(280, 400);
        mPath.lineTo(300, 400);
        mPath.lineTo(310, 410);
        mPath.lineTo(300, 420);
        mPath.lineTo(280, 420);
        mPath.lineTo(270, 410);
        mPath.close();
        canvas.drawPath(mPath, arcPaint);

        // 圆角矩形
        arcPaint.setStyle(Paint.Style.FILL);
        arcPaint.setColor(Color.LTGRAY);
        arcPaint.setAntiAlias(true);
        canvas.drawText("画圆角矩形：", 10, 450, arcPaint);
        rectF.set(180, 430, 300, 470);
        canvas.drawRoundRect(rectF, 20, 15, arcPaint);

        // 贝塞尔曲线
        canvas.drawText("画贝塞尔曲线：", 10, 310, arcPaint);
        arcPaint.reset();
        arcPaint.setStyle(Paint.Style.STROKE);
        arcPaint.setColor(Color.GREEN);
        mPath.reset();
        mPath.moveTo(180, 310);
        mPath.quadTo(250, 250, 200, 350);
        canvas.drawPath(mPath, arcPaint);

        // 画点
        arcPaint.setStyle(Paint.Style.FILL);
        canvas.drawText("画点：", 10, 520, arcPaint);
        canvas.drawPoint(60, 520, arcPaint);
        canvas.drawPoints(new float[] {60, 550, 65, 560, 70, 570}, arcPaint);

        // 画图片
        canvas.drawBitmap(bitmap, 350, 350, arcPaint);
    }
}
```

## 参考

- [roamer' blog - Canvas 详解](http://blog.csdn.net/lonelyroamer/article/details/8264189)
- [源码 Canvas(1)](https://github.com/Haoxiqiang/BlogCode/tree/master/Blog02)
- [Canvas - Android Developers](https://developer.android.com/reference/android/graphics/Canvas)
- [Paint - Android Developers](https://developer.android.com/reference/android/graphics/Paint)
- [Create a custom drawing - Android Developers](https://developer.android.com/develop/ui/views/layout/custom-views/custom-drawing)
