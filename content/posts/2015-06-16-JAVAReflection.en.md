---
title: "Java Reflection: Modifying Private Static Final Fields"
date: 2015-06-16 11:09:06
author: "haoxiqiang"
tags: ["java", "reflection", "jls"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

While debugging memory leaks, I often need to modify field values via reflection. I came across a great Stack Overflow answer worth documenting.

<!--more-->

## Can We Modify `private static final` Fields?

Assuming no SecurityManager is preventing it, you can use `setAccessible` to bypass `private`, then remove the `final` modifier to actually modify a `private static final` field.

## Example

```java
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
```

If no SecurityException is thrown, this prints "Everything is true".

## How It Works

1. The primitive `boolean` values `true` and `false` in `main` are autoboxed to `Boolean.TRUE` and `Boolean.FALSE`
2. Reflection changes `public static final Boolean.FALSE` to refer to the same object as `Boolean.TRUE`
3. Consequently, `false` autoboxes to `Boolean.TRUE`
4. Everything that was "false" now reads as "true"

## Bitwise Manipulation

```java
field.getModifiers() & ~Modifier.FINAL
```

- `field.getModifiers()` gets the modifier bitmask
- `~Modifier.FINAL` inverts the FINAL bit
- The AND operation clears the FINAL bit

## Caveats

- This behavior depends on the SecurityManager configuration
- JLS 17.5.3 states: final fields can be changed via reflection, but this only has reasonable semantics when an object is constructed, its final fields are updated, and the object is not made visible to other threads until updates are complete
- If a final field is initialized to a compile-time constant, changes may not be observable because the constant is inlined at compile time
- The specification allows aggressive optimization of final fields, including reordering reads with modifications not happening in the constructor

See also [JLS 15.28 Constant Expression](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.28): this technique is unlikely to work with a `private static final boolean` primitive because it is inlined as a compile-time constant.

## References

- [Stack Overflow: Change private static final field using Java reflection](https://stackoverflow.com/questions/3301635/change-private-static-final-field-using-java-reflection)
- [JLS 17.5.3: Subsequent Modification of Final Fields](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html#jls-17.5.3)
- [JLS 15.28: Constant Expression](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.28)
- [Stack Overflow: Using reflection to change static final File.separatorChar](https://stackoverflow.com/questions/2474017/using-reflection-to-change-static-final-file-separatorchar-for-unit-testing)
- [Stack Overflow: How to limit setAccessible to legitimate uses](https://stackoverflow.com/questions/2481862/how-to-limit-setaccessible-to-only-legitimate-uses)
