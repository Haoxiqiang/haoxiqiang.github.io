---
title: "Android Fragment$InstantiationException: Causes and Solutions"
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

This error used to be rare, but recently it spiked. After investigation, here are the causes and solutions.

<!--more-->

## Root Cause

The Android framework recreates Fragments via reflection during state restoration. The following patterns break that:

1. **Fragment is a non-static inner class** — Java inner classes hold an implicit reference to the outer class, so the compiler generates a constructor with the outer class parameter, leaving no empty constructor
2. **Passing parameters via constructors** — the system only calls the no-argument constructor; custom constructors are not used during restoration
3. **No public empty constructor declared** — even if you rely on the compiler-generated default, ensure it is declared `public` (package-private visibility can fail in certain scenarios)

## How to Reproduce

The easiest trigger is an Activity configuration change: screen rotation (`portrait <-> landscape`), returning from a phone call, etc. The system destroys and recreates the Activity along with its Fragments, calling `Fragment.instantiate()` on each. If a public no-arg constructor is not found, `InstantiationException` is thrown.

## Solution

```java
// Always have a public empty constructor
public class CourseFragment extends BaseThemeFragment {
    public CourseFragment() {
        super();
    }
}

// Pass initialization parameters via setArguments
public static PageFragment newInstance(int currentResId) {
    PageFragment fragment = new PageFragment();
    Bundle args = new Bundle();
    args.putInt(CURRENT_RES, currentResId);
    fragment.setArguments(args);
    return fragment;
}
```

**Key rule**: always use `setArguments(Bundle)` for Fragment initialization parameters — never custom constructors. The system automatically restores the Arguments bundle when recreating the Fragment.

## Why Explicitly Declare an Empty Constructor

`Fragment.instantiate()` uses `Class.newInstance()` via reflection, which requires a **public** no-argument constructor accessible to the class loader. Non-static inner classes carry an implicit outer class reference, making their constructors incompatible with `Class.newInstance()`.

### Alternative: FragmentFactory (AndroidX)

If you're using AndroidX, you can register a custom `FragmentFactory` to bypass the empty constructor requirement:

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

That said, the `newInstance()` static factory pattern remains the simplest and most recommended approach for most cases.

## References

- [Fragment Official Documentation](https://developer.android.com/reference/android/app/Fragment) — "All subclasses of Fragment must include a public no-argument constructor"
- [Fragment.InstantiationException API Reference](https://developer.android.com/reference/android/app/Fragment.InstantiationException)
- [FragmentFactory API Reference](https://developer.android.com/reference/androidx/fragment/app/FragmentFactory)
- [Do fragments really need an empty constructor?](http://stackoverflow.com/questions/10450348/do-fragments-really-need-an-empty-constructor)
- [Fragment InstantiationException — no empty constructor](http://stackoverflow.com/questions/16062923/fragment-instantiationexception-no-empty-constructor-google-maps-v2/16064418#16064418)
