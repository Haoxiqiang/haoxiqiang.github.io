---
title: "Android 通知机制详解"
date: 2015-01-29 15:26:07
slug: "AndroidNotification"
author: "haoxiqiang"
tags: ["android", "notification"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

通知系统是 Android 平台上用户与应用交互的重要通道——它能在应用不处于前台时告知用户重要事件，如来消息或日历提醒。`Notification` 本身在 Android 4.1 (Jelly Bean) 经历过一次重大升级，后续在 5.0 (Lollipop) 又有诸多细节改进。从 4.1 开始，Android 支持在通知底部附加操作按钮，用户无需打开应用即可直接执行常见任务，配合滑出清除，使通知抽屉的体验更加顺滑。

> **注意**：本文基于 Android 4.1—5.0 时代的 API 编写。自 Android 8.0 (API 26) 起，所有通知必须归属到通知渠道（Notification Channel）；Android 13 (API 33) 起需要运行时权限 `POST_NOTIFICATIONS`。下文代码示例使用 `NotificationCompat` 以保证对低版本的兼容性，在不同设备上效果可能略有差异。

![notification01](/images/notification01.jpg)

<!--more-->

## 基础用法

所有示例均通过 `android.support.v4.app.NotificationCompat` 实现。创建一个最基本的通知只需要几行代码：

```java
public static void showNotification(Context context, int mNotificationId) {
    NotificationCompat.Builder mBuilder =
            new NotificationCompat.Builder(context)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle("SimpleNotification")
                    .setContentText("Hello World! This is the first notification.");
    NotificationManager mNotifyMgr =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    mNotifyMgr.notify(mNotificationId, mBuilder.build());
}
```

## 点击行为与 Activity 导航

如果希望用户点击通知后跳转到应用内的某个页面，需要为通知设置一个 `PendingIntent`：

```java
Intent resultIntent = new Intent(context, ResultActivity.class);
// 因为是通知触发的"特殊"Activity，无需构建人工返回栈
PendingIntent resultPendingIntent = PendingIntent.getActivity(
        context, 0, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);
// ...
mBuilder.setContentIntent(resultPendingIntent);
```

这里有一个容易忽略的细节：`android:excludeFromRecents` 可以控制 Activity 是否出现在最近任务列表中。

```xml
<activity android:name=".ResultActivity"
    android:launchMode="singleTask"
    android:taskAffinity=""
    android:excludeFromRecents="false"/>
```

通知所指向的页面通常分为两种场景。

### 常规 Activity（带返回栈）

适用于通知启动的是应用工作流中的某个环节，用户应当能够按返回键回到上一级页面。使用 `TaskStackBuilder` 构建完整的返回栈：

```java
Intent resultIntent = new Intent(context, ParentActivity.class);
TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
// 添加返回栈
stackBuilder.addParentStack(ParentActivity.class);
// 将 Intent 放入栈顶
stackBuilder.addNextIntent(resultIntent);
// 获取包含完整返回栈的 PendingIntent
PendingIntent resultPendingIntent =
        stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
```

### 特定 Activity（无返回栈）

适用于用户只能从通知进入的页面，相当于通知的扩展，展示通知本身难以容纳的信息：

```java
Intent notifyIntent = new Intent();
notifyIntent.setComponent(new ComponentName(context, NewTaskActivity.class));
notifyIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
PendingIntent notifyPendingIntent = PendingIntent.getActivity(
        context, 0, notifyIntent, PendingIntent.FLAG_UPDATE_CURRENT);
```

## 更新与取消通知

避免每次都生成全新的通知。应当尽量更新已有的通知——要么修改内容，要么增加信息。要实现可更新的通知，发布时需通过 `NotificationManager.notify(ID, notification)` 指定一个唯一 `ID`。更新时只需修改或重建 `NotificationCompat.Builder` 对象，然后以相同的 `ID` 再次发布：

```java
mBuilder.setNumber(20); // 通知数字将显示为 20
```

通知的消失由以下几种情况控制：

- 用户手动清除单条通知，或点击"清除所有"（前提是通知可被清除）
- 创建时调用了 `setAutoCancel()` 且用户点击了该通知
- 调用了 `NotificationManager.cancel(ID)`，这也会移除正在进行的通知
- 调用了 `NotificationManager.cancelAll()`，移除所有此前发布的通知

## 通知样式

Android 4.1 引入了大视图（Big Views），让通知能够展示更多内容。

### BigTextStyle

展示大段文字：

```java
.setStyle(new NotificationCompat.BigTextStyle()
        .setBigContentTitle("BigContentTitle")
        .setSummaryText("SummaryText")
        .bigText("I'm a big text message"))
.addAction(R.mipmap.ic_stat_dismiss, "dismiss", notifyPendingIntent)
.addAction(R.mipmap.ic_stat_snooze, "snooze", notifyPendingIntent);
```

![notification03](/images/notification03.png)

### BigPictureStyle

展示大图：

```java
.setStyle(new NotificationCompat.BigPictureStyle()
        .setBigContentTitle("BigContentTitle")
        .setSummaryText("SummaryText")
        .bigPicture(bitmapDrawable.getBitmap()));
```

![notification05](/images/notification05.png)

### InboxStyle

展示多条消息列表：

```java
.setStyle(new NotificationCompat.InboxStyle()
        .setBigContentTitle("BigContentTitle")
        .setSummaryText("SummaryText")
        .addLine("aaaaaaaaaaaaaaaaa")
        .addLine("bbbbbbbbbbbbbbbbb")
        .addLine("ccccccccccccccccc")
        .addLine("ddddddddddddddddd"));
```

![notification04](/images/notification04.png)

## 进度条通知

通知可以包含进度条。如果能够估算操作总时长和当前进度，使用 determinate 模式显示百分比进度；否则使用 indeterminate 模式显示连续动画进度。

```java
// 在后台线程中执行耗时操作
new Thread(
    new Runnable() {
        @Override
        public void run() {
            int incr;
            for (incr = 0; incr <= 100; incr += 5) {
                mBuilder.setProgress(100, incr, false);
                mNotifyManager.notify(mNotificationId, mBuilder.build());
                try {
                    Thread.sleep(5 * 1000);
                } catch (InterruptedException e) {
                    Log.d("showNotificationWithDeterminate", "sleep failure");
                }
            }
            mBuilder.setContentText("Download complete")
                    .setProgress(0, 0, false); // 移除进度条
            mNotifyManager.notify(mNotificationId, mBuilder.build());
        }
    }).start();

// indeterminate 模式
// .setProgress(0, 0, true);
```

## 参考资料

- [Android Notification Overview (developer.android.com)](https://developer.android.com/develop/ui/views/notifications)
- [Create a Notification (developer.android.com)](https://developer.android.com/develop/ui/views/notifications/build-notification)
- [Start an Activity from a Notification (developer.android.com)](https://developer.android.com/develop/ui/views/notifications/navigation)
- [NotificationCompat API Reference (developer.android.com)](https://developer.android.com/reference/androidx/core/app/NotificationCompat)
- [NotificationCompat.Builder API Reference (developer.android.com)](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
- [TaskStackBuilder API Reference (developer.android.com)](https://developer.android.com/reference/androidx/core/app/TaskStackBuilder)
- [Notifications Design Guide (developer.android.com)](https://developer.android.com/design/ui/mobile/guides/home-screen/notifications)
