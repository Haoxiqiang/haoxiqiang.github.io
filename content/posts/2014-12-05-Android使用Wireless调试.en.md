---
title: "Wireless Debugging on Android"
date: 2014-12-05 11:35:07
author: "haoxiqiang"
tags: ["android"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

Ever since getting a Nexus device, I never wanted to plug in a USB cable again. Android supports ADB debugging over WiFi, making cable-free development a reality.

<!--more-->

## Prerequisites

- Phone and computer on the same local network
- Developer Options and USB Debugging enabled on the phone
- ADB tools installed on the computer

## Legacy Method (Android 10 and below)

Connect your phone via USB and switch ADB to TCP/IP mode:

```bash
# Make sure adb is running in USB mode
$ adb usb
restarting in USB mode

# Verify the device is detected
$ adb devices
List of devices attached
######## device

# Restart adb in TCP/IP mode on port 5555
$ adb tcpip 5555
restarting in TCP mode port: 5555
```

Find your phone's IP address (`Settings > About phone > Status > IP address`), then connect wirelessly:

```bash
# Connect to the device over WiFi
$ adb connect your_ip
connected to #.#.#.#:5555

# Remove USB cable and confirm the device is still accessible
$ adb devices
List of devices attached
#.#.#.#:5555 device
```

Now you can debug wirelessly without any cables.

## Troubleshooting

If the connection drops or fails:

1. Make sure both devices are on the same network subnet
2. Restart ADB and try again:

```bash
$ adb kill-server
$ adb start-server
$ adb tcpip 5555
$ adb connect your_ip
```

If it still doesn't work, plug the USB cable back in and repeat the full process.

## Android 11+ Native Wireless Debugging

Android 11 introduced a **Wireless debugging** option that requires no initial USB connection:

1. Enable Developer Options and Wireless Debugging
2. Select "Pair device with pairing code"
3. On your computer, run:

```bash
$ adb pair IP_address:pairing_port
# Enter the 6-digit pairing code
$ adb connect IP_address:connection_port
```

This method uses TLS-encrypted communication, offering better security than the legacy `adb tcpip` approach.

## References

- [Run apps on a hardware device | Android Developers](https://developer.android.com/studio/run/device.html)
- [Android Debug Bridge (adb) | Android Developers](https://developer.android.com/tools/adb)
- [ADB over Wi-Fi and Ethernet | ChromeOS Developers](https://chromeos.dev/en/android-environment/adb-over-wifi-and-ethernet)
- [ADB Wifi Architecture | AOSP](https://android.googlesource.com/platform/packages/modules/adb/+/main/docs/dev/adb_wifi.md)
