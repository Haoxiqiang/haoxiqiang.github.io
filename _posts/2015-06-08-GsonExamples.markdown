---
layout: post
title:  Gson的官方帮助文档
date:   2015-06-08 12:37:45
author: haoxiqiang
categories: blog
tags: [java]

---
不考虑每次都会初始化`GSON`的情况下,`GSON`的性能不会比其他框架低,考虑到`Google`牌的因素决定主要使用`GSON`来操作`JSON`数据,全面的查看一遍文档,作为备忘,E文有些着实不知道如何翻译,贴出来了原文.

<!-- more -->

##GSON性能和可伸缩性

下面是我们在桌面系统获取的一些数据(dual opteron, 8GB RAM, 64-bit Ubuntu),您可以通过使用PerformanceTest重新运行这些测试。

* Strings: 超过25MB的字符串反序列化没有任何问题(see disabled_testStringDeserializationPerformance method in PerformanceTest)
* Large collections: 序列化140万对象的集合(see disabled_testLargeCollectionSerialization method in PerformanceTest),反序列化87000对象的集合 (see disabled_testLargeCollectionDeserialization in PerformanceTest)
* Gson 1.4 数组的反序列化限制从80KB提高到了11MB.

## 最原始的例子
``` java
//(序列化Serialization)
Gson gson = new Gson();
gson.toJson(1);            ==> prints 1
gson.toJson("abcd");       ==> prints "abcd"
gson.toJson(new Long(10)); ==> prints 10
int[] values = { 1 };
gson.toJson(values);       ==> prints [1]

//(反序列化Deserialization)
int one = gson.fromJson("1", int.class);
Integer one = gson.fromJson("1", Integer.class);
Long one = gson.fromJson("1", Long.class);
Boolean false = gson.fromJson("false", Boolean.class);
String str = gson.fromJson("\"abc\"", String.class);
String anotherStr = gson.fromJson("[\"abc\"]", String.class);
```

## 对象的例子
``` java
//类
class BagOfPrimitives {
  private int value1 = 1;
  private String value2 = "abc";
  private transient int value3 = 3;
  BagOfPrimitives() {
    // no-args constructor
  }
}
//(序列化Serialization)
BagOfPrimitives obj = new BagOfPrimitives();
Gson gson = new Gson();
String json = gson.toJson(obj);  
==> json is {"value1":1,"value2":"abc"}
//需要注意的是你不能序列化循环引用的对象,会导致无穷递归
//(反序列化Deserialization)
BagOfPrimitives obj2 = gson.fromJson(json, BagOfPrimitives.class);   
==> obj2 is just like obj
```

### 要点

* 推荐使用`private`字段
* 不需要通过注解来指示一个对象是否包括序列化和反序列化,当前类和他的父类的所有字段都会默认包括在内
* 如果一个变量被标记为`transient`,在序列化和反序列化的过程中会被默认忽略
* 此实现正确的解决`null`
 	*序列化的时候,为`null`的字段会被跳过*
 	*反序列化的时候,没有对应键值的的对象的字段的值会被设置为`null`*
* 如果一个字段是`synthetic`(合成的),那么它不会进行序列化和反序列化
* 对应相当于外部字段的内部类，匿名类和局部类的字段被忽略，并且不包括在序列化和反序列化,我也没有太理解这个是什么意思,下面贴上原文
* Fields corresponding to the outer classes in  inner classes, anonymous classes, and local classes are ignored and not included in serialization or deserialization

## 多个类的嵌套的例子

`GSON`可以很容易地序列化静态嵌套类。`GSON`也可以很容易地反序列化静态嵌套类。
但是`GSON`不能自动反序列化的纯内部类,因为它们的无参构造函数需要引用的对象在反序列化时是无法使用的.你可以通过使用静态内部类或给它提供一个定制的`InstanceCreator`来解决这个问题。下面是一个例子：
``` java
//NOTE: 这个class B在默认情况下不会被`GSON`序列化
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
`GSON`不能反序列化`{"b":"abc"} `,因为`class B`是一个内部类,如果你这么定义B:`static class B`,`GSON`是能反序列化这段字符串的,另外一个办法就是自定一个实例构建方法,下面是一个例子
``` java
//NOTE: 这样可行,但是不推荐
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

