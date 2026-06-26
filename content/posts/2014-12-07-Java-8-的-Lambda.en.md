---
title: "Lambda Expressions in Java 8"
date: 2014-12-07 15:35:07
author: "haoxiqiang"
tags: ["java"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

## What is a Lambda Expression?

Lambda expressions are a core feature introduced in Java 8, enabling more concise code. Here is the most straightforward example:

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

Both blocks are equivalent, but the lambda version is a single line. The basic form is `() -> expression` or `() -> { statements; }`.

<!--more-->

## With Parameters, No Return Value

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

Parentheses can be omitted for single parameters: `e -> expression`.

## With Parameters and Return Value

```java
List<Person> personList = Person.createShortList();

// Anonymous inner class
Collections.sort(personList, new Comparator<Person>() {
    public int compare(Person p1, Person p2) {
        return p1.getSurName().compareTo(p2.getSurName());
    }
});

// Lambda version
Collections.sort(personList,
    (Person p1, Person p2) -> p1.getSurName().compareTo(p2.getSurName()));
```

For multiple parameters with a return value: `(p1, p2) -> { return expression; }`. Parameter types can be omitted when inferable.

## @FunctionalInterface

An interface with a single abstract method is treated as a functional interface by Java 8, even without the `@FunctionalInterface` annotation. Adding the annotation makes the intent explicit and triggers a compiler error if the contract is violated.

Common functional interfaces include `Runnable`, `Comparator`, and `ActionListener`.

## Built-in Functional Interfaces

Java 8 provides standard functional interfaces in `java.util.function`:

| Interface | Description |
|-----------|-------------|
| `Predicate<T>` | Takes T, returns boolean |
| `Consumer<T>` | Takes T, returns void |
| `Function<T, R>` | Takes T, returns R |
| `Supplier<T>` | Takes nothing, returns T (factory pattern) |
| `UnaryOperator<T>` | Takes T, returns T (unary operation) |
| `BinaryOperator<T>` | Takes two T, returns T (binary operation) |

## Stream API and Collection Operations

Combined with the Stream API, lambdas enable highly readable data processing:

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

// filter + collect (create new list)
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

## Generic Processing Pipeline

The following example combines `Predicate`, `Function`, and `Consumer` into a generic processing pipeline. Readability decreases with nesting, but understanding each interface's role makes the pattern clear:

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

## References

- [Lambda Expressions (Oracle Official Tutorial)](https://docs.oracle.com/javase/tutorial/java/javaOO/lambdaexpressions.html)
- [Lambda-QuickStart (Oracle OBE)](http://www.oracle.com/webfolder/technetwork/tutorials/obe/java/Lambda-QuickStart/index.html)
- [java.util.function Package (Java SE 8)](https://docs.oracle.com/javase/8/docs/api/java/util/function/package-summary.html)
- [Project Lambda (OpenJDK)](https://openjdk.org/projects/lambda/)
- [Lambda Expressions (JLS 15.27)](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27)
