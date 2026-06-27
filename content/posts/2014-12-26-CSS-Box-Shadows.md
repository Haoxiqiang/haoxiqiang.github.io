---
title: "CSS Box Shadows 实用技巧"
date: 2014-12-26 23:35:07
slug: "CSS-Box-Shadows"
author: "haoxiqiang"
tags: ["css"]
categories: ["Web"]
ShowToc: true
TocOpen: false
---

`box-shadow` 是 CSS3 中非常灵活的属性，用好它可以在纯 CSS 的情况下实现丰富的视觉效果。下面整理了几类常用技巧。

<!--more-->

## 定向阴影

通过调整偏移量和扩散半径，可以控制阴影只出现在特定方向。

<style>
.block-level {
    width: 8em;
    height: 8em;
    color: #fff;
    margin: 0.5em 1em;
    text-align: center;
    padding: 2em;
    text-shadow: 0 -1px 1px rgba(0,0,0,0.5);
}
.drop-shadow {
    background: #9479fa;
}
.drop-shadow.top {
    box-shadow: 0 -4px 2px -2px rgba(0,0,0,0.4);
}
.drop-shadow.right {
    box-shadow: 4px 0 2px -2px rgba(0,0,0,0.4);
}
.drop-shadow.bottom {
    box-shadow: 0 4px 2px -2px rgba(0,0,0,0.4);
}
.drop-shadow.left {
    box-shadow: -4px 0 2px -2px rgba(0,0,0,0.4);
}
</style>

<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level drop-shadow top">Top</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level drop-shadow right">Right</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level drop-shadow bottom">Bottom</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level drop-shadow left">Left</div></div>
</div>

```css
.drop-shadow.top {
    box-shadow: 0 -4px 2px -2px rgba(0,0,0,0.4);
}
.drop-shadow.right {
    box-shadow: 4px 0 2px -2px rgba(0,0,0,0.4);
}
.drop-shadow.bottom {
    box-shadow: 0 4px 2px -2px rgba(0,0,0,0.4);
}
.drop-shadow.left {
    box-shadow: -4px 0 2px -2px rgba(0,0,0,0.4);
}
```

关键点：使用负的 `spread-radius`（第四参数）抵消阴影在非目标方向上的扩散，配合偏移量实现单边阴影。

## 强调效果

通过无偏移的阴影和高扩散半径可模拟发光或边框效果。

<style>
div[class*="emphasize-"] {
    background: #69D2E7;
}
.emphasize-dark {
    box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
}
.emphasize-light {
    box-shadow: 0 0 0 10px rgba(255,255,255,.25);
}
.emphasize-inset {
    box-shadow: inset 0 0 7px 4px rgba(255,255,255,.5);
}
.emphasize-border {
    box-shadow: inset 0 0 0 7px rgba(255,255,255,.5);
}
</style>

<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level emphasize-dark">Dark</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level emphasize-light">Light</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level emphasize-inset">Inset</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level emphasize-border">Border</div></div>
</div>

```css
.emphasize-dark {
    box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
}
.emphasize-light {
    box-shadow: 0 0 0 10px rgba(255,255,255,.25);
}
.emphasize-inset {
    box-shadow: inset 0 0 7px 4px rgba(255,255,255,.5);
}
.emphasize-border {
    box-shadow: inset 0 0 0 7px rgba(255,255,255,.5);
}
```

- **Dark/Light**：通过模糊半径+扩散半径组合制造光晕
- **Inset**：利用 `inset` 关键字实现内阴影，模拟内凹效果
- **Border**：`spread-radius` 等于 7px、无模糊时，`inset` 阴影看起来像一个内边框

## 渐变叠加

使用 `background-image` 的渐变配合透明度的 `box-shadow`，实现更为柔和的层次感。

<style>
div[class*="gradient"] {
    background-color: #DEB8A0;
    box-shadow: 0 0 0 1px #a27b62;
}
.gradient-light-linear {
    background-image: linear-gradient(
        rgba(255,255,255,.5), rgba(255,255,255,0));
}
.gradient-dark-linear {
    background-image: linear-gradient(
        rgba(0,0,0,.25), rgba(0,0,0,0));
}
.gradient-light-radial {
    background-image: radial-gradient(
        center 0, circle farthest-corner,
        rgba(255,255,255,0.4), rgba(255,255,255,0));
}
.gradient-dark-radial {
    background-image: radial-gradient(
        center 0, circle farthest-corner,
        rgba(0,0,0,0.15), rgba(0,0,0,0));
}
</style>

<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-light-linear">Light Linear</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-dark-linear">Dark Linear</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-light-radial">Light Radial</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-dark-radial">Dark Radial</div></div>
</div>

```css
.gradient-light-linear {
    background-image: linear-gradient(
        rgba(255,255,255,.5), rgba(255,255,255,0));
}
.gradient-dark-linear {
    background-image: linear-gradient(
        rgba(0,0,0,.25), rgba(0,0,0,0));
}
.gradient-light-radial {
    background-image: radial-gradient(
        center 0, circle farthest-corner,
        rgba(255,255,255,0.4), rgba(255,255,255,0));
}
.gradient-dark-radial {
    background-image: radial-gradient(
        center 0, circle farthest-corner,
        rgba(0,0,0,0.15), rgba(0,0,0,0));
}
```

注意：这里已移除厂商前缀，现代浏览器均支持标准 `linear-gradient` / `radial-gradient` 写法。

## 圆角阴影

圆角与阴影配合使用，可获得更自然的卡片效果。

<style>
div[class*="rounded"] {
    background: #fca1cc;
}
.light-rounded {
    border-radius: 3px;
}
.heavy-rounded {
    border-radius: 8px;
}
.full-rounded {
    border-radius: 50%;
}
.barrel-rounded {
    border-radius: 20px/60px;
}
</style>

<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level light-rounded">Light</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level heavy-rounded">Heavy</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level full-rounded">Full</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level barrel-rounded">Barrel</div></div>
</div>

```css
.light-rounded {
    border-radius: 3px;
}
.heavy-rounded {
    border-radius: 8px;
}
.full-rounded {
    border-radius: 50%;
}
.barrel-rounded {
    border-radius: 20px/60px;
}
```

`border-radius` 支持使用 `/` 分别指定水平和垂直半径，`barrel-rounded` 展示了这种椭圆圆角的效果。

## 浮雕阴影

结合 `inset` 和常规阴影，可以模拟按钮或卡片的浮雕效果。

<style>
div[class*="embossed"] {
    background: #8ec12d;
    color: #333;
    text-shadow: 0 1px 1px rgba(255,255,255,0.9);
}
.embossed-light {
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.embossed-heavy {
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow:
        inset 0 2px 3px rgba(255,255,255,0.3),
        inset 0 -2px 3px rgba(0,0,0,0.3),
        0 1px 1px rgba(255,255,255,0.9);
}
</style>

<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level embossed-light">Light</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level embossed-heavy">Heavy</div></div>
</div>

```css
.embossed-light {
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}
.embossed-heavy {
    border: 1px solid rgba(0,0,0,0.05);
    box-shadow:
        inset 0 2px 3px rgba(255,255,255,0.3),
        inset 0 -2px 3px rgba(0,0,0,0.3),
        0 1px 1px rgba(255,255,255,0.9);
}
```

原理：通过 `inset` 高亮上边缘、暗化下边缘，配合外部投影，模拟出凸起或凹陷的立体感。

## 参考

- [box-shadow | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [Basic Ready to Use CSS Styles | Tympanus](http://tympanus.net/Tutorials/BasicReadyToUseCSSStyles/)
- [Box-shadow generator | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Box-shadow_generator)
