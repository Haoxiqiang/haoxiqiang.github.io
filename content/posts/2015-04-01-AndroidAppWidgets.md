---
title: "Android App Widgets"
date: 2015-04-01 10:37:26
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

App Widget 是 Android 中的一种微型应用视图,可以嵌入到其他应用(如桌面 Home Screen)中,并支持周期性更新。最常见的例子就是桌面 Widget,比如天气小部件、音乐播放器控件等。

![appwidget](/images/appwidget.png)

<!--more-->

## 基本架构

一个 App Widget 由以下组件构成:

- **AppWidgetProviderInfo**:定义 Widget 的元数据(布局、更新频率、尺寸等),在 XML 中声明
- **AppWidgetProvider**:继承自 BroadcastReceiver,处理 Widget 的生命周期事件
- **View Layout**:Widget 的界面布局,使用 RemoteViews 构建

## 关键生命周期方法

| 方法 | 触发时机 |
|------|----------|
| `onUpdate()` | 到达更新周期时触发,是唯一必须实现的方法 |
| `onAppWidgetOptionsChanged()` | Widget 尺寸变化时触发 |
| `onEnabled(Context)` | 第一个 Widget 实例被创建时触发 |
| `onDisabled(Context)` | 最后一个 Widget 实例被移除时触发 |
| `onDeleted(Context, int[])` | Widget 实例被删除时触发 |

## 创建步骤

### 1. 定义 Widget 元信息

`res/xml/example_appwidget_info.xml`:

```xml
<appwidget-provider xmlns:android="http://schemas.android.com/apk/res/android"
    android:minWidth="250dp"
    android:minHeight="40dp"
    android:updatePeriodMillis="86400000"
    android:initialLayout="@layout/example_appwidget"
    android:resizeMode="horizontal|vertical"
    android:widgetCategory="home_screen" />
```

### 2. 创建布局

Widget 布局使用 RemoteViews,支持的控件有限(主要是 FrameLayout、LinearLayout、RelativeLayout、GridLayout、Button、TextView、ImageView 等):

`res/layout/example_appwidget.xml`:

```xml
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:orientation="horizontal">
    <TextView
        android:id="@+id/example_text"
        android:layout_width="0dp"
        android:layout_height="match_parent"
        android:layout_weight="1"
        android:text="Hello Widget!" />
</LinearLayout>
```

### 3. 实现 Provider

```java
public class ExampleAppWidgetProvider extends AppWidgetProvider {
    public void onUpdate(Context context, AppWidgetManager appWidgetManager,
                         int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            RemoteViews views = new RemoteViews(
                context.getPackageName(), R.layout.example_appwidget);
            views.setTextViewText(R.id.example_text, "Updated!");
            appWidgetManager.updateAppWidget(appWidgetId, views);
        }
    }
}
```

### 4. 在 AndroidManifest 中声明

```xml
<receiver android:name=".ExampleAppWidgetProvider">
    <intent-filter>
        <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
    </intent-filter>
    <meta-data
        android:name="android.appwidget.provider"
        android:resource="@xml/example_appwidget_info" />
</receiver>
```

## 局限性

- Widget 不能使用自定义 View 或 View 子类——只能使用 RemoteViews 支持的控件
- Widget 的更新频率由系统管理,`updatePeriodMillis` 最小值为 30 分钟
- 使用 ListView 或 GridView 时需要配合 RemoteViewsService 提供数据

## 参考

- [Create a simple widget — Android Developers](https://developer.android.com/develop/ui/views/appwidgets)
- [App Widgets Overview — Android Developers](https://developer.android.com/develop/ui/views/appwidgets/overview)
- [AppWidgetProvider API Reference](https://developer.android.com/reference/android/appwidget/AppWidgetProvider)
- [App Widget Design Guidelines](https://developer.android.com/design/ui/mobile/guides/widgets/)
- [Jetpack Glance (Compose-based Widgets)](https://developer.android.com/develop/ui/views/appwidgets/glance)
