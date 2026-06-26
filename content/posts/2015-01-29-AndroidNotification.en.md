---
title: "Android Notification Guide"
date: 2015-01-29 15:26:07
author: "haoxiqiang"
tags: ["android", "notification"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

The notification system is a critical channel for user-app interaction on Android — it keeps users informed of important events even when the app is not in the foreground, such as incoming messages or calendar reminders. Notifications received a major overhaul in Android 4.1 (Jelly Bean) and continued to see refinements through Android 5.0 (Lollipop). Since 4.1, Android supports action buttons at the bottom of notifications, allowing users to perform common tasks directly without opening the app.

> **Note**: This article was written for the Android 4.1–5.0 era APIs. Starting from Android 8.0 (API 26), all notifications must be assigned to a Notification Channel. Android 13 (API 33) introduced the `POST_NOTIFICATIONS` runtime permission. The code examples below use `NotificationCompat` for backward compatibility; visual results may vary across devices.

![notification01](/images/notification01.jpg)

<!--more-->

## Basic Usage

All examples use `android.support.v4.app.NotificationCompat`. Creating a basic notification takes only a few lines:

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

## Click Behavior and Activity Navigation

To navigate to an in-app page when the user taps the notification, attach a `PendingIntent`:

```java
Intent resultIntent = new Intent(context, ResultActivity.class);
PendingIntent resultPendingIntent = PendingIntent.getActivity(
        context, 0, resultIntent, PendingIntent.FLAG_UPDATE_CURRENT);
// ...
mBuilder.setContentIntent(resultPendingIntent);
```

One detail often overlooked: `android:excludeFromRecents` controls whether the Activity appears in the recent tasks list.

```xml
<activity android:name=".ResultActivity"
    android:launchMode="singleTask"
    android:taskAffinity=""
    android:excludeFromRecents="false"/>
```

There are two common scenarios for notification-driven Activity navigation.

### Regular Activity (with Back Stack)

Use when the notification launches an Activity that is part of the app's normal workflow — the user should be able to press back to return to the previous screen. Build a proper back stack using `TaskStackBuilder`:

```java
Intent resultIntent = new Intent(context, ParentActivity.class);
TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
// Add the back stack
stackBuilder.addParentStack(ParentActivity.class);
// Add the Intent to the top of the stack
stackBuilder.addNextIntent(resultIntent);
// Obtain a PendingIntent containing the full back stack
PendingIntent resultPendingIntent =
        stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);
```

### Special Activity (No Back Stack)

Use when the Activity is only reachable from the notification — it serves as an extension of the notification, displaying information that doesn't fit in the notification itself:

```java
Intent notifyIntent = new Intent();
notifyIntent.setComponent(new ComponentName(context, NewTaskActivity.class));
notifyIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
PendingIntent notifyPendingIntent = PendingIntent.getActivity(
        context, 0, notifyIntent, PendingIntent.FLAG_UPDATE_CURRENT);
```

## Updating and Canceling Notifications

Avoid creating a brand new notification every time. Instead, update an existing one — either modify its content or append new information. To make a notification updatable, assign a unique `ID` when publishing via `NotificationManager.notify(ID, notification)`. To update, rebuild the `NotificationCompat.Builder` and re-publish with the same ID:

```java
mBuilder.setNumber(20); // The notification badge will show 20
```

A notification is removed under the following conditions:

- The user manually clears it or taps "Clear All" (if the notification is dismissable)
- `setAutoCancel()` was set and the user tapped the notification
- `NotificationManager.cancel(ID)` was called — this also removes ongoing notifications
- `NotificationManager.cancelAll()` was called — removes all previously published notifications

## Notification Styles

Android 4.1 introduced Big Views, allowing notifications to display richer content.

### BigTextStyle

For displaying lengthy text:

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

For displaying a large image:

```java
.setStyle(new NotificationCompat.BigPictureStyle()
        .setBigContentTitle("BigContentTitle")
        .setSummaryText("SummaryText")
        .bigPicture(bitmapDrawable.getBitmap()));
```

![notification05](/images/notification05.png)

### InboxStyle

For displaying a list of multiple messages:

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

## Progress Bar Notifications

Notifications can include a progress bar. If you can estimate the total duration and current progress, use **determinate** mode to show a percentage. Otherwise, use **indeterminate** mode for a continuous animation.

```java
// Start a lengthy operation in a background thread
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
                    .setProgress(0, 0, false); // Remove the progress bar
            mNotifyManager.notify(mNotificationId, mBuilder.build());
        }
    }).start();

// Indeterminate mode
// .setProgress(0, 0, true);
```

## References

- [Android Notification Overview (developer.android.com)](https://developer.android.com/develop/ui/views/notifications)
- [Create a Notification (developer.android.com)](https://developer.android.com/develop/ui/views/notifications/build-notification)
- [Start an Activity from a Notification (developer.android.com)](https://developer.android.com/develop/ui/views/notifications/navigation)
- [NotificationCompat API Reference (developer.android.com)](https://developer.android.com/reference/androidx/core/app/NotificationCompat)
- [NotificationCompat.Builder API Reference (developer.android.com)](https://developer.android.com/reference/androidx/core/app/NotificationCompat.Builder)
- [TaskStackBuilder API Reference (developer.android.com)](https://developer.android.com/reference/androidx/core/app/TaskStackBuilder)
- [Notifications Design Guide (developer.android.com)](https://developer.android.com/design/ui/mobile/guides/home-screen/notifications)