## 数组的例子
``` java
Gson gson = new Gson();
int[] ints = {1, 2, 3, 4, 5};
String[] strings = {"abc", "def", "ghi"};
//(序列化Serialization)
gson.toJson(ints);     ==> prints [1,2,3,4,5]
gson.toJson(strings);  ==> prints ["abc", "def", "ghi"]
//(反序列化Deserialization)
int[] ints2 = gson.fromJson("[1,2,3,4,5]", int[].class); 
==> ints2 will be same as ints
```
`GSON`也支持任意复杂的元素类型的多维数组

## 集合的例子
``` java
Gson gson = new Gson();
Collection<Integer> ints = Lists.immutableList(1,2,3,4,5);
//(序列化Serialization)
String json = gson.toJson(ints); ==> json is [1,2,3,4,5]
//(反序列化Deserialization)
Type collectionType = new TypeToken<Collection<Integer>>(){}.getType();
Collection<Integer> ints2 = gson.fromJson(json, collectionType);
//ints,ints2是一样的
```
特别注意:请注意我们是如何定义的集合类型,非常不幸的是,在`JAVA`中,别无他途

### 集合限制

* 能够序列化任何任意类型的集合,但是不能让它反序列化,因为没有办法给用户指示数据类型
* 反序列化的时候,集合一定得是一个特定泛型的集合

## 泛型的序列化和反序列化

