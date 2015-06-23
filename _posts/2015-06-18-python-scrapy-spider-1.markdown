---
layout: post
title:  Python Scrapy Spider(1)
date:   2015-06-18 14:54:46
author: 郝锡强
categories: blog
letex: false
tags: [python]
---
[Scrapy Tutorial](http://doc.scrapy.org/en/latest/intro/tutorial.html#creating-a-project)
[Scrapy入门教程](http://scrapy-chs.readthedocs.org/zh_CN/latest/intro/tutorial.html)

基本的安装之类的对着教程做吧,我记录我的一个简单的爬虫程序

<!-- more -->

## First

* scrapy startproject jcodecraeer
* 编辑items.py
{% highlight python%}
import scrapy
class JcodecraeerItem(scrapy.Item):
    # define the fields for your item here like:
    # name = scrapy.Field()
    title = scrapy.Field()
    link = scrapy.Field()
    desc = scrapy.Field()
    pass
{% endhighlight %}	
	
## Crawling

* scrapy crawl jcodecraeer 
* scrapy crawl jcodecraeer -o items.json

## Scrapy选择器

* scrapy shell "http://www.jikexueyuan.com/course/"

