# Fix for Expo Start Error on Windows

## Problem
Error: `ENOENT: no such file or directory, mkdir 'node:sea'`

This happens because Windows doesn't allow colons (`:`) in directory names, and Expo is trying to create a directory named `node:sea`.

## Solutions (Try in Order)

### ✅ Solution 1: Use Tunnel Mode (Recommended)
```bash
npx expo start --tunnel
```
This bypasses local path issues and works great with Expo Go!

### ✅ Solution 2: Use Web Version
```bash
npx expo start --web
```
Opens in browser - perfect for testing UI.

### ✅ Solution 3: Update Expo (Already Done)
```bash
npm install expo@latest
```
✅ Already completed!

### Solution 4: Use Android Studio Emulator
Instead of Expo Go:
1. Install Android Studio
2. Create virtual device
3. Run: `npx expo start --android`

### Solution 5: Downgrade Node.js (If needed)
If Node.js 24 causes issues, try Node.js 20 LTS:
- Download: https://nodejs.org/
- Install Node.js 20.x LTS
- Run: `npm install` again

## Current Status
- ✅ Expo updated to latest version
- ✅ Node.js v24.5.0 (very new, might need LTS version)
- ⏳ Trying tunnel mode...

## Quick Commands

```bash
# Tunnel mode (best for Expo Go)
npx expo start --tunnel

# Web version (for testing)
npx expo start --web

# Android emulator (if installed)
npx expo start --android

# Clear cache and retry
npx expo start --clear
```

## Using Expo Go with Tunnel Mode

1. Run: `npx expo start --tunnel`
2. Wait for QR code to appear
3. Open Expo Go app on phone
4. Scan QR code
5. App loads! 🎉

---

**Note**: Tunnel mode requires internet connection but works around Windows path issues.




