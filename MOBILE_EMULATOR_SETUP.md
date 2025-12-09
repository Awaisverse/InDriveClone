# Mobile Emulator Setup Guide - RideShare

## 📱 Two Options to View Your App

### Option 1: Expo Go (Easiest - Physical Device) ⭐ Recommended
### Option 2: Android Studio Emulator (Virtual Device)

---

## 🚀 Option 1: Expo Go - Physical Device (Recommended)

### Step 1: Install Expo Go App

**For Android:**
- Go to [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
- Search "Expo Go"
- Install the app

**For iOS:**
- Go to [App Store](https://apps.apple.com/app/expo-go/id982107779)
- Search "Expo Go"
- Install the app

### Step 2: Start Your Development Server

```bash
cd frontend
npm start
```

This will:
- Start the Expo development server
- Show a QR code in your terminal
- Open Expo DevTools in your browser

### Step 3: Connect Your Device

**Android:**
1. Open Expo Go app
2. Tap "Scan QR code"
3. Scan the QR code from terminal/browser
4. App will load on your device!

**iOS:**
1. Open Camera app (or Expo Go)
2. Scan the QR code from terminal/browser
3. Tap the notification to open in Expo Go
4. App will load on your device!

### Step 4: Development

- Your device and computer must be on the same WiFi network
- Changes will reload automatically (Hot Reload)
- Shake device to open developer menu

---

## 💻 Option 2: Android Studio Emulator

### Step 1: Install Android Studio

1. Download: [Android Studio](https://developer.android.com/studio)
2. Install with default settings
3. During installation, make sure to install:
   - Android SDK
   - Android SDK Platform
   - Android Virtual Device (AVD)

### Step 2: Create Virtual Device

1. Open Android Studio
2. Click "More Actions" → "Virtual Device Manager"
3. Click "Create Device"
4. Select a device (e.g., Pixel 5)
5. Select a system image (e.g., Android 13 - API 33)
6. Click "Finish"

### Step 3: Start Emulator

1. In Virtual Device Manager, click ▶️ (Play button) next to your device
2. Wait for emulator to boot (first time takes a few minutes)

### Step 4: Run Your App

```bash
cd frontend
npm start
```

Then:
- Press `a` in the terminal to open on Android emulator
- Or scan QR code with emulator's camera

---

## 🎯 Quick Start Commands

### Start Development Server
```bash
cd frontend
npm start
```

### Open on Android Emulator
```bash
cd frontend
npm run android
```

### Open on iOS Simulator (Mac only)
```bash
cd frontend
npm run ios
```

### Open in Web Browser
```bash
cd frontend
npm run web
```

---

## 📋 Prerequisites Checklist

### For Expo Go (Physical Device)
- ✅ Node.js installed
- ✅ Expo Go app installed on phone
- ✅ Phone and computer on same WiFi
- ✅ Frontend dependencies installed (`npm install` in frontend folder)

### For Android Studio Emulator
- ✅ Android Studio installed
- ✅ Android SDK installed
- ✅ Virtual Device created
- ✅ Frontend dependencies installed

---

## 🔧 Troubleshooting

### Expo Go Issues

**QR Code not scanning:**
- Make sure phone and computer are on same WiFi
- Try typing the URL manually in Expo Go
- Check firewall isn't blocking connection

**App not loading:**
- Restart Expo server: `npm start -- --clear`
- Check if backend is running (if using API)
- Verify all dependencies installed

### Android Emulator Issues

**Emulator not starting:**
- Enable virtualization in BIOS (Intel VT-x or AMD-V)
- Check if Hyper-V is enabled (Windows)
- Try creating a new virtual device

**App not opening:**
- Make sure emulator is fully booted
- Check if Expo server is running
- Try `npm run android` command

---

## 📱 Testing on Multiple Devices

### Physical Devices
1. Install Expo Go on each device
2. Scan same QR code from all devices
3. All devices will show the same app

### Virtual Devices
1. Create multiple AVDs in Android Studio
2. Start each emulator
3. Run `npm run android` and select device

---

## 🎨 Viewing Different Screen Sizes

### With Expo Go
- Test on different physical devices (phone, tablet)
- Each device shows real screen size

### With Android Studio
- Create AVDs with different screen sizes:
  - Phone: Pixel 5 (1080x2340)
  - Tablet: Pixel Tablet (2560x1600)
  - Small: Pixel 2 (1080x1920)

---

## ✅ Recommended Setup

**For Quick Testing:** Use Expo Go on your physical device
- Fastest setup
- Real device testing
- Easy to share with others

**For Development:** Use Android Studio Emulator
- Test different screen sizes
- No need for physical device
- Better for debugging

---

## 🚀 Next Steps

1. Install Expo Go on your phone
2. Run `cd frontend && npm start`
3. Scan QR code
4. See your RideShare app live!

---

**Need Help?** Check Expo documentation: https://docs.expo.dev/




