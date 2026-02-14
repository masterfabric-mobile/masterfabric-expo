# Prerequisites

Software and tools required to develop the Recipio app.

## Required Software

### Node.js
- **Version**: 18.0.0 or higher
- **Download**: [nodejs.org](https://nodejs.org/)
- **Check**: `node --version`

### npm
- Included with Node.js
- **Check**: `npm --version`

### Git
- **Download**: [git-scm.com](https://git-scm.com/)
- **Check**: `git --version`

### Expo CLI
- Can be installed globally: `npm install -g expo-cli`
- Or use `npx expo` (recommended)
- **Check**: `npx expo --version`

## Platform-Specific Requirements

### iOS Development (macOS only)
- **Xcode**: 14.0 or higher
- **iOS Simulator**: Included with Xcode
- **CocoaPods**: `sudo gem install cocoapods`

### Android Development
- **Android Studio**: Latest version
- **Android SDK**: Included with Android Studio
- **Android Emulator**: Can be installed via Android Studio
- **Java Development Kit (JDK)**: 11 or higher

### Web Development
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Recommended Tools

### Code Editor
- **VS Code**: [code.visualstudio.com](https://code.visualstudio.com/)
- Recommended extensions:
  - ESLint
  - Prettier
  - TypeScript
  - React Native Tools
  - Expo Tools

### Mobile Device (Optional)
- **Expo Go app**: For testing on a physical iOS or Android device
  - iOS: [App Store](https://apps.apple.com/app/expo-go/id982107779)
  - Android: [Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)

## Supabase Account

- **Supabase account**: [supabase.com](https://supabase.com)
- Create a new project
- Get API keys (Settings → API)
  - Project URL
  - anon/public key

## Verification

To verify all requirements are installed:

```bash
node --version      # v18.0.0 or higher
npm --version       # v9.0.0 or higher
git --version       # v2.30.0 or higher
npx expo --version  # any version
```

## Workspace Requirements

### MasterFabric Expo Workspace

The project lives inside the MasterFabric Expo workspace:

```
masterfabric-expo/
├── packages/
│   └── masterfabric-expo-core/    # Local package (required)
└── project/
    └── recipio/                    # Application
```

**Important:** The `@masterfabric-expo/core` package must be present in the workspace.

---

**Last updated:** 2025-02-10  
**Version:** 1.0.0
