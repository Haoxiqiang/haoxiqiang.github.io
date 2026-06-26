---
title: "Tencent Interview"
date: 2014-12-08 10:35:07
author: "haoxiqiang"
tags: ["android", "java", "interview"]
categories: ["Blog"]
ShowToc: true
TocOpen: false
---

I came across [stormzhang's Tencent interview questions](http://stormzhang.com/android/other/2014/05/03/tencent-interview/) and decided to work through them, documenting my answers and thought process.

Topics covered:
- Android fundamentals (processes, Activities, Handler)
- Screen density and resource qualifiers
- Thread synchronization in Java
- System design (resumable downloads, network architecture)

<!--more-->

> Interview questions:
> 1. How to draw a stamp pattern
> 2. How to implement text stroke and shadow effects
> 3. Can different Activities of the same app run in separate processes? If so, give an example.
> 4. What thread synchronization mechanisms exist in Java? Give examples.
> 5. Explain Handler, Looper, and HandlerThread.
> 6. What do dp, dip, dpi, px, sp mean? How are they converted? What do layout-sw600dp and layout-h600dp mean?
> 7. List Activity launch modes with your understanding and use cases.
> 8. How to design a resumable file download system.
> 9. XML layout: how to center two TextViews horizontally in a RelativeLayout.
> 10. Design a system that fetches data and images from the network and loads them into a list — draw the client architecture and analyze.

---

### 3. Can different Activities of the same app run in separate processes?

Yes. Normally all Activities in an application run in the same process. However, setting the `android:process` attribute on an Activity forces it to run in its own process.

Naming rules for `android:process`:

- Prefix with `:` (e.g., `:first.process`): creates a **private** process (prefixed with the app's package name)
- Start with a lowercase letter (e.g., `com.example.shared`): creates a **global** process that other apps can also use

```xml
<application android:icon="@drawable/icon"
             android:label="@string/app_name">
    <activity android:name=".MainActivity"
              android:process=":first.process" />
    <activity android:name=".SubActivity"
              android:process=":second.process" />
</application>
```

Two Activities from the same app can run in different processes yet belong to the same task — this demonstrates the power of Android's task management. It allows isolating independent modules into separate processes, reducing coupling, without worrying about inter-process communication details. The implementation involves ActivityRecord and ProcessRecord scheduling managed by ActivityManagerService.

> Reference: [android:process | Android Developers](https://developer.android.com/guide/topics/manifest/activity-element#proc)
> Reference: [Processes and threads overview | Android Developers](https://developer.android.com/guide/components/processes-and-threads)

---

### 6. dp, dip, dpi, px, sp — Definitions and Conversion

| Unit | Meaning | Description |
|------|---------|-------------|
| px | Pixel | Physical screen pixel |
| in | Inch | Physical measurement |
| mm | Millimeter | Physical measurement |
| pt | Point | 1/72 inch |
| dp / dip | Density-independent pixel | At 160dpi, 1dp = 1px |
| sp | Scale-independent pixel | Like dp, but respects user font size preference |

Conversion between dp and px:

```java
public static int dip2px(Context context, float dipValue) {
    final float scale = context.getResources()
        .getDisplayMetrics().density;
    return (int)(dipValue * scale + 0.5f);
}

public static int px2dip(Context context, float pxValue) {
    final float scale = context.getResources()
        .getDisplayMetrics().density;
    return (int)(pxValue / scale + 0.5f);
}
```

Recommendation: use sp for text, dp for everything else.

#### Resource Directory Qualifiers

- **sw<N>dp** (e.g., `layout-sw600dp`): smallest width — the smaller of width/height. Does not change when the device orientation changes.
- **w<N>dp** (e.g., `layout-w600dp`): current screen width — changes with orientation.
- **h<N>dp** (e.g., `layout-h600dp`): current screen height — changes with orientation. The official docs recommend avoiding this qualifier, since scrollable content makes height less predictable than width.

---

## References

- [Tencent Interview - stormzhang](http://stormzhang.com/android/other/2014/05/03/tencent-interview/)
- [android:process | Android Developers](https://developer.android.com/guide/topics/manifest/activity-element#proc)
- [Processes and threads overview | Android Developers](https://developer.android.com/guide/components/processes-and-threads)
