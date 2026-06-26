---
title: "Design Patterns"
date: 2015-03-30 10:08:26
author: "haoxiqiang"
tags: ["java", "design-patterns"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

Design Patterns are reusable solutions to common problems in object-oriented design. The 23 classic patterns were systematized by the Gang of Four (GoF: Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides) in their 1994 book *Design Patterns: Elements of Reusable Object-Oriented Software*.

This article is compiled from a blog post by [smallnest](https://github.com/smallnest) and a StackOverflow discussion on GoF design pattern implementations in the Java API.

![javagofdesignpatterns](/images/javagofdesignpatterns.png)

[View PDF Overview](../source/pdf/design-pattern-scard.pdf)

<!--more-->

> Design patterns are not code libraries — they are conceptual frameworks for solving problems. The key is understanding **when** to use a pattern, not just **how** to implement it.

---

## Creational Patterns

Creational patterns abstract the instantiation process, making a system independent of how its objects are created, composed, and represented.

### Abstract Factory

**Recognizable by**: creational methods returning the factory itself, which in turn creates another abstract/interface type.

**Java API Examples**:

- `javax.xml.parsers.DocumentBuilderFactory#newInstance()`
- `javax.xml.transform.TransformerFactory#newInstance()`
- `javax.xml.xpath.XPathFactory#newInstance()`

### Builder

**Recognizable by**: creational methods returning the instance itself (fluent API).

**Java API Examples**:

- `java.lang.StringBuilder#append()` (unsynchronized)
- `java.lang.StringBuffer#append()` (synchronized)
- `java.nio.ByteBuffer#put()` (also CharBuffer, ShortBuffer, IntBuffer, LongBuffer, FloatBuffer, DoubleBuffer)
- `javax.swing.GroupLayout.Group#addComponent()`
- All implementations of `java.lang.Appendable`

### Factory Method

**Recognizable by**: creational methods returning an implementation of an abstract/interface type.

**Java API Examples**:

- `java.util.Calendar#getInstance()`
- `java.util.ResourceBundle#getBundle()`
- `java.text.NumberFormat#getInstance()`
- `java.nio.charset.Charset#forName()`
- `java.net.URLStreamHandlerFactory#createURLStreamHandler(String)` (returns singleton per protocol)

### Prototype

**Recognizable by**: creational methods returning a different instance of itself with the same properties.

**Java API Examples**:

- `java.lang.Object#clone()` (class must implement `java.lang.Cloneable`)

### Singleton

**Recognizable by**: creational methods returning the same instance every time.

**Java API Examples**:

- `java.lang.Runtime#getRuntime()`
- `java.awt.Desktop#getDesktop()`

---

## Structural Patterns

Structural patterns focus on how classes and objects are composed to form larger structures.

### Adapter

**Recognizable by**: creational methods taking an instance of a different abstract/interface type and returning an implementation of own/another abstract/interface type that decorates/overrides the given instance.

**Java API Examples**:

- `java.util.Arrays#asList()`
- `java.io.InputStreamReader(InputStream)` (returns a Reader)
- `java.io.OutputStreamWriter(OutputStream)` (returns a Writer)
- `javax.xml.bind.annotation.adapters.XmlAdapter#marshal()` and `#unmarshal()`

### Bridge

**Recognizable by**: creational methods taking an instance of a different abstract/interface type and returning an implementation that delegates/uses the given instance.

**Java API Examples**:

JDBC, JNDI, JCE are the classic examples. No direct JDK class comes to mind. `java.util.Collections#newSetFromMap()` and `singletonXXX()` methods come close.

### Composite

**Recognizable by**: behavioral methods taking an instance of the same abstract/interface type into a tree structure.

**Java API Examples**:

- `java.awt.Container#add(Component)` (all over Swing)
- `javax.faces.component.UIComponent#getChildren()` (all over JSF)

### Decorator

**Recognizable by**: creational methods taking an instance of the same abstract/interface type and adding additional behavior.

**Java API Examples**:

- All subclasses of `java.io.InputStream`, `OutputStream`, `Reader`, `Writer` have constructors taking the same type
- `java.util.Collections` checkedXXX(), synchronizedXXX(), unmodifiableXXX() methods
- `javax.servlet.http.HttpServletRequestWrapper` and `HttpServletResponseWrapper`

### Facade

**Recognizable by**: behavioral methods that internally use instances of different independent abstract/interface types.

**Java API Examples**:

- `javax.faces.context.FacesContext` — internally uses LifeCycle, ViewHandler, NavigationHandler, etc.
- `javax.faces.context.ExternalContext` — internally uses ServletContext, HttpSession, HttpServletRequest, etc.

### Flyweight

**Recognizable by**: creational methods returning a cached instance (the "multiton" idea).

**Java API Examples**:

- `java.lang.Integer#valueOf(int)` (also Boolean, Byte, Character, Short, Long)
- String constant pool

### Proxy

**Recognizable by**: creational methods returning an implementation that delegates/uses a different implementation.

**Java API Examples**:

- `java.lang.reflect.Proxy`
- `java.rmi.*` — the entire API

---

## Behavioral Patterns

Behavioral patterns focus on how objects distribute responsibilities and interact.

### Chain of Responsibility

**Recognizable by**: behavioral methods that (indirectly) invoke the same method in another implementation of the same type in a queue.

**Java API Examples**:

- `java.util.logging.Logger#log()`
- `javax.servlet.Filter#doFilter()`

### Command

**Recognizable by**: behavioral methods in an abstract/interface type that invoke a method in a different type, encapsulated during creation.

**Java API Examples**:

- All implementations of `java.lang.Runnable`
- All implementations of `javax.swing.Action`

### Interpreter

**Recognizable by**: behavioral methods returning a structurally different instance/type of the given instance/type.

**Java API Examples**:

- `java.util.Pattern`
- `java.text.Normalizer`
- All subclasses of `java.text.Format`
- All subclasses of `javax.el.ELResolver`

### Iterator

**Recognizable by**: behavioral methods sequentially returning instances of a different type from a queue.

**Java API Examples**:

- All implementations of `java.util.Iterator`
- All implementations of `java.util.Enumeration`

### Mediator

**Recognizable by**: behavioral methods taking an instance of a different abstract/interface type and delegating/using it.

**Java API Examples**:

- `java.util.Timer` (all scheduleXXX() methods)
- `java.util.concurrent.Executor#execute()`
- `java.util.concurrent.ExecutorService` (invokeXXX() and submit() methods)
- `java.util.concurrent.ScheduledExecutorService` (all scheduleXXX() methods)
- `java.lang.reflect.Method#invoke()`

### Memento

**Recognizable by**: behavioral methods that internally change the state of the whole instance.

**Java API Examples**:

- `java.util.Date` (setters change the internal long value)
- All implementations of `java.io.Serializable`
- All implementations of `javax.faces.component.StateHolder`

### Observer (Publish/Subscribe)

**Recognizable by**: behavioral methods that invoke a method on another abstract/interface type instance, depending on own state.

**Java API Examples**:

- `java.util.Observer` / `java.util.Observable` (rarely used in practice)
- All implementations of `java.util.EventListener` (all over Swing)
- `javax.servlet.http.HttpSessionBindingListener`
- `javax.servlet.http.HttpSessionAttributeListener`
- `javax.faces.event.PhaseListener`

### State

**Recognizable by**: behavioral methods that change behavior depending on the instance's state, which can be controlled externally.

**Java API Examples**:

- `javax.faces.lifecycle.LifeCycle#execute()` (behavior depends on the current JSF lifecycle phase)

### Strategy

**Recognizable by**: behavioral methods in an abstract/interface type that invoke a method in a different abstract/interface type passed in as a method argument.

**Java API Examples**:

- `java.util.Comparator#compare()` (executed by `Collections#sort()`)
- `javax.servlet.http.HttpServlet` — service() and all doXXX() methods
- `javax.servlet.Filter#doFilter()`

### Template Method

**Recognizable by**: behavioral methods in an abstract type that already have a "default" behavior defined.

**Java API Examples**:

- All non-abstract methods of `java.io.InputStream`, `OutputStream`, `Reader`, `Writer`
- All non-abstract methods of `java.util.AbstractList`, `AbstractSet`, `AbstractMap`
- `javax.servlet.http.HttpServlet` — all doXXX() methods default to HTTP 405

### Visitor

**Recognizable by**: two different abstract/interface types that each have methods taking the other type; one calls the other's method to execute the desired strategy.

**Java API Examples**:

- `javax.lang.model.element.AnnotationValue` and `AnnotationValueVisitor`
- `javax.lang.model.element.Element` and `ElementVisitor`
- `javax.lang.model.type.TypeMirror` and `TypeVisitor`

---

## References

- Original post: [smallnest/Design Patterns Cheatsheet](http://colobu.com/2014/09/05/design-pattern-cheatsheet/)
- *Design Patterns: Elements of Reusable Object-Oriented Software* — GoF
- [CMU Course: "23 Patterns in 80 Minutes" by Josh Bloch](http://www.cs.cmu.edu/~charlie/courses/17-214/2021-spring/slides/20210504-all-the-gof-patterns.pdf)
- [GoF Design Patterns in Java — Alibaba Cloud](https://developer.aliyun.com/article/347735)
- [Java Design Patterns — Wikipedia](https://en.wikipedia.org/wiki/Design_Patterns)