当你调用`toJson(obj)`的时候,`GSON`会执行`obj.getClass()`来获取序列化的字段的信息,同样的,你可以在`fromJson(json, MyClass.class)`方法中使用典型对象.如果对象是一个非泛型对象,这样也能正常工作.但是,如果对象是一个泛型对象,`Java`的类型擦除会让这个对象丢失泛型类型信息.下面是一个说明性的例子:
``` java
class Foo<T> {
  T value;
}
Gson gson = new Gson();
Foo<Bar> foo = new Foo<Bar>();
gson.toJson(foo); // May not serialize foo.value correctly这样或许不能正确序列化foo.value
gson.fromJson(json, foo.getClass()); // Fails to deserialize foo.value as Bar把foo.value作为一个Bar来反序列化会失败
```
上面的例子都会失败,因为`GSON`会调用`list.getClass()`来获取类的信息,但这李会返回一个本类(这个词我也不知道存不存在,我从a raw class中瞎编的)`Foo.class`,这样`GSON`不能知道`Foo<Bar>`的类型,所以不能解释`Foo`.您可以通过指定正确的参数化类型的泛型类型解决这个问题,你可以使用[TypeToken](http://google-gson.googlecode.com/svn/tags/1.1.1/docs/javadocs/com/google/gson/reflect/TypeToken.html)来做:
``` java
Type fooType = new TypeToken<Foo<Bar>>() {}.getType();
gson.toJson(foo, fooType);
gson.fromJson(json, fooType);
```
`fooType`定义了一个`GetType`方法,这个方法返回了了一个真正的类型.

## 任意对象集合的序列化和反序列化

有时你会处理一些混合类型的`JSON`,比如
``` java
['hello',5,{name:'GREETINGS',source:'guest'}]
```
一个相同的集合是这样的
``` java
Collection collection = new ArrayList();
collection.add("hello");
collection.add(5);
collection.add(new Event("GREETINGS", "guest"));
```
`Event`对象是这样定义的
``` java
class Event {
  private String name;
  private String source;
  private Event(String name, String source) {
    this.name = name;
    this.source = source;
  }
}
```
使用`GSON`序列化这个集合只需要调用`toJson(collection)`,而且不用设置其他任何东西.但是你要是通过`fromJson(json, Collection.class)`反序列化这个集合的话是不可行的,因为`GSON`,没办法匹配集合类型,所以`GSON`需要你提供这个集合序列化的类型.你有三个选项:

* 使用`GSON`的解析器`API`(底层流解析器或DOM解析器`JsonParser`)来解析数据元素,然后在每一个元素上使用`Gson.fromJson()`.这是首选的方法,下面是一个例子:
``` java
static class Event {
    private String name;
    private String source;
    private Event(String name, String source) {
      this.name = name;
      this.source = source;
    }
    @Override
    public String toString() {
      return String.format("(name=%s, source=%s)", name, source);
    }
}
 @SuppressWarnings({ "unchecked", "rawtypes" })
 public static void main(String[] args) {
   Gson gson = new Gson();
   Collection collection = new ArrayList();
   collection.add("hello");
   collection.add(5);
   collection.add(new Event("GREETINGS", "guest"));
   String json = gson.toJson(collection);
   System.out.println("Using Gson.toJson() on a raw collection: " + json);
   JsonParser parser = new JsonParser();
   JsonArray array = parser.parse(json).getAsJsonArray();
   String message = gson.fromJson(array.get(0), String.class);
   int number = gson.fromJson(array.get(1), int.class);
   Event event = gson.fromJson(array.get(2), Event.class);
   System.out.printf("Using Gson.fromJson() to get: %s, %d, %s", message, number, event);
 }
```
* 给`Collection.class``注册类型适配器,让每一个元素都对应自己的对象.缺点是会搞乱`GSON`中其他的集合的反序列化.
* 通过注册一个`MyCollectionMemberType`使用`fromJson`和`Collection<MyCollectionMemberType>`,缺点就是只有数组是顶级元素才是可行的

## 内置序列化和反序列化

`Gson`内置了一些常用类的序列化和反序列化(默认的表示可能不正确),下面是这些类的列表:

* java.net.URL to match it with strings like "http://code.google.com/p/google-gson/".
* java.net.URI to match it with strings like "/p/google-gson/".


`JodaTime Classes`
`DateTime`
``` java
private static class DateTimeTypeConverter implements JsonSerializer<DateTime>, JsonDeserializer<DateTime> {
  @Override
  public JsonElement serialize(DateTime src, Type srcType, JsonSerializationContext context) {
    return new JsonPrimitive(src.toString());
  }

  @Override
  public DateTime deserialize(JsonElement json, Type type, JsonDeserializationContext context) throws JsonParseException {
    try {
      return new DateTime(json.getAsString());
    } catch (IllegalArgumentException e) {
      // May be it came in formatted as a java.util.Date, so try that
      Date date = context.deserialize(json, Date.class);
      return new DateTime(date);
    }
  }
}
```
`Instant`
``` java
private static class InstantTypeConverter implements JsonSerializer<Instant>, JsonDeserializer<Instant> {
 @Override
 public JsonElement serialize(Instant src, Type srcType, JsonSerializationContext context) {
   return new JsonPrimitive(src.getMillis());
 }
 @Override
 public Instant deserialize(JsonElement json, Type type, JsonDeserializationContext context) throws JsonParseException {
   return new Instant(json.getAsLong());
 }
}
```
## 自定义序列化和反序列化

有时默认的描述并不是你想要的,做时间之类的东西处理的时候这种问题经常出现,`Gson`允许你自定义序列化工具,定义通常分为两部分:

* Json Serialiers: 需要定义自定义序列化对象
* Json Deserializers: 需要定义自定义反序列化的类型
* Instance Creators: 无参构造方法和反序列化解析器都不是必须的
``` java
GsonBuilder gson = new GsonBuilder();
gson.registerTypeAdapter(MyType2.class, new MyTypeAdapter());
gson.registerTypeAdapter(MyType.class, new MySerializer());
gson.registerTypeAdapter(MyType.class, new MyDeserializer());
gson.registerTypeAdapter(MyType.class, new MyInstanceCreator());
```
registerTypeAdapter调用检查,如果该类型的适配器实现多个接口，并将其注册.

## 写一个序列化解释器

给`JodaTime DateTime class`写一个自定义的序列化解释器的例子:
``` java
private class DateTimeSerializer implements JsonSerializer<DateTime> {
  public JsonElement serialize(DateTime src, Type typeOfSrc, JsonSerializationContext context) {
    return new JsonPrimitive(src.toString());
  }
}
```
需要对一个`DateTime`对象序列化的时候调用`GSON.toJson()`.

## 写一个反序列化解释器

给`JodaTime DateTime class`写一个自定义的反序列化解释器的例子:
``` java
private class DateTimeDeserializer implements JsonDeserializer<DateTime> {
  public DateTime deserialize(JsonElement json, Type typeOfT, JsonDeserializationContext context)
      throws JsonParseException {
    return new DateTime(json.getAsJsonPrimitive().getAsString());
  }
}
```
需要对一个`DateTime`对象反序列化的时候调用`GSON.fromJson()`.

## 序列化解释器和反序列化解释器的要点

通常的情况下,你想注册一个单一的的处理器来把所有的泛型转化成真正类型:

* 比如你有一个Id的类,内外表达不是一致的,内部是数据外部是描述(不确定翻译是否无误For example, suppose you have an "Id" class for Id representation/translation (i.e. an internal vs. external representation))
* Id<T>,对于所有的泛型来说都有相同的序列化方式,本质就是写出来的id
* 反序列化解释器也是非常相似的,不过在获取Id<T>实例的时候需要调用`new Id(Class<T>, String)`

`GSON`支持注册单一的处理器,你也可以注册对一个特殊的泛型注册一个特殊的处理器(或者说<RequiresSpecialHandling>需要特殊处理),`Type`参数能帮助你编写一个单独的处理器来把所有的泛型都完成转化.(Gson supports registering a single handler for this. You can also register a specific handler for a specific generic type (say Id<RequiresSpecialHandling> needed special handling).The Type parameter for the toJson and fromJson contains the generic type information to help you write a single handler for all generic types corresponding to the same raw type)

## 写实例构造器

反序列化一个对象的时候,`GSON`需要创建这个对象的实例,一个良好的类应该具有无参构造方法来保证`GSON`在序列化和反序列化的时候可以使用.`private`或者`public`并不重要.一般来说,如果一个类没有无参构造方法的时候,你就应用自己写一个实例构造器了.
一个构造器的例子:
``` java
private class MoneyInstanceCreator implements InstanceCreator<Money> {
  public Money createInstance(Type type) {
    return new Money("1000000", CurrencyCode.USD);
  }
}
```
`Type`可以是相应的泛型类型:

* 调用一个需要具体的泛型类型的构造方法很有用
* 例如，如果Id类存储的量，就是正被创建的Id

## 实例构造器的参数化类型

有时，需要的实例类型是参数化类型。这不是一个问题,因为实际的实例是`raw type`。下面是一个例子：
``` java
class MyList<T> extends ArrayList<T> {
}
class MyListInstanceCreator implements InstanceCreator<MyList<?>> {
    @SuppressWarnings("unchecked")
  public MyList<?> createInstance(Type type) {
    // No need to use a parameterized list since the actual instance will have the raw type anyway.
    return new MyList();
  }
}
```
有时候你需要根据实际参数化类型来创建实例。在这种情况下，你可以使用类型参数传递到实例构造器方法。下面是一个例子：
``` java
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
    Type idType = typeParameters[0]; // Id has only one parameterized type T
    return Id.get((Class)idType, 0L);
  }
}
```
在上面的例子中，不能在没有实际传递的实际类型参数化的类型的情况下来创建的Id类的一个实例,我们通过传递方法参数，类型解决了这个问题。在这种情况下，该类型的对象是Id<Foo>的Java的参数类型的表示，其中实际的实例应绑定到Id<Foo> 。因为标识类只有一个参数化的类型参数，T ，我们用getActualTypeArgument返回的类型的数组的第一个元素来保存Foo.class。

## 紧凑漂亮的JSON输出

默认的`JSON`输出是`GSON`提供的是一种紧凑`JSON`格式。这意味着它们将不会输出`JSON`结构,任何空白。因此出现在`JSON`输出内容中的字段名和值，对象字段和对象之间没有空格。同时`null`字段将在输出忽略(注意：空值仍将被列入收藏的对象/数组)。如果你需要`JSON`保持一个清晰的格式,你需要使用`GsonBuilder`来配置`GSON`,现在`JsonFormatter`还不是一个`public API`,所以客户端不能配置默认打印设置/边距JSON输出.现我们只提供一个默认JsonPrintFormatter80字,2个字符缩进和4字右边界默认行长度.
下面是一个例子展示了如何配置GSON实例使用默认`JsonPrintFormatter`而不是`JsonCompactFormatter`:
``` java
Gson gson = new GsonBuilder().setPrettyPrinting().create();
String jsonOutput = gson.toJson(someObject);
```

## NULL对象的支持

GSON实现的默认行为是空的对象字段被忽略,这让更紧凑的输出格式成为可能;然而,客户端必须定义这些字段的默认值作为`JSON`格式转换回`Java` 。
这将展示如何配置`GSON`实例输出`null`
``` java
Gson gson = new GsonBuilder().serializeNulls().create();
```
Note:使用`Gson`序列化`null`时,它会加入`JsonNull`到`JsonElement`结构。因此它可以在自定义的序列化/反序列化中使用.
下面是一个例子:
``` java
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
Gson gson = new GsonBuilder().serializeNulls().create();
Foo foo = new Foo();
String json = gson.toJson(foo);
System.out.println(json);
json = gson.toJson(null);
System.out.println(json);
======== OUTPUT ========
{"s":null,"i":5}
null
```
## 版本支持

相同的对象的多个版本可以通过使用`@Since`注解来解决,这个注解可以在一个未来的类,字段,方法上使用.为了使用这个功能,你必须配置大于某个版本时忽略的对象,字段,如果没有配置,`GSON`会序列化全部内容.
``` java
@Since(1.1) private final String newerField;
@Since(1.0) private final String newField;
private final String field;
public VersionedClass() {
   this.newerField = "newer";
   this.newField = "new";
   this.field = "old";
}
VersionedClass versionedObject = new VersionedClass();
Gson gson = new GsonBuilder().setVersion(1.0).create();
String jsonOutput = gson.toJson(someObject);
System.out.println(jsonOutput);
System.out.println();
gson = new Gson();
jsonOutput = gson.toJson(someObject);
System.out.println(jsonOutput);
======== OUTPUT ========
{"newField":"new","field":"old"}
{"newerField":"newer","newField":"new","field":"old"}
```

## 从序列化和反序列化中剔除字段

GSON支持剔除顶层类，字段和字段类型,`Below`是一种排除字段或者类的可插拔的机制,如果这些机制没有满足你的需要.你可以自定义序列化和反序列化的解释器.

* `Java Modifier Exclusion` java修改的剔除
默认的情况下,如果一个对象被声明为`transient`,`static`,那么它就会被剔除.如果你要包含这些字段,你需要做:
``` java
Gson gson = new GsonBuilder()
    .excludeFieldsWithModifiers(Modifier.STATIC)
    .create();
