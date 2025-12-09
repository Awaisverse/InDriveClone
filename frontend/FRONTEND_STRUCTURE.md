# Frontend Structure - RideShare

## 📁 Folder Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Custom button component
│   │   ├── Input.tsx        # Custom input component
│   │   └── index.ts         # Component exports
│   │
│   ├── screens/             # Screen components
│   │   ├── LoginScreen.tsx  # Login screen
│   │   └── HomeScreen.tsx   # Home screen
│   │
│   ├── navigation/          # Navigation setup
│   │   └── Navigation.tsx  # Main navigation component
│   │
│   ├── hooks/               # Custom React hooks
│   │   └── useAuth.ts       # Authentication hook
│   │
│   ├── store/                # State management (Zustand)
│   │   └── authStore.ts     # Auth state store
│   │
│   ├── services/             # API services
│   │   └── api.ts           # Axios API client
│   │
│   ├── utils/                # Utility functions
│   │   ├── constants.ts     # App constants
│   │   ├── validation.ts    # Form validation
│   │   └── helpers.ts       # Helper functions
│   │
│   ├── types/                # TypeScript types
│   │   └── index.ts         # Type definitions
│   │
│   └── App.tsx              # Main app component
│
├── assets/                   # Images, fonts, etc.
├── app.json                  # Expo configuration
├── babel.config.js          # Babel configuration
├── metro.config.js          # Metro bundler config
├── package.json             # Dependencies
└── tsconfig.json            # TypeScript config
```

## 🏗️ Architecture

### Components
- **Button**: Reusable button with variants (primary, secondary, outline)
- **Input**: Form input with label and error handling

### Screens
- **LoginScreen**: User authentication
- **HomeScreen**: Main app screen (to be expanded)

### Hooks
- **useAuth**: Authentication logic with React Query

### Store (Zustand)
- **authStore**: Global authentication state

### Services
- **api**: Axios instance with interceptors

### Utils
- **constants**: App-wide constants
- **validation**: Form validation functions
- **helpers**: Utility functions (formatting, etc.)

### Types
- TypeScript type definitions for the entire app

## 📦 Key Dependencies

- **expo**: ~52.0.0 - Expo SDK
- **react-native**: 0.76.5 - React Native
- **@react-navigation**: Navigation library
- **@tanstack/react-query**: Data fetching
- **zustand**: State management
- **axios**: HTTP client
- **react-hook-form**: Form handling

## 🎯 Best Practices

1. **Component Structure**: Each component in its own file
2. **Type Safety**: All components typed with TypeScript
3. **Reusability**: Components are reusable and configurable
4. **State Management**: Zustand for global state, React Query for server state
5. **Error Handling**: Proper error handling in API calls
6. **Validation**: Centralized validation utilities

## 🚀 Adding New Features

### Add a New Screen
1. Create file in `src/screens/`
2. Add route in `src/navigation/Navigation.tsx`
3. Add type in `src/types/index.ts`

### Add a New Component
1. Create file in `src/components/`
2. Export from `src/components/index.ts`
3. Use throughout the app

### Add a New Hook
1. Create file in `src/hooks/`
2. Follow existing patterns
3. Use React Query for data fetching

## ✅ Current Status

- ✅ Project structure created
- ✅ Components (Button, Input)
- ✅ Authentication flow
- ✅ Navigation setup
- ✅ Type definitions
- ✅ Utility functions
- ✅ API service layer

---

**Next Steps**: Add more screens, components, and features as needed!



