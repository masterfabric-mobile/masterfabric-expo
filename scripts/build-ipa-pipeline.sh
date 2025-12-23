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

# App information (will be extracted from app.json)
APP_NAME=""
BUNDLE_ID=""
APP_VERSION=""
BUILD_NUMBER=""

# Timing
SCRIPT_START_TIME=$(date +%s)

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

# Extract app information from app.json
extract_app_info() {
    if [ -f "app.json" ]; then
        APP_NAME=$(node -e "console.log(require('./app.json').expo.name)" 2>/dev/null || echo "MasterFabric")
        BUNDLE_ID=$(node -e "console.log(require('./app.json').expo.ios.bundleIdentifier)" 2>/dev/null || echo "com.masterfabric.expo.ios")
        APP_VERSION=$(node -e "console.log(require('./app.json').expo.version)" 2>/dev/null || echo "1.0.0")
        BUILD_NUMBER=$(node -e "console.log(require('./app.json').expo.ios.buildNumber)" 2>/dev/null || echo "1")
    else
        # Fallback values
        APP_NAME="MasterFabric"
        BUNDLE_ID="com.masterfabric.expo.ios"
        APP_VERSION="1.0.0"
        BUILD_NUMBER="1"
    fi
}

# Calculate elapsed time
get_elapsed_time() {
    local end_time=$(date +%s)
    local elapsed=$((end_time - SCRIPT_START_TIME))
    local hours=$((elapsed / 3600))
    local minutes=$(((elapsed % 3600) / 60))
    local seconds=$((elapsed % 60))
    
    if [ $hours -gt 0 ]; then
        echo "${hours}h ${minutes}m ${seconds}s"
    elif [ $minutes -gt 0 ]; then
        echo "${minutes}m ${seconds}s"
    else
        echo "${seconds}s"
    fi
}

# Format file size
format_file_size() {
    local size=$1
    if [ -f "$(which numfmt)" ]; then
        numfmt --to=iec-i --suffix=B "$size" 2>/dev/null || du -h "$size" | cut -f1
    else
        du -h "$size" | cut -f1
    fi
}

# Open IPA in Finder
open_ipa_in_finder() {
    local ipa_path=$1
    if [ -f "$ipa_path" ]; then
        log_info "Opening IPA location in Finder..."
        open -R "$ipa_path"
    else
        log_warning "IPA file not found, opening build directory instead..."
        open "$BUILD_DIR"
    fi
}

