---
layout: post
title:  CSS Box Shadows
date:   2014-12-26 23:35:07
author: 郝锡强
categories: blog
letex: false
tags: [css]
---
## Directional Box Shadows
<style>
.block-level {
	width:8em;
    height: 8em;
    color: #fff;
    margin: 0.0em 1em;
    text-align:center;
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
<!-- more -->
{% highlight css%}
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
{% endhighlight %}
## Emphesized Box Shadows
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
{% highlight css%}
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
{% endhighlight %}
## Gradients
<style>
div[class*="gradient"]{
    background-color: #DEB8A0;
    box-shadow: 0 0 0 1px #a27b62;
}
.gradient-light-linear {
    background-image: -webkit-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: -moz-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: -o-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: -ms-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
}
.gradient-dark-linear {
    background-image: -webkit-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: -moz-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: -o-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: -ms-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
}
.gradient-light-radial {
    background-image: -webkit-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: -moz-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: -o-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: -ms-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
}
.gradient-dark-radial {
    background-image: -webkit-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: -moz-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: -o-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: -ms-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
}
</style>
<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-light-linear">Light Linear</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-dark-linear">Dark Linear</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-light-radial">Light Radial</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level gradient-dark-radial">Dark Radial</div></div>
</div>
{% highlight css%}
.gradient-light-linear {
    background-image: -webkit-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: -moz-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: -o-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: -ms-linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
    background-image: linear-gradient(rgba(255,255,255,.5), rgba(255,255,255,0));
}
.gradient-dark-linear {
    background-image: -webkit-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: -moz-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: -o-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: -ms-linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
    background-image: linear-gradient(rgba(0,0,0,.25), rgba(0,0,0,0));
}
.gradient-light-radial {
    background-image: -webkit-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: -moz-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: -o-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: -ms-radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
    background-image: radial-gradient(center 0, circle farthest-corner, rgba(255,255,255,0.4), rgba(255,255,255,0));
}
.gradient-dark-radial {
    background-image: -webkit-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: -moz-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: -o-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: -ms-radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
    background-image: radial-gradient(center 0, circle farthest-corner, rgba(0,0,0,0.15), rgba(0,0,0,0));
}
{% endhighlight %}
## Rounded Borders
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
{% highlight css%}
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
{% endhighlight %}
## Embossed Box Shadows
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
}</style>
<div class="pure-g" >
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level embossed-light">Light</div></div>
<div class="pure-u-sm-1-4 pure-u-1-2"><div class="block-level embossed-heavy">Heavy</div></div>
</div>
{% highlight css%}
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
{% endhighlight %}


>引用<br />
[BasicReadyToUseCSSStyles](http://tympanus.net/Tutorials/BasicReadyToUseCSSStyles/#)