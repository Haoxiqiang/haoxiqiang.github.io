---
title: "Make Your App the Default SMS App"
date: 2015-05-18 16:49:21
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

While using Google Messenger, I noticed it has a "set as default SMS app" feature. Here's how it works.

Starting from Android 4.4 KitKat, Google introduced the default SMS app mechanism. The official reasoning:

> Some of you have built SMS apps using hidden APIs — a practice we discourage because hidden APIs may be changed or removed and new devices are not tested against them for compatibility. So, to provide you with a fully supported set of APIs for building SMS apps.

In short, if you build well and have enough users, Google takes notice and provides official support.

<!--more-->

## API Overview

Two new intents were introduced in Android 4.4:

- `SMS_DELIVER_ACTION` — for SMS
- `WAP_PUSH_DELIVER_ACTION` — for MMS

## Making Your App the Default

```java
Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
startActivity(intent);
```

## Complete Implementation: Register and Unregister

```java
// Check if we are the default SMS app
currentPackageName = getPackageName();
String defaultSmsApp = Telephony.Sms.getDefaultSmsPackage(this);
if (currentPackageName != null && !currentPackageName.equals(defaultSmsApp)) {
    SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString(DEDAULTSMS, defaultSmsApp);
    editor.apply();
}

// Register as default
register.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
        intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
        startActivity(intent);
    }
});

// Restore the previous default
unregister.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        SharedPreferences sharedPreferences = PreferenceManager
                .getDefaultSharedPreferences(getApplicationContext());
        String defaultSmsApp = sharedPreferences.getString(DEDAULTSMS, null);
        if (defaultSmsApp != null) {
            Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
            intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, defaultSmsApp);
            startActivity(intent);
        } else {
            Toast.makeText(getApplicationContext(), "failed unregister", Toast.LENGTH_SHORT).show();
        }
    }
});
```

## Key Logic

1. On startup, save the current default SMS app's package name to SharedPreferences
2. When the user clicks "register", set the current app as default
3. When the user clicks "unregister", restore the previously saved default app

**Note for Android Q (10) and above**: Google introduced the `RoleManager` API. Use `RoleManager.createRequestRoleIntent(RoleManager.ROLE_SMS)` instead of `ACTION_CHANGE_DEFAULT` for newer versions. The above implementation still works across most Android versions.

## References

- [Telephony API Reference](https://developer.android.com/reference/android/provider/Telephony)
- [Telephony.Sms.Intents - ACTION_CHANGE_DEFAULT](https://developer.android.com/reference/android/provider/Telephony.Sms.Intents#ACTION_CHANGE_DEFAULT)
- [Getting Your SMS Apps Ready for KitKat](https://android-developers.googleblog.com/2013/10/getting-your-sms-apps-ready-for-kitkat.html)
