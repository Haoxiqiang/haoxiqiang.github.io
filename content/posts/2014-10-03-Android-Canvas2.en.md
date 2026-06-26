---
title: "Android Canvas (Part 2): Clipping"
date: 2014-10-03 14:19:06
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Canvas clipping limits the drawing region: only content within the clipped area is visible.

<!--more-->

## Region.Op Clip Modes

Canvas supports combining multiple clip regions through `Region.Op`:

| Enum Value | Description |
|------------|-------------|
| `DIFFERENCE`(0) | Final region is the part of region1 NOT in region2 |
| `INTERSECT`(1) | Final region is the intersection of region1 and region2 |
| `UNION`(2) | Final region is the union of region1 and region2 |
| `XOR`(3) | Final region is the non-overlapping parts of region1 and region2 |
| `REVERSE_DIFFERENCE`(4) | Final region is the part of region2 NOT in region1 |
| `REPLACE`(5) | Final region is region2 |

![Canvas05](/images/android_canvas05.png)

## Complete Example

The following code demonstrates the effect of each clip mode:

```java
private void drawScene(Canvas canvas) {
    canvas.clipRect(0, 0, 100 * factor, 100 * factor);

    canvas.drawColor(Color.WHITE);

    mPaint.setColor(Color.RED);
    canvas.drawLine(0, 0, 100 * factor, 100 * factor, mPaint);

    mPaint.setColor(Color.GREEN);
    canvas.drawCircle(30 * factor, 70 * factor, 30 * factor, mPaint);

    mPaint.setColor(Color.BLUE);
    canvas.drawText("Clipping", 100 * factor, 30 * factor, mPaint);
}

@Override
protected void onDraw(Canvas canvas) {

    canvas.drawColor(Color.GRAY);

    canvas.save();
    canvas.translate(10 * factor, 10 * factor);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(160 * factor, 10 * factor);
    canvas.clipRect(10 * factor, 10 * factor, 90 * factor, 90 * factor);
    canvas.clipRect(30 * factor, 30 * factor, 70 * factor, 70 * factor, Region.Op.DIFFERENCE);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(10 * factor, 160 * factor);
    mPath.reset();
    mPath.addCircle(50 * factor, 50 * factor, 50 * factor, Path.Direction.CCW);
    canvas.clipPath(mPath, Region.Op.REPLACE);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(160 * factor, 160 * factor);
    canvas.clipRect(0, 0, 60 * factor, 60 * factor);
    canvas.clipRect(40 * factor, 40 * factor, 100 * factor, 100 * factor, Region.Op.UNION);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(10 * factor, 310 * factor);
    canvas.clipRect(0, 0, 60 * factor, 60 * factor);
    canvas.clipRect(40 * factor, 40 * factor, 100 * factor, 100 * factor, Region.Op.XOR);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(160 * factor, 310 * factor);
    canvas.clipRect(0, 0, 60 * factor, 60 * factor);
    canvas.clipRect(40 * factor, 40 * factor, 100 * factor, 100 * factor,
            Region.Op.REVERSE_DIFFERENCE);
    drawScene(canvas);
    canvas.restore();
}
```

Using `canvas.save()` and `canvas.restore()` preserves and restores the Canvas state, ensuring each clip operation only affects the current drawing scope.

## References

- [roamer' blog - Canvas Clip](http://blog.csdn.net/lonelyroamer/article/details/8349601)
- [Source code Blog02](https://github.com/Haoxiqiang/BlogCode/tree/master/Blog02)
- [Canvas - Android Developers](https://developer.android.com/reference/android/graphics/Canvas)
