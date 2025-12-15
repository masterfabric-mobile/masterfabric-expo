# Build Scripts Documentation

This directory contains scripts for building iOS IPA files, checking build setup, and managing the project.

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
| `build-ipa-pipeline.sh` | Complete clean build pipeline | `npm run build:ios:pipeline` |
| `check-build-setup.sh` | Diagnostic check for build issues | `npm run build:ios:check` |
| `build-ipa.sh` | Original build script (EAS/local/manual) | `npm run build:ios` |
| `reset-project.js` | Reset project to clean state | `npm run reset-project` |

---

## Quick Start

### First Time Setup
```bash
# 1. Check your setup
npm run build:ios:check

# 2. Run the full pipeline
npm run build:ios:pipeline
```

### Common Workflows

**Build IPA for device:**
```bash
npm run build:ios:pipeline
```

**Check for issues:**
```bash
npm run build:ios:check
```

**Reset project (clean everything):**
```bash
npm run reset-project
```

**Run on iOS Simulator:**
```bash
npm run ios
# or
expo run:ios
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

### 2. `check-build-setup.sh` - Diagnostic Check

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

### 3. `build-ipa.sh` - Original Build Script

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

### 4. `reset-project.js` - Reset Project

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
# Build commands
npm run build:ios              # Interactive build menu
npm run build:ios:pipeline     # Full clean pipeline
npm run build:ios:check        # Diagnostic check
npm run build:ios:eas          # EAS cloud build
npm run build:ios:local        # Local build
npm run build:ios:manual       # Manual instructions

# Development commands
npm run ios                    # Run on iOS simulator
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
