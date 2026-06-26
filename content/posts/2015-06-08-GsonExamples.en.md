---
title: "Gson User Guide"
date: 2015-06-08 12:37:45
author: "haoxiqiang"
tags: ["java", "gson", "json"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

> This article is compiled from the official Gson User Guide. Gson's performance is competitive with other JSON frameworks, and being Google-maintained makes it a solid choice for Java/Android JSON processing.

Gson is a Java library developed by Google for serializing Java objects to JSON and deserializing JSON strings back to Java objects.

<!--more-->

## Performance and Scalability

Benchmark data from a desktop system (dual opteron, 8GB RAM, 64-bit Ubuntu), reproducible via `PerformanceTest`:

- **Strings**: Deserialization of 25MB+ strings works without issues
- **Large collections**: Serialization of 1.4M objects, deserialization of 87K objects
- Gson 1.4 increased array deserialization limits from 80KB to 11MB

## Basic Usage

### Primitives

```java
// Serialization
Gson gson = new Gson();
gson.toJson(1);            ==> prints 1
gson.toJson("abcd");       ==> prints "abcd"
gson.toJson(new Long(10)); ==> prints 10
int[] values = { 1 };
gson.toJson(values);       ==> prints [1]

// Deserialization
int one = gson.fromJson("1", int.class);
Integer one = gson.fromJson("1", Integer.class);
Long one = gson.fromJson("1", Long.class);
Boolean false = gson.fromJson("false", Boolean.class);
String str = gson.fromJson("\"abc\"", String.class);
String anotherStr = gson.fromJson("[\"abc\"]", String.class);
```

### Object Examples

```java
class BagOfPrimitives {
  private int value1 = 1;
  private String value2 = "abc";
  private transient int value3 = 3;
  BagOfPrimitives() {
    // no-args constructor
  }
}

// Serialization
BagOfPrimitives obj = new BagOfPrimitives();
Gson gson = new Gson();
String json = gson.toJson(obj);
==> json is {"value1":1,"value2":"abc"}

// Deserialization
BagOfPrimitives obj2 = gson.fromJson(json, BagOfPrimitives.class);
==> obj2 is just like obj
```

### Key Points

- `private` fields are recommended
- No annotations needed — all fields in the class and its superclasses are included by default
- `transient` fields are excluded automatically
- `null` handling:
  - During serialization, `null` fields are omitted
  - During deserialization, missing keys result in `null` field values
- `synthetic` fields are excluded
- **Inner, anonymous, and local class references to outer classes are ignored**

## Nested Classes

Gson can serialize/deserialize **static** nested classes easily, but cannot auto-deserialize **non-static** inner classes because their no-arg constructors need an outer class reference.

```java
// NOTE: Class B cannot be correctly serialized by default
public class A {
  public String a;
  class B {
    public String b;
    public B() { }
  }
}
```

Solutions:
1. Define B as `static class B`
2. Provide a custom InstanceCreator (works but not recommended)

## Arrays

```java
Gson gson = new Gson();
int[] ints = {1, 2, 3, 4, 5};
String[] strings = {"abc", "def", "ghi"};

// Serialization
gson.toJson(ints);     ==> prints [1,2,3,4,5]
gson.toJson(strings);  ==> prints ["abc", "def", "ghi"]

// Deserialization
int[] ints2 = gson.fromJson("[1,2,3,4,5]", int[].class);
```

Multi-dimensional arrays are also supported.

## Collections

```java
Gson gson = new Gson();
Collection<Integer> ints = Lists.immutableList(1,2,3,4,5);

String json = gson.toJson(ints); ==> json is [1,2,3,4,5]

Type collectionType = new TypeToken<Collection<Integer>>(){}.getType();
Collection<Integer> ints2 = gson.fromJson(json, collectionType);
```

> Note: Java's type erasure requires `TypeToken` to specify generic types for deserialization.

## Generics

Type erasure causes loss of generic type information:

```java
class Foo<T> {
  T value;
}

Gson gson = new Gson();
Foo<Bar> foo = new Foo<Bar>();
gson.toJson(foo);              // May not serialize foo.value correctly
gson.fromJson(json, foo.getClass()); // Cannot deserialize to Bar
```

Use `TypeToken`:

```java
Type fooType = new TypeToken<Foo<Bar>>() {}.getType();
gson.toJson(foo, fooType);
gson.fromJson(json, fooType);
```

## Mixed Type Collections

For `['hello', 5, {name: 'GREETINGS', source: 'guest'}]`:

Three approaches:
1. **Recommended**: Parse each element individually using `JsonParser`
2. Register a type adapter for `Collection.class`
3. Use `Collection<MyCollectionMemberType>` with a registered adapter

## Built-in Type Support

Gson provides built-in serializers/deserializers for `java.net.URL`, `java.net.URI`, plus Joda-Time types (DateTime, Instant) via custom converters.

## Custom Serialization/Deserialization

```java
GsonBuilder gson = new GsonBuilder();
gson.registerTypeAdapter(MyType2.class, new MyTypeAdapter());
gson.registerTypeAdapter(MyType.class, new MySerializer());
gson.registerTypeAdapter(MyType.class, new MyDeserializer());
gson.registerTypeAdapter(MyType.class, new MyInstanceCreator());
```

## Pretty Printing

Default output is compact. For readable formatting:

```java
Gson gson = new GsonBuilder().setPrettyPrinting().create();
String jsonOutput = gson.toJson(someObject);
```

## Null Object Support

By default, null fields are omitted. To include them:

```java
Gson gson = new GsonBuilder().serializeNulls().create();
```

## Versioning

Use `@Since` annotation for versioned field control:

```java
Gson gson = new GsonBuilder().setVersion(1.0).create();
```

## Field Exclusion

Built-in mechanisms:
- **Modifier-based**: Exclude `transient` and `static` by default
- **@Expose annotation**: Whitelist fields for serialization
- **Custom ExclusionStrategy**: Full programmatic control

## Field Naming

Use `@SerializedName` for custom field names, or `FieldNamingPolicy` for global naming conventions.

---

## References

- [Gson GitHub Repository](https://github.com/google/gson)
- [Gson User Guide](https://github.com/google/gson/blob/master/UserGuide.md)
- [Gson API Javadoc](https://www.javadoc.io/doc/com.google.code.gson/gson)
- [Joda-Time](http://www.joda.org/joda-time/)
