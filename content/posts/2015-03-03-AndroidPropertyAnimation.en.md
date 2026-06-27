---
title: "Android Property Animation"
date: 2015-03-03 10:31:21
slug: "AndroidPropertyAnimation"
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

`Property Animation` is a powerful animation framework introduced in Android 3.0 (API 11). Unlike the older View Animation (tween animation) system, property animation actually changes the properties of the target object, not just its rendered appearance.

<!--more-->

## Why Property Animation?

The legacy View Animation system (android.view.animation.Animation) had a fundamental flaw: it only changed where a View was drawn, not its actual properties. For example, if you animated a Button to move to the right side of the screen, clicking the original position would still trigger the button — because the View's clickable region never moved. Property animation solves this by directly modifying the actual property values (like `x`, `y`, `alpha`) of the target object.

## Core APIs

The core classes reside in the `android.animation` package:

### ObjectAnimator

The most commonly used class. It directly animates a named property of a target object:

```java
ObjectAnimator anim = ObjectAnimator.ofFloat(foo, "alpha", 0f, 1f);
anim.setDuration(1000);
anim.start();
```

### ValueAnimator

A lower-level class that animates values without applying them to any specific object. You must provide an update listener to apply each frame's value:

```java
ValueAnimator animator = ValueAnimator.ofFloat(0f, 1f);
animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
    @Override
    public void onAnimationUpdate(ValueAnimator animation) {
        float value = (float) animation.getAnimatedValue();
        view.setAlpha(value);
    }
});
animator.setDuration(300);
animator.start();
```

### AnimatorSet

Used to orchestrate multiple animations — playing them together, sequentially, or with delays:

```java
AnimatorSet set = new AnimatorSet();
set.play(anim1).before(anim2);
set.play(anim2).with(anim3);
set.start();
```

## Configurable Properties

| Property | Description | Default |
|----------|-------------|---------|
| Duration | How long the animation runs | 300ms |
| TimeInterpolator | Controls the rate of change | AccelerateDecelerateInterpolator |
| RepeatCount | Number of times to repeat | 0 (no repeat) |
| RepeatMode | `RESTART` or `REVERSE` | RESTART |
| StartDelay | Delay before animation starts | 0 |
| FrameRefreshDelay | Frame refresh interval (rarely changed) | 10ms |

> Note: The actual frame rate depends not only on the configured delay but also on system performance and resource usage.

## Interpolators

Android provides several built-in interpolators:

- `LinearInterpolator` — constant speed
- `AccelerateDecelerateInterpolator` — accelerate then decelerate
- `AccelerateInterpolator` — accelerate only
- `DecelerateInterpolator` — decelerate only
- `BounceInterpolator` — bounce effect at the end
- `AnticipateOvershootInterpolator` — pull back then overshoot the target

You can also implement `TimeInterpolator` to create custom interpolators.

## ViewPropertyAnimator

For simple multi-property view animations, `ViewPropertyAnimator` provides a fluent API:

```java
view.animate()
    .alpha(0.5f)
    .translationX(200f)
    .setDuration(1000)
    .start();
```

## Animation Listeners

Use `AnimatorListener` or the convenience class `AnimatorListenerAdapter` to react to animation events:

```java
anim.addListener(new AnimatorListenerAdapter() {
    @Override
    public void onAnimationEnd(Animator animation) {
        // Handle post-animation logic
    }
});
```

## References

- [Property Animation Overview — Android Developers](https://developer.android.com/develop/ui/views/animations/prop-animation)
- [Animation Resources — Android Developers](https://developer.android.com/guide/topics/resources/animation-resource#Property)
- [ObjectAnimator API Reference](https://developer.android.com/reference/android/animation/ObjectAnimator)
- [ValueAnimator API Reference](https://developer.android.com/reference/android/animation/ValueAnimator)
- [AnimatorSet API Reference](https://developer.android.com/reference/android/animation/AnimatorSet)
- [ViewPropertyAnimator API Reference](https://developer.android.com/reference/android/view/ViewPropertyAnimator)
