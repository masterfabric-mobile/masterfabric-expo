# Installation

Steps to set up the Recipio app in your local development environment.

## Clone Repository

```bash
# Go to workspace root
cd masterfabric-expo

# Go to project directory
cd project/recipio
```

## Install Dependencies

```bash
npm install
```

This installs:
- React Native and Expo dependencies
- TypeScript and type definitions
- `@masterfabric-expo/core` (local workspace package)
- Supabase client (`@supabase/supabase-js`)
- Zustand (state management)
- AsyncStorage
- All other dependencies

## Verify Installation

To confirm installation succeeded:

```bash
# Expo CLI version
npx expo --version

# Installed packages
npm list --depth=0

# MasterFabric Core package check
ls ../../packages/masterfabric-expo-core
```

## Troubleshooting

### Node Modules Issues

If you have dependency issues:

```bash
# Remove node_modules and lock file
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### MasterFabric Core Package Issues

If `@masterfabric-expo/core` is not found:

```bash
# Go to workspace root
cd ../../

# Check for MasterFabric Core package
ls packages/masterfabric-expo-core

# Create the package if it does not exist
```

### Metro Bundler Cache Issues

```bash
# Clear Expo cache
npx expo start --clear

# Clear Metro cache
npx expo start --reset-cache
```

### iOS Pods (macOS only)

```bash
cd ios
pod install
cd ..
```

## Installation Checklist

- [ ] Node.js installed (v18+)
- [ ] npm installed
- [ ] Git installed
- [ ] Expo CLI accessible (`npx expo`)
- [ ] Dependencies installed (`npm install`)
- [ ] MasterFabric Core package present
- [ ] Supabase credentials ready (app.json or .env)

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
