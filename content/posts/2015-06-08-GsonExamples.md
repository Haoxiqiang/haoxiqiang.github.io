---
title: "Gson 使用指南"
date: 2015-06-08 12:37:45
slug: "GsonExamples"
author: "haoxiqiang"
tags: ["java", "gson", "json"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

> 本文基于 Gson 官方用户指南整理而成。相对于其他 JSON 框架，Gson 的性能并不逊色，加上 Google 官方维护的背景，成为 Java/Android 项目中处理 JSON 的首选。以下是对官方文档的全面梳理和备忘。

Gson 是 Google 开发的 Java 库，用于将 Java 对象序列化为 JSON 表示，以及将 JSON 字符串反序列化为 Java 对象。

<!--more-->

## 性能和可伸缩性

以下数据来自桌面系统（dual opteron, 8GB RAM, 64-bit Ubuntu），可通过 `PerformanceTest` 复现：

- **strings**：超过 25MB 的字符串反序列化没有问题
- **Large collections**：序列化 140 万对象的集合，反序列化 87000 对象的集合
- Gson 1.4 将数组的反序列化限制从 80KB 提升到了 11MB

## 基础用法

### 基本类型

```java
// 序列化
Gson gson = new Gson();
gson.toJson(1);            ==> prints 1
gson.toJson("abcd");       ==> prints "abcd"
gson.toJson(new Long(10)); ==> prints 10
int[] values = { 1 };
gson.toJson(values);       ==> prints [1]

// 反序列化
int one = gson.fromJson("1", int.class);
Integer one = gson.fromJson("1", Integer.class);
Long one = gson.fromJson("1", Long.class);
Boolean false = gson.fromJson("false", Boolean.class);
String str = gson.fromJson("\"abc\"", String.class);
String anotherStr = gson.fromJson("[\"abc\"]", String.class);
```

### 对象示例

```java
class BagOfPrimitives {
  private int value1 = 1;
  private String value2 = "abc";
  private transient int value3 = 3;
  BagOfPrimitives() {
    // no-args constructor
  }
}

// 序列化
BagOfPrimitives obj = new BagOfPrimitives();
Gson gson = new Gson();
String json = gson.toJson(obj);
==> json is {"value1":1,"value2":"abc"}

// 反序列化
BagOfPrimitives obj2 = gson.fromJson(json, BagOfPrimitives.class);
==> obj2 is just like obj
```

### 要点

- 推荐使用 `private` 字段
- 不需要注解来标记序列化字段，当前类及其所有父类的字段都会默认序列化
- `transient` 字段会被自动忽略
- `null` 处理：
  - 序列化时，`null` 字段会被跳过
  - 反序列化时，JSON 中缺失的键对应的字段值会被设为 `null`
- `synthetic`（合成）字段不会被序列化
- **内部类、匿名类和局部类的外部类引用字段会被忽略**，不会参与序列化和反序列化

## 嵌套类

Gson 可以轻松序列化/反序列化**静态**嵌套类，但无法自动反序列化**非静态**内部类，因为其无参构造函数需要外部类引用，在反序列化时无法提供。

```java
// NOTE: 这个 class B 默认不会被 Gson 正确序列化
public class A {
  public String a;
  class B {
    public String b;
    public B() {
      // No args constructor for B
    }
  }
}
```

Gson 无法反序列化 `{"b":"abc"}` 因为 class B 是内部类。两种解决方案：

1. 将 B 定义为 `static class B`
2. 自定义 InstanceCreator：

```java
// 可行但不推荐
public class InstanceCreatorForB implements InstanceCreator<A.B> {
  private final A a;
  public InstanceCreatorForB(A a)  {
    this.a = a;
  }
  public A.B createInstance(Type type) {
    return a.new B();
  }
}
```

## 数组

```java
Gson gson = new Gson();
int[] ints = {1, 2, 3, 4, 5};
String[] strings = {"abc", "def", "ghi"};

// 序列化
gson.toJson(ints);     ==> prints [1,2,3,4,5]
gson.toJson(strings);  ==> prints ["abc", "def", "ghi"]

// 反序列化
int[] ints2 = gson.fromJson("[1,2,3,4,5]", int[].class);
```

Gson 也支持任意复杂元素类型的多维数组。

## 集合

```java
Gson gson = new Gson();
Collection<Integer> ints = Lists.immutableList(1,2,3,4,5);

// 序列化
String json = gson.toJson(ints); ==> json is [1,2,3,4,5]

// 反序列化
Type collectionType = new TypeToken<Collection<Integer>>(){}.getType();
Collection<Integer> ints2 = gson.fromJson(json, collectionType);
```

> 注意：Java 的泛型擦除使得反序列化时必须通过 `TypeToken` 指定具体泛型类型。

### 集合限制

- 可以序列化任意类型的集合，但无法自动反序列化（无法确定元素数据类型）
- 反序列化时，集合必须是具体泛型化的集合

## 泛型

由于 Java 的类型擦除，直接对泛型对象进行序列化/反序列化会丢失类型信息：

```java
class Foo<T> {
  T value;
}

Gson gson = new Gson();
Foo<Bar> foo = new Foo<Bar>();
gson.toJson(foo);              // 可能无法正确序列化 foo.value
gson.fromJson(json, foo.getClass()); // 无法将 foo.value 反序列化为 Bar
```

通过 `TypeToken` 解决：

```java
Type fooType = new TypeToken<Foo<Bar>>() {}.getType();
gson.toJson(foo, fooType);
gson.fromJson(json, fooType);
```

## 混合类型集合

对于 JSON 数组 `['hello', 5, {name: 'GREETINGS', source: 'guest'}]`：

```java
Collection collection = new ArrayList();
collection.add("hello");
collection.add(5);
collection.add(new Event("GREETINGS", "guest"));
```

序列化很简单，但反序列化需要额外操作。三种方法：

1. **推荐**：使用 Gson 的解析 API（JsonParser）逐个解析元素
2. 为 `Collection.class` 注册类型适配器
3. 使用 `Collection<MyCollectionMemberType>` 并注册适配器

使用 JsonParser 的示例：

```java
Gson gson = new Gson();
JsonParser parser = new JsonParser();
JsonArray array = parser.parse(json).getAsJsonArray();
String message = gson.fromJson(array.get(0), String.class);
int number = gson.fromJson(array.get(1), int.class);
Event event = gson.fromJson(array.get(2), Event.class);
```

## 内置类型支持

Gson 内置了以下类型的序列化/反序列化：

- `java.net.URL` — 匹配字符串 `http://code.google.com/p/google-gson/`
- `java.net.URI` — 匹配字符串 `/p/google-gson/`

### Joda-Time 支持

**DateTime**：

```java
private static class DateTimeTypeConverter
    implements JsonSerializer<DateTime>, JsonDeserializer<DateTime> {
  @Override
  public JsonElement serialize(DateTime src, Type srcType,
      JsonSerializationContext context) {
    return new JsonPrimitive(src.toString());
  }

  @Override
  public DateTime deserialize(JsonElement json, Type type,
      JsonDeserializationContext context) throws JsonParseException {
    try {
      return new DateTime(json.getAsString());
    } catch (IllegalArgumentException e) {
      Date date = context.deserialize(json, Date.class);
      return new DateTime(date);
    }
  }
}
```

**Instant**：

```java
private static class InstantTypeConverter
    implements JsonSerializer<Instant>, JsonDeserializer<Instant> {
  @Override
  public JsonElement serialize(Instant src, Type srcType,
      JsonSerializationContext context) {
    return new JsonPrimitive(src.getMillis());
  }
  @Override
  public Instant deserialize(JsonElement json, Type type,
      JsonDeserializationContext context) throws JsonParseException {
    return new Instant(json.getAsLong());
  }
}
```

## 自定义序列化和反序列化

Gson 通过 `GsonBuilder` 注册自定义的序列化器：

```java
GsonBuilder gson = new GsonBuilder();
gson.registerTypeAdapter(MyType2.class, new MyTypeAdapter());
gson.registerTypeAdapter(MyType.class, new MySerializer());
gson.registerTypeAdapter(MyType.class, new MyDeserializer());
gson.registerTypeAdapter(MyType.class, new MyInstanceCreator());
```

`registerTypeAdapter` 会检查适配器是否实现了多个接口，并相应注册。

### 自定义序列化器

```java
private class DateTimeSerializer implements JsonSerializer<DateTime> {
  public JsonElement serialize(DateTime src, Type typeOfSrc,
      JsonSerializationContext context) {
    return new JsonPrimitive(src.toString());
  }
}
```

### 自定义反序列化器

```java
private class DateTimeDeserializer implements JsonDeserializer<DateTime> {
  public DateTime deserialize(JsonElement json, Type typeOfT,
      JsonDeserializationContext context) throws JsonParseException {
    return new DateTime(json.getAsJsonPrimitive().getAsString());
  }
}
```

### 泛型类型的统一处理

如果有一个 `Id<T>` 类，不同泛型参数的序列化方式相同，可以注册一个处理器统一处理所有 Id 类型：

```java
// Gson 支持注册单一处理器处理所有同 raw type 的泛型，
// 也支持为特定泛型注册独立处理器
```

## 实例构造器（Instance Creator）

反序列化时，Gson 需要创建对象实例。如果类没有无参构造方法，就需要提供 InstanceCreator。

```java
private class MoneyInstanceCreator implements InstanceCreator<Money> {
  public Money createInstance(Type type) {
    return new Money("1000000", CurrencyCode.USD);
  }
}
```

### 参数化类型的实例构造

```java
class MyList<T> extends ArrayList<T> { }

class MyListInstanceCreator implements InstanceCreator<MyList<?>> {
  @SuppressWarnings("unchecked")
  public MyList<?> createInstance(Type type) {
    return new MyList();
  }
}
```

对于需要在构造时获取参数化类型信息的场景：

```java
public class Id<T> {
  private final Class<T> classOfId;
  private final long value;
  public Id(Class<T> classOfId, long value) {
    this.classOfId = classOfId;
    this.value = value;
  }
}

class IdInstanceCreator implements InstanceCreator<Id<?>> {
  public Id<?> createInstance(Type type) {
    Type[] typeParameters = ((ParameterizedType)type).getActualTypeArguments();
    Type idType = typeParameters[0];
    return Id.get((Class)idType, 0L);
  }
}
```

## 格式化输出

默认 Gson 输出紧凑格式，无空白字符。需要美化输出时：

```java
Gson gson = new GsonBuilder().setPrettyPrinting().create();
String jsonOutput = gson.toJson(someObject);
```

## NULL 对象处理

默认情况下，Gson 忽略 null 字段。如需序列化 null 值：

```java
Gson gson = new GsonBuilder().serializeNulls().create();

public class Foo {
  private final String s;
  private final int i;
  public Foo() {
    this(null, 5);
  }
  public Foo(String s, int i) {
    this.s = s;
    this.i = i;
  }
}

Foo foo = new Foo();
String json = gson.toJson(foo);
System.out.println(json); // {"s":null,"i":5}
```

## 版本支持

通过 `@Since` 注解支持同一对象的多版本控制：

```java
@Since(1.1) private final String newerField;
@Since(1.0) private final String newField;
private final String field;

VersionedClass versionedObject = new VersionedClass();
Gson gson = new GsonBuilder().setVersion(1.0).create();
String jsonOutput = gson.toJson(someObject);
System.out.println(jsonOutput);
// {"newField":"new","field":"old"}

gson = new Gson();
jsonOutput = gson.toJson(someObject);
System.out.println(jsonOutput);
// {"newerField":"newer","newField":"new","field":"old"}
```

## 字段排除

### Java Modifier 排除

默认排除 `transient` 和 `static` 字段。如需只排除 static：

```java
Gson gson = new GsonBuilder()
    .excludeFieldsWithModifiers(Modifier.STATIC)
    .create();
```

支持多种修饰符组合：

```java
Gson gson = new GsonBuilder()
    .excludeFieldsWithModifiers(Modifier.STATIC, Modifier.TRANSIENT, Modifier.VOLATILE)
    .create();
```

### @Expose 注解

通过 `@Expose` 注解标记需要暴露的字段，未标记的字段被排除：

```java
Gson gson = new GsonBuilder()
    .excludeFieldsWithoutExposeAnnotation()
    .create();
```

### 自定义排除策略

```java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface Foo {
  // Field tag only annotation
}

public class MyExclusionStrategy implements ExclusionStrategy {
  private final Class<?> typeToSkip;

  private MyExclusionStrategy(Class<?> typeToSkip) {
    this.typeToSkip = typeToSkip;
  }

  public boolean shouldSkipClass(Class<?> clazz) {
    return (clazz == typeToSkip);
  }

  public boolean shouldSkipField(FieldAttributes f) {
    return f.getAnnotation(Foo.class) != null;
  }
}

Gson gson = new GsonBuilder()
    .setExclusionStrategies(new MyExclusionStrategy(String.class))
    .serializeNulls()
    .create();
```

## 字段命名

Gson 支持预定义的字段命名策略和 `@SerializedName` 注解：

```java
private class SomeObject {
  @SerializedName("custom_naming") private final String someField;
  private final String someOtherField;
  public SomeObject(String a, String b) {
    this.someField = a;
    this.someOtherField = b;
  }
}

SomeObject someObject = new SomeObject("first", "second");
Gson gson = new GsonBuilder()
    .setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE)
    .create();
String jsonRepresentation = gson.toJson(someObject);
System.out.println(jsonRepresentation);
// {"custom_naming":"first","SomeOtherField":"second"}
```

## 参考资料

- [Gson GitHub 仓库](https://github.com/google/gson)
- [Gson 官方用户指南](https://github.com/google/gson/blob/master/UserGuide.md)
- [Gson API 文档 (Javadoc)](https://www.javadoc.io/doc/com.google.code.gson/gson)
- [Joda-Time](http://www.joda.org/joda-time/)
