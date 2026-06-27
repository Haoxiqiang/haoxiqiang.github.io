---
title: "Design Patterns"
date: 2015-03-30 10:08:26
slug: "DesignPatterns"
author: "haoxiqiang"
tags: ["java", "design-patterns"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

设计模式(Design Patterns)是面向对象设计中针对常见问题的可复用解决方案。1994 年由 GoF (Gang of Four: Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides) 在 *Design Patterns: Elements of Reusable Object-Oriented Software* 一书中系统总结,共 23 种经典模式。

本文整理自 [smallnest](https://github.com/smallnest) 的博客文章,以及 StackOverflow 上关于 GoF 设计模式在 Java API 中应用实例的讨论。

![javagofdesignpatterns](/images/javagofdesignpatterns.png)

[查看PDF概览图](../source/pdf/design-pattern-scard.pdf)

<!--more-->

> 设计模式不是代码库,而是解决问题的"思路框架"。理解模式的关键在于知道 **"何时使用"** 而非 **"如何实现"**。

---

## 创建型模式 (Creational Patterns)

创建型模式抽象了对象的实例化过程,使系统与如何创建、组合和表示对象相独立。

### 抽象工厂 (Abstract Factory)

**识别方式**:创建方法返回工厂本身,该工厂可进一步用于创建其他抽象/接口类型。

**Java API 示例**:

- `javax.xml.parsers.DocumentBuilderFactory#newInstance()`
- `javax.xml.transform.TransformerFactory#newInstance()`
- `javax.xml.xpath.XPathFactory#newInstance()`

### 建造者模式 (Builder)

**识别方式**:创建方法返回实例本身,支持链式调用。

**Java API 示例**:

- `java.lang.StringBuilder#append()` (非线程安全)
- `java.lang.StringBuffer#append()` (线程安全)
- `java.nio.ByteBuffer#put()` (以及 CharBuffer、ShortBuffer、IntBuffer、LongBuffer、FloatBuffer、DoubleBuffer)
- `javax.swing.GroupLayout.Group#addComponent()`
- 所有实现了 `java.lang.Appendable` 的类

### 工厂方法 (Factory Method)

**识别方式**:创建方法返回某个抽象/接口类型的实现(非工厂本身)。

**Java API 示例**:

- `java.util.Calendar#getInstance()`
- `java.util.ResourceBundle#getBundle()`
- `java.text.NumberFormat#getInstance()`
- `java.nio.charset.Charset#forName()`
- `java.net.URLStreamHandlerFactory#createURLStreamHandler(String)` (每个协议返回单例)

### 原型模式 (Prototype)

**识别方式**:创建方法返回自身的一个新实例,属性与原实例相同。

**Java API 示例**:

- `java.lang.Object#clone()` (类需实现 `java.lang.Cloneable`)

### 单例模式 (Singleton)

**识别方式**:创建方法每次返回同一个实例。

**Java API 示例**:

- `java.lang.Runtime#getRuntime()`
- `java.awt.Desktop#getDesktop()`

---

## 结构型模式 (Structural Patterns)

结构型模式关注类和对象的组合方式,以形成更大的结构。

### 适配器模式 (Adapter)

**识别方式**:创建方法接收一个不同抽象/接口类型的实例,返回包装/覆盖了该实例的当前抽象/接口类型的实现。

**Java API 示例**:

- `java.util.Arrays#asList()`
- `java.io.InputStreamReader(InputStream)` (返回 Reader)
- `java.io.OutputStreamWriter(OutputStream)` (返回 Writer)
- `javax.xml.bind.annotation.adapters.XmlAdapter#marshal()` 和 `#unmarshal()`

### 桥接模式 (Bridge)

**识别方式**:创建方法接收一个不同抽象/接口类型的实例,返回使用/委托该实例的当前抽象/接口类型的实现。

**Java API 示例**:

JDBC、JNDI、JCE 等 API 是桥接模式的典型应用。——尚未找到直接的 JDK 类示例。`java.util.Collections#newSetFromMap()` 和 `singletonXXX()` 方法较为接近。

### 组合模式 (Composite)

**识别方式**:行为方法接收相同抽象/接口类型的实例以形成树形结构。

**Java API 示例**:

- `java.awt.Container#add(Component)` (Swing 中随处可见)
- `javax.faces.component.UIComponent#getChildren()` (JSF 中随处可见)

### 装饰器模式 (Decorator)

**识别方式**:创建方法接收相同抽象/接口类型的实例并添加额外行为。

**Java API 示例**:

- `java.io.InputStream`、`OutputStream`、`Reader`、`Writer` 的所有子类均有接收同类型实例的构造方法
- `java.util.Collections` 的 `checkedXXX()`、`synchronizedXXX()`、`unmodifiableXXX()` 方法
- `javax.servlet.http.HttpServletRequestWrapper` 和 `HttpServletResponseWrapper`

### 外观模式 (Facade)

**识别方式**:行为方法内部使用多个不同的独立抽象/接口类型的实例。

**Java API 示例**:

- `javax.faces.context.FacesContext` — 内部使用 `LifeCycle`、`ViewHandler`、`NavigationHandler` 等多个抽象类型
- `javax.faces.context.ExternalContext` — 内部使用 `ServletContext`、`HttpSession`、`HttpServletRequest` 等

### 享元模式 (Flyweight)

**识别方式**:创建方法返回缓存实例,类似"多例"模式。

**Java API 示例**:

- `java.lang.Integer#valueOf(int)` (Boolean、Byte、Character、Short、Long 同理)
- 字符串常量池

### 代理模式 (Proxy)

**识别方式**:创建方法返回给定抽象/接口类型的实现,该实现内部委托/使用另一个实现。

**Java API 示例**:

- `java.lang.reflect.Proxy`
- `java.rmi.*` 全部 API

---

## 行为型模式 (Behavioral Patterns)

行为型模式关注对象之间的责任分配和算法交互。

### 责任链模式 (Chain of Responsibility)

**识别方式**:行为方法(间接)在队列中调用另一个同类型实现的相同方法。

**Java API 示例**:

- `java.util.logging.Logger#log()`
- `javax.servlet.Filter#doFilter()`

### 命令模式 (Command)

**识别方式**:抽象/接口类型中的行为方法,调用在创建时被封装到命令实现中的另一个类型的方法。

**Java API 示例**:

- 所有实现了 `java.lang.Runnable` 的类
- 所有实现了 `javax.swing.Action` 的类

### 解释器模式 (Interpreter)

**识别方式**:行为方法返回与给定实例/类型结构不同的实例/类型。

**Java API 示例**:

- `java.util.Pattern`
- `java.text.Normalizer`
- `java.text.Format` 的所有子类
- `javax.el.ELResolver` 的所有子类

### 迭代器模式 (Iterator)

**识别方式**:行为方法按顺序从队列中返回另一种类型的实例。

**Java API 示例**:

- 所有实现了 `java.util.Iterator` 的类
- 所有实现了 `java.util.Enumeration` 的类

### 中介者模式 (Mediator)

**识别方式**:行为方法接收一个(通常使用命令模式封装的)抽象/接口类型的实例,并委托/使用该实例。

**Java API 示例**:

- `java.util.Timer` (所有 `scheduleXXX()` 方法)
- `java.util.concurrent.Executor#execute()`
- `java.util.concurrent.ExecutorService` (invokeXXX() 和 submit() 方法)
- `java.util.concurrent.ScheduledExecutorService` (所有 scheduleXXX() 方法)
- `java.lang.reflect.Method#invoke()`

### 备忘录模式 (Memento)

**识别方式**:行为方法内部改变整个实例的状态。

**Java API 示例**:

- `java.util.Date` (setter 方法改变内部 long 值)
- 所有实现了 `java.io.Serializable` 的类
- 所有实现了 `javax.faces.component.StateHolder` 的类

### 观察者模式 (Observer / Publish-Subscribe)

**识别方式**:行为方法根据自身状态调用另一个抽象/接口类型实例的方法。

**Java API 示例**:

- `java.util.Observer` / `java.util.Observable` (实际使用较少)
- 所有实现了 `java.util.EventListener` 的类
- `javax.servlet.http.HttpSessionBindingListener`
- `javax.servlet.http.HttpSessionAttributeListener`
- `javax.faces.event.PhaseListener`

### 状态模式 (State)

**识别方式**:行为方法根据实例的状态改变其行为,且状态可被外部控制。

**Java API 示例**:

- `javax.faces.lifecycle.LifeCycle#execute()` (行为取决于当前 JSF 生命周期阶段)

### 策略模式 (Strategy)

**识别方式**:抽象/接口类型中的行为方法调用了另一抽象/接口类型实例的方法,该实例作为参数传入策略实现。

**Java API 示例**:

- `java.util.Comparator#compare()` (被 `Collections#sort()` 调用)
- `javax.servlet.http.HttpServlet` 的 `service()` 及所有 `doXXX()` 方法
- `javax.servlet.Filter#doFilter()`

### 模板方法模式 (Template Method)

**识别方式**:抽象类型中已经定义了"默认"行为的行为方法。

**Java API 示例**:

- `java.io.InputStream`、`OutputStream`、`Reader`、`Writer` 的所有非抽象方法
- `java.util.AbstractList`、`AbstractSet`、`AbstractMap` 的所有非抽象方法
- `javax.servlet.http.HttpServlet` 的所有 `doXXX()` 方法默认返回 HTTP 405 错误

### 访问者模式 (Visitor)

**识别方式**:两个不同的抽象/接口类型各自定义了接收对方类型的方法,一方调用另一方的方法执行策略。

**Java API 示例**:

- `javax.lang.model.element.AnnotationValue` 和 `AnnotationValueVisitor`
- `javax.lang.model.element.Element` 和 `ElementVisitor`
- `javax.lang.model.type.TypeMirror` 和 `TypeVisitor`

---

## 参考

- 原文: [smallnest/设计模式速查表](http://colobu.com/2014/09/05/design-pattern-cheatsheet/)
- *Design Patterns: Elements of Reusable Object-Oriented Software* — GoF 著
- [CMU 课程: "23 Patterns in 80 Minutes" by Josh Bloch](http://www.cs.cmu.edu/~charlie/courses/17-214/2021-spring/slides/20210504-all-the-gof-patterns.pdf)
- [GoF 设计模式 Java 示例 — Alibaba Cloud](https://developer.aliyun.com/article/347735)
- [Java Design Patterns — Wikipedia](https://en.wikipedia.org/wiki/Design_Patterns)
