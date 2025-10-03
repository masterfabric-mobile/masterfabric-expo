#!/bin/bash

# Fix theme imports in critical files
files=(
  "src/screens/home/components/sections/quick-actions-section.tsx"
  "src/screens/home/components/sections/device-info-section.tsx"
  "src/screens/home/components/sections/activity-section.tsx"
  "src/screens/home/components/header-logo.tsx"
  "src/screens/home/components/header-actions.tsx"
  "src/screens/notifications/hooks/use-notification-view-model.ts"
  "src/shared/components/ScaffoldMessage.tsx"
  "src/shared/components/Dropdown.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Fixing $file..."
    # Replace import
    sed -i '' 's/import { getThemeColors } from '\''@\/src\/shared\/constants\/Colors'\'';/import { getThemeColors, useMasterView } from '\''masterfabric-expo-core'\'';/g' "$file"
    sed -i '' 's/import { useTheme } from '\''@\/src\/shared\/contexts\/theme-context'\'';//g' "$file"
    # Replace usage
    sed -i '' 's/const { currentTheme } = useTheme();/const { isDark } = useMasterView();/g' "$file"
    sed -i '' 's/const isDark = currentTheme === '\''dark'\'';//g' "$file"
  fi
done

echo "Done fixing theme imports!"
