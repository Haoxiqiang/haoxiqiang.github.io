---
title: "Java Reflection 修改 private static final 字段"
date: 2015-06-16 11:09:06
slug: "JAVAReflection"
author: "haoxiqiang"
tags: ["java", "reflection", "jls"]
categories: ["Java"]
ShowToc: true
TocOpen: false
---

排查内存泄漏问题时，经常需要反射修改字段值。在 Stack Overflow 上看到一个高质量回答，整理如下。

<!--more-->

## 能否修改 `private static final` 字段？

在 SecurityManager 允许的前提下，可以通过 `setAccessible` 绕过 `private` 限制，再移除 `final` 修饰符，从而修改 `private static final` 字段。

## 示例代码

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

若无 SecurityException 抛出，上述代码输出 `"Everything is true"`。

## 原理

1. `main` 中的 `true` 和 `false` 被自动装箱为 `Boolean.TRUE` 和 `Boolean.FALSE`
2. 通过反射将 `Boolean.FALSE` 指向 `Boolean.TRUE` 所引用的对象
3. 此后所有 `false` 的自动装箱结果都变为 `Boolean.TRUE`
4. 于是原本为 "false" 的地方都变成了 "true"

## 位运算说明

```java
field.getModifiers() & ~Modifier.FINAL
```

- `field.getModifiers()` 获取修饰符位掩码
- `~Modifier.FINAL` 对 `FINAL` 位取反
- 按位与运算，即清除 `FINAL` 位

## 注意事项

- 此行为依赖于 `SecurityManager` 配置，开启后可能失败
- JLS 17.5.3 明确指出：final 字段可以通过反射及其他实现相关手段修改，但语义上仅在对象构造完成且尚未被其他线程可见时才有合理含义
- 若 final 字段声明时初始化为编译期常量（compile-time constant），反射修改可能无效——编译器已将常量内联到字节码中
- JVM 可以对 final 字段的读取进行激进的指令重排优化

> JLS 17.5.3：Final fields can be changed via reflection and other implementation dependent means. The only pattern in which this has reasonable semantics is one in which an object is constructed and then the final fields of the object are updated. The object should not be made visible to other threads, nor should the final fields be read, until all updates to the final fields of the object are complete.

另见 [JLS 15.28 Constant Expression](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.28)：编译期常量（如原始类型的 `private static final boolean`）的内联特性使得反射修改很可能无效。

## 参考

- [Stack Overflow: Change private static final field using Java reflection](https://stackoverflow.com/questions/3301635/change-private-static-final-field-using-java-reflection)
- [JLS 17.5.3: Subsequent Modification of Final Fields](https://docs.oracle.com/javase/specs/jls/se21/html/jls-17.html#jls-17.5.3)
- [JLS 15.28: Constant Expression](https://docs.oracle.com/javase/specs/jls/se21/html/jls-15.html#jls-15.28)
- [Stack Overflow: Using reflection to change static final File.separatorChar](https://stackoverflow.com/questions/2474017/using-reflection-to-change-static-final-file-separatorchar-for-unit-testing)
- [Stack Overflow: How to limit setAccessible to legitimate uses](https://stackoverflow.com/questions/2481862/how-to-limit-setaccessible-to-only-legitimate-uses)
- [Wikipedia: Bitwise operation](https://en.wikipedia.org/wiki/Bitwise_operation)
