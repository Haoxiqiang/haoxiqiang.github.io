---
title: "Make Your App the Default SMS App"
date: 2015-05-18 16:49:21
slug: "DefaultApp"
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

使用 Google Messenger 时发现它有设置默认短信应用的功能，于是研究了一下实现方式。

Android 4.4 KitKat 开始，Google 推出了默认短信应用的机制。官方对此的解释是：

> Some of you have built SMS apps using hidden APIs — a practice we discourage because hidden APIs may be changed or removed and new devices are not tested against them for compatibility. So, to provide you with a fully supported set of APIs for building SMS apps.

简而言之，做得足够好、用户量足够大，Google 就会重视并官方支持。

<!--more-->

## API 概览

从 Android 4.4 开始引入了两个新 Intent：

- `SMS_DELIVER_ACTION` — 短信
- `WAP_PUSH_DELIVER_ACTION` — 彩信

## 设置默认应用

```java
Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
startActivity(intent);
```

## 完整实现：注册与取消注册

```java
// 检查当前是否是默认短信应用
currentPackageName = getPackageName();
String defaultSmsApp = Telephony.Sms.getDefaultSmsPackage(this);
if (currentPackageName != null && !currentPackageName.equals(defaultSmsApp)) {
    SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString(DEDAULTSMS, defaultSmsApp);
    editor.apply();
}

// 注册为默认
register.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
        intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
        startActivity(intent);
    }
});

// 恢复默认
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

## 关键逻辑说明

代码的核心思路：

1. 启动时保存当前默认短信应用的包名到 SharedPreferences
2. 用户点击"注册"时，将自己设为默认
3. 用户点击"取消注册"时，从 SharedPreferences 读取之前的默认应用并恢复

**关于 Android Q (10) 的变更**：
从 Android 10 开始，Google 引入了 `RoleManager` API，推荐使用 `RoleManager.createRequestRoleIntent(RoleManager.ROLE_SMS)` 替代旧的 `ACTION_CHANGE_DEFAULT` 方式。但上述实现仍兼容大多数版本。

## 参考资料

- [Telephony API 参考文档](https://developer.android.com/reference/android/provider/Telephony)
- [Telephony.Sms.Intents - ACTION_CHANGE_DEFAULT](https://developer.android.com/reference/android/provider/Telephony.Sms.Intents#ACTION_CHANGE_DEFAULT)
- [Getting Your SMS Apps Ready for KitKat](https://android-developers.googleblog.com/2013/10/getting-your-sms-apps-ready-for-kitkat.html)
