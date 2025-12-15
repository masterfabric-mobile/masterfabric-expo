#!/bin/bash

# Clean IPA Build Pipeline Script
# This script performs a complete clean build pipeline:
# 1. Clean all build artifacts
# 2. Install/update CocoaPods dependencies
# 3. Validate setup and check for common issues
# 4. Perform clean build and archive
# 5. Export IPA

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project configuration
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

SCHEME="MasterFabric"
WORKSPACE="ios/MasterFabric.xcworkspace"
CONFIGURATION="Release"
BUILD_DIR="ios/build"
ARCHIVE_PATH="$BUILD_DIR/MasterFabric.xcarchive"
EXPORT_PATH="$BUILD_DIR/export"
IPA_PATH="$BUILD_DIR/MasterFabric.ipa"
TEAM_ID="4GW994398K"

# Derived data path (Xcode's build cache)
DERIVED_DATA_PATH="$HOME/Library/Developer/Xcode/DerivedData"

# Logging functions
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

log_step() {
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}📋 $1${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Step 1: Clean all build artifacts
clean_build_artifacts() {
    log_step "Step 1: Cleaning Build Artifacts"
    
    log_info "Cleaning build directory..."
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    
    log_info "Cleaning Xcode derived data for MasterFabric..."
    if [ -d "$DERIVED_DATA_PATH" ]; then
        find "$DERIVED_DATA_PATH" -name "*MasterFabric*" -type d -exec rm -rf {} + 2>/dev/null || true
        log_success "Derived data cleaned"
    else
        log_warning "Derived data directory not found (this is OK if first build)"
    fi
    
    log_info "Cleaning CocoaPods cache..."
    cd ios
    pod cache clean --all 2>/dev/null || log_warning "Pod cache clean failed (may not be critical)"
    cd ..
    
    log_info "Removing Pods directory for fresh install..."
    rm -rf ios/Pods
    rm -f ios/Podfile.lock
    
    log_success "Build artifacts cleaned"
}

# Step 2: Validate environment
validate_environment() {
    log_step "Step 2: Validating Environment"
    
    local errors=0
    
    # Check Xcode
    if ! command_exists xcodebuild; then
        log_error "Xcode command line tools not found"
        errors=$((errors + 1))
    else
        local xcode_version=$(xcodebuild -version 2>&1 | head -n 1)
        log_success "Xcode found: $xcode_version"
    fi
    
    # Check CocoaPods
    if ! command_exists pod; then
        log_error "CocoaPods not installed. Install with: sudo gem install cocoapods"
        errors=$((errors + 1))
    else
        local pod_version=$(pod --version)
        log_success "CocoaPods found: v$pod_version"
    fi
    
    # Check Node.js
    if ! command_exists node; then
        log_error "Node.js not found"
        errors=$((errors + 1))
    else
        local node_version=$(node --version)
        log_success "Node.js found: $node_version"
    fi
    
    # Check npm/yarn
    if ! command_exists npm && ! command_exists yarn; then
        log_error "Neither npm nor yarn found"
        errors=$((errors + 1))
    else
        log_success "Package manager found"
    fi
    
    # Check if workspace exists
    if [ ! -f "$WORKSPACE/contents.xcworkspacedata" ]; then
        log_warning "Workspace not found (will be created after pod install)"
    else
        log_success "Workspace found"
    fi
    
    # Check if project directory exists
    if [ ! -d "ios" ]; then
        log_error "iOS directory not found"
        errors=$((errors + 1))
    fi
    
    if [ $errors -gt 0 ]; then
        log_error "Environment validation failed with $errors error(s)"
        exit 1
    fi
    
    log_success "Environment validated"
}

# Step 3: Install Node dependencies
install_node_dependencies() {
    log_step "Step 3: Installing Node Dependencies"
    
    log_info "Checking node_modules..."
    if [ ! -d "node_modules" ] || [ ! -f "node_modules/.bin/expo" ]; then
        log_info "Installing npm dependencies..."
        npm install
        log_success "Node dependencies installed"
    else
        log_success "Node dependencies already installed"
    fi
    
    # Verify critical packages
    log_info "Verifying critical packages..."
    local missing_packages=0
    
    if [ ! -d "node_modules/react-native-get-random-values" ]; then
        log_error "react-native-get-random-values not found in node_modules"
        missing_packages=$((missing_packages + 1))
    fi
    
    if [ ! -d "node_modules/react-native" ]; then
        log_error "react-native not found in node_modules"
        missing_packages=$((missing_packages + 1))
    fi
    
    if [ $missing_packages -gt 0 ]; then
        log_error "Missing $missing_packages critical package(s). Reinstalling..."
        npm install
    fi
    
    log_success "Node dependencies verified"
}

# Step 4: Install CocoaPods dependencies
install_pods() {
    log_step "Step 4: Installing CocoaPods Dependencies"
    
    cd ios
    
    log_info "Running pod install (this may take a while)..."
    
    # Run pod install with verbose output
    if pod install --repo-update; then
        log_success "CocoaPods installed successfully"
    else
        log_error "Pod install failed"
        log_info "Trying pod install without repo update..."
        if pod install; then
            log_success "CocoaPods installed (without repo update)"
        else
            log_error "Pod install failed completely"
            cd ..
            exit 1
        fi
    fi
    
    cd ..
    
    # Verify workspace was created
    if [ ! -f "$WORKSPACE/contents.xcworkspacedata" ]; then
        log_error "Workspace was not created after pod install"
        exit 1
    fi
    
    log_success "Workspace verified"
}

# Step 5: Validate Pod installation
validate_pods() {
    log_step "Step 5: Validating Pod Installation"
    
    local issues=0
    
    # Check for common missing files
    log_info "Checking for common issues..."
    
    # Check react-native-get-random-values (from error log)
    # Check for either .m or .mm file (both are valid Objective-C files)
    if [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.m" ] && \
       [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.mm" ]; then
        log_error "Missing: node_modules/react-native-get-random-values/ios/RNGetRandomValues.m or .mm"
        log_info "This package may need to be reinstalled"
        issues=$((issues + 1))
    fi
    
    # Check Pods directory
    if [ ! -d "ios/Pods" ]; then
        log_error "Pods directory not found"
        issues=$((issues + 1))
    else
        log_success "Pods directory exists"
    fi
    
    # Check workspace
    if [ ! -f "$WORKSPACE/contents.xcworkspacedata" ]; then
        log_error "Workspace file not found"
        issues=$((issues + 1))
    else
        log_success "Workspace file exists"
    fi
    
    if [ $issues -gt 0 ]; then
        log_warning "Found $issues issue(s). Attempting to fix..."
        
        # Try to fix react-native-get-random-values
        # Check for either .m or .mm file (both are valid)
        if [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.m" ] && \
           [ ! -f "node_modules/react-native-get-random-values/ios/RNGetRandomValues.mm" ]; then
            log_info "Reinstalling react-native-get-random-values..."
            npm install react-native-get-random-values --force
            cd ios && pod install && cd ..
        fi
        
        log_info "Re-running validation..."
        validate_pods
        return
    fi
    
    log_success "Pod installation validated"
}

# Step 6: Clean Xcode build
clean_xcode_build() {
    log_step "Step 6: Cleaning Xcode Build"
    
    log_info "Cleaning Xcode build folder..."
    xcodebuild clean \
        -workspace "$WORKSPACE" \
        -scheme "$SCHEME" \
        -configuration "$CONFIGURATION" \
        2>&1 | grep -v "note:" || true
    
    log_success "Xcode build cleaned"
}

# Step 7: Build Archive
build_archive() {
    log_step "Step 7: Building Archive"
    
    log_info "Creating archive (this may take 10-20 minutes)..."
    log_info "Scheme: $SCHEME"
    log_info "Configuration: $CONFIGURATION"
    log_info "Archive path: $ARCHIVE_PATH"
    
    if xcodebuild archive \
        -workspace "$WORKSPACE" \
        -scheme "$SCHEME" \
        -configuration "$CONFIGURATION" \
        -archivePath "$ARCHIVE_PATH" \
        -allowProvisioningUpdates \
        CODE_SIGN_IDENTITY="Apple Development" \
        DEVELOPMENT_TEAM="$TEAM_ID" \
        -quiet; then
        log_success "Archive created successfully"
    else
        log_error "Archive failed"
        log_info ""
        log_info "Common issues and solutions:"
        log_info "1. Missing files: Run 'npm install' and 'pod install' again"
        log_info "2. Code signing: Check your Apple Developer account and certificates"
        log_info "3. Deployment target: Check Podfile for iOS version compatibility"
        log_info "4. Missing dependencies: Verify all node_modules are installed"
        exit 1
    fi
}

# Step 8: Export IPA
export_ipa() {
    log_step "Step 8: Exporting IPA"
    
    # Create export options plist
    log_info "Creating export options..."
    cat > "$BUILD_DIR/ExportOptions.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>development</string>
    <key>teamID</key>
    <string>$TEAM_ID</string>
    <key>compileBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>stripSwiftSymbols</key>
    <true/>
</dict>
</plist>
EOF
    
    log_info "Exporting IPA..."
    if xcodebuild -exportArchive \
        -archivePath "$ARCHIVE_PATH" \
        -exportPath "$EXPORT_PATH" \
        -exportOptionsPlist "$BUILD_DIR/ExportOptions.plist" \
        -allowProvisioningUpdates \
        -quiet; then
        log_success "IPA exported successfully"
    else
        log_error "IPA export failed"
        log_info "Check export options and code signing certificates"
        exit 1
    fi
    
    # Find and copy IPA
    IPA_FILE=$(find "$EXPORT_PATH" -name "*.ipa" -type f | head -1)
    if [ -f "$IPA_FILE" ]; then
        cp "$IPA_FILE" "$IPA_PATH"
        local ipa_size=$(du -h "$IPA_PATH" | cut -f1)
        log_success "IPA file ready"
        echo ""
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${GREEN}🎉 Build Pipeline Completed Successfully!${NC}"
        echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo ""
        echo -e "${GREEN}📍 IPA Location:${NC} $IPA_PATH"
        echo -e "${GREEN}📦 IPA Size:${NC} $ipa_size"
        echo ""
    else
        log_error "IPA file not found in export directory"
        log_info "Check: $EXPORT_PATH"
        exit 1
    fi
}

# Main execution
main() {
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Clean IPA Build Pipeline                 ║${NC}"
    echo -e "${BLUE}║   MasterFabric iOS Build                  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check for skip flags
    SKIP_CLEAN=false
    SKIP_PODS=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-clean)
                SKIP_CLEAN=true
                shift
                ;;
            --skip-pods)
                SKIP_PODS=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Usage: $0 [--skip-clean] [--skip-pods]"
                exit 1
                ;;
        esac
    done
    
    # Run pipeline steps
    if [ "$SKIP_CLEAN" = false ]; then
        clean_build_artifacts
    else
        log_warning "Skipping clean step"
    fi
    
    validate_environment
    install_node_dependencies
    
    if [ "$SKIP_PODS" = false ]; then
        install_pods
        validate_pods
    else
        log_warning "Skipping pod installation"
    fi
    
    clean_xcode_build
    build_archive
    export_ipa
}

# Run main function
main "$@"

