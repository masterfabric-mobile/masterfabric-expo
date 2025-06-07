# MasterFabric Expo 🚀

Modern mobile application platform designed for fabric design and management. Built with React Native and Expo for seamless cross-platform development.

## 📖 About MasterFabric

MasterFabric is a comprehensive mobile solution for textile professionals, designers, and fabric enthusiasts. The platform provides tools for fabric catalog management, design visualization, and collaborative workflow management.

## ✨ Features

- **Multi-platform**: iOS, Android, and Web support with native performance
- **Fabric Catalog**: Advanced fabric management and categorization system
- **Design Tools**: Integrated tools for fabric pattern design and visualization
- **Internationalization**: Full English and Turkish language support
- **Modern UI**: Adaptive dark/light theme with Material Design principles
- **Type Safe**: Complete TypeScript implementation for robust development
- **State Management**: Efficient Zustand store with React Query for data fetching
- **Navigation**: Type-safe routing with Expo Router
- **Offline Support**: Local storage capabilities for offline functionality

## 🛠 Tech Stack

- **Framework**: React Native with Expo SDK 53
- **Language**: TypeScript for type safety and better DX
- **Navigation**: Expo Router with file-based routing
- **State Management**: Zustand + React Query for optimal data flow
- **Styling**: React Native StyleSheet + Expo components
- **Animations**: React Native Reanimated for smooth 60fps animations
- **Storage**: Async Storage + Encrypted Storage for secure data
- **Testing**: Jest + React Native Testing Library
- **Internationalization**: Expo Localization with JSON translation files
- **Development**: ESLint + Prettier for code quality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (macOS) or Android Emulator

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gurkanfikretgunak/masterfabric-expo.git
   cd masterfabric-expo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npx expo start
   ```

4. **Run on device/simulator**
   - Press `i` for iOS simulator
   - Press `a` for Android emulator  
   - Scan QR code with Expo Go app on physical device

## 📱 Available Platforms

- **iOS**: iPhone and iPad support with native iOS design patterns
- **Android**: Phone and tablet support with Material Design 3
- **Web**: Progressive Web App with responsive design for desktop browsers

## 🌍 Internationalization

The app supports multiple languages with RTL support:
- 🇺🇸 English (default)
- 🇹🇷 Turkish

Language switching is available in the app settings with automatic locale detection.

## 📁 Project Structure

```
src/
├── screens/           # Feature-based screen modules
│   ├── home/         # Home screen with dashboard
│   └── splash/       # Splash screen with loading
├── navigation/        # Navigation configuration and types
├── shared/
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── i18n/          # Internationalization setup
│   ├── services/      # API services and utilities
│   ├── store/         # Global state management
│   ├── types/         # TypeScript type definitions
│   └── utils/         # Utility functions
└── assets/            # Static assets (images, fonts, icons)
```

## 🔧 Development Scripts

```bash
# Development
npm start              # Start Expo development server
npm run android        # Run on Android emulator
npm run ios           # Run on iOS simulator
npm run web           # Run web version

# Code Quality
npm run type-check     # TypeScript type checking
npm run lint          # ESLint code analysis
npm run format        # Prettier code formatting
npm run format:check  # Check code formatting

# Testing
npm run test          # Run Jest tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate test coverage report
```

## 🏗️ Build & Deploy

```bash
# Build for production
npx expo build:android    # Android APK/AAB
npx expo build:ios        # iOS IPA
npx expo build:web        # Web bundle

# Submit to stores
npx expo submit:android    # Google Play Store
npx expo submit:ios       # Apple App Store
```

## 📄 License

This project is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0) - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Gürkan Fikret Günak**
- GitHub: [@gurkanfikretgunak](https://github.com/gurkanfikretgunak)
- Email: gurkanfikretgunak@example.com

## 🤝 Contributing

Contributions are welcome! Please read our [Code of Conduct](CODE_OF_CONDUCT.md) and feel free to submit issues and pull requests.

## 📚 Documentation

For more detailed documentation, please visit our [docs](docs/) directory:
- [Internationalization Implementation](docs/i18n-implementation.md)
- [Development Rules](rules/expo-development-rules.md)