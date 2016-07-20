---
layout: post
title:  Android的Notification
date:   2015-01-29 15:26:07
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
通知系统使用户得知应用中重要的事情，例如有新信息到来或者日历事件提醒。将通知作为一个新的通道，提醒用户重要的事情或者记录下用户没有注意到的事情。但是我们要注意到`Notification`本身在`Android 4.1`的时候有过重大升级,一直到`5.0`微小修改很多.从`4.1`开始,`Android`支持在通知底部显示附加操作。通过这些操作，用户可以对通知直接执行常见的任务，而不用打开应用。这样可以加快操作，配合上滑出消失操作，使用户的通知抽屉体验更加顺滑。上一张`5.0`的图

![notification01](/source/images/blog/notification01.jpg)
<!-- more -->

考虑到对低版本的兼容性,所有例子都通过`android.support.v4.app.NotificationCompat`来实现,效果这不同手机上会有不同

public static void showNotification(Context context,int mNotificationId){
    NotificationCompat.Builder mBuilder =
            new NotificationCompat.Builder(context)
                    .setSmallIcon(R.mipmap.ic_launcher)
                    .setContentTitle("SimpleNotification")
                    .setContentText("Hello World!This is the first notification.");
    NotificationManager mNotifyMgr =
            (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
    mNotifyMgr.notify(mNotificationId, mBuilder.build());
}

这样就能`show`出来一个`notification`的最基本的模样了,如果我们想在通知栏点击,然后跳转到一个应用内的页面,我们还得给这个`notification`设置一个行为

Intent resultIntent = new Intent(context, ResultActivity.class);
// Because clicking the notification opens a new ("special") activity, there's
// no need to create an artificial back stack.
PendingIntent resultPendingIntent = PendingIntent.getActivity(context,0,resultIntent,PendingIntent.FLAG_UPDATE_CURRENT);
...
mBuilder.setContentIntent(resultPendingIntent);
...

我这里发现一个以前没有注意到的细节,`android:excludeFromRecents`可以控制`Activity`是否会出现在`recently list`中

//Indicates that an Activity should be excluded from the list of recently launched activities.
//public static final int FLAG_ACTIVITY_EXCLUDE_FROM_RECENTS,If set, the new activity is not kept in the list of recently launched activities.
<activity android:name=".ResultActivity"
    android:launchMode="singleTask"
    android:taskAffinity=""
    android:excludeFromRecents="false"/>

这个行为指向的页面一般分为两种

* 常规`Activity`,你启动的是你`application`工作流中的一部分`Activity`。
* 特定`Activity` 用户只能从`notification`中启动，才能看到这个`Activity`，在某种意义上，这个`Activity`是`notification`的扩展，额外展示了一些`notification`本身难以展示的信息。

第一种

Intent resultIntent = new Intent(context, ParentActivity.class);
TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);
// Adds the back stack
stackBuilder.addParentStack(ParentActivity.class);
// Adds the Intent to the top of the stack
stackBuilder.addNextIntent(resultIntent);
// Gets a PendingIntent containing the entire back stack
PendingIntent resultPendingIntent =
        stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);

第二种

// Creates an Intent for the Activity
Intent notifyIntent = new Intent();
notifyIntent.setComponent(new ComponentName(context,NewTaskActivity.class));
// Sets the Activity to start in a new, empty task
notifyIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
// Creates the PendingIntent
PendingIntent notifyPendingIntent = PendingIntent.getActivity(context,0,notifyIntent,PendingIntent.FLAG_UPDATE_CURRENT);


以上是创建一个`Notification`的方式,如果现在已经发出来了一个`Notification`,你应该避免每次都生成一个全新的`Notification`。你应该考虑去更新先前的`Notification`，或者改变它的值，或者增加一些值.想要设置一个可以被更新的`Notification`,需要在发布它的时候调用`NotificationManager.notify(ID, notification))`方法为它指定一个`notification ID`。更新一个已经发布的`Notification`,需要更新或者创建一个`NotificationCompat.Builder`对象,并从这个对象创建一个`Notification`对象，然后用与先前一样的`ID`去发布这个`Notification`。

...
//like this,notification will be 20.
mBuilder.setNumber(20);
...

我们每次创建出来的`Notifications`不会消失,除非除非下面任何一种情况发生。

* 用户清除`Notification`,单独或者使用`清除所有`(如果`Notification`能被清除)
* 你在创建`Notification`时调用了[setAutoCancel](http;//developer.android.com/reference/android/support/v4/app/NotificationCompat.Builder.html#setAutoCancel(boolean))方法，以及用户点击了这个`Notification`，
* 你为一个指定的`Notification ID`调用了[cancel()](http://developer.android.com/reference/android/app/NotificationManager.html#cancel(int))方法。这个方法也会删除正在进行的`notifications`。
* 你调用了[cancelAll()](http://developer.android.com/reference/android/app/NotificationManager.html#cancelAll())方法，它将会移除你先前发布的所有`Notification`。

在`Android4.1`引进了`Big views`,使用起来也很简单,比如这个是`BigTextStyle`

...
.setStyle(new NotificationCompat.BigTextStyle().setBigContentTitle("BigContentTitle").setSummaryText("SummaryTextSummaryText")
        .bigText("I'm a big text message"))
.addAction (R.mipmap.ic_stat_dismiss,"dismiss",notifyPendingIntent)
.addAction (R.mipmap.ic_stat_snooze,
        "snooze", notifyPendingIntent);
...

![notification03](/source/images/blog/notification03.png)

...
.setStyle(new NotificationCompat.BigPictureStyle()
            .setBigContentTitle("BigContentTitle")
            .setSummaryText("SummaryTextSummaryText")
            .bigPicture(bitmapDrawable.getBitmap()))
...

![notification05](/source/images/blog/notification05.png)

...
.setStyle(new NotificationCompat.InboxStyle()
            .setBigContentTitle("BigContentTitle")
            .setSummaryText("SummaryTextSummaryText")
            .addLine("aaaaaaaaaaaaaaaaa")
            .addLine("bbbbbbbbbbbbbbbbb")
            .addLine("ccccccccccccccccc")
            .addLine("ddddddddddddddddd")
    )
...

![notification04](/source/images/blog/notification04.png)

`Notifications`可以包含一个进度条。如果你可以在任何时候估算这个操作得花多少时间以及当前已经完成多少,如果是`determinate`就显示一个百分比的进度条,如果`indeterminate`则显示一个连续的进度显示.

...
// Start a lengthy operation in a background thread
new Thread(
    new Runnable() {
        @Override
        public void run() {
            int incr;
            // Do the "lengthy" operation 20 times
            for (incr = 0; incr <= 100; incr+=5) {
                mBuilder.setProgress(100, incr, false);
                mNotifyManager.notify(mNotificationId, mBuilder.build());
                try {
                    // Sleep for 5 seconds
                    Thread.sleep(5*1000);
                } catch (InterruptedException e) {
                    Log.d("showNotificationWithDeterminate", "sleep failure");
                }
            }
            mBuilder.setContentText("Download complete")
                    // Removes the progress bar
                    .setProgress(0,0,false);
            mNotifyManager.notify(mNotificationId, mBuilder.build());
        }
    }
// Starts the thread by calling the run() method in its Runnable
).start();
...
.setProgress(0, 0, true);
...
