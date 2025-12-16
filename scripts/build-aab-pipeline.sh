#!/bin/bash

# Clean Android App Bundle (AAB) Build Pipeline Script
# This script performs a complete clean build pipeline:
# 1. Clean all build artifacts
# 2. Update version and build number
# 3. Validate setup and check for common issues
# 4. Run Expo prebuild if needed
# 5. Perform clean Gradle build
# 6. Build AAB

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

BUILD_DIR="android/app/build"
AAB_PATH="android/app/build/outputs/bundle/release/app-release.aab"
APK_PATH="android/app/build/outputs/apk/release/app-release.apk"

# App information (will be extracted from app.json)
APP_NAME=""
PACKAGE_NAME=""
APP_VERSION=""
VERSION_CODE=""

# Timing
SCRIPT_START_TIME=$(date +%s)

# Debug logging function
debug_log() {
    local location="$1"
    local message="$2"
    local data="$3"
    local hypothesis_id="${4:-}"
    local timestamp=$(date +%s000)
    local log_file="/Users/gurkanfikretgunak/Documents/GitHub/masterfabric-expo/.cursor/debug.log"
    echo "{\"timestamp\":$timestamp,\"location\":\"$location\",\"message\":\"$message\",\"data\":$data,\"sessionId\":\"debug-session\",\"hypothesisId\":\"$hypothesis_id\"}" >> "$log_file"
}

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
        PACKAGE_NAME=$(node -e "console.log(require('./app.json').expo.android.package)" 2>/dev/null || echo "com.masterfabric.expo.android")
        APP_VERSION=$(node -e "console.log(require('./app.json').expo.version)" 2>/dev/null || echo "1.0.0")
        VERSION_CODE=$(node -e "console.log(require('./app.json').expo.android.versionCode)" 2>/dev/null || echo "1")
    else
        # Fallback values
        APP_NAME="MasterFabric"
        PACKAGE_NAME="com.masterfabric.expo.android"
        APP_VERSION="1.0.0"
        VERSION_CODE="1"
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

# Open AAB in Finder
open_aab_in_finder() {
    local aab_path=$1
    if [ -f "$aab_path" ]; then
        log_info "Opening AAB location in Finder..."
        open -R "$aab_path"
    else
        log_warning "AAB file not found, opening build directory instead..."
        open "android/app/build/outputs/bundle/release"
    fi
}

# Update version and build number in app.json
update_version_info() {
    log_step "Version & Build Number Configuration"
    
    # Extract current values
    extract_app_info
    
    echo -e "${BLUE}Current Version Information:${NC}"
    echo -e "  ${BLUE}Version:${NC} $APP_VERSION"
    echo -e "  ${BLUE}Version Code:${NC} $VERSION_CODE"
    echo ""
    
    # Ask if user wants to update
    echo -ne "${YELLOW}Do you want to update version/version code? [y/N]: ${NC}"
    read -n 1 -r
    echo ""
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Keeping current version: $APP_VERSION (Version Code $VERSION_CODE)"
        return
    fi
    
    # Clear any leftover input from stdin
    while IFS= read -t 0.1 -r -n 1; do :; done 2>/dev/null || true
    
    # Step 1: Get new version
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
    
    # Step 2: Get new version code
    while true; do
        printf "${BLUE}Enter new version code (1-999999) [Press Enter to skip] [$VERSION_CODE]: ${NC}"
        IFS= read -r new_version_code </dev/tty
        
        # Trim whitespace
        new_version_code=$(echo "$new_version_code" | tr -d '\r\n' | sed 's/^[[:space:]]*//;s/[[:space:]]*$//')
        
        # If empty, use current version code
        if [ -z "$new_version_code" ]; then
            new_version_code="$VERSION_CODE"
            break
        fi
        
        # Validate version code: must be numeric, range 1-999999
        if [[ "$new_version_code" =~ ^[0-9]+$ ]]; then
            if (( new_version_code >= 1 && new_version_code <= 999999 )); then
                break
            else
                log_error "Version code must be between 1 and 999999."
                echo ""
            fi
        else
            log_error "Version code must be numeric (1-999999)."
            echo ""
        fi
    done
    
    # Update app.json and Android files if values changed
    if [ "$new_version" != "$APP_VERSION" ] || [ "$new_version_code" != "$VERSION_CODE" ]; then
        log_info "Updating version and version code..."
        
        # Step 1: Update app.json
        node -e "
        const fs = require('fs');
        const appJsonPath = './app.json';
        const appJson = JSON.parse(fs.readFileSync(appJsonPath, 'utf8'));
        
        appJson.expo.version = '$new_version';
        appJson.expo.android.versionCode = parseInt('$new_version_code');
        
        fs.writeFileSync(appJsonPath, JSON.stringify(appJson, null, 2) + '\n');
        console.log('✅ Updated app.json');
        " || {
            log_error "Failed to update app.json"
            exit 1
        }
        
        # Note: build.gradle and AndroidManifest.xml will be updated AFTER prebuild
        # since they are generated by prebuild. This function only updates app.json.
        
        # Update local variables
        APP_VERSION="$new_version"
        VERSION_CODE="$new_version_code"
        
        log_success "Version and version code updated"
        echo -e "  ${BLUE}Version:${NC} $new_version"
        echo -e "  ${BLUE}Version Code:${NC} $new_version_code"
    else
        log_info "No changes made"
    fi
    
    echo ""
}

