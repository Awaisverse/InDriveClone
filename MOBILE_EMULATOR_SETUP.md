# Mobile Emulator Setup Guide - RideShare App

## 📱 Options to View Your App on Different Devices

### Option 1: Expo Go App (Easiest - Physical Device) ⭐ Recommended

**Best for**: Quick testing on real devices

#### Steps:
1. **Install Expo Go** on your phone:
   - Android: [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)

2. **Start Expo Dev Server**:
   ```bash
   cd frontend
   npm start
   ```

3. **Scan QR Code**:
   - Open Expo Go app
   - Scan the QR code from terminal
   - App will load on your device!

**Pros**: 
- ✅ Works on real devices
- ✅ No emulator setup needed
- ✅ Hot reload works perfectly
- ✅ Test on multiple devices easily

---

### Option 2: Android Studio Emulator (Windows/Mac/Linux)

**Best for**: Testing Android-specific features

#### Setup Steps:

1. **Download Android Studio**:
   - Download: https://developer.android.com/studio
   - Install Android Studio

2. **Install Android SDK**:
   - Open Android Studio
   - Go to: Tools → SDK Manager
   - Install: Android SDK Platform, Android SDK Build-Tools
   - Install: Android Emulator

3. **Create Virtual Device**:
   - Go to: Tools → Device Manager
   - Click "Create Device"
   - Select device (e.g., Pixel 5, Samsung Galaxy)
   - Select system image (e.g., Android 13)
   - Finish setup

4. **Start Emulator**:
   ```bash
   # Start Android emulator from command line
   emulator -avd <device_name>
   
   # Or start from Android Studio: Tools → Device Manager → Play button
   ```

5. **Run Expo App**:
   ```bash
   cd frontend
   npm start
   # Press 'a' to open in Android emulator
   ```

**Pros**:
- ✅ Multiple device sizes
- ✅ Different Android versions
- ✅ Full Android features

---

### Option 3: Expo Web Preview (Quick Preview)

**Best for**: Quick UI preview without emulator

#### Steps:
```bash
cd frontend
npm start
# Press 'w' to open in web browser
```

**Pros**:
- ✅ Instant preview
- ✅ No setup needed
- ✅ Good for UI development

**Cons**:
- ❌ Not native mobile experience
- ❌ Some features may not work

---

### Option 4: iOS Simulator (Mac Only)

**Best for**: Testing iOS-specific features (Mac only)

#### Steps:
1. **Install Xcode** from App Store
2. **Install Command Line Tools**:
   ```bash
   xcode-select --install
   ```
3. **Run Expo App**:
   ```bash
   cd frontend
   npm start
   # Press 'i' to open in iOS Simulator
   ```

---

## 🛠️ VS Code Extensions for Mobile Development

### Recommended Extensions:

1. **Expo Tools**
   - Extension ID: `expo.vscode-expo-tools`
   - Features: Expo commands, device preview

2. **React Native Tools**
   - Extension ID: `ms-vscode.vscode-react-native`
   - Features: Debugging, device selection

3. **Android iOS Emulator**
   - Extension ID: `DiemasMichiels.emulate`
   - Features: Launch emulators from VS Code

4. **Device Preview**
   - Extension ID: `auchenberg.vscode-browser-preview`
   - Features: Preview in different screen sizes

### Install Extensions:
```bash
# Or install from VS Code:
# Press Ctrl+Shift+X
# Search and install the extensions above
```

---

## 🚀 Quick Start Commands

### Start Development Server:
```bash
cd frontend
npm start
```

### Then choose:
- **Press `a`** - Android emulator
- **Press `i`** - iOS simulator (Mac only)
- **Press `w`** - Web browser
- **Scan QR** - Expo Go app on phone

---

## 📱 Multiple Device Testing

### Test on Multiple Devices Simultaneously:

1. **Physical Devices**:
   - Start Expo: `npm start`
   - Scan QR code on multiple phones
   - All devices update in real-time!

2. **Emulators**:
   - Open multiple Android Studio emulators
   - Each can run the app independently
   - Test different screen sizes

3. **Device Preview Extension**:
   - Install "Device Preview" extension
   - View app in different screen sizes
   - Side-by-side comparison

---

## 🎯 Recommended Setup for Windows

Since you're on Windows, here's the best setup:

1. **Primary**: Expo Go on physical Android/iOS device
2. **Secondary**: Android Studio emulator
3. **Quick Preview**: Web browser (press 'w')

### Setup Priority:
1. ✅ Expo Go (easiest, works immediately)
2. ⏳ Android Studio (for advanced testing)
3. ✅ Web preview (for quick UI checks)

---

## 🔧 Troubleshooting

### Android Emulator Not Starting:
```bash
# Check if emulator is in PATH
emulator -list-avds

# Start specific emulator
emulator -avd Pixel_5_API_33
```

### Expo Not Detecting Emulator:
- Make sure emulator is running first
- Check: `adb devices` should show your emulator
- Restart Expo: `npm start`

### Multiple Devices:
- Expo supports multiple devices simultaneously
- Changes reflect on all connected devices
- Use `r` to reload, `m` to toggle menu

---

## 📚 Additional Resources

- **Expo Docs**: https://docs.expo.dev/
- **Android Studio**: https://developer.android.com/studio
- **React Native Docs**: https://reactnative.dev/

---

## ✅ Quick Checklist

- [ ] Install Expo Go on phone
- [ ] Install Android Studio (optional)
- [ ] Install VS Code extensions
- [ ] Test with `npm start`
- [ ] Scan QR code with Expo Go
- [ ] Test on Android emulator (if installed)

---

**Ready to test?** Run `cd frontend && npm start` and choose your device! 🚀

