#!/bin/bash

# Quick Build Setup Check Script
# This script checks for common build issues without making changes

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
echo -e "${BLUE}║   Build Setup Diagnostic Check             ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

issues=0
warnings=0

# Check Xcode
echo -e "${BLUE}Checking Xcode...${NC}"
if command -v xcodebuild >/dev/null 2>&1; then
    xcode_version=$(xcodebuild -version 2>&1 | head -n 1)
    log_success "Xcode: $xcode_version"
else
    log_error "Xcode command line tools not found"
    issues=$((issues + 1))
fi

# Check CocoaPods
echo -e "${BLUE}Checking CocoaPods...${NC}"
if command -v pod >/dev/null 2>&1; then
    pod_version=$(pod --version)
    log_success "CocoaPods: v$pod_version"
else
    log_error "CocoaPods not installed"
    issues=$((issues + 1))
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
    
    # Check critical packages
    if [ ! -d "node_modules/react-native-get-random-values" ]; then
        log_error "react-native-get-random-values missing"
        issues=$((issues + 1))
    else
        # Check for either .m or .mm file (both are valid)
        if [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.m" ] && \
           [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.mm" ]; then
            log_error "react-native-get-random-values/ios/RNGetRandomValues.m or .mm missing"
            issues=$((issues + 1))
        else
            log_success "react-native-get-random-values files OK"
        fi
    fi
    
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

# Check iOS directory
echo -e "${BLUE}Checking iOS directory...${NC}"
if [ -d "ios" ]; then
    log_success "iOS directory exists"
else
    log_error "iOS directory not found"
    issues=$((issues + 1))
fi

# Check Pods
echo -e "${BLUE}Checking CocoaPods installation...${NC}"
if [ -d "ios/Pods" ]; then
    log_success "Pods directory exists"
    
    pod_count=$(find ios/Pods -name "*.podspec" 2>/dev/null | wc -l | tr -d ' ')
    log_info "Found $pod_count pod(s)"
else
    log_warning "Pods directory not found (run 'pod install')"
    warnings=$((warnings + 1))
fi

# Check workspace
echo -e "${BLUE}Checking Xcode workspace...${NC}"
if [ -f "ios/MasterFabric.xcworkspace/contents.xcworkspacedata" ]; then
    log_success "Workspace file exists"
else
    log_warning "Workspace file not found (will be created by pod install)"
    warnings=$((warnings + 1))
fi

# Check Podfile.lock
echo -e "${BLUE}Checking Podfile.lock...${NC}"
if [ -f "ios/Podfile.lock" ]; then
    log_success "Podfile.lock exists"
else
    log_warning "Podfile.lock not found (run 'pod install')"
    warnings=$((warnings + 1))
fi

# Check for common build issues
echo -e "${BLUE}Checking for common issues...${NC}"

# Check deployment target warnings
if [ -f "ios/Podfile.lock" ]; then
    if grep -q "IPHONEOS_DEPLOYMENT_TARGET.*11.0\|IPHONEOS_DEPLOYMENT_TARGET.*9.0" ios/Podfile.lock 2>/dev/null; then
        log_warning "Some pods have old deployment targets (may cause warnings)"
        warnings=$((warnings + 1))
    fi
fi

# Summary
echo ""
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if [ $issues -eq 0 ] && [ $warnings -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo ""
    echo "You can run the build pipeline with:"
    echo "  npm run build:ios:pipeline"
elif [ $issues -eq 0 ]; then
    echo -e "${YELLOW}⚠️  Found $warnings warning(s) but no critical issues${NC}"
    echo ""
    echo "You can run the build pipeline, but consider fixing warnings:"
    echo "  npm run build:ios:pipeline"
else
    echo -e "${RED}❌ Found $issues critical issue(s) and $warnings warning(s)${NC}"
    echo ""
    echo "Fix the issues above before building. Suggested fixes:"
    echo ""
    if [ ! -d "node_modules" ]; then
        echo "  npm install"
    fi
    if [ ! -d "ios/Pods" ]; then
        echo "  cd ios && pod install"
    fi
    if [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.m" ] && \
       [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.mm" ]; then
        echo "  npm install react-native-get-random-values --force"
        echo "  cd ios && pod install"
    fi
fi
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

exit $issues

