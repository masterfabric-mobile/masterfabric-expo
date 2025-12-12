#!/bin/bash

# Build IPA for MasterFabric
# Usage: ./scripts/build-ipa.sh [eas|local|manual]
#   eas    - Build using EAS Build (cloud)
#   local  - Build locally using xcodebuild
#   manual - Show manual build instructions

set -e

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# Configuration
SCHEME="MasterFabric"
WORKSPACE="ios/MasterFabric.xcworkspace"
CONFIGURATION="Release"
BUILD_DIR="ios/build"
ARCHIVE_PATH="$BUILD_DIR/MasterFabric.xcarchive"
EXPORT_PATH="$BUILD_DIR/export"
IPA_PATH="$BUILD_DIR/MasterFabric.ipa"
TEAM_ID="4GW994398K"

# Function to show manual instructions
show_manual_instructions() {
  echo ""
  echo "📖 Manual Build Instructions"
  echo "=============================="
  echo ""
  echo "1. Open Xcode:"
  echo "   open ios/MasterFabric.xcworkspace"
  echo ""
  echo "2. In Xcode:"
  echo "   - Select 'Any iOS Device' (not simulator)"
  echo "   - Product → Clean Build Folder (⇧⌘K)"
  echo "   - Product → Archive"
  echo ""
  echo "3. After archiving:"
  echo "   - Organizer window opens automatically"
  echo "   - Select your archive → 'Distribute App'"
  echo "   - Choose distribution method:"
  echo "     • Development: For testing on registered devices"
  echo "     • Ad Hoc: For distribution to specific devices"
  echo "     • App Store Connect: For App Store submission"
  echo "   - Follow the wizard to export the IPA"
  echo ""
  echo "4. IPA will be saved to your chosen location"
  echo ""
}

# Function to build locally
build_local() {
  echo "📱 Building IPA locally for MasterFabric..."
  echo ""
  
  # Clean previous builds
  echo "🧹 Cleaning previous builds..."
  rm -rf "$BUILD_DIR"
  mkdir -p "$BUILD_DIR"
  
  # Ensure pods are installed
  if [ ! -d "ios/Pods" ]; then
    echo "📦 Installing CocoaPods dependencies..."
    cd ios && pod install && cd ..
  fi
  
  # Build archive
  echo "📦 Creating archive..."
  xcodebuild archive \
    -workspace "$WORKSPACE" \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    -allowProvisioningUpdates \
    CODE_SIGN_IDENTITY="Apple Development" \
    DEVELOPMENT_TEAM="$TEAM_ID" \
    || {
      echo "❌ Archive failed. Make sure:"
      echo "   1. Xcode is installed and updated"
      echo "   2. You're signed in to your Apple Developer account"
      echo "   3. Code signing certificates are valid"
      exit 1
    }
  
  # Create export options plist
  echo "📝 Creating export options..."
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
</dict>
</plist>
EOF
  
  # Export IPA
  echo "📤 Exporting IPA..."
  xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$EXPORT_PATH" \
    -exportOptionsPlist "$BUILD_DIR/ExportOptions.plist" \
    -allowProvisioningUpdates \
    || {
      echo "❌ Export failed. Check export options and certificates."
      exit 1
    }
  
  # Find and copy IPA
  IPA_FILE=$(find "$EXPORT_PATH" -name "*.ipa" | head -1)
  if [ -f "$IPA_FILE" ]; then
    cp "$IPA_FILE" "$IPA_PATH"
    echo ""
    echo "✅ IPA built successfully!"
    echo "📍 Location: $IPA_PATH"
    echo "📦 Size: $(du -h "$IPA_PATH" | cut -f1)"
    echo ""
  else
    echo "❌ IPA file not found in export directory"
    exit 1
  fi
}

# Function to build with EAS
build_eas() {
  echo "☁️  Building IPA with EAS Build (cloud)..."
  echo ""
  
  # Check if EAS CLI is available
  if ! command -v eas &> /dev/null && ! command -v npx &> /dev/null; then
    echo "❌ EAS CLI not found. Install it with:"
    echo "   npm install -g eas-cli"
    exit 1
  fi
  
  # Ask for profile
  echo "Select build profile:"
  echo "  1) development"
  echo "  2) preview"
  echo "  3) production"
  read -p "Enter choice [1-3] (default: 3): " PROFILE_CHOICE
  
  case $PROFILE_CHOICE in
    1) PROFILE="development" ;;
    2) PROFILE="preview" ;;
    3|"") PROFILE="production" ;;
    *) echo "Invalid choice, using production"; PROFILE="production" ;;
  esac
  
  echo ""
  echo "🚀 Starting EAS build with profile: $PROFILE"
  echo ""
  
  # Run EAS build
  if command -v eas &> /dev/null; then
    eas build --platform ios --profile "$PROFILE" --non-interactive
  else
    npx eas-cli build --platform ios --profile "$PROFILE" --non-interactive
  fi
  
  echo ""
  echo "✅ EAS build started!"
  echo "📱 Check build status at: https://expo.dev/accounts/gurkanfikretgunak/projects/masterfabric-expo/builds"
  echo ""
}

# Main menu
if [ "$1" = "eas" ]; then
  build_eas
elif [ "$1" = "local" ]; then
  build_local
elif [ "$1" = "manual" ]; then
  show_manual_instructions
else
  echo "📱 MasterFabric IPA Builder"
  echo "=========================="
  echo ""
  echo "Select build method:"
  echo "  1) EAS Build (cloud) - Recommended for production"
  echo "  2) Local Build (xcodebuild) - Requires Xcode"
  echo "  3) Manual Build (instructions)"
  echo ""
  read -p "Enter choice [1-3]: " CHOICE
  
  case $CHOICE in
    1) build_eas ;;
    2) build_local ;;
    3) show_manual_instructions ;;
    *)
      echo "Invalid choice"
      exit 1
      ;;
  esac
fi
