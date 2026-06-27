---
title: "Bezier Curve Practice"
date: 2015-03-04 14:11:48
slug: "BezierCurvePractice"
author: "haoxiqiang"
tags: ["android", "graphics"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Bézier curves are widely used in computer graphics to model smooth curves. They were independently developed by French engineers Pierre Bézier (Renault) and Paul de Casteljau (Citroën) in the 1960s.

![Bézier_3_big](/images/Bézier_3_big.svg.png)![Bézier_3_big_gif](/images/Bézier_3_big.gif)

<!--more-->

## Mathematical Definition

A Bézier curve is defined by a vector function `B(t)` that traces from control points `P0, P1, ..., Pn`, with parameter `t` in `[0, 1]`. The general formula of degree n is:

$$\mathbf{B}(t) = \sum_{i=0}^{n} \binom{n}{i} t^{i} (1-t)^{n-i} \mathbf{P}_i \quad , \quad t \in [0, 1]$$

## Common Degrees

### Linear (1st degree) Bézier Curve

Two control points `P0` and `P1` — simply a straight line between them:

$$\mathbf{B}(t)=\mathbf{P}_0 + (\mathbf{P}_1-\mathbf{P}_0)t=(1-t)\mathbf{P}_0 + t\mathbf{P}_1 \mbox{ , } t \in [0,1]$$

```java
private float getLinearBezier(float t, float p0, float p1) {
    return (1 - t) * p0 + t * p1;
}
```

### Quadratic (2nd degree) Bézier Curve

Three control points `P0, P1, P2`:

$$\mathbf{B}(t) = (1 - t)^{2}\mathbf{P}_0 + 2t(1 - t)\mathbf{P}_1 + t^{2}\mathbf{P}_2 \mbox{ , } t \in [0,1]$$

### Cubic (3rd degree) Bézier Curve

Four control points `P0, P1, P2, P3` — the most commonly used in practice:

$$\mathbf{B}(t) = (1 - t)^3\mathbf{P}_0 + 3t(1 - t)^2\mathbf{P}_1 + 3t^2(1 - t)\mathbf{P}_2 + t^3\mathbf{P}_3 \quad , \quad t \in [0, 1]$$

## Key Properties

- **Endpoint interpolation**: The curve always passes through the first and last control points: `B(0) = P0`, `B(1) = Pn`
- **Tangent property**: The curve is tangent to `P0->P1` at the start and `Pn-1->Pn` at the end
- **Convex hull property**: The entire curve lies within the convex hull of its control points
- **Affine invariance**: Applying affine transformations (translation, rotation, scaling) to control points is equivalent to transforming the curve itself
- **Subdivision**: A Bézier curve can be split into two curves of the same degree (via de Casteljau's algorithm)

## Usage in Android

In Android, Bézier curves are commonly used for:

- **Custom interpolators**: Define animation curves via Bézier control points
- **Path animations**: Use `Path.quadTo()` (quadratic) and `Path.cubicTo()` (cubic) for curved paths
- **Gesture tracking**: Draw touch trajectories in custom Views
- **Vector graphics**: Define curved shapes in VectorDrawable resources

```java
// Cubic Bézier curve in Android Path
Path path = new Path();
path.moveTo(startX, startY);
path.cubicTo(control1X, control1Y, control2X, control2Y, endX, endY);

// Quadratic Bézier curve
path.quadTo(controlX, controlY, endX, endY);
```

## References

- [Bézier Curve — Wolfram MathWorld](https://mathworld.wolfram.com/BezierCurve.html)
- [Bézier curve — Wikipedia](https://en.wikipedia.org/wiki/B%C3%A9zier_curve)
- [Path API Reference — Android Developers](https://developer.android.com/reference/android/graphics/Path)
- [VectorDrawable — Android Developers](https://developer.android.com/reference/android/graphics/drawable/VectorDrawable)
- [de Casteljau's algorithm — Wikipedia](https://en.wikipedia.org/wiki/De_Casteljau%27s_algorithm)