# Step 1: Clean all build artifacts
clean_build_artifacts() {
    debug_log "build-aab-pipeline.sh:clean_build_artifacts" "Function entry" "{\"build_dir\":\"$BUILD_DIR\"}" "A"
    log_step "Step 1: Cleaning Build Artifacts"
    
    log_info "Cleaning Android build directory..."
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    debug_log "build-aab-pipeline.sh:clean_build_artifacts" "Build dir cleaned" "{\"build_dir\":\"$BUILD_DIR\",\"exists\":\"$(test -d "$BUILD_DIR" && echo true || echo false)\"}" "A"
    
    log_info "Cleaning Gradle cache..."
    cd android
    local gradle_clean_result=0
    ./gradlew clean 2>/dev/null || gradle_clean_result=$?
    debug_log "build-aab-pipeline.sh:clean_build_artifacts" "Gradle clean result" "{\"exit_code\":$gradle_clean_result}" "A"
    if [ $gradle_clean_result -ne 0 ]; then
        log_warning "Gradle clean failed (may not be critical)"
    fi
    cd ..
    
    log_info "Cleaning .gradle directory..."
    rm -rf android/.gradle
    debug_log "build-aab-pipeline.sh:clean_build_artifacts" "Function exit" "{\"success\":true}" "A"
    
    log_success "Build artifacts cleaned"
}