# Update version and build number in app.json
update_version_info() {
    log_step "Version & Build Number Configuration"
    
    # Extract current values
    extract_app_info
    
    echo -e "${BLUE}Current Version Information:${NC}"
    echo -e "  ${BLUE}Version:${NC} $APP_VERSION"
    echo -e "  ${BLUE}Build Number:${NC} $BUILD_NUMBER"
    echo ""
    
    # Ask if user wants to update
    echo -ne "${YELLOW}Do you want to update version/build number? [y/N]: ${NC}"
    read -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Keeping current version: $APP_VERSION (Build $BUILD_NUMBER)"
        return
    fi
    
    # Clear any leftover input from stdin (read -n 1 doesn't consume newline)
    # Read and discard any remaining characters including newline
    while IFS= read -t 0.1 -r -n 1; do :; done 2>/dev/null || true
    
    # Step 1: Get new version (simple - any text, press Enter to skip)
    echo ""
    log_info "Enter new values or press Enter to keep current."
    echo ""
    
    printf "${BLUE}Enter new version [Press Enter to skip] [$APP_VERSION]: ${NC}"
    IFS= read -r new_version </dev/tty
    
    # Trim whitespace and use current if empty
    new_version=$(echo "$new_version" | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
    if [ -z "$new_version" ]; then
        new_version="$APP_VERSION"
    fi
    
    # Step 2: Get new build number
    while true; do
        printf "${BLUE}Enter new build number (1-999) [Press Enter to skip] [$BUILD_NUMBER]: ${NC}"
        IFS= read -r new_build_number </dev/tty
        
        # Trim whitespace
        new_build_number=$(echo "$new_build_number" | tr -d '\r\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        # If empty, use current build number
        if [ -z "$new_build_number" ]; then
            new_build_number="$BUILD_NUMBER"
            break
        fi
        
        # Validate build number: must be numeric, range 1-999
        if [[ "$new_build_number" =~ ^[0-9]+$ ]]; then
            if (( new_build_number >= 1 && new_build_number <= 999 )); then
                break
            else
                log_error "Build number must be between 1 and 999."
                echo ""
            fi
        else
            log_error "Build number must be numeric (1-999)."
            echo ""
        fi
    done
    
    # Update app.json and iOS files if values changed
    if [ "$new_version" != "$APP_VERSION" ] || [ "$new_build_number" != "$BUILD_NUMBER" ]; then
        log_info "Updating version and build number..."
        
        # Step 1: Update app.json
        node -e "
        const fs = require('fs');
        const appJsonPath = './app.json';
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        
        appJson.expo.version = '$new_version';
        appJson.expo.ios.buildNumber = '$new_build_number';
        appJson.expo.android.versionCode = parseInt('$new_build_number');
        
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
        console.log('✅ Updated app.json');
        " || {
            log_error "Failed to update app.json"
            exit 1
        }
        
        # Step 2: Update iOS Info.plist
        if [ -f "ios/MasterFabric/Info.plist" ]; then
            # Try PlistBuddy first (most reliable)
            if command_exists /usr/libexec/PlistBuddy; then
                /usr/libexec/PlistBuddy -c "Set :CFBundleShortVersionString $new_version" "ios/MasterFabric/Info.plist" 2>/dev/null
                /usr/libexec/PlistBuddy -c "Set :CFBundleVersion $new_build_number" "ios/MasterFabric/Info.plist" 2>/dev/null
                log_success "Updated Info.plist (using PlistBuddy)"
            else
                # Fallback: use sed for XML plist
                # Escape special characters for sed
                escaped_version=$(echo "$new_version" | sed 's/\./\\./g')
                sed -i '' "s/<key>CFBundleShortVersionString<\/key>\([^<]*\)<string>[^<]*<\/string>/<key>CFBundleShortVersionString<\/key>\1<string>$escaped_version<\/string>/" "ios/MasterFabric/Info.plist"
                sed -i '' "s/<key>CFBundleVersion<\/key>\([^<]*\)<string>[^<]*<\/string>/<key>CFBundleVersion<\/key>\1<string>$new_build_number<\/string>/" "ios/MasterFabric/Info.plist"
                log_success "Updated Info.plist (using sed)"
            fi
        else
            log_warning "Info.plist not found, skipping"
        fi
        
        # Step 3: Update Xcode project.pbxproj
        if [ -f "ios/MasterFabric.xcodeproj/project.pbxproj" ]; then
            # Update MARKETING_VERSION and CURRENT_PROJECT_VERSION in project.pbxproj
            sed -i '' "s/MARKETING_VERSION = [^;]*;/MARKETING_VERSION = $new_version;/g" "ios/MasterFabric.xcodeproj/project.pbxproj"
            sed -i '' "s/CURRENT_PROJECT_VERSION = [^;]*;/CURRENT_PROJECT_VERSION = $new_build_number;/g" "ios/MasterFabric.xcodeproj/project.pbxproj"
            log_success "Updated project.pbxproj"
        else
            log_warning "project.pbxproj not found, skipping"
        fi
        
        # Update local variables
        APP_VERSION="$new_version"
        BUILD_NUMBER="$new_build_number"
        
        log_success "Version and build number updated in all files"
        echo -e "  ${BLUE}Version:${NC} $new_version"
        echo -e "  ${BLUE}Build Number:${NC} $new_build_number"
    else
        log_info "No changes made"
    fi
    
    echo ""
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
        
        # Show final summary
        show_final_summary "$IPA_PATH" "$ipa_size"
    else
        log_error "IPA file not found in export directory"
        log_info "Check: $EXPORT_PATH"
        exit 1
    fi
}

# Show final summary
show_final_summary() {
    local ipa_path=$1
    local ipa_size=$2
    local elapsed_time=$(get_elapsed_time)
    
    # Extract app info if not already done
    if [ -z "$APP_NAME" ]; then
        extract_app_info
    fi
    
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║           🎉 Build Pipeline Completed Successfully! 🎉     ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  📱 App Information:                                        ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    printf "${GREEN}║  ${NC}  App Name:        ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$APP_NAME"
    printf "${GREEN}║  ${NC}  Bundle ID:       ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$BUNDLE_ID"
    printf "${GREEN}║  ${NC}  Version:         ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$APP_VERSION"
    printf "${GREEN}║  ${NC}  Build Number:    ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$BUILD_NUMBER"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  📦 Build Results:                                         ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    printf "${GREEN}║  ${NC}  IPA Location:    ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$ipa_path"
    printf "${GREEN}║  ${NC}  IPA Size:        ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$ipa_size"
    printf "${GREEN}║  ${NC}  Total Time:      ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$elapsed_time"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  ${YELLOW}💡 Opening IPA location in Finder...${NC}${GREEN}                              ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Automatically open IPA location in Finder
    sleep 1
    open_ipa_in_finder "$ipa_path"
}

# Main execution
main() {
    # Extract app information at the start
    extract_app_info
    
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Clean IPA Build Pipeline                 ║${NC}"
    echo -e "${BLUE}║   MasterFabric iOS Build                  ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Ask user to update version/build number
    update_version_info
    
    # Re-extract app info in case it was updated
    extract_app_info
    
    echo ""
    echo -e "${BLUE}📱 App:${NC} $APP_NAME"
    echo -e "${BLUE}📦 Bundle ID:${NC} $BUNDLE_ID"
    echo -e "${BLUE}🔢 Version:${NC} $APP_VERSION (Build $BUILD_NUMBER)"
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

