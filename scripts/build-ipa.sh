#!/usr/bin/env bash
# Build a signed IPA from the Xcode workspace (no EAS).
# Usage:
#   ./scripts/build-ipa.sh              # App Store / TestFlight (default)
#   EXPORT_METHOD=development ./scripts/build-ipa.sh   # development IPA
#   APPLE_TEAM_ID=XXXXXXXXXX ./scripts/build-ipa.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

SCHEME="MasterFabric"
WORKSPACE="ios/MasterFabric.xcworkspace"
CONFIGURATION="Release"
BUILD_DIR="ios/build"
ARCHIVE_PATH="$BUILD_DIR/MasterFabric.xcarchive"
EXPORT_PATH="$BUILD_DIR/export"
TEAM_ID="${APPLE_TEAM_ID:-4GW994398K}"
# Use app-store-connect (replaces deprecated app-store for -exportArchive).
METHOD="${EXPORT_METHOD:-app-store-connect}"

mkdir -p "$BUILD_DIR"

if [[ ! -f "$WORKSPACE/contents.xcworkspacedata" ]]; then
  echo "Missing workspace. Run: cd ios && pod install"
  exit 1
fi

cat > "$BUILD_DIR/ExportOptions.plist" << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>method</key>
  <string>${METHOD}</string>
  <key>teamID</key>
  <string>${TEAM_ID}</string>
  <key>uploadSymbols</key>
  <true/>
  <key>compileBitcode</key>
  <false/>
  <key>signingStyle</key>
  <string>automatic</string>
  <key>stripSwiftSymbols</key>
  <true/>
</dict>
</plist>
EOF

echo "==> Archiving (Release, generic iOS device)..."
xcodebuild archive \
  -workspace "$WORKSPACE" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -destination 'generic/platform=iOS' \
  -allowProvisioningUpdates

echo "==> Exporting IPA (method: ${METHOD})..."
rm -rf "$EXPORT_PATH"
mkdir -p "$EXPORT_PATH"

xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$BUILD_DIR/ExportOptions.plist" \
  -allowProvisioningUpdates

IPA_FILE="$(find "$EXPORT_PATH" -name "*.ipa" -type f | head -1)"
if [[ -z "$IPA_FILE" || ! -f "$IPA_FILE" ]]; then
  echo "Export failed: no .ipa under $EXPORT_PATH"
  exit 1
fi

OUT_IPA="$BUILD_DIR/MasterFabric.ipa"
cp "$IPA_FILE" "$OUT_IPA"
echo ""
echo "==> IPA ready: $OUT_IPA"
ls -lh "$OUT_IPA"
