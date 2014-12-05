---
layout: post
title:  Android's RecyclerView(2) 视差滚动
date:   2014-11-03 10:01:22
author: 郝锡强
categories: blog
letex: false
tags: [java,android]
---
### Palette
Palette是一个v7包中提供的工具,可以用来在你的一个Bitmap中提取出一些代表色值,就想下面的这一幅图
![palette01](../img/palette01.png)
<!-- more -->
现在支持这几种代表色:

* Vibrant （鲜艳的）
* Vibrant Dark （鲜艳的 暗色）
* Vibrant Light （鲜艳的 亮色）
* Muted （暗淡的）
* Muted Dark（暗淡的 暗色）
* Muted Light（暗淡的 亮色）

{% highlight java %}
public static Palette generate (Bitmap bitmap);
public static Palette generate (Bitmap bitmap, int numColors);
public static AsyncTask<Bitmap, Void, Palette> generateAsync (Bitmap bitmap, Palette.PaletteAsyncListener listener)
public static AsyncTask<Bitmap, Void, Palette> generateAsync (Bitmap bitmap, int numColors, Palette.PaletteAsyncListener listener);
{% endhighlight %}

generate的生成速度很快,大约几十毫秒的样子,取色的时候可以加上默认值.对于numColors,风景画类的12-16就可以了,要是人脸就得24-32,肯定是越少越快,越多越精细
```
Generate a Palette from a Bitmap using the specified numColors. Good values for numColors depend on the source image type. For landscapes, a good values are in the range 12-16. For images which are largely made up of people's faces then this value should be increased to 24-32.
```
{% highlight java %}
Bitmap bitmap = BitmapFactory.decodeResource(getResources(), R.drawable.strictdroid);
Palette.generateAsync(bitmap, new PaletteAsyncListener() {

    @Override
    public void onGenerated(Palette palette) {
        getSupportActionBar().setBackgroundDrawable(
                new ColorDrawable(palette.getVibrantSwatch().getRgb()));
        for (int i = 0; i < viewList.size(); i++) {
            View view = viewList.get(i);
            switch (i) {
                case 0:
                    view.setBackgroundColor(palette.getDarkMutedColor(Color.BLACK));
                    break;
                case 1:
                    view.setBackgroundColor(palette.getDarkVibrantColor(Color.BLACK));
                    break;
                case 2:
                    view.setBackgroundColor(palette.getLightMutedColor(Color.BLACK));
                    break;
                case 3:
                    view.setBackgroundColor(palette.getLightVibrantColor(Color.BLACK));
                    break;
                case 4:
                    view.setBackgroundColor(palette.getMutedColor(Color.BLACK));
                    break;
                case 5:
                    view.setBackgroundColor(palette.getVibrantColor(Color.BLACK));
                    break;
            }

        }
    }
});
{% endhighlight %}
>源码地址<br />
[PaletteDemo](https://github.com/Haoxiqiang/BlogCode/tree/master/PaletteDemo)
>参考<br />
[v7-palette](https://developer.android.com/reference/android/support/v7/graphics/Palette.html)