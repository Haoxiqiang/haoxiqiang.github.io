---
layout: post
title:  Java 8的Lambda表达式
date:   2014-12-07 15:35:07
author: 郝锡强
categories: blog
letex: false
tags: [java]
---
啥是`Lambda`表达式?写个最简单的看看:

{% highlight java%}
Runnable runnable1 = new Runnable() {	
	@Override
	public void run() {
		System.out.println("runnable1 start!!!");
	}
};
Runnable runnable2 = () -> System.out.println("runnable2 start!!!");
runnable1.run();
runnable2.run();
{% endhighlight %}
这个是一个无参数无返回值的例子,可以直接写成`()->expression`
<!-- more -->
{% highlight java%}
JButton testButton = new JButton("Test Button");
testButton.addActionListener(new ActionListener() {
	@Override
	public void actionPerformed(ActionEvent ae) {
		System.out.println("Click Detected by Anon Class");
	}
});
testButton.addActionListener(e -> System.out
		.println("Click Detected by Lambda Listner"));
{% endhighlight %}
这个是一个有参数无返回值的例子,可以直接写成`e->expression`
{% highlight java%}
List<Person> personList = Person.createShortList();
// Sort with Inner Class
Collections.sort(personList, new Comparator<Person>(){
  public int compare(Person p1, Person p2){
    return p1.getSurName().compareTo(p2.getSurName());
  }
});
// Use Lambda instead
Collections.sort(personList, (Person p1, Person p2) -> p1.getSurName().compareTo(p2.getSurName()));
{% endhighlight %}
这个是一个有参数有返回值的例子,可以直接写成`(p1,p2)->{return expression;}`
当你看到这里,你虽然不明白为什么,但是你确实是会使用了最基本的几种`Lambda`表达式的用法,我们先不管`Lambda`的优劣,只是研究一下它的特点.

>参考<br />
[Lambda-QuickStart](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/Lambda-QuickStart/index.html)