```
NOTE: 您可以使用任意数量参数的“excludeFieldsWithModifiers”的方法.比如:
``` java
Gson gson = new GsonBuilder()
    .excludeFieldsWithModifiers(Modifier.STATIC, Modifier.TRANSIENT, Modifier.VOLATILE)
    .create();
```
## Gson's @Expose

该功能提供了一种方法，你可以标记某些字段被排除,不考虑序列化和反序列化到`JSON`。要使用此批注,您必须`new GsonBuilder().excludeFieldsWithoutExposeAnnotation().create()`来创建`GSON`,创建GSON实例将排除所有未标明注释`@expose`各个字段。

## 用户定义的排除策略

如果这些默认的策略都不能满足你的需求,你还可以自定自己的策略,更多可见[ExclusionStrategy](http://google-gson.googlecode.com/svn/trunk/gson/docs/javadocs/com/google/gson/ExclusionStrategy.html)
下面是一个使用`@Foo`的例子
``` java
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD})
public @interface Foo {
  // Field tag only annotation
}

public class SampleObjectForTest {
  @Foo private final int annotatedField;
  private final String stringField;
  private final long longField;
  private final Class<?> clazzField;

  public SampleObjectForTest() {
    annotatedField = 5;
    stringField = "someDefaultValue";
    longField = 1234;
  }
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

public static void main(String[] args) {
  Gson gson = new GsonBuilder()
      .setExclusionStrategies(new MyExclusionStrategy(String.class))
      .serializeNulls()
      .create();
  SampleObjectForTest src = new SampleObjectForTest();
  String json = gson.toJson(src);
  System.out.println(json);
}
======== OUTPUT ========
{"longField":1234}
```
## JSON Field Naming Support 字段命名支持

`Gson`支持一些预先定义的字段命名策略转换(比如,`JAVA`,开头小写,`sampleFieldNameInJava`,驼峰命名,到一个`JSON`字段名称,即`sample_field_name_in_java`或`SampleFieldNameInJava`)
它也有一个注释为基础的策略，以允许在每个字段的基础上定义自定义名称。请注意，该注释为基础的策略情况下,如果一个无效的字段名称作为注解值将在`Runtime`才会校验。下面是一些例子
``` java
private class SomeObject {
  @SerializedName("custom_naming") private final String someField;
  private final String someOtherField;
  public SomeObject(String a, String b) {
    this.someField = a;
    this.someOtherField = b;
  }
}
SomeObject someObject = new SomeObject("first", "second");
Gson gson = new GsonBuilder().setFieldNamingPolicy(FieldNamingPolicy.UPPER_CAMEL_CASE).create();
String jsonRepresentation = gson.toJson(someObject);
System.out.println(jsonRepresentation);
======== OUTPUT ========
{"custom_naming":"first","SomeOtherField":"second"}
```


> <br />[joda-time](http://www.joda.org/joda-time/)
  <br />[TOC-Using-Gson](https://sites.google.com/site/gson/gson-user-guide#TOC-Using-Gson)



