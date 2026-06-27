---
title: "Remote Debugging on Android with Chrome"
date: 2015-03-24 14:54:02
slug: "RemoteDebuggingonAndroidwithChrome"
author: "haoxiqiang"
tags: ["android", "chrome", "debug"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Chrome DevTools 支持远程调试 Android 设备上的网页和 WebView 应用。这一功能对于移动端前端开发和混合应用开发来说非常实用,可以让我们使用桌面 Chrome 的完整开发者工具来调试移动端页面。

<!--more-->

## 前置要求

- 开发机上安装 **Chrome 32+**
- USB 数据线连接 Android 设备
- **浏览器调试**: Android 4.0+ 且安装了 Chrome for Android
- **WebView 调试**: Android 4.4+ (KitKat) 且 WebView 已配置为可调试模式

## 操作步骤

### 1. 连接设备

打开设备的开发者模式(设置 > 关于手机 > 连续点击版本号),确保 **USB 调试** 已启用,然后用数据线连接手机。

### 2. 打开 Chrome 检查页面

在桌面 Chrome 地址栏输入 `chrome://inspect`,确保 **Discover USB devices** 已勾选。设备首次连接时可能会弹出授权确认,点击确定即可。

![chrome-discover-usb](/images/chrome-discover-usb.png)

### 3. 检查浏览器标签页

此时 Chrome 会列出设备上已打开的浏览器标签页,点击 **inspect** 即可打开 DevTools 调试界面。

![chrome-inspect-tabs](/images/chrome-inspect-tabs.png)

### 4. 调试 WebView 应用

如果想调试自己的应用中的 WebView,需要在代码中添加:

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.KITKAT) {
    WebView.setWebContentsDebuggingEnabled(true);
}
```

> 生产环境中建议仅在 debug 构建中启用,或通过编译开关控制。

![chrome-debug-webview](/images/chrome-debug-webview.png)

### 5. 实时显示设备屏幕

点击 DevTools 中的 **Screencast** 图标,可以实时查看设备屏幕,并在桌面上直接操作。

![screencast-icon-location](/images/screencast-icon-location.png)

## 调试技巧

- 按 **F5** (Mac 上为 **Cmd+R**) 从 DevTools 刷新远程页面
- 使设备使用 **蜂窝网络**连接,在 Network 面板中查看真实移动网络下的网络瀑布图
- 使用 **Timeline 面板** 分析渲染和 CPU 性能——移动设备的硬件通常远慢于开发机
- 如果开发服务器无法从设备访问,使用端口转发(Port Forwarding)或虚拟主机映射(Virtual Host Mapping)

## 端口转发

手机通常无法直接访问开发服务器(它们可能处于不同的网络,或开发机处于受限的企业网络中)。Chrome 的端口转发功能通过在手机上创建一个监听 TCP 端口,将流量通过 USB 转发到开发机的指定端口,从而解决这个问题。

设置步骤:

1. 打开 `chrome://inspect`
2. 点击 **Port Forwarding**
3. 在 **Device port** 中填写设备要监听的端口(默认 8080)
4. 在 **Host** 中填写开发服务器的 IP 和端口(端口必须在 1024-65535 之间)
5. 勾选 **Enable port forwarding**
6. 点击 **Done**

![port-forwarding-on-device](/images/port-forwarding-on-device.png)

## 虚拟主机映射

如果需要使用自定义域名访问本地开发服务器:

1. 在开发机上安装代理软件(如 Charles Proxy 或 Squid),运行代理并记下端口号
2. 在 `chrome://inspect` 中设置端口转发,Device port 填写 9000,Host 填写 `localhost:代理端口`
3. 在 Android 设备的 Wi-Fi 设置中手动配置代理为 `localhost:9000`

## 常见问题

**设备未显示在 `chrome://inspect` 页面**

- Windows 用户需确认安装了正确的 USB 驱动,参见 [OEM USB Drivers](https://developer.android.com/studio/run/oem-usb)
- 确保设备直接连接到电脑(不要经过 USB Hub)
- 确认已启用 USB 调试,并在设备上同意 USB 调试授权
- 桌面 Chrome 版本需高于设备上的 Chrome for Android 版本,可尝试 Chrome Canary
- 如果仍然不行,在设备上进入 设置 > 开发者选项 > 撤销 USB 调试授权,重新连接

**浏览器标签页未显示**

- 在设备上打开 Chrome 并加载要调试的网页,然后刷新 `chrome://inspect`

**WebView 未显示**

- 确认 WebView 调试已启用(`setWebContentsDebuggingEnabled(true)`)
- 在设备上打开包含 WebView 的应用,然后刷新 `chrome://inspect`

**无法访问开发服务器**

- 尝试启用端口转发或设置虚拟主机映射

如果上述方法都无效,可以使用 adb 工具的传统方案作为备选。

## 参考

- [Remote debugging WebViews — Chrome DevTools](https://developer.chrome.com/docs/devtools/remote-debugging/webviews)
- [Debugging Web Apps — Android Developers](https://developer.android.com/develop/ui/views/layout/webapps/debug-chrome-devtools)
- [OEM USB Drivers — Android Developers](https://developer.android.com/studio/run/oem-usb)
- [Chrome DevTools Remote Debugging](https://developer.chrome.com/docs/devtools/remote-debugging)
