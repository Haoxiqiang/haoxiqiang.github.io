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

The Palette library, part of Android Support Library (now migrated to AndroidX `palette`), extracts representative colors from a Bitmap. In Material Design, deriving UI colors from imagery is a common pattern, and Palette makes this straightforward.

![palette01](/images/palette01.png)

<!--more-->

## Supported Color Profiles

Palette provides six color profiles covering vibrant to muted tones:

| Profile | Description |
|---------|-------------|
| **Vibrant** | Bright, saturated |
| **Vibrant Dark** | Dark variant of vibrant |
| **Vibrant Light** | Light variant of vibrant |
| **Muted** | Subdued, desaturated |
| **Muted Dark** | Dark variant of muted |
| **Muted Light** | Light variant of muted |

Each profile corresponds to a `Palette.Swatch` object that provides RGB/HSL values, population count, and recommended text colors for overlaying on the swatch.

## Basic Usage

Palette supports both synchronous and asynchronous generation:

```java
// Synchronous generation (run on background thread)
public static Palette generate (Bitmap bitmap);
public static Palette generate (Bitmap bitmap, int numColors);

// Asynchronous generation
public static AsyncTask<Bitmap, Void, Palette> generateAsync (
    Bitmap bitmap, Palette.PaletteAsyncListener listener);
public static AsyncTask<Bitmap, Void, Palette> generateAsync (
    Bitmap bitmap, int numColors, Palette.PaletteAsyncListener listener);
```

The synchronous `generate` method completes in tens of milliseconds. The async variant runs on a background thread via `AsyncTask` and delivers results through a callback.

## About the numColors Parameter

`numColors` controls the number of colors extracted:

> For landscapes, 12-16 colors suffice. For images dominated by faces, increase to 24-32 for better detail.

Smaller values yield faster generation; larger values produce finer color granularity. Default is 16.

## Example

The following example extracts colors from a Bitmap and applies them to the ActionBar and a set of views:

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

Each `getXxxColor()` method accepts a default color parameter, used when the requested profile is not present in the image.

## Migration to AndroidX

The original v7 Palette library has migrated to AndroidX:

```groovy
implementation("androidx.palette:palette:1.0.0")
```

The API remains largely the same. The Builder pattern (`Palette.from(bitmap).generate()`) is recommended for new code, offering customization options like `maximumColorCount()`, `addFilter()`, and `resizeBitmapArea()`.

## References

- [Select colors with the Palette API | Android Developers](https://developer.android.com/develop/ui/views/graphics/palette-colors)
- [Palette API Reference | Android Developers](https://developer.android.com/reference/kotlin/androidx/palette/graphics/Palette)
- [Palette.Builder API Reference | Android Developers](https://developer.android.com/reference/androidx/palette/graphics/Palette.Builder)
- Source code: [PaletteDemo](https://github.com/Haoxiqiang/BlogCode/tree/master/PaletteDemo)
