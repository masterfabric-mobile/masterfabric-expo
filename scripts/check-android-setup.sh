#!/bin/bash

# Android Build Setup Diagnostic Check
# This script checks for common Android build issues without making changes

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

log_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

log_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

log_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

log_error() {
    echo -e "${RED}❌ $1${NC}"
}

echo ""
echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Android Build Setup Diagnostic Check    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

issues=0
warnings=0

# Check Java
echo -e "${BLUE}Checking Java...${NC}"
if command -v java >/dev/null 2>&1; then
    java_version=$(java -version 2>&1 | head -n 1)
    log_success "Java: $java_version"
    
    # Check Java version (should be 17+)
    java_major=$(java -version 2>&1 | awk -F '"' '/version/ {print $2}' | awk -F '.' '{print $1}')
    if [ -n "$java_major" ] && [ "$java_major" -lt 17 ]; then
        log_warning "Java version should be 17 or higher (found: $java_major)"
        warnings=$((warnings + 1))
    fi
else
    log_error "Java not found"
    issues=$((issues + 1))
fi

# Check Android SDK
echo -e "${BLUE}Checking Android SDK...${NC}"
if [ -n "$ANDROID_HOME" ] || [ -n "$ANDROID_SDK_ROOT" ]; then
    android_home="${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
    log_success "Android SDK: $android_home"
    
    # Check if SDK tools exist
    if [ -f "$android_home/platform-tools/adb" ]; then
        log_success "ADB found"
    else
        log_warning "ADB not found in Android SDK"
        warnings=$((warnings + 1))
    fi
else
    log_warning "ANDROID_HOME not set"
    log_info "Install Android Studio or set ANDROID_HOME environment variable"
    warnings=$((warnings + 1))
fi

# Check Android SDK Platform Tools
echo -e "${BLUE}Checking Android SDK Platform...${NC}"
if [ -n "$ANDROID_HOME" ] || [ -n "$ANDROID_SDK_ROOT" ]; then
    android_home="${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
    if [ -d "$android_home/platforms" ]; then
        platform_count=$(ls -1 "$android_home/platforms" 2>/dev/null | wc -l | tr -d ' ')
        log_success "Found $platform_count Android platform(s)"
    else
        log_warning "No Android platforms found"
        warnings=$((warnings + 1))
    fi
else
    log_warning "Cannot check platforms (ANDROID_HOME not set)"
fi

# Check Gradle
echo -e "${BLUE}Checking Gradle...${NC}"
if [ -f "android/gradlew" ]; then
    log_success "Gradle wrapper found"
    if [ -x "android/gradlew" ]; then
        gradle_version=$(cd android && ./gradlew --version 2>/dev/null | grep "Gradle" | head -1 || echo "Unknown")
        log_info "Gradle: $gradle_version"
    else
        log_warning "Gradle wrapper not executable"
        warnings=$((warnings + 1))
    fi
else
    log_warning "Gradle wrapper not found (will be created by prebuild)"
    warnings=$((warnings + 1))
fi

# Check Node.js
echo -e "${BLUE}Checking Node.js...${NC}"
if command -v node >/dev/null 2>&1; then
    node_version=$(node --version)
    log_success "Node.js: $node_version"
else
    log_error "Node.js not found"
    issues=$((issues + 1))
fi

# Check npm
echo -e "${BLUE}Checking npm...${NC}"
if command -v npm >/dev/null 2>&1; then
    npm_version=$(npm --version)
    log_success "npm: v$npm_version"
else
    log_error "npm not found"
    issues=$((issues + 1))
fi

# Check node_modules
echo -e "${BLUE}Checking node_modules...${NC}"
if [ -d "node_modules" ]; then
    log_success "node_modules directory exists"
    
    if [ ! -d "node_modules/react-native" ]; then
        log_error "react-native missing"
        issues=$((issues + 1))
    else
        log_success "react-native installed"
    fi
else
    log_warning "node_modules not found (run 'npm install')"
    warnings=$((warnings + 1))
fi

# Check Android directory
echo -e "${BLUE}Checking Android directory...${NC}"
if [ -d "android" ]; then
    log_success "Android directory exists"
else
    log_error "Android directory not found"
    issues=$((issues + 1))
fi

# Check build.gradle
echo -e "${BLUE}Checking build.gradle...${NC}"
if [ -f "android/app/build.gradle" ]; then
    log_success "build.gradle exists"
    
    # Check for versionName and versionCode
    if grep -q "versionName" "android/app/build.gradle"; then
        log_success "versionName found in build.gradle"
    else
        log_warning "versionName not found in build.gradle"
        warnings=$((warnings + 1))
    fi
    
    if grep -q "versionCode" "android/app/build.gradle"; then
        log_success "versionCode found in build.gradle"
    else
        log_warning "versionCode not found in build.gradle"
        warnings=$((warnings + 1))
    fi
else
    log_warning "build.gradle not found (will be created by prebuild)"
    warnings=$((warnings + 1))
fi

# Check AndroidManifest.xml
echo -e "${BLUE}Checking AndroidManifest.xml...${NC}"
if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
    log_success "AndroidManifest.xml exists"
else
    log_warning "AndroidManifest.xml not found (will be created by prebuild)"
    warnings=$((warnings + 1))
fi

# Check Expo CLI
echo -e "${BLUE}Checking Expo CLI...${NC}"
if command -v expo >/dev/null 2>&1 || command -v npx >/dev/null 2>&1; then
    log_success "Expo CLI available"
else
    log_error "Expo CLI not found"
    issues=$((issues + 1))
fi

# Check app.json
echo -e "${BLUE}Checking app.json...${NC}"
if [ -f "app.json" ]; then
    log_success "app.json exists"
    
    # Check Android config
    if node -e "require('./app.json').expo.android" 2>/dev/null; then
        log_success "Android config found in app.json"
        
        # Check package name
        package_name=$(node -e "console.log(require('./app.json').expo.android.package)" 2>/dev/null || echo "")
        if [ -n "$package_name" ]; then
            log_success "Package name: $package_name"
        else
            log_warning "Package name not set in app.json"
            warnings=$((warnings + 1))
        fi
        
        # Check versionCode
        version_code=$(node -e "console.log(require('./app.json').expo.android.versionCode)" 2>/dev/null || echo "")
        if [ -n "$version_code" ]; then
            log_success "Version code: $version_code"
        else
            log_warning "Version code not set in app.json"
            warnings=$((warnings + 1))
        fi
    else
        log_warning "Android config missing in app.json"
        warnings=$((warnings + 1))
    fi
else
    log_error "app.json not found"
    issues=$((issues + 1))
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $issues -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "You can run the build pipeline with:"
    echo "  npm run build:android"
elif [ $issues -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Found $warnings warning(s) but no critical issues${NC}"
    echo ""
    echo "You can run the build pipeline, but consider fixing warnings:"
    echo "  npm run build:android"
else
    echo -e "${RED}❌ Found $issues critical issue(s) and $warnings warning(s)${RED}"
    echo ""
    echo "Fix the issues above before building. Suggested fixes:"
    echo ""
    if ! command -v java >/dev/null 2>&1; then
        echo "  Install Java JDK 17+: https://adoptium.net/"
    fi
    if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
        echo "  Install Android Studio: https://developer.android.com/studio"
        echo "  Set ANDROID_HOME environment variable"
    fi
    if [ ! -d "node_modules" ]; then
        echo "  npm install"
    fi
    if [ ! -f "android/app/build.gradle" ]; then
        echo "  npx expo prebuild --platform android"
    fi
fi
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit $issues

