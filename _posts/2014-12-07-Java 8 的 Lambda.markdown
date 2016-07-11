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

{% highlight java %}
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
{% highlight java %}
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
{% highlight java %}
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
当你看到这里,你虽然不明白为什么,但是你确实是会使用了最基本的几种`Predicate` `Lambda`表达式的用法,我们先不管`Lambda`的优劣,只是研究一下它的特点.如果你自己定义了一个接口你可以使用`@FunctionalInterface`来声明,但是不管声明不声明,`java 8`都会默认看做是函数式接口

Java 8 提供了多种类型的`function`

* Predicate: A property of the object passed as argument
* Consumer: An action to be performed with the object passed as argument
* Function: Transform a T to a U
* Supplier: Provide an instance of a T (such as a factory)
* UnaryOperator: A unary operator from T -> T
* BinaryOperator: A binary operator from (T, T) -> T

如果是集合,遍历的时候可以选择使用`forEach`

{% highlight java %}
List<Person> pl = Person.createShortList();
pl.forEach( p -> p.printWesternName() );
pl.forEach(Person::printEasternName);
pl.forEach(p -> { System.out.println(p.printCustom(r -> "Name: " + r.getGivenName())); });
pl.stream().filter(p->p.getAge()>16)
  .forEach(Person::printWesternName);

// Make a new list after filtering.
Predicate<Person> allDraftees = p -> p.getAge() >= 18 && p.getAge() <= 25 && p.getGender() == Gender.MALE;
List<Person> pilotList = pl
        .stream()
        .filter(allDraftees)
        .collect(Collectors.toList());

Predicate<Person> allPilots = p -> p.getAge() >= 23 && p.getAge() <= 65;
long totalAge = pl
        .stream()
        .filter(allPilots)
        .mapToInt(p -> p.getAge())
        .sum();

// Get average of ages
OptionalDouble averageAge = pl
        .parallelStream()
        .filter(allPilots)
        .mapToDouble(p -> p.getAge())
        .average();
{% endhighlight %}

接下来的混合使用,我没弄太明白,这种扩展了很多层的,看起来就头晕啊...
{% highlight java %}
public static <X, Y> void processElements(
    Iterable<X> source,
    Predicate<X> tester,
    Function <X, Y> mapper,
    Consumer<Y> block) {
    for (X p : source) {
        if (tester.test(p)) {
            Y data = mapper.apply(p);
            block.accept(data);
        }
    }
}
{% endhighlight %}

>参考<br />
[Lambda-QuickStart](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/Lambda-QuickStart/index.html)<br />
[LambdaExpressions](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)<br />
[LambdaExpressions性能影响](/source/pdf/jvmls2013kuksen-2014088.pdf)
