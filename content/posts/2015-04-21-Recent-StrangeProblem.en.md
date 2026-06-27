---
title: "Strange Problems I Encountered Recently"
date: 2015-04-21 14:41:34
slug: "Recent-StrangeProblem"
author: "haoxiqiang"
tags: ["android", "troubleshooting"]
categories: ["Android"]
ShowToc: true
TocOpen: false
---

A collection of obscure Android development issues and their solutions.

<!--more-->

## 1. Android Studio Fails to Compile a New Project

```
Error:Execution failed for task :app:mergeDebugResources.
> Crunching Cruncher ic_launcher.png failed, see logs
```

**Root cause**: In early versions of Android Studio, an incomplete resource directory structure could trigger this error.

**Fix**: Create a `drawable-hdpi` or `drawable-xhdpi` folder.

## 2. Meilan Note Cannot Connect via ADB

When your device won't connect over USB despite all normal conditions being met, you may need to add the USB **Vendor ID**.

**Solution (macOS)**:

1. Find the Vendor ID via System Information or `system_profiler SPUSBDataType`
2. Edit `~/.android/adb_usb.ini` and append `0x2a45` (Meizu's vendor ID)
3. Restart ADB and reconnect:
   ```bash
   adb kill-server
   adb start-server
   ```

See: [Android ADB Documentation](https://developer.android.com/studio/command-line/adb)

## 3. App Installation Fails Due to Signature Mismatch

```
Package com.yuexue.tifenapp signatures do not match the previously installed version; ignoring!
```

**Root cause**: The installed version has a different signature than the one you're trying to install. This commonly happens when switching between debug and release signing keys.

**Fix**: Uninstall the conflicting version first:

```bash
adb uninstall com.yuexue.tifenapp
```

Key notes:
- `adb -e` targets an emulator; without the `-e` flag ADB picks the only connected device
- To uninstall a system app from Google Play, use `adb shell pm uninstall -k --user 0 <pkg>` (requires root)
