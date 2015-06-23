---
layout: post
title:  Java Reflection
date:   2015-06-16 11:09:06
author: 郝锡强
categories: blog
letex: false
tags: [java]
---
[change-private-static-final-field-using-java-reflection](http://stackoverflow.com/questions/3301635/change-private-static-final-field-using-java-reflection)
最近搞内存泄露很多地方得自己反射去改值,看到一个不错的回答,记录一下

<!-- more -->

Assuming no SecurityManager is preventing you from doing this, you can use setAccessible to get around private and resetting the modifier to get rid of final, and actually modify a private static final field.

## Here's an example:

import java.lang.reflect.*;

public class EverythingIsTrue {
   static void setFinalStatic(Field field, Object newValue) throws Exception {
      field.setAccessible(true);

      Field modifiersField = Field.class.getDeclaredField("modifiers");
      modifiersField.setAccessible(true);
      modifiersField.setInt(field, field.getModifiers() & ~Modifier.FINAL);

      field.set(null, newValue);
   }
   public static void main(String args[]) throws Exception {      
      setFinalStatic(Boolean.class.getField("FALSE"), true);

      System.out.format("Everything is %s", false); // "Everything is true"
   }
}
Assuming no SecurityException is thrown, the above code prints "Everything is true".

## What's actually done here is as follows:

The primitive boolean values true and false in main are autoboxed to reference type Boolean "constants" Boolean.TRUE and Boolean.FALSE
Reflection is used to change the public static final Boolean.FALSE to refer to the Boolean referred to by Boolean.TRUE
As a result, subsequently whenever a false is autoboxed to Boolean.FALSE, it refers to the same Boolean as the one refered to by Boolean.TRUE
Everything that was "false" now is "true"

## Related questions

[Using reflection to change static final File.separatorChar for unit testing](http://stackoverflow.com/questions/2474017/using-reflection-to-change-static-final-file-separatorchar-for-unit-testing/2474242#2474242)
[How to limit setAccessible to only “legitimate” uses?](http://stackoverflow.com/questions/2481862/how-to-limit-setaccessible-to-only-legitimate-uses)

* Has examples of messing with Integer's cache, mutating a String, etc

## Caveats

Extreme care should be taken whenever you do something like this. It may not work because a SecurityManager may be present, but even if it doesn't, depending on usage pattern, it may or may not work.

[JLS 17.5.3 Subsequent Modification of Final Fields](http://java.sun.com/docs/books/jls/third_edition/html/memory.html#17.5.3)

In some cases, such as deserialization, the system will need to change the final fields of an object after construction. final fields can be changed via reflection and other implementation dependent means. The only pattern in which this has reasonable semantics is one in which an object is constructed and then the final fields of the object are updated. The object should not be made visible to other threads, nor should the final fields be read, until all updates to the final fields of the object are complete. Freezes of a final field occur both at the end of the constructor in which the final field is set, and immediately after each modification of a final field via reflection or other special mechanism.

Even then, there are a number of complications. If a final field is initialized to a compile-time constant in the field declaration, changes to the final field may not be observed, since uses of that final field are replaced at compile time with the compile-time constant.

Another problem is that the specification allows aggressive optimization of final fields. Within a thread, it is permissible to reorder reads of a final field with those modifications of a final field that do not take place in the constructor.

### See also

[JLS 15.28 Constant Expression](http://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.28)
It's unlikely that this technique works with a primitive private static final boolean, because it's inlineable as a compile-time constant and thus the "new" value may not be observable

## Appendix: On the bitwise manipulation

Essentially,

field.getModifiers() & ~Modifier.FINAL
turns off the bit corresponding to Modifier.FINAL from field.getModifiers(). & is the bitwise-and, and ~ is the bitwise-complement.

### See also

[Wikipedia/Bitwise operation](http://en.wikipedia.org/wiki/Bitwise_operations)