# MasterFabric Expo &nbsp;🚀

[![Expo](https://img.shields.io/badge/Expo-54.0.0-1B1F23?logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Native](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![License: AGPL v3](https://img.shields.io/badge/License-AGPL%20v3-blue.svg)](LICENSE)

> **Modern cross-platform mobile application design, management & development tool.**  
> Cross-platform, type-safe, and lightning fast.

A modern cross-platform mobile application development framework built with React Native and Expo. 
Offering type-safe development with TypeScript, state management solutions, multi-language support, theming capabilities, and developer tools.

<!-- Optionally, add a screenshot or GIF here -->
<!-- ![App Screenshot](assets/screenshots/app-demo.gif) -->

## 🚀 Features

| **Category** | **Feature**        | **Details**                             |
|--------------|--------------------|------------------------------------------|
| Platform     | Cross-Platform      | iOS · Android · Web (PWA)                |
| Localization | Internationalization| English · Turkish · RTL support          |
| UI/UX        | Modern UI           | Adaptive theming · Material Design 3     |
| Design       | Design Tools        | Pattern design · Visual editor           |
| Development  | Type-Safe           | Fully typed with TypeScript              |
| State Mgmt   | State Management    | Zustand · React Query                    |
| Routing      | Navigation          | Expo Router · Type-safe routing          |
| Storage      | Offline Support     | Local & encrypted storage                |
| Security     | Secure Storage      | Async + encrypted layer                  |
| Testing      | Tested              | Jest · RN Testing Library                |


## 🛠️ Tech Stack

| Category         | Stack                                                                 |
|------------------|----------------------------------------------------------------------|
| **Framework**    | [Expo SDK 54](https://docs.expo.dev/) + [React Native](https://reactnative.dev/) |
| **Language**     | [TypeScript](https://www.typescriptlang.org/)                        |
| **Navigation**   | [Expo Router](https://expo.github.io/router/)                        |
| **State**        | [Zustand](https://zustand-demo.pmnd.rs/) + [React Query](https://tanstack.com/query/latest) |
| **Styling**      | React Native StyleSheet, Expo Components                             |
| **Animations**   | [Reanimated](https://docs.swmansion.com/react-native-reanimated/)    |
| **Storage**      | Async Storage, Encrypted Storage                                     |
| **Testing**      | Jest, React Native Testing Library                                   |
| **i18n**         | Expo Localization, JSON translations                                 |
| **Dev Tools**    | ESLint, Prettier                                                     |

---

## 📦 Project Structure

```dart
src
├── screens            # Application views, grouped by feature
│   ├── home           # Home screen with dashboard
│   ├── splash         # Initial loading screen
│   ├── onboarding     # User onboarding flow
│   ├── projects       # Project listing and details
│   ├── settings       # User and app settings
│   ├── notifications  # In-app notifications
├── navigation         # Navigation configuration and typed routes
├── shared             # Shared code and modules
│   ├── components     # Reusable UI components
│   ├── hooks          # Custom React hooks
│   ├── i18n           # Internationalization setup
│   ├── services       # API services and utility logic
│   ├── store          # Global state management (Zustand, etc.)
│   ├── types          # Global TypeScript type definitions
│   └── utils          # General utility functions
└── assets             # Static assets (images, fonts, icons)
```

---

## ⚡ Quick Start

> **Requirements:** Node.js 18+, npm or yarn, Expo CLI

```diff
+ Clone the repo
git clone https://github.com/masterfabric-mobile/masterfabric-expo.git
cd masterfabric-expo

+ Install dependencies
npm install

+ Start development server
npx expo start
```

- Press `i` for iOS, `a` for Android, or scan QR with Expo Go.

### Running on a physical iOS/Android device (development build)

If the app stays on a **black screen** on a real device:

1. **Metro must be running** and the device must reach it:
   - **Same Wi‑Fi:** Start with `npx expo start`, then run the app from the device (or use `npx expo run:ios --device` so Metro starts and the app is installed with the correct server URL).
   - **Different network / remote:** Use tunnel: `npx expo start --tunnel`, then open the app on the device and connect to the shown URL if the dev client asks.
2. **Build and run in one go (recommended):**  
   `npx expo run:ios --device`  
   This builds, installs, starts Metro, and points the app at your Mac.

---

## 📱 Platforms

- **iOS:** iPhone/iPad (native patterns)
- **Android:** Phone/Tablet (Material 3)
- **Web:** PWA, responsive for desktop/mobile

---

## 🌍 Internationalization

- 🇺🇸 English (default)
- 🇹🇷 Turkish  
Switch languages in-app, with auto locale detection and RTL support.

---

## 🧑‍💻 Scripts

| Script                | Description                       |
|-----------------------|-----------------------------------|
| `npm start`           | Start Expo dev server             |
| `npm run android`     | Run on Android emulator           |
| `npm run ios`         | Run on iOS simulator              |
| `npm run web`         | Run web version                   |
| `npm run type-check`  | TypeScript check                  |
| `npm run lint`        | ESLint analysis                   |
| `npm run format`      | Prettier formatting               |
| `npm run test`        | Run Jest tests                    |

---

## 🏗️ Build & Deploy

```diff
+ Android
npx expo build:android
+ iOS
npx expo build:ios
+ Web
npx expo build:web
```

---

## 🤝 Contributing

Contributions welcome!  
Please read our [Code of Conduct](CODE_OF_CONDUCT.md) and open issues or PRs.

---

## 📄 License

[GNU AGPL v3.0](LICENSE)

---

## 👤 Author

[Gürkan Fikret Günak](https://github.com/gurkanfikretgunak)  
✉️ gurkanfikretgunak@masterfabric.co

---

## 📚 Documentation

See [`docs/`](docs/) for guides:
- [Internationalization](docs/i18n-implementation.md)
- [Development Rules](rules/expo-development-rules.md)