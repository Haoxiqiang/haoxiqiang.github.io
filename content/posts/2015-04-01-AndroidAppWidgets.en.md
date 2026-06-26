---
title: "Android App Widgets"
date: 2015-04-01 10:37:26
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

An App Widget is a miniature application view that can be embedded into other applications (such as the Home screen) and receive periodic updates. Common examples include weather widgets and music player controls.

![appwidget](/images/appwidget.png)

<!--more-->

## Architecture

An App Widget consists of three core components:

- **AppWidgetProviderInfo**: metadata defining the widget (layout, update frequency, size), declared in XML
- **AppWidgetProvider**: extends BroadcastReceiver, handles widget lifecycle events
- **View Layout**: the widget's UI layout, built using RemoteViews

## Key Lifecycle Methods

| Method | Trigger |
|--------|---------|
| `onUpdate()` | At each update interval; the only required method |
| `onAppWidgetOptionsChanged()` | When the widget is resized |
| `onEnabled(Context)` | When the first widget instance is created |
| `onDisabled(Context)` | When the last widget instance is removed |
| `onDeleted(Context, int[])` | When widget instances are deleted |

## How to Create a Widget

### 1. Define Widget Metadata

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

### 2. Create the Layout

Widget layouts use RemoteViews, which supports a limited set of views (FrameLayout, LinearLayout, RelativeLayout, GridLayout, Button, TextView, ImageView, etc.):

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

### 3. Implement the Provider

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

### 4. Declare in AndroidManifest

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

## Limitations

- Custom Views or View subclasses cannot be used — only views supported by RemoteViews
- Update frequency is managed by the system; `updatePeriodMillis` has a minimum of 30 minutes
- ListView and GridView widgets require a RemoteViewsService for data provision

## References

- [Create a simple widget — Android Developers](https://developer.android.com/develop/ui/views/appwidgets)
- [App Widgets Overview — Android Developers](https://developer.android.com/develop/ui/views/appwidgets/overview)
- [AppWidgetProvider API Reference](https://developer.android.com/reference/android/appwidget/AppWidgetProvider)
- [App Widget Design Guidelines](https://developer.android.com/design/ui/mobile/guides/widgets/)
- [Jetpack Glance (Compose-based Widgets)](https://developer.android.com/develop/ui/views/appwidgets/glance)
