---
title: "Android 的 Canvas（二）：裁剪"
date: 2014-10-03 14:19:06
slug: "Android-Canvas2"
author: "haoxiqiang"
tags: ["Android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Canvas 的裁剪（Clip）用于限定绘制区域：只有裁剪区域范围内的内容才会被显示出来。

<!--more-->

## Region.Op 裁剪模式

Canvas 支持多种裁剪区域的组合操作，通过 `Region.Op` 枚举指定：

| 枚举值 | 说明 |
|--------|------|
| `DIFFERENCE`(0) | 最终区域为 region1 与 region2 不同的区域 |
| `INTERSECT`(1) | 最终区域为 region1 与 region2 相交的区域 |
| `UNION`(2) | 最终区域为 region1 与 region2 组合的区域 |
| `XOR`(3) | 最终区域为 region1 与 region2 相交之外的区域 |
| `REVERSE_DIFFERENCE`(4) | 最终区域为 region2 与 region1 不同的区域 |
| `REPLACE`(5) | 最终区域为 region2 的区域 |

![Canvas05](/images/android_canvas05.png)

## 完整示例

以下代码展示了各种裁剪模式的实际效果：

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
    // 剪切外圈
    canvas.clipRect(10 * factor, 10 * factor, 90 * factor, 90 * factor);
    // 中间挖空，保留 region1 与 region2 不同的区域
    canvas.clipRect(30 * factor, 30 * factor, 70 * factor, 70 * factor, Region.Op.DIFFERENCE);
    drawScene(canvas);
    canvas.restore();

    canvas.save();
    canvas.translate(10 * factor, 160 * factor);
    mPath.reset();
    // canvas.clipPath(mPath); // makes the clip empty
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

使用 `canvas.save()` 和 `canvas.restore()` 可以保存和恢复 Canvas 状态，确保每次裁剪只影响当前绘制区域。

## 参考

- [roamer' blog - Canvas Clip](http://blog.csdn.net/lonelyroamer/article/details/8349601)
- [源码 Blog02](https://github.com/Haoxiqiang/BlogCode/tree/master/Blog02)
- [Canvas - Android Developers](https://developer.android.com/reference/android/graphics/Canvas)
