---
layout: post
title:  Make your app the default SMS app
date:   2015-05-18 16:49:21
author: 郝锡强
categories: blog
letex: false
tags: [android]
---
最近使用`Google Messenger`发现有一个设定默认短信的功能,很好奇,研究了一下.
现在有很多短信应用,很强大,可以帮助用户把一个短信费用转化成流量费用,于是google出来说话了
> Some of you have built SMS apps using hidden APIs—a practice we discourage because hidden APIs may be changed or removed and new devices are not tested against them for compatibility. So, to provide you with a fully supported set of APIs for building SMS apps
看起来,你做的足够好,用户足够大,还是挺被重视的
<!-- more -->

4.4开始有一个新的Intent,SMS_DELIVER_ACTION(短信),WAP_PUSH_DELIVER_ACTION(彩信),更改默认应用的方式很简单

{% highlight java %}
Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
startActivity(intent);
{% endhighlight %}

加一段代码
{% highlight java %}
currentPackageName = getPackageName();
String defaultSmsApp = Telephony.Sms.getDefaultSmsPackage(this);
if (currentPackageName != null && !currentPackageName.equals(defaultSmsApp)) {
    SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(this);
    SharedPreferences.Editor editor = sharedPreferences.edit();
    editor.putString(DEDAULTSMS, defaultSmsApp);
    editor.apply();
}
register.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Intent intent = new Intent(Telephony.Sms.Intents.ACTION_CHANGE_DEFAULT);
        intent.putExtra(Telephony.Sms.Intents.EXTRA_PACKAGE_NAME, getPackageName());
        startActivity(intent);
    }
});
unregister.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        SharedPreferences sharedPreferences = PreferenceManager.getDefaultSharedPreferences(getApplicationContext());
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
{% endhighlight %}
