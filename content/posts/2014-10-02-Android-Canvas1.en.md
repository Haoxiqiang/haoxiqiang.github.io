---
title: "Android Canvas (Part 1)"
date: 2014-10-02 13:19:06
slug: "Android-Canvas1"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

A View renders its content by "drawing" — using a canvas (`Canvas`) and a paintbrush (`Paint`). The `Canvas` obtained through the `onDraw` method is directly composited onto the View.

![Canvas01](/images/android_canvas01.png)

<!--more-->

## Obtaining a Canvas

There are three ways to get a Canvas instance:

1. **Override `View.onDraw`** — The Canvas is passed in as a parameter by the system
2. **Direct construction** — `Canvas c = new Canvas(Bitmap)` or construct then call `setBitmap`
3. **Surface locking** — Call `SurfaceHolder.lockCanvas()`

## Canvas Transformations

Canvas provides transformation methods for translation, rotation, scaling, and more:

- `rotate`
- `scale`
- `translate`
- `skew`

![Canvas02](/images/android_canvas02.png)

## Canvas Layers

> The following content is adapted from [roamer' blog](http://blog.csdn.net/lonelyroamer/article/details/8264189)

A Canvas can be thought of as a drawing board where all drawing operations (`drawBitmap`, `drawCircle`, etc.) take place. The canvas also defines properties like Matrix and color.

For complex rendering needs (e.g., multi-layer animations, map overlays), Canvas supports layers. By default there is one layer. You can draw hierarchically using `saveLayerXXX` to create intermediate layers and `restore` to return.

Layers are managed as a stack:

![Canvas03](/images/android_canvas03.png)

> Adapted from [roamer' blog](http://blog.csdn.net/lonelyroamer/article/details/8264189)

Push a new Layer onto the stack with `saveLayer` or `savaLayerAlpha`; pop with `restore` or `restoreToCount`. While a Layer is on the stack, all `DrawXXX` calls affect it. When the Layer is popped, its content is composited onto the parent layer or the Canvas, optionally with a transparency value.

![Canvas04](/images/android_canvas04.png)

## Complete Drawing Example

The following example demonstrates various Canvas drawing operations:

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
        // Background fill
        canvas.drawARGB(255, 0, 180, 255);
        canvas.drawColor(Color.RED);
        // TODO PorterDuff.Mode — needs further study
        canvas.drawColor(Color.BLACK, PorterDuff.Mode.CLEAR);
        canvas.drawRGB(255, 255, 255);

        arcPaint.setColor(Color.RED);

        canvas.drawText("Circle:", 10, 50, arcPaint);
        canvas.drawCircle(100, 45, 10, arcPaint);
        arcPaint.setAntiAlias(true);
        canvas.drawCircle(150, 45, 20, arcPaint);

        canvas.drawText("Lines & Arcs:", 10, 100, arcPaint);
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

        canvas.drawText("Rectangles:", 50, 150, arcPaint);
        arcPaint.setColor(Color.GRAY);
        arcPaint.setStyle(Paint.Style.FILL);
        canvas.drawRect(160, 135, 210, 185, arcPaint);
        canvas.drawRect(215, 150, 260, 210, arcPaint);

        canvas.drawText("Sector & Oval:", 10, 250, arcPaint);

        arcPaint.setShader(mShader);
        rectF.set(150, 190, 290, 310);
        canvas.drawArc(rectF, 200, 130, true, arcPaint);
        rectF.set(300, 200, 420, 300);
        canvas.drawOval(rectF, arcPaint);

        canvas.drawText("Triangle:", 10, 380, arcPaint);
        mPath.moveTo(100, 330);
        mPath.lineTo(150, 430);
        mPath.lineTo(180, 350);
        mPath.close();
        canvas.drawPath(mPath, arcPaint);

        // Hexagon
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

        // Rounded rectangle
        arcPaint.setStyle(Paint.Style.FILL);
        arcPaint.setColor(Color.LTGRAY);
        arcPaint.setAntiAlias(true);
        canvas.drawText("Rounded Rectangle:", 10, 450, arcPaint);
        rectF.set(180, 430, 300, 470);
        canvas.drawRoundRect(rectF, 20, 15, arcPaint);

        // Bezier curve
        canvas.drawText("Bezier Curve:", 10, 310, arcPaint);
        arcPaint.reset();
        arcPaint.setStyle(Paint.Style.STROKE);
        arcPaint.setColor(Color.GREEN);
        mPath.reset();
        mPath.moveTo(180, 310);
        mPath.quadTo(250, 250, 200, 350);
        canvas.drawPath(mPath, arcPaint);

        // Points
        arcPaint.setStyle(Paint.Style.FILL);
        canvas.drawText("Points:", 10, 520, arcPaint);
        canvas.drawPoint(60, 520, arcPaint);
        canvas.drawPoints(new float[] {60, 550, 65, 560, 70, 570}, arcPaint);

        // Bitmap
        canvas.drawBitmap(bitmap, 350, 350, arcPaint);
    }
}
```

## References

- [roamer' blog - Canvas Guide](http://blog.csdn.net/lonelyroamer/article/details/8264189)
- [Source code Canvas(1)](https://github.com/Haoxiqiang/BlogCode/tree/master/Blog02)
- [Canvas - Android Developers](https://developer.android.com/reference/android/graphics/Canvas)
- [Paint - Android Developers](https://developer.android.com/reference/android/graphics/Paint)
- [Create a custom drawing - Android Developers](https://developer.android.com/develop/ui/views/layout/custom-views/custom-drawing)