# Step 2: Validate environment
validate_environment() {
    debug_log "build-aab-pipeline.sh:validate_environment" "Function entry" "{}" "A"
    log_step "Step 2: Validating Environment"
    
    local errors=0
    
    # Check Java - verify it actually works, not just that the command exists
    if ! command_exists java; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Java check failed" "{\"java_exists\":false}" "A"
        log_error "Java not found. Install Java JDK 17 or later"
        errors=$((errors + 1))
    else
        # Try to actually run Java to verify it's functional
        local java_test_output=$(java -version 2>&1)
        local java_test_exit=$?
        debug_log "build-aab-pipeline.sh:validate_environment" "Java test" "{\"java_exists\":true,\"exit_code\":$java_test_exit,\"output\":\"$java_test_output\"}" "A"
        
        # Check if Java actually works (not just a stub)
        if [ $java_test_exit -ne 0 ] || echo "$java_test_output" | grep -qi "unable to locate\|no java runtime\|install java"; then
            debug_log "build-aab-pipeline.sh:validate_environment" "Java check failed - stub detected" "{\"java_exists\":true,\"functional\":false}" "A"
            log_error "Java command exists but no runtime is installed. Install Java JDK 17 or later"
            log_info "Install from: https://adoptium.net/ or use: brew install openjdk@17"
            errors=$((errors + 1))
        else
            local java_version=$(echo "$java_test_output" | head -n 1)
            debug_log "build-aab-pipeline.sh:validate_environment" "Java check passed" "{\"java_exists\":true,\"functional\":true,\"version\":\"$java_version\"}" "A"
            log_success "Java found: $java_version"
        fi
    fi
    
    # Check Android SDK
    if [ -z "$ANDROID_HOME" ] && [ -z "$ANDROID_SDK_ROOT" ]; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Android SDK check warning" "{\"android_home\":\"\",\"android_sdk_root\":\"\"}" "A"
        log_warning "ANDROID_HOME not set. Android SDK may not be found."
        log_info "Set ANDROID_HOME environment variable or install Android Studio"
    else
        local android_home="${ANDROID_HOME:-$ANDROID_SDK_ROOT}"
        debug_log "build-aab-pipeline.sh:validate_environment" "Android SDK check passed" "{\"android_home\":\"$android_home\"}" "A"
        log_success "Android SDK found: $android_home"
    fi
    
    # Check Node.js
    if ! command_exists node; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Node.js check failed" "{\"node_exists\":false}" "A"
        log_error "Node.js not found"
        errors=$((errors + 1))
    else
        local node_version=$(node --version)
        debug_log "build-aab-pipeline.sh:validate_environment" "Node.js check passed" "{\"node_exists\":true,\"version\":\"$node_version\"}" "A"
        log_success "Node.js found: $node_version"
    fi
    
    # Check npm/yarn
    if ! command_exists npm && ! command_exists yarn; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Package manager check failed" "{\"npm_exists\":false,\"yarn_exists\":false}" "A"
        log_error "Neither npm nor yarn found"
        errors=$((errors + 1))
    else
        debug_log "build-aab-pipeline.sh:validate_environment" "Package manager check passed" "{\"npm_exists\":$(command_exists npm && echo true || echo false),\"yarn_exists\":$(command_exists yarn && echo true || echo false)}" "A"
        log_success "Package manager found"
    fi
    
    # Check Expo CLI
    if ! command_exists expo && ! command_exists npx; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Expo CLI check failed" "{\"expo_exists\":false,\"npx_exists\":false}" "A"
        log_error "Expo CLI not found. Install with: npm install -g expo-cli"
        errors=$((errors + 1))
    else
        debug_log "build-aab-pipeline.sh:validate_environment" "Expo CLI check passed" "{\"expo_exists\":$(command_exists expo && echo true || echo false),\"npx_exists\":$(command_exists npx && echo true || echo false)}" "A"
        log_success "Expo CLI available"
    fi
    
    # Check if android directory exists
    if [ ! -d "android" ]; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Android directory check failed" "{\"android_dir_exists\":false}" "A"
        log_error "Android directory not found"
        errors=$((errors + 1))
    else
        debug_log "build-aab-pipeline.sh:validate_environment" "Android directory check passed" "{\"android_dir_exists\":true}" "A"
    fi
    
    debug_log "build-aab-pipeline.sh:validate_environment" "Validation complete" "{\"errors\":$errors}" "A"
    if [ $errors -gt 0 ]; then
        debug_log "build-aab-pipeline.sh:validate_environment" "Exiting due to validation errors" "{\"errors\":$errors}" "A"
        log_error "Environment validation failed with $errors error(s)"
        log_info ""
        log_info "Please fix the errors above and try again."
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
    
    log_success "Node dependencies verified"
}

# Step 4: Run Expo prebuild if needed
run_prebuild() {
    debug_log "build-aab-pipeline.sh:run_prebuild" "Function entry" "{}" "B"
    log_step "Step 4: Running Expo Prebuild"
    
    # Check if build.gradle exists
    local build_gradle_exists=false
    if [ -f "android/app/build.gradle" ]; then
        build_gradle_exists=true
    fi
    debug_log "build-aab-pipeline.sh:run_prebuild" "Checking build.gradle" "{\"build_gradle_exists\":$build_gradle_exists}" "B"
    
    if [ ! -f "android/app/build.gradle" ]; then
        log_info "Android native files not found. Running Expo prebuild..."
        debug_log "build-aab-pipeline.sh:run_prebuild" "Starting prebuild" "{\"command\":\"npx expo prebuild --platform android --clean\"}" "B"
        local prebuild_result=0
        npx expo prebuild --platform android --clean || prebuild_result=$?
        debug_log "build-aab-pipeline.sh:run_prebuild" "Prebuild completed" "{\"exit_code\":$prebuild_result}" "B"
        if [ $prebuild_result -ne 0 ]; then
            log_error "Prebuild failed"
            exit 1
        fi
        log_success "Prebuild completed"
    else
        debug_log "build-aab-pipeline.sh:run_prebuild" "Skipping prebuild" "{\"reason\":\"build.gradle exists\"}" "B"
        log_success "Android native files already exist"
    fi
    debug_log "build-aab-pipeline.sh:run_prebuild" "Function exit" "{\"success\":true}" "B"
}

# Step 5: Clean Gradle build
clean_gradle_build() {
    log_step "Step 5: Cleaning Gradle Build"
    
    log_info "Cleaning Gradle build..."
    cd android
    ./gradlew clean 2>&1 | grep -v "note:" || true
    cd ..
    
    log_success "Gradle build cleaned"
}

# Step 6: Build AAB
build_aab() {
    debug_log "build-aab-pipeline.sh:build_aab" "Function entry" "{\"package_name\":\"$PACKAGE_NAME\",\"version\":\"$APP_VERSION\",\"version_code\":\"$VERSION_CODE\",\"aab_path\":\"$AAB_PATH\"}" "C"
    log_step "Step 6: Building Android App Bundle (AAB)"
    
    log_info "Building AAB (this may take 10-20 minutes)..."
    log_info "Package: $PACKAGE_NAME"
    log_info "Version: $APP_VERSION (Code: $VERSION_CODE)"
    
    cd android
    debug_log "build-aab-pipeline.sh:build_aab" "Changed to android directory" "{\"pwd\":\"$(pwd)\"}" "C"
    
    debug_log "build-aab-pipeline.sh:build_aab" "Starting gradlew bundleRelease" "{\"command\":\"./gradlew bundleRelease\"}" "C"
    local gradle_result=0
    local gradle_output=$(./gradlew bundleRelease 2>&1) || gradle_result=$?
    debug_log "build-aab-pipeline.sh:build_aab" "Gradle build completed" "{\"exit_code\":$gradle_result,\"output_lines\":$(echo "$gradle_output" | wc -l | tr -d ' ')}" "C"
    
    if [ $gradle_result -eq 0 ]; then
        log_success "AAB built successfully"
    else
        debug_log "build-aab-pipeline.sh:build_aab" "Gradle build failed" "{\"exit_code\":$gradle_result,\"error_snippet\":\"$(echo "$gradle_output" | tail -20 | tr '\n' ' ')\"}" "C"
        log_error "AAB build failed"
        echo ""
        log_info "Gradle error output (last 20 lines):"
        echo "$gradle_output" | tail -20 | sed 's/^/  /'
        echo ""
        log_info "Common issues and solutions:"
        log_info "1. Missing Java: Install Java JDK 17+ from https://adoptium.net/"
        log_info "2. Missing Android SDK: Install Android Studio and set ANDROID_HOME"
        log_info "3. Gradle sync issues: Run 'cd android && ./gradlew --refresh-dependencies'"
        log_info "4. Signing issues: Check keystore configuration"
        log_info "5. Missing dependencies: Run 'npm install' and 'npx expo prebuild'"
        cd ..
        exit 1
    fi
    
    cd ..
    debug_log "build-aab-pipeline.sh:build_aab" "Changed back to project root" "{\"pwd\":\"$(pwd)\"}" "C"
    
    # Verify AAB was created
    debug_log "build-aab-pipeline.sh:build_aab" "Checking AAB file" "{\"expected_path\":\"$AAB_PATH\",\"exists\":$(test -f "$AAB_PATH" && echo true || echo false)}" "D"
    if [ ! -f "$AAB_PATH" ]; then
        log_error "AAB file not found at expected location: $AAB_PATH"
        log_info "Checking alternative locations..."
        local alt_aab=$(find android/app/build -name "*.aab" -type f 2>/dev/null | head -1)
        debug_log "build-aab-pipeline.sh:build_aab" "Searching for AAB files" "{\"found\":\"$alt_aab\"}" "D"
        if [ -f "$alt_aab" ]; then
            AAB_PATH="$alt_aab"
            debug_log "build-aab-pipeline.sh:build_aab" "Found AAB at alternative location" "{\"new_path\":\"$AAB_PATH\"}" "D"
            log_success "Found AAB at: $AAB_PATH"
        else
            debug_log "build-aab-pipeline.sh:build_aab" "AAB not found anywhere" "{\"searched\":\"android/app/build\"}" "D"
            log_error "AAB file not found in build directory"
            exit 1
        fi
    else
        debug_log "build-aab-pipeline.sh:build_aab" "AAB found at expected location" "{\"path\":\"$AAB_PATH\"}" "D"
    fi
    debug_log "build-aab-pipeline.sh:build_aab" "Function exit" "{\"success\":true,\"aab_path\":\"$AAB_PATH\"}" "C"
}

# Show final summary
show_final_summary() {
    local aab_path=$1
    local aab_size=$2
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
    printf "${GREEN}║  ${NC}  Package Name:    ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$PACKAGE_NAME"
    printf "${GREEN}║  ${NC}  Version:         ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$APP_VERSION"
    printf "${GREEN}║  ${NC}  Version Code:    ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$VERSION_CODE"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  📦 Build Results:                                         ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    printf "${GREEN}║  ${NC}  AAB Location:    ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$aab_path"
    printf "${GREEN}║  ${NC}  AAB Size:        ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$aab_size"
    printf "${GREEN}║  ${NC}  Total Time:      ${BLUE}%-45s${NC}${GREEN}║${NC}\n" "$elapsed_time"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╠════════════════════════════════════════════════════════════╣${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}║  ${YELLOW}💡 Opening AAB location in Finder...${NC}${GREEN}                              ║${NC}"
    echo -e "${GREEN}║                                                            ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Automatically open AAB location in Finder
    sleep 1
    open_aab_in_finder "$aab_path"
}

# Main execution
main() {
    debug_log "build-aab-pipeline.sh:main" "Script started" "{\"args\":\"$@\",\"project_dir\":\"$PROJECT_DIR\"}" "F"
    # Extract app information at the start
    extract_app_info
    debug_log "build-aab-pipeline.sh:main" "App info extracted" "{\"app_name\":\"$APP_NAME\",\"package_name\":\"$PACKAGE_NAME\",\"version\":\"$APP_VERSION\",\"version_code\":\"$VERSION_CODE\"}" "F"
    
    echo ""
    echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║   Clean AAB Build Pipeline                ║${NC}"
    echo -e "${BLUE}║   MasterFabric Android Build              ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
    echo ""
    
    # Check for skip flags
    SKIP_CLEAN=false
    SKIP_PREBUILD=false
    
    while [[ $# -gt 0 ]]; do
        case $1 in
            --skip-clean)
                SKIP_CLEAN=true
                shift
                ;;
            --skip-prebuild)
                SKIP_PREBUILD=true
                shift
                ;;
            *)
                log_error "Unknown option: $1"
                echo "Usage: $0 [--skip-clean] [--skip-prebuild]"
                exit 1
                ;;
        esac
    done
    
    debug_log "build-aab-pipeline.sh:main" "Flags parsed" "{\"skip_clean\":$SKIP_CLEAN,\"skip_prebuild\":$SKIP_PREBUILD}" "F"
    
    # Run pipeline steps
    if [ "$SKIP_CLEAN" = false ]; then
        clean_build_artifacts
    else
        log_warning "Skipping clean step"
    fi
    
    validate_environment
    install_node_dependencies
    
    # Ask user to update version/version code BEFORE prebuild
    # This updates app.json first, then prebuild will use those values
    update_version_info
    
    # Re-extract app info in case it was updated
    extract_app_info
    debug_log "build-aab-pipeline.sh:main" "App info re-extracted after version update" "{\"app_name\":\"$APP_NAME\",\"package_name\":\"$PACKAGE_NAME\",\"version\":\"$APP_VERSION\",\"version_code\":\"$VERSION_CODE\"}" "F"
    
    echo ""
    echo -e "${BLUE}📱 App:${NC} $APP_NAME"
    echo -e "${BLUE}📦 Package:${NC} $PACKAGE_NAME"
    echo -e "${BLUE}🔢 Version:${NC} $APP_VERSION (Code $VERSION_CODE)"
    echo ""
    
    if [ "$SKIP_PREBUILD" = false ]; then
        run_prebuild
        
        # Update native files AFTER prebuild (since prebuild generates them)
        # This ensures our version updates are applied to the generated files
        debug_log "build-aab-pipeline.sh:main" "Updating native files after prebuild" "{\"build_gradle_exists\":$(test -f "android/app/build.gradle" && echo true || echo false)}" "E"
        if [ -f "android/app/build.gradle" ]; then
            log_info "Updating version in generated build.gradle..."
            local sed_result1=0
            sed -i '' "s/versionName \".*\"/versionName \"$APP_VERSION\"/g" "android/app/build.gradle" || sed_result1=$?
            local sed_result2=0
            sed -i '' "s/versionCode [0-9]*/versionCode $VERSION_CODE/g" "android/app/build.gradle" || sed_result2=$?
            debug_log "build-aab-pipeline.sh:main" "build.gradle sed results" "{\"version_name_sed\":$sed_result1,\"version_code_sed\":$sed_result2}" "E"
            log_success "Updated build.gradle with version $APP_VERSION (Code $VERSION_CODE)"
        fi
        
        local manifest_path="android/app/src/main/AndroidManifest.xml"
        debug_log "build-aab-pipeline.sh:main" "Checking AndroidManifest.xml" "{\"manifest_exists\":$(test -f "$manifest_path" && echo true || echo false),\"path\":\"$manifest_path\"}" "E"
        if [ -f "$manifest_path" ]; then
            log_info "Updating version in generated AndroidManifest.xml..."
            local sed_result3=0
            sed -i '' "s/android:versionName=\"[^\"]*\"/android:versionName=\"$APP_VERSION\"/g" "$manifest_path" || sed_result3=$?
            local sed_result4=0
            sed -i '' "s/android:versionCode=\"[^\"]*\"/android:versionCode=\"$VERSION_CODE\"/g" "$manifest_path" || sed_result4=$?
            debug_log "build-aab-pipeline.sh:main" "AndroidManifest.xml sed results" "{\"version_name_sed\":$sed_result3,\"version_code_sed\":$sed_result4}" "E"
            log_success "Updated AndroidManifest.xml with version $APP_VERSION (Code $VERSION_CODE)"
        fi
    else
        log_warning "Skipping prebuild"
    fi
    
    clean_gradle_build
    build_aab
    
    # Show final summary
    debug_log "build-aab-pipeline.sh:main" "Preparing final summary" "{\"aab_path\":\"$AAB_PATH\",\"aab_exists\":$(test -f "$AAB_PATH" && echo true || echo false)}" "F"
    local aab_size=$(du -h "$AAB_PATH" | cut -f1)
    show_final_summary "$AAB_PATH" "$aab_size"
    debug_log "build-aab-pipeline.sh:main" "Script completed successfully" "{\"aab_path\":\"$AAB_PATH\",\"aab_size\":\"$aab_size\"}" "F"
}

# Run main function
main "$@"

