---
title: "Java 8 的 Lambda 表达式"
date: 2014-12-07 15:35:07
slug: "Java-8-的-Lambda"
author: "haoxiqiang"
tags: ["java"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

## 什么是 Lambda 表达式？

Lambda 表达式是 Java 8 引入的核心特性，让代码更加简洁。先看一个最直观的例子：

```java
Runnable runnable1 = new Runnable() {
    @Override
    public void run() {
        System.out.println("runnable1 start!!!");
    }
};
Runnable runnable2 = () -> System.out.println("runnable2 start!!!");

runnable1.run();
runnable2.run();
```

两段代码完全等价，但 Lambda 版本只有一行。基本形式为 `() -> expression` 或 `() -> { statements; }`。

<!--more-->

## 有参数无返回值

```java
JButton testButton = new JButton("Test Button");
testButton.addActionListener(new ActionListener() {
    @Override
    public void actionPerformed(ActionEvent ae) {
        System.out.println("Click Detected by Anon Class");
    }
});
testButton.addActionListener(e -> System.out
        .println("Click Detected by Lambda Listner"));
```

单参数时可省略括号，形式为 `e -> expression`。

## 有参数有返回值

```java
List<Person> personList = Person.createShortList();

// 匿名内部类
Collections.sort(personList, new Comparator<Person>() {
    public int compare(Person p1, Person p2) {
        return p1.getSurName().compareTo(p2.getSurName());
    }
});

// Lambda 版本
Collections.sort(personList,
    (Person p1, Person p2) -> p1.getSurName().compareTo(p2.getSurName()));
```

多参数带返回值的 Lambda 可写成 `(p1, p2) -> { return expression; }`。当类型可推断时，参数类型可以省略。

## @FunctionalInterface 与函数式接口

如果一个接口中只有一个抽象方法，即使不加 `@FunctionalInterface` 注解，Java 8 也会将其视为函数式接口。加上注解可以明确意图，并在违反约定时让编译器报错。

常见的函数式接口包括 `Runnable`、`Comparator`、`ActionListener` 等。

## Java 8 内置的函数式接口

Java 8 在 `java.util.function` 包下提供了多种标准函数式接口：

| 接口 | 描述 |
|------|------|
| `Predicate<T>` | 接收参数 T，返回 boolean |
| `Consumer<T>` | 接收参数 T，无返回值 |
| `Function<T, R>` | 接收 T，返回 R |
| `Supplier<T>` | 不接受参数，返回 T（工厂模式） |
| `UnaryOperator<T>` | 接收 T，返回 T（一元操作） |
| `BinaryOperator<T>` | 接收两个 T，返回 T（二元操作） |

## 集合操作与 Stream

结合 Stream API 可以写出非常简洁的数据处理代码：

```java
List<Person> pl = Person.createShortList();

// forEach
pl.forEach(p -> p.printWesternName());
pl.forEach(Person::printEasternName);
pl.forEach(p -> {
    System.out.println(p.printCustom(
        r -> "Name: " + r.getGivenName()));
});

// filter + forEach
pl.stream().filter(p -> p.getAge() > 16)
    .forEach(Person::printWesternName);

// filter + collect（生成新列表）
Predicate<Person> allDraftees =
    p -> p.getAge() >= 18 && p.getAge() <= 25
         && p.getGender() == Gender.MALE;
List<Person> pilotList = pl
    .stream()
    .filter(allDraftees)
    .collect(Collectors.toList());

// mapToInt + sum
Predicate<Person> allPilots =
    p -> p.getAge() >= 23 && p.getAge() <= 65;
long totalAge = pl
    .stream()
    .filter(allPilots)
    .mapToInt(p -> p.getAge())
    .sum();

// parallelStream + average
OptionalDouble averageAge = pl
    .parallelStream()
    .filter(allPilots)
    .mapToDouble(p -> p.getAge())
    .average();
```

## 泛型混合使用

下面这个例子展示了如何将 `Predicate`、`Function` 和 `Consumer` 组合为一个通用的处理管道。可读性随着层级增加而下降，但理解了每个接口的职责后还是可以看懂的：

```java
public static <X, Y> void processElements(
    Iterable<X> source,
    Predicate<X> tester,
    Function<X, Y> mapper,
    Consumer<Y> block) {
    for (X p : source) {
        if (tester.test(p)) {
            Y data = mapper.apply(p);
            block.accept(data);
        }
    }
}
```

## 参考

- [Lambda Expressions (Oracle Official Tutorial)](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
- [Lambda-QuickStart (Oracle OBE)](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/Lambda-QuickStart/index.html)
- [java.util.function Package (Java SE 8)](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
- [Project Lambda (OpenJDK)](https://openjdk.org/projects/lambda/)
- [Lambda Expressions (JLS 15.27)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27)
