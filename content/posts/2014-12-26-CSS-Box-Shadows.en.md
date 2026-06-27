---
title: "CSS Box Shadows Techniques"
date: 2014-12-26 23:35:07
slug: "CSS-Box-Shadows"
author: "haoxiqiang"
tags: ["css"]
categories: ["Web"]
ShowToc: true
TocOpen: false
---

The `box-shadow` property in CSS3 is highly versatile. When used creatively, it can produce rich visual effects with pure CSS. Here are several practical techniques.

<!--more-->

## Directional Shadows

By adjusting offsets and spread radius, shadows can be limited to a specific direction.

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

Key point: a negative `spread-radius` (fourth parameter) cancels shadow diffusion on non-target sides, making single-side shadows possible.

## Emphasis Effects

Zero-offset shadows with large spread radius simulate glow or border effects.

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

- **Dark/Light**: blur radius + spread radius create a glow effect
- **Inset**: the `inset` keyword creates inner shadow, simulating a concave look
- **Border**: when `spread-radius` is 7px with no blur, `inset` shadow appears as an inner border

## Gradient Overlays

Combining `background-image` gradients with semi-transparent `box-shadow` creates subtle depth.

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

Note: vendor prefixes have been removed — modern browsers all support the standard `linear-gradient` / `radial-gradient` syntax.

## Rounded Shadows

Combining border-radius with shadows yields more natural card-like visuals.

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

`border-radius` supports separate horizontal and vertical radii using `/`. The `barrel-rounded` example demonstrates this elliptical effect.

## Embossed Shadows

Combining `inset` shadows with regular box shadows simulates embossed or debossed button effects.

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

How it works: an `inset` highlight on the top edge combined with an `inset` darken on the bottom edge, plus a subtle drop shadow, creates the illusion of raised or indented surfaces.

## References

- [box-shadow | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/box-shadow)
- [Basic Ready to Use CSS Styles | Tympanus](http://tympanus.net/Tutorials/BasicReadyToUseCSSStyles/)
- [Box-shadow generator | MDN](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Backgrounds_and_Borders/Box-shadow_generator)
