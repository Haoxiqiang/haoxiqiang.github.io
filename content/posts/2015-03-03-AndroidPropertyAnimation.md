---
title: "Android Property Animation"
date: 2015-03-03 10:31:21
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

`Property Animation` 是 Android 提供的一套非常强大的动画框架,可以在运行时动态改变任意 View (可见或不可见) 的属性.相比传统的 View 动画(补间动画),属性动画真正改变了对象的属性,而不仅仅是绘制效果.

<!--more-->

## 为什么需要属性动画?

Android 3.0 (API 11) 之前的 View 动画(Animation) 存在一个根本缺陷:它只改变 View 的绘制位置,而不改变 View 本身的实际属性。比如把一个 Button 通过平移动画移到屏幕右侧,点击原来的位置依然有效——因为 View 的 `click` 事件区域并未移动。属性动画则直接改变对象的属性值(如 `x`、`y`、`alpha`),从根本上解决了这个问题。

## 核心 API

属性动画的核心类位于 `android.animation` 包下:

### ObjectAnimator

最常用的属性动画类,直接对指定对象的指定属性进行动画:

```java
ObjectAnimator anim = ObjectAnimator.ofFloat(foo, "alpha", 0f, 1f);
anim.setDuration(1000);
anim.start();
```

### ValueAnimator

更底层的动画类,通过监听值的变化手动更新属性:

```java
ValueAnimator animator = ValueAnimator.ofFloat(0f, 1f);
animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener() {
    @Override
    public void onAnimationUpdate(ValueAnimator animation) {
        float value = (float) animation.getAnimatedValue();
        // 手动应用 value
        view.setAlpha(value);
    }
});
animator.setDuration(300);
animator.start();
```

### AnimatorSet

用于编排多个动画的播放顺序:

```java
AnimatorSet set = new AnimatorSet();
set.play(anim1).before(anim2);
set.play(anim2).with(anim3);
set.start();
```

## 可配置属性

| 属性 | 说明 | 默认值 |
|------|------|--------|
| Duration | 动画持续时长 | 300ms |
| TimeInterpolator | 时间插值器,控制动画变化速率 | AccelerateDecelerateInterpolator |
| RepeatCount | 重复次数 | 0 (不重复) |
| RepeatMode | 重复模式: `RESTART` 或 `REVERSE` | RESTART |
| StartDelay | 启动延迟 | 0 |
| FrameRefreshDelay | 帧刷新延迟(通常无需修改) | 10ms |

> 注意:帧刷新延迟的最终结果不仅取决于设定的值,还受到当前系统性能和资源占用的影响。

## 插值器 (Interpolator)

插值器决定了动画的变化速率。Android 内置了多种插值器:

- `LinearInterpolator` — 匀速
- `AccelerateDecelerateInterpolator` — 先加速后减速
- `AccelerateInterpolator` — 加速
- `DecelerateInterpolator` — 减速
- `BounceInterpolator` — 回弹效果
- `AnticipateOvershootInterpolator` — 先回退再超出目标

你也可以实现 `TimeInterpolator` 接口来自定义插值器。

## ViewPropertyAnimator

如果只需要对一个 View 的多个属性做简单动画,`ViewPropertyAnimator` 提供了更简洁的链式调用:

```java
view.animate()
    .alpha(0.5f)
    .translationX(200f)
    .setDuration(1000)
    .start();
```

## 动画监听

通过 `AnimatorListener` 或简化版 `AnimatorListenerAdapter` 监听动画状态:

```java
anim.addListener(new AnimatorListenerAdapter() {
    @Override
    public void onAnimationEnd(Animator animation) {
        // 动画结束后的处理
    }
});
```

## 参考

- [Property Animation Overview — Android Developers](https://developer.android.com/develop/ui/views/animations/prop-animation)
- [Animation Resources — Android Developers](https://developer.android.com/guide/topics/resources/animation-resource#Property)
- [ObjectAnimator API Reference](https://developer.android.com/reference/android/animation/ObjectAnimator)
- [ValueAnimator API Reference](https://developer.android.com/reference/android/animation/ValueAnimator)
- [AnimatorSet API Reference](https://developer.android.com/reference/android/animation/AnimatorSet)
- [ViewPropertyAnimator API Reference](https://developer.android.com/reference/android/view/ViewPropertyAnimator)
