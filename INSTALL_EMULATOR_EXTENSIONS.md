# 📱 Install Mobile Emulator Extensions - Quick Guide

## 🎯 VS Code Extensions for Mobile Development

### Step 1: Open VS Code Extensions

1. Open VS Code in your project
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. VS Code will show recommended extensions automatically
4. Click **"Install All"** or install individually

### Step 2: Install These Extensions

#### Essential Mobile Development Extensions:

1. **Expo Tools** ⭐
   - Extension ID: `expo.vscode-expo-tools`
   - **What it does**: Expo commands, device preview, debugging
   - **Install**: Search "Expo Tools" in VS Code Extensions

2. **React Native Tools** ⭐
   - Extension ID: `ms-vscode.vscode-react-native`
   - **What it does**: Debugging, device selection, emulator control
   - **Install**: Search "React Native Tools"

3. **Android iOS Emulator** ⭐
   - Extension ID: `DiemasMichiels.emulate`
   - **What it does**: Launch Android/iOS emulators from VS Code
   - **Install**: Search "Android iOS Emulator"

4. **Browser Preview**
   - Extension ID: `auchenberg.vscode-browser-preview`
   - **What it does**: Preview app in different screen sizes
   - **Install**: Search "Browser Preview"

5. **Code Runner**
   - Extension ID: `formulahendry.code-runner`
   - **What it does**: Run code snippets quickly
   - **Install**: Search "Code Runner"

### Step 3: Quick Install Command

Open VS Code terminal and run:
```bash
code --install-extension expo.vscode-expo-tools
code --install-extension ms-vscode.vscode-react-native
code --install-extension DiemasMichiels.emulate
code --install-extension auchenberg.vscode-browser-preview
code --install-extension formulahendry.code-runner
```

---

## 📲 Setup Android Studio Emulator (Like Android Studio Preview)

### Download & Install Android Studio

1. **Download Android Studio**:
   - Visit: https://developer.android.com/studio
   - Download for Windows
   - Install the application

2. **Install Android SDK**:
   - Open Android Studio
   - Go to: **Tools → SDK Manager**
   - Install:
     - ✅ Android SDK Platform (latest)
     - ✅ Android SDK Build-Tools
     - ✅ Android Emulator
     - ✅ Android SDK Platform-Tools

3. **Create Virtual Devices** (Like Android Studio):
   - Go to: **Tools → Device Manager**
   - Click **"Create Device"**
   - Select device type:
     - Pixel 5
     - Pixel 6
     - Samsung Galaxy S21
     - etc.
   - Select system image (Android 13, 12, etc.)
   - Click **Finish**

4. **Start Emulator**:
   - In Device Manager, click **Play** button next to device
   - Or use VS Code extension: Press `F1` → "Emulator: Start Android Emulator"

---

## 🚀 Using Emulators in VS Code

### Method 1: Using Expo Tools Extension

1. **Start Expo**:
   ```bash
   cd frontend
   npm start
   ```

2. **In VS Code**:
   - Press `F1`
   - Type: "Expo: Start"
   - Select device from list

### Method 2: Using React Native Tools

1. **Press `F5`** to start debugging
2. Select "React Native" from debugger
3. Choose your emulator/device

### Method 3: Using Android iOS Emulator Extension

1. **Press `F1`**
2. Type: "Emulator: Start Android Emulator"
3. Select device from list
4. Emulator will launch automatically

---

## 📱 Test on Multiple Devices

### Option 1: Multiple Emulators
1. Open Android Studio Device Manager
2. Start multiple emulators (different sizes)
3. Each can run your app independently

### Option 2: Physical Devices + Emulators
1. Start Expo: `npm start`
2. Scan QR code on physical device (Expo Go app)
3. Press `a` for Android emulator
4. Both will show your app simultaneously!

### Option 3: Browser Preview Extension
1. Start app: `npm start` then press `w`
2. In VS Code, use Browser Preview extension
3. View in different screen sizes side-by-side

---

## ✅ Quick Test

1. **Install extensions** (see Step 2 above)
2. **Start Expo**:
   ```bash
   cd frontend
   npm start
   ```
3. **Choose device**:
   - Press `a` for Android emulator
   - Press `w` for web browser
   - Scan QR for physical device

---

## 🎯 Recommended Setup for Windows

### Priority Order:

1. ✅ **Install VS Code Extensions** (5 minutes)
   - Expo Tools
   - React Native Tools
   - Android iOS Emulator

2. ✅ **Install Expo Go on Phone** (2 minutes)
   - Fastest way to test
   - No emulator setup needed

3. ⏳ **Install Android Studio** (30 minutes)
   - For advanced testing
   - Multiple device sizes
   - Full Android features

---

## 🔧 Troubleshooting

### Extension Not Working:
- Reload VS Code: `Ctrl+Shift+P` → "Reload Window"
- Check extension is enabled
- Restart VS Code

### Emulator Not Starting:
- Make sure Android Studio is installed
- Check emulator is created in Device Manager
- Try starting emulator from Android Studio first

### Expo Not Detecting Emulator:
- Start emulator first, then run `npm start`
- Check: `adb devices` should show your emulator
- Restart Expo: `npm start`

---

## 📚 Additional Resources

- **Expo Tools Docs**: https://docs.expo.dev/
- **React Native Tools**: https://marketplace.visualstudio.com/items?itemName=ms-vscode.vscode-react-native
- **Android Studio**: https://developer.android.com/studio

---

**Ready?** Install the extensions and start testing! 🚀

