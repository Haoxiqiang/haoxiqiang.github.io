---
title: "Bezier Curve Practice"
date: 2015-03-04 14:11:48
author: "haoxiqiang"
tags: ["android", "graphics"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

贝塞尔曲线(Bézier Curve)被广泛应用于计算机图形学中,用于为平滑曲线建立模型。它以法国工程师 Pierre Bézier (雷诺汽车公司) 和 Paul de Casteljau (雪铁龙汽车公司) 命名,两人在 1960 年代独立开发了这一曲线表示方法。

![Bézier_3_big](/images/Bézier_3_big.svg.png)![Bézier_3_big_gif](/images/Bézier_3_big.gif)

<!--more-->

## 数学定义

贝塞尔曲线由给定控制点 `P0`、`P1`、...、`Pn` 的向量函数 `B(t)` 追踪,参数 `t` 的取值范围为 `[0, 1]`。通用的 n 阶贝塞尔曲线公式为:

$$\mathbf{B}(t) = \sum_{i=0}^{n} \binom{n}{i} t^{i} (1-t)^{n-i} \mathbf{P}_i \quad , \quad t \in [0, 1]$$

## 常用阶数

### 一阶(线性)贝塞尔曲线

两个控制点 `P0`、`P1`,就是两点之间的一条直线:

$$\mathbf{B}(t)=\mathbf{P}_0 + (\mathbf{P}_1-\mathbf{P}_0)t=(1-t)\mathbf{P}_0 + t\mathbf{P}_1 \mbox{ , } t \in [0,1]$$

```java
private float getLinearBezier(float t, float p0, float p1) {
    return (1 - t) * p0 + t * p1;
}
```

### 二阶(二次)贝塞尔曲线

三个控制点 `P0`、`P1`、`P2`:

$$\mathbf{B}(t) = (1 - t)^{2}\mathbf{P}_0 + 2t(1 - t)\mathbf{P}_1 + t^{2}\mathbf{P}_2 \mbox{ , } t \in [0,1]$$

### 三阶(三次)贝塞尔曲线

四个控制点 `P0`、`P1`、`P2`、`P3`,也是实际应用中最常见的:

$$\mathbf{B}(t) = (1 - t)^3\mathbf{P}_0 + 3t(1 - t)^2\mathbf{P}_1 + 3t^2(1 - t)\mathbf{P}_2 + t^3\mathbf{P}_3 \quad , \quad t \in [0, 1]$$

## 关键性质

- **端点插值**:曲线始终经过第一个和最后一个控制点: `B(0) = P0`, `B(1) = Pn`
- **切线性质**:曲线在起点处与 `P0->P1` 相切,在终点处与 `Pn-1->Pn` 相切
- **凸包性质**:整个曲线位于其控制点的凸包(Convex Hull)之内
- **仿射不变性**:对控制点做仿射变换(平移、旋转、缩放)后再生成曲线,等价于对曲线本身做相同变换
- **细分性**:一条贝塞尔曲线可以被分割为两条同阶的贝塞尔曲线(de Casteljau 算法)

## 在 Android 中的应用

在 Android 中,贝塞尔曲线常用于:

- **自定义插值器**:通过贝塞尔曲线定义动画的变化速率
- **路径动画**:使用 `Path` 类的 `quadTo()`(二次)和 `cubicTo()`(三次)方法创建曲线路径
- **手势轨迹**:通过 `GestureOverlayView` 或自定义 View 绘制触摸轨迹
- **矢量图形**:在 VectorDrawable 中定义曲线形状

```java
// Android Path 中使用三次贝塞尔曲线
Path path = new Path();
path.moveTo(startX, startY);
path.cubicTo(control1X, control1Y, control2X, control2Y, endX, endY);

// 使用二次贝塞尔曲线
path.quadTo(controlX, controlY, endX, endY);
```

## 参考

- [Bézier Curve — Wolfram MathWorld](https://mathworld.wolfram.com/BezierCurve.html)
- [Bézier curve — Wikipedia](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
- [Path API Reference — Android Developers](https://developer.android.com/reference/android/graphics/Path)
- [VectorDrawable — Android Developers](https://developer.android.com/reference/android/graphics/drawable/VectorDrawable)
- [de Casteljau's algorithm — Wikipedia](https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm)
