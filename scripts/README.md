# Build Scripts Documentation

This directory contains scripts for building iOS IPA files, Android AAB files, checking build setup, and managing the project.

## Table of Contents

- [Scripts Overview](#scripts-overview)
- [Quick Start](#quick-start)
- [Detailed Script Documentation](#detailed-script-documentation)
- [Troubleshooting](#troubleshooting)
- [CI/CD Integration](#cicd-integration)

---

## Scripts Overview

| Script | Purpose | Command |
|--------|---------|---------|
| `build-ipa-pipeline.sh` | Complete iOS clean build pipeline | `npm run build:ios:pipeline` |
| `build-aab-pipeline.sh` | Complete Android clean build pipeline | `npm run build:android` |
| `check-build-setup.sh` | iOS diagnostic check | `npm run build:ios:check` |
| `check-android-setup.sh` | Android diagnostic check | `npm run build:android:check` |
| `build-ipa.sh` | Original iOS build script (EAS/local/manual) | `npm run build:ios` |
| `reset-project.js` | Reset project to clean state | `npm run reset-project` |

---

## Quick Start

### iOS Build

**First Time Setup:**
```bash
# 1. Check your setup
npm run build:ios:check

# 2. Run the full pipeline
npm run build:ios:pipeline
```

**Common Workflows:**
```bash
# Build IPA for device
npm run build:ios:pipeline

# Check for issues
npm run build:ios:check

# Run on iOS Simulator
npm run ios
```

### Android Build

**First Time Setup:**
```bash
# 1. Check your setup
npm run build:android:check

# 2. Run the full pipeline
npm run build:android
```

**Common Workflows:**
```bash
# Build AAB for Play Store
npm run build:android

# Check for issues
npm run build:android:check

# Run on Android device/emulator
npm run android
```

**Reset project (clean everything):**
```bash
npm run reset-project
```

---

## Detailed Script Documentation

### 1. `build-ipa-pipeline.sh` - Complete Clean Build Pipeline

A comprehensive pipeline script that performs a complete clean build from scratch.

**Features:**
- ✅ Cleans all build artifacts (derived data, build folders, pods)
- ✅ Validates environment (Xcode, CocoaPods, Node.js)
- ✅ Installs Node dependencies
- ✅ Installs CocoaPods dependencies
- ✅ Validates pod installation (checks for `.m` and `.mm` files)
- ✅ Performs clean Xcode build
- ✅ Creates archive
- ✅ Exports IPA

**Usage:**
```bash
# Full pipeline (recommended)
npm run build:ios:pipeline

# Or directly
./scripts/build-ipa-pipeline.sh

# Skip clean step (faster, but may have stale artifacts)
./scripts/build-ipa-pipeline.sh --skip-clean

# Skip pod installation (if pods are already installed)
./scripts/build-ipa-pipeline.sh --skip-pods
```

**What it does:**
1. Cleans build directory, derived data, and Pods
2. Validates Xcode, CocoaPods, Node.js are installed
3. Installs npm dependencies
4. Runs `pod install` with validation
5. Validates pod installation (checks for missing files)
6. Cleans Xcode build folder
7. Creates archive using xcodebuild
8. Exports IPA file

**Output:**
- IPA file: `ios/build/MasterFabric.ipa`
- Archive: `ios/build/MasterFabric.xcarchive`
- Export directory: `ios/build/export/`

**Pipeline Steps:**
1. **Clean Build Artifacts** - Removes all build files, derived data, Pods
2. **Validate Environment** - Checks required tools are installed
3. **Install Node Dependencies** - Runs `npm install` and verifies packages
4. **Install CocoaPods Dependencies** - Runs `pod install` with repo update
5. **Validate Pod Installation** - Checks for common issues (e.g., missing RNGetRandomValues.m/mm)
6. **Clean Xcode Build** - Runs `xcodebuild clean`
7. **Build Archive** - Creates Release archive
8. **Export IPA** - Exports IPA from archive

---

### 2. `build-aab-pipeline.sh` - Complete Android Build Pipeline

A comprehensive pipeline script for building Android App Bundle (AAB) files.

**Features:**
- ✅ Cleans all build artifacts (build folders, Gradle cache)
- ✅ Validates environment (Java, Android SDK, Node.js, Expo CLI)
- ✅ Installs Node dependencies
- ✅ Runs Expo prebuild if needed
- ✅ Updates version and version code
- ✅ Performs clean Gradle build
- ✅ Builds AAB file
- ✅ Shows final summary with execution time

**Usage:**
```bash
# Full pipeline (recommended)
npm run build:android

# Or directly
./scripts/build-aab-pipeline.sh

# Skip clean step (faster, but may have stale artifacts)
./scripts/build-aab-pipeline.sh --skip-clean

# Skip prebuild (if native files already exist)
./scripts/build-aab-pipeline.sh --skip-prebuild
```

**What it does:**
1. Prompts for version and version code updates
2. Cleans build directory and Gradle cache
3. Validates Java, Android SDK, Node.js, Expo CLI
4. Installs npm dependencies
5. Runs `expo prebuild --platform android` if needed
6. Cleans Gradle build
7. Builds AAB using `./gradlew bundleRelease`
8. Shows summary and opens AAB location

**Output:**
- AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
- APK file: `android/app/build/outputs/apk/release/app-release.apk` (also created)

**Requirements:**
- Java JDK 17 or later
- Android SDK (set ANDROID_HOME environment variable)
- Android Studio (recommended)
- Node.js and npm
- Expo CLI

---

### 3. `check-build-setup.sh` - iOS Diagnostic Check

Quick diagnostic script that checks for common build issues without making changes.

**Usage:**
```bash
npm run build:ios:check

# Or directly
./scripts/check-build-setup.sh
```

**What it checks:**
- ✅ Xcode installation and version
- ✅ CocoaPods installation and version
- ✅ Node.js and npm versions
- ✅ node_modules directory exists
- ✅ Critical packages (react-native, react-native-get-random-values)
  - Checks for both `.m` and `.mm` files (both are valid)
- ✅ iOS directory structure
- ✅ Pods installation
- ✅ Workspace file
- ✅ Podfile.lock
- ✅ Common build issues (deployment target warnings)

**Exit codes:**
- `0` - All checks passed
- `>0` - Critical issues found

**Example output:**
```
✅ Xcode: Xcode 26.0.1
✅ CocoaPods: v1.16.2
✅ Node.js: v24.10.0
✅ react-native-get-random-values files OK
✅ Pods directory exists
✅ Workspace file exists
```

---

### 4. `check-android-setup.sh` - Android Diagnostic Check

Quick diagnostic script that checks for common Android build issues.

**Usage:**
```bash
npm run build:android:check

# Or directly
./scripts/check-android-setup.sh
```

**What it checks:**
- ✅ Java installation and version (17+)
- ✅ Android SDK installation (ANDROID_HOME)
- ✅ Android SDK platforms
- ✅ Gradle wrapper
- ✅ Node.js and npm
- ✅ node_modules directory
- ✅ Android directory structure
- ✅ build.gradle existence and configuration
- ✅ AndroidManifest.xml existence
- ✅ Expo CLI availability
- ✅ app.json Android configuration

**Exit codes:**
- `0` - All checks passed
- `>0` - Critical issues found

---

### 5. `build-ipa.sh` - Original iOS Build Script

Original build script with multiple build methods (EAS, local, manual).

**Usage:**
```bash
npm run build:ios          # Interactive menu
npm run build:ios:eas      # EAS cloud build
npm run build:ios:local   # Local xcodebuild
npm run build:ios:manual  # Show manual instructions
```

**Build Methods:**
- **EAS Build** - Cloud build using Expo Application Services
- **Local Build** - Build using local xcodebuild
- **Manual Build** - Instructions for building in Xcode GUI

---

### 6. `reset-project.js` - Reset Project

Resets the project to a clean state by removing build artifacts and caches.

**Usage:**
```bash
npm run reset-project
```

**What it does:**
- Removes `node_modules`
- Removes `ios/Pods`
- Removes `ios/build`
- Removes `ios/Podfile.lock`
- Cleans npm cache
- Cleans CocoaPods cache
- Removes Metro bundler cache
- Removes watchman cache (if installed)

**Use when:**
- Dependencies are corrupted
- Build issues persist after troubleshooting
- Starting fresh after major changes
- CI/CD clean builds

---

## Troubleshooting

### Issue: Missing react-native-get-random-values files

The script now checks for both `.m` and `.mm` files (both are valid Objective-C files).

**Solution:**
```bash
npm install react-native-get-random-values --force
cd ios && pod install && cd ..
npm run build:ios:check  # Verify it's fixed
```

### Issue: Pod installation fails

**Solution:**
```bash
cd ios
rm -rf Pods Podfile.lock
pod cache clean --all
pod install --repo-update
cd ..
npm run build:ios:check
```

### Issue: Code signing errors

**Solutions:**
- Make sure you're signed in to your Apple Developer account in Xcode
- Check that your Team ID matches in the script (currently: `4GW994398K`)
- Verify certificates in Keychain Access
- Run: `xcodebuild -checkFirstLaunchStatus`

### Issue: Build fails with missing files

**Solution:**
```bash
# Full clean rebuild
npm run build:ios:pipeline
```

### Issue: Deployment target warnings

Some pods may have old deployment targets. These are warnings and won't prevent builds, but you can fix them:

```bash
cd ios
# Edit Podfile to set minimum deployment target
# Then:
pod install
```

---

## Android Troubleshooting

### Issue: ANDROID_HOME not set

**Solution:**
```bash
# macOS/Linux - Add to ~/.zshrc or ~/.bashrc
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin

# Then reload shell
source ~/.zshrc  # or source ~/.bashrc
```

### Issue: Java version too old

**Solution:**
- Install Java JDK 17 or later from [Adoptium](https://adoptium.net/)
- Verify: `java -version`
- Set JAVA_HOME if needed:
  ```bash
  export JAVA_HOME=$(/usr/libexec/java_home -v 17)
  ```

### Issue: Gradle build fails

**Solutions:**
```bash
# Clean Gradle cache
cd android
./gradlew clean
./gradlew --refresh-dependencies
cd ..

# If still failing, remove .gradle directory
rm -rf android/.gradle
```

### Issue: Android native files missing

**Solution:**
```bash
# Run Expo prebuild to generate native files
npx expo prebuild --platform android --clean
```

### Issue: Version/versionCode not updating

The script updates:
- `app.json` → `expo.android.versionCode`
- `android/app/build.gradle` → `versionName` and `versionCode`
- `android/app/src/main/AndroidManifest.xml` → `android:versionName` and `android:versionCode`

**Verify updates:**
```bash
# Check app.json
cat app.json | grep versionCode

# Check build.gradle (after prebuild)
grep -E "versionName|versionCode" android/app/build.gradle

# Check AndroidManifest.xml (after prebuild)
grep -E "versionName|versionCode" android/app/src/main/AndroidManifest.xml
```

### Issue: Build fails with signing errors

**Solution:**
- For Play Store uploads, signing is handled automatically
- For local testing, ensure debug keystore exists:
  ```bash
  # Debug keystore is auto-generated on first build
  # Location: ~/.android/debug.keystore
  ```
- For release builds, configure signing in `android/app/build.gradle`:
  ```gradle
  android {
      signingConfigs {
          release {
              storeFile file('path/to/keystore.jks')
              storePassword 'password'
              keyAlias 'key-alias'
              keyPassword 'password'
          }
      }
  }
  ```

### Issue: Missing Android SDK platforms

**Solution:**
1. Open Android Studio
2. Go to Tools → SDK Manager
3. Install required SDK platforms (API level 33+ recommended)
4. Install Android SDK Build-Tools
5. Install Android SDK Platform-Tools

### Issue: Simulator installation

**Note:** IPA files built for devices cannot be installed on simulators. Use:

```bash
# Build and run on simulator
npm run ios

# Or open Xcode
open ios/MasterFabric.xcworkspace
# Then select a simulator and press Cmd+R
```

---

## Environment Variables

The scripts use these default values (can be modified in the scripts):

| Variable | Value | Description |
|----------|-------|-------------|
| `TEAM_ID` | `4GW994398K` | Apple Developer Team ID |
| `SCHEME` | `MasterFabric` | Xcode scheme name |
| `CONFIGURATION` | `Release` | Build configuration |
| `BUNDLE_ID` | `com.masterfabric.expo.ios` | App bundle identifier |

---

## Notes

- **Build Time:** The pipeline script takes 10-20 minutes for a full build
- **Skip Clean:** Use `--skip-clean` for faster rebuilds (not recommended for first build)
- **Validation:** Always run `check-build-setup.sh` first if you encounter issues
- **Early Exit:** Scripts exit early if critical issues are found
- **File Extensions:** Scripts check for both `.m` and `.mm` Objective-C files
- **Simulator:** Use `npm run ios` for simulator builds (not IPA files)

---

## CI/CD Integration

The pipeline script is designed to work in CI/CD environments:
- Exits with non-zero code on failure
- Provides clear error messages
- Can be run non-interactively
- Validates environment before starting
- No user interaction required

### GitHub Actions Example

```yaml
name: Build iOS IPA

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build:
    runs-on: macos-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '20'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Check build setup
      run: npm run build:ios:check
    
    - name: Build IPA
      run: npm run build:ios:pipeline
      env:
        APPLE_TEAM_ID: ${{ secrets.APPLE_TEAM_ID }}
    
    - name: Upload IPA
      uses: actions/upload-artifact@v3
      with:
        name: MasterFabric.ipa
        path: ios/build/MasterFabric.ipa
```

### GitLab CI Example

```yaml
build_ios:
  image: node:20
  before_script:
    - npm ci
  script:
    - npm run build:ios:check
    - npm run build:ios:pipeline
  artifacts:
    paths:
      - ios/build/MasterFabric.ipa
    expire_in: 1 week
```

---

## Related Commands

All scripts are available via npm:

```bash
# iOS Build commands
npm run build:ios              # Interactive build menu
npm run build:ios:pipeline     # Full clean pipeline
npm run build:ios:check        # Diagnostic check
npm run build:ios:eas          # EAS cloud build
npm run build:ios:local        # Local build
npm run build:ios:manual       # Manual instructions

# Android Build commands
npm run build:android          # Full clean AAB pipeline
npm run build:android:check    # Diagnostic check

# Development commands
npm run ios                    # Run on iOS simulator
npm run android                # Run on Android device/emulator
npm run reset-project          # Reset project to clean state
```

---

## Support

If you encounter issues:

1. **Run diagnostic check:**
   ```bash
   npm run build:ios:check
   ```

2. **Check the error messages** - Scripts provide detailed error information

3. **Try a clean rebuild:**
   ```bash
   npm run reset-project
   npm run build:ios:pipeline
   ```

4. **Check Xcode logs** in `~/Library/Developer/Xcode/DerivedData/`

5. **Verify environment:**
   - Xcode version: `xcodebuild -version`
   - CocoaPods version: `pod --version`
   - Node version: `node --version`
