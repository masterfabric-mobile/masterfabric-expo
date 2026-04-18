# Expo Core Components Reference for @masterfabric-expo-core

This document provides a comprehensive list of all React Native core components and Expo packages that can be used with the `@masterfabric-expo-core` package.

## 📦 React Native Core Components

All React Native core components are available for use. Here's the complete list:

### Layout Components (10)
1. **View** - Container component (✅ Used in package)
2. **Text** - Text display component (✅ Used via ThemedText wrapper)
3. **ScrollView** - Scrollable container (✅ Used)
4. **SafeAreaView** - Safe area aware container (✅ Used)
5. **KeyboardAvoidingView** - Keyboard-aware container
6. **RefreshControl** - Pull-to-refresh control (✅ Used)
7. **StatusBar** - Status bar control
8. **ActivityIndicator** - Loading spinner (✅ Used)
9. **Modal** - Modal overlay
10. **Pressable** - Pressable component

### Form Components (5)
11. **TextInput** - Text input field
12. **Switch** - Toggle switch
13. **Slider** - Value slider (via `@react-native-community/slider`)
14. **Picker** - Dropdown picker
15. **Button** - Button component (✅ Used)

### List Components (3)
16. **FlatList** - Efficient list component
17. **SectionList** - Sectioned list component
18. **VirtualizedList** - Base list component

### Touchable Components (4)
19. **TouchableOpacity** - Touchable with opacity feedback (✅ Used)
20. **TouchableHighlight** - Touchable with highlight feedback
21. **TouchableWithoutFeedback** - Touchable without visual feedback
22. **TouchableNativeFeedback** - Android-specific touchable

### Image Components (1)
23. **Image** - Image display component

### Other Components (2)
24. **Animated** - Animation API
25. **ImageBackground** - Image background component

**Total React Native Core Components: 25**

---

## 🚀 Expo Packages Available

### Currently Used in @masterfabric-expo-core

#### Core Expo Packages (4)
1. **expo-constants** (✅ Used) - App constants and configuration
   - Used for: App name, version, environment detection
   - Peer dependency: `>=14.0.0`

2. **expo-device** (✅ Used) - Device information
   - Used for: Device model, OS version, device type
   - Peer dependency: `>=5.0.0`

3. **expo-router** (✅ Used) - File-based routing
   - Used for: Navigation utilities
   - Peer dependency: `>=2.0.0`

4. **expo-web-browser** (✅ Used) - Web browser integration
   - Used for: Opening URLs in browser
   - Peer dependency: `>=13.0.0`

#### Feature Packages (1)
5. **expo-battery** (✅ Used) - Battery information
   - Used for: Battery level, charging status, low power mode
   - Peer dependency: `>=7.0.0`

#### Icon Package (1)
6. **@expo/vector-icons** (✅ Used) - Icon library
   - Used for: Ionicons in components
   - Peer dependency: `>=13.0.0`

### Available but Not Currently Used

#### UI Components (7)
7. **expo-image** - Optimized image component
8. **expo-blur** - Blur effects
9. **expo-linear-gradient** - Gradient backgrounds
10. **expo-status-bar** - Status bar component
11. **expo-splash-screen** - Splash screen management
12. **expo-font** - Custom font loading
13. **expo-symbols** - SF Symbols (iOS)

#### User Input (2)
14. **expo-image-picker** - Image picker
15. **expo-haptics** - Haptic feedback

#### System Integration (3)
16. **expo-linking** - Deep linking
17. **expo-localization** - Internationalization
18. **expo-system-ui** - System UI controls

#### Other Packages Available in Main App
These are available in the main app's `package.json` but not required by `@masterfabric-expo-core`:

- **expo-dev-client** - Development client
- **expo-symbols** - SF Symbols support

**Total Expo Packages Currently Used: 6**
**Total Expo Packages Available: 19+**

---

## 📊 Summary

### React Native Core Components
- **Total Available**: 25 components
- **Currently Used**: 10+ components
- **Usage Rate**: ~40%

### Expo Packages
- **Total Available**: 19+ packages
- **Currently Used**: 6 packages
- **Usage Rate**: ~32%

### Combined Total
- **Total Core Components/Packages**: 44+
- **Currently Used**: 16+
- **Potential for Expansion**: 28+ additional components/packages

---

## 💡 Recommendations

### High Priority Additions
1. **expo-image** - Replace React Native Image for better performance
2. **expo-haptics** - Add haptic feedback to interactions
3. **expo-font** - Support custom fonts
4. **expo-linking** - Deep linking support
5. **expo-localization** - Enhanced i18n support

### Medium Priority Additions
6. **expo-blur** - Add blur effects to modals/overlays
7. **expo-linear-gradient** - Gradient backgrounds
8. **expo-image-picker** - Image selection functionality
9. **expo-status-bar** - Status bar customization
10. **FlatList/SectionList** - List components for data display

### Component Usage Examples

```typescript
// React Native Core Components
import { 
  View, Text, ScrollView, FlatList, 
  TextInput, Button, TouchableOpacity,
  Image, Modal, ActivityIndicator 
} from 'react-native';

// Expo Packages
import { Image as ExpoImage } from 'expo-image';
import * as Haptics from 'expo-haptics';
import * as Font from 'expo-font';
import * as Linking from 'expo-linking';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
```

---

## 🔗 Integration Status

### Fully Integrated
- ✅ expo-constants
- ✅ expo-device
- ✅ expo-router
- ✅ expo-web-browser
- ✅ expo-battery
- ✅ @expo/vector-icons

### Ready to Integrate (Peer Dependencies Already Set)
- ⚠️ expo-image (not in peer deps, but available)
- ⚠️ expo-haptics (not in peer deps, but available)
- ⚠️ expo-font (not in peer deps, but available)
- ⚠️ expo-linking (not in peer deps, but available)

### Requires Peer Dependency Addition
- ❌ expo-blur
- ❌ expo-linear-gradient
- ❌ expo-image-picker
- ❌ expo-status-bar
- ❌ expo-splash-screen
- ❌ expo-symbols
- ❌ expo-localization
- ❌ expo-system-ui

---

## 📝 Notes

1. **React Native Core Components**: All 25 core components are available by default with React Native and don't require additional installation.

2. **Expo Packages**: While many Expo packages are available, they need to be:
   - Added as peer dependencies in `package.json`
   - Installed in the consuming app
   - Imported and used in components

3. **Current Usage**: The package currently focuses on core functionality (routing, device info, battery, theming) and doesn't use many UI-focused Expo packages yet.

4. **Expansion Potential**: There's significant room to expand usage of both React Native core components and Expo packages to enhance the package's capabilities.
