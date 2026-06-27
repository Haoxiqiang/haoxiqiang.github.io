---
title: "Android's Palette"
date: 2014-11-03 10:01:22
slug: "Androids-Palette"
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Palette 是 Android Support Library（现已迁移至 AndroidX `palette` 库）提供的取色工具，可以从 Bitmap 中自动提取一组代表色。在 Material Design 中，从图片提取色彩并应用到 UI 元素是常见的设计手法，Palette 让这一过程变得非常简单。

![palette01](/images/palette01.png)

<!--more-->

## 支持的颜色类型

Palette 提供六种色调类型，覆盖从鲜艳到暗淡的不同风格：

| 色调类型 | 说明 |
|---------|------|
| **Vibrant** | 鲜艳 |
| **Vibrant Dark** | 鲜艳暗色 |
| **Vibrant Light** | 鲜艳亮色 |
| **Muted** | 暗淡 |
| **Muted Dark** | 暗淡暗色 |
| **Muted Light** | 暗淡亮色 |

每种色调对应一个 `Palette.Swatch` 对象，包含 RGB 值、HSL 值、像素占比（population），以及适合在该色块上展示的标题和正文文本颜色。

## 基本用法

Palette 支持同步和异步两种生成方式：

```java
// 同步生成（需在后台线程执行）
public static Palette generate (Bitmap bitmap);
public static Palette generate (Bitmap bitmap, int numColors);

// 异步生成（自动在后台线程执行）
public static AsyncTask<Bitmap, Void, Palette> generateAsync (
    Bitmap bitmap, Palette.PaletteAsyncListener listener);
public static AsyncTask<Bitmap, Void, Palette> generateAsync (
    Bitmap bitmap, int numColors, Palette.PaletteAsyncListener listener);
```

同步方法 `generate` 速度很快，约几十毫秒。异步方式则通过 `AsyncTask` 在后台线程执行，结果通过回调返回。

## 关于 numColors 参数

`numColors` 控制提取的颜色数量，取值取决于图片类型：

> 风景照推荐 12-16，人物肖像建议 24-32。

数量越少生成速度越快，越多则色彩越精细。如果未指定，默认值为 16。

## 示例代码

以下示例从 Bitmap 提取颜色并应用到 ActionBar 和一组 View 上：

```java
Bitmap bitmap = BitmapFactory.decodeResource(
    getResources(), R.drawable.strictdroid);
Palette.generateAsync(bitmap, new PaletteAsyncListener() {

    @Override
    public void onGenerated(Palette palette) {
        getSupportActionBar().setBackgroundDrawable(
                new ColorDrawable(
                    palette.getVibrantSwatch().getRgb()));
        for (int i = 0; i < viewList.size(); i++) {
            View view = viewList.get(i);
            switch (i) {
                case 0:
                    view.setBackgroundColor(
                        palette.getDarkMutedColor(Color.BLACK));
                    break;
                case 1:
                    view.setBackgroundColor(
                        palette.getDarkVibrantColor(Color.BLACK));
                    break;
                case 2:
                    view.setBackgroundColor(
                        palette.getLightMutedColor(Color.BLACK));
                    break;
                case 3:
                    view.setBackgroundColor(
                        palette.getLightVibrantColor(Color.BLACK));
                    break;
                case 4:
                    view.setBackgroundColor(
                        palette.getMutedColor(Color.BLACK));
                    break;
                case 5:
                    view.setBackgroundColor(
                        palette.getVibrantColor(Color.BLACK));
                    break;
            }
        }
    }
});
```

每种 `getXxxColor()` 方法都接受一个默认颜色参数，当该色调类型在图片中不存在时使用。

## 迁移至 AndroidX

原始 v7 Palette 库已迁移至 AndroidX，新依赖为：

```groovy
implementation("androidx.palette:palette:1.0.0")
```

API 用法基本一致。Builder 模式推荐使用 `Palette.from(bitmap).generate()`，支持更多自定义选项，如 `maximumColorCount()`、`addFilter()`、`resizeBitmapArea()` 等。

## 参考

- [Select colors with the Palette API | Android Developers](https://developer.android.com/develop/ui/views/graphics/palette-colors)
- [Palette API Reference | Android Developers](https://developer.android.com/reference/kotlin/androidx/palette/graphics/Palette)
- [Palette.Builder API Reference | Android Developers](https://developer.android.com/reference/androidx/palette/graphics/Palette.Builder)
- [使用 Palette API 选择颜色 | Android 开发者](https://developer.android.google.cn/develop/ui/views/graphics/palette-colors)
- 示例源码：[PaletteDemo](https://github.com/Haoxiqiang/BlogCode/tree/master/PaletteDemo)
