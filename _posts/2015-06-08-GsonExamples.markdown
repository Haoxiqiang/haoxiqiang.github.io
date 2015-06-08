---
layout: post
title:  Gson的官方帮助文档
date:   2015-06-08 12:37:45
author: 郝锡强
categories: blog
letex: false
tags: [java]
---
不考虑每次都会初始化`GSON`的情况下,`GSON`的性能不会比其他框架低,考虑到`Google`牌的因素决定主要使用`GSON`来操作`JSON`数据,全面的查看一遍文档,作为备忘

<!-- more -->

## 最原始的例子
{% highlight java%}
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
{% endhighlight %}

## 对象的例子
{% highlight java%}
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
{% endhighlight %}

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
{% highlight java%}
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
{% endhighlight %}
`GSON`不能反序列化`{"b":"abc"} `,因为`class B`是一个内部类,如果你这么定义B:`static class B`,`GSON`是能反序列化这段字符串的,另外一个办法就是自定一个实例构建方法,下面是一个例子
{% highlight java%}
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
{% endhighlight %}

## 数组的例子

{% highlight java%}
Gson gson = new Gson();
int[] ints = {1, 2, 3, 4, 5};
String[] strings = {"abc", "def", "ghi"};
//(序列化Serialization)
gson.toJson(ints);     ==> prints [1,2,3,4,5]
gson.toJson(strings);  ==> prints ["abc", "def", "ghi"]
//(反序列化Deserialization)
int[] ints2 = gson.fromJson("[1,2,3,4,5]", int[].class); 
==> ints2 will be same as ints
{% endhighlight %}
`GSON`也支持任意复杂的元素类型的多维数组

## 集合的例子

{% highlight java%}
Gson gson = new Gson();
Collection<Integer> ints = Lists.immutableList(1,2,3,4,5);
//(序列化Serialization)
String json = gson.toJson(ints); ==> json is [1,2,3,4,5]
//(反序列化Deserialization)
Type collectionType = new TypeToken<Collection<Integer>>(){}.getType();
Collection<Integer> ints2 = gson.fromJson(json, collectionType);
//ints,ints2是一样的
{% endhighlight %}
特别注意:请注意我们是如何定义的集合类型,非常不幸的是,在`JAVA`中,别无他途

### 集合限制

* 能够序列化任何任意类型的集合,但是不能让它反序列化,因为没有办法给用户指示数据类型
* 反序列化的时候,集合一定得是一个特定泛型的集合

## 泛型的序列化和反序列化

当你调用`toJson(obj)`的时候,`GSON`会执行`obj.getClass()`来获取序列化的字段的信息,同样的,你可以在`fromJson(json, MyClass.class)`方法中使用典型对象.如果对象是一个非泛型对象,这样也能正常工作.但是,如果对象是一个泛型对象,`Java`的类型擦除会让这个对象丢失泛型类型信息.下面是一个说明性的例子:
{% highlight java%}
class Foo<T> {
  T value;
}
Gson gson = new Gson();
Foo<Bar> foo = new Foo<Bar>();
gson.toJson(foo); // May not serialize foo.value correctly这样或许不能正确序列化foo.value
gson.fromJson(json, foo.getClass()); // Fails to deserialize foo.value as Bar把foo.value作为一个Bar来反序列化会失败
{% endhighlight %}
上面的例子都会失败,因为`GSON`会调用`list.getClass()`来获取类的信息,但这李会返回一个本类(这个词我也不知道存不存在,我从a raw class中瞎编的)`Foo.class`,这样`GSON`不能知道`Foo<Bar>`的类型,所以不能解释`Foo`.您可以通过指定正确的参数化类型的泛型类型解决这个问题,你可以使用[TypeToken](http://google-gson.googlecode.com/svn/tags/1.1.1/docs/javadocs/com/google/gson/reflect/TypeToken.html)来做:
{% highlight java%}
Type fooType = new TypeToken<Foo<Bar>>() {}.getType();
gson.toJson(foo, fooType);
gson.fromJson(json, fooType);
{% endhighlight %}
`fooType`定义了一个`GetType`方法,这个方法返回了了一个真正的类型.

## 任意对象集合的序列化和反序列化

有时你会处理一些混合类型的`JSON`,比如
{% highlight json%}
['hello',5,{name:'GREETINGS',source:'guest'}]
{% endhighlight %}
一个相同的集合是这样的
{% highlight java%}
Collection collection = new ArrayList();
collection.add("hello");
collection.add(5);
collection.add(new Event("GREETINGS", "guest"));
{% endhighlight %}
`Event`对象是这样定义的
{% highlight java%}
class Event {
  private String name;
  private String source;
  private Event(String name, String source) {
    this.name = name;
    this.source = source;
  }
}
{% endhighlight %}
使用`GSON`序列化这个集合只需要调用`toJson(collection)`,而且不用设置其他任何东西.但是你要是通过`fromJson(json, Collection.class)`反序列化这个集合的话是不可行的,因为`GSON`,没办法匹配集合类型,所以`GSON`需要你提供这个集合序列化的类型.你有三个选项:

* 使用`GSON`的解析器`API`(底层流解析器或DOM解析器`JsonParser`)来解析数据元素,然后在每一个元素上使用`Gson.fromJson()`.这是首选的方法,下面是一个例子:
{% highlight java%}
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
{% endhighlight %}
* 给`Collection.class``注册类型适配器,让每一个元素都对应自己的对象.缺点是会搞乱`GSON`中其他的集合的反序列化.
* 通过注册一个`MyCollectionMemberType`使用`fromJson`和`Collection<MyCollectionMemberType>`,缺点就是只有数组是顶级元素才是可行的

## 内置序列化和反序列化

`Gson`内置了一些常用类的序列化和反序列化(默认的表示可能不正确),下面是这些类的列表:

* java.net.URL to match it with strings like "http://code.google.com/p/google-gson/".
* java.net.URI to match it with strings like "/p/google-gson/".

{% highlight java%}
JodaTime Classes
DateTime
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
Instant
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
{% endhighlight %}