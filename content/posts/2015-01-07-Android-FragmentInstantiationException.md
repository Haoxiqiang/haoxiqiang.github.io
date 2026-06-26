---
title: "Android Fragment$InstantiationException 分析与解决"
date: 2015-01-07 08:35:07
author: "haoxiqiang"
tags: ["android", "fragment", "crash", "exception"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

```
android.support.v4.app.Fragment$InstantiationException: Unable to instantiate fragment
make sure class name exists, is public, and has an empty constructor that is public
```

以前偶尔碰到这个错误，量不大没在意。最近突然暴增，仔细研究了一番，整理出几个原因和解决办法。

<!--more-->

## 崩溃原因

Fragment 在系统恢复状态时需要通过反射重新创建实例。以下情况会导致反射失败：

1. **Fragment 是非 static 的内部类** —— Java 内部类会持有对外部类的隐式引用，编译器生成带外部类参数的构造方法，导致没有空构造方法
2. **通过构造方法传递参数** —— 系统恢复时只会调用无参构造器，自定义的有参构造不会被调用
3. **没有声明 public 的空构造方法** —— 即使没有定义任何构造方法，也要确保编译器生成的默认构造是 `public` 的（包可见性在某些情况下不够）

## 复现场景

最容易触发的方式是让 Activity 经历配置变化：旋转屏幕（`portrait <-> landscape`）、接打电话后切回应用等。在这些场景下系统会销毁并重建 Activity 及其关联的 Fragment，此时会对每个 Fragment 调用 `Fragment.instantiate()`，如果找不到 public 无参构造就会抛出 `InstantiationException`。

## 解决方案

```java
// 保证有 public 的空构造方法
public class CourseFragment extends BaseThemeFragment {
    public CourseFragment() {
        super();
    }
}

// 需要初始化参数的，通过 setArguments 传递
public static PageFragment newInstance(int currentResId) {
    PageFragment fragment = new PageFragment();
    Bundle args = new Bundle();
    args.putInt(CURRENT_RES, currentResId);
    fragment.setArguments(args);
    return fragment;
}
```

**关键原则**：永远通过 `setArguments(Bundle)` 传递 Fragment 初始化参数，不要使用自定义构造方法。Fragment 被系统重建时会自动恢复 `Arguments`。

## 为什么一定要写 public 空构造

即使编译器会生成默认构造，也建议显式声明 `public`。`Fragment.instantiate()` 内部通过 `Class.newInstance()` 反射创建实例，该方法要求构造方法是 `public` 且类加载器允许访问。内部类（非 static）的隐式构造带有外部类引用参数，不满足 `Class.newInstance()` 的要求。

### 补充：FragmentFactory 方案（AndroidX）

如果你的项目使用了 AndroidX，可以通过 `FragmentFactory` 自定义 Fragment 的实例化逻辑，不再强制要求空构造：

```java
supportFragmentManager.fragmentFactory = new FragmentFactory() {
    @NonNull
    @Override
    public Fragment instantiate(@NonNull ClassLoader classLoader, @NonNull String className) {
        return switch (className) {
            case "com.example.MyFragment" -> new MyFragment("custom arg");
            default -> super.instantiate(classLoader, className);
        };
    }
};
```

但在大多数情况下，`newInstance()` 静态工厂模式仍然是最简单、最推荐的做法。

## 参考文献

- [Fragment 官方文档](https://developer.android.com/reference/android/app/Fragment) — "All subclasses of Fragment must include a public no-argument constructor"
- [Fragment.InstantiationException 文档](https://developer.android.com/reference/android/app/Fragment.InstantiationException)
- [FragmentFactory API 参考](https://developer.android.com/reference/androidx/fragment/app/FragmentFactory)
- [Do fragments really need an empty constructor?](http://stackoverflow.com/questions/10450348/do-fragments-really-need-an-empty-constructor)
- [Fragment InstantiationException — no empty constructor](http://stackoverflow.com/questions/16062923/fragment-instantiationexception-no-empty-constructor-google-maps-v2/16064418#16064418)
