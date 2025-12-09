# Troubleshooting Expo Start Issues

## Error: ENOENT: no such file or directory, mkdir 'node:sea'

This is a known issue with Expo on Windows when dealing with certain Node.js versions.

### Solutions:

#### Solution 1: Use Web Version First
```bash
npx expo start --web
```
This will open your app in a browser and help verify everything works.

#### Solution 2: Update Expo CLI
```bash
npm install -g expo-cli@latest
npx expo start --clear
```

#### Solution 3: Use Tunnel Mode
```bash
npx expo start --tunnel
```

#### Solution 4: Update Node.js
Make sure you're using Node.js 18 or higher:
```bash
node --version
```

If lower, update from: https://nodejs.org/

#### Solution 5: Use Android Studio Emulator Instead
If Expo Go continues to have issues:
1. Install Android Studio
2. Create a virtual device
3. Run: `npx expo start --android`

### Alternative: Use Expo Snack (Online)
1. Go to: https://snack.expo.dev/
2. Copy your code
3. Test in browser or on device

---

## Quick Fix Commands

```bash
# Clear cache and try again
npx expo start --clear

# Try web version
npx expo start --web

# Try tunnel mode
npx expo start --tunnel

# Update Expo
npm install expo@latest
```

---

**Current Issue**: Windows path with colon in directory name
**Workaround**: Use web version or update Expo CLI




