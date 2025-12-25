# Recipio 🍳

A modern recipe mobile application built with Expo and React Native. Recipio helps you discover, save, and share delicious recipes from around the world.

## 📱 About Recipio

Recipio is a cross-platform mobile application designed for food enthusiasts who want to explore new recipes, save their favorites, and create their own culinary masterpieces. Built as part of the "Create Mobile App Session I" event.

## ✨ Features

- **Recipe Discovery**: Browse through a vast collection of recipes
- **Recipe Details**: View detailed recipe information with ingredients and instructions
- **Favorites**: Save your favorite recipes for quick access
- **Search**: Find recipes by name, ingredients, or cuisine type
- **Modern UI**: Clean and intuitive user interface
- **Cross-Platform**: Works on iOS, Android, and Web

## 🏗️ Architecture

### Project Structure

```
recipio/
├── App.tsx              # Main application component
├── index.js             # Entry point
├── app.json            # Expo configuration
├── package.json        # Dependencies
├── metro.config.js     # Metro bundler configuration
├── tsconfig.json       # TypeScript configuration
└── README.md           # This file
```

### Tech Stack

- **Framework**: Expo SDK 54
- **Language**: TypeScript
- **UI Library**: React Native
- **Platforms**: iOS, Android, Web

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Expo CLI (installed globally or via npx)
- iOS Simulator (for iOS development) or Android Emulator (for Android development)

### Installation

```bash
cd project/recipio
npm install
```

### Running the Application

#### Quick Start (Recommended)

**Linux/macOS:**
```bash
cd project/recipio
chmod +x run.sh
./run.sh
```

**Windows:**
```cmd
cd project\recipio
run.bat
```

#### Manual Start

```bash
cd project/recipio
npm start
```

Then:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Press `w` for Web browser
- Scan QR code with Expo Go app on your device

## 📦 Scripts

| Script | Description |
|--------|-------------|
| `npm start` | Start Expo development server |
| `npm run android` | Run on Android emulator |
| `npm run ios` | Run on iOS simulator |
| `npm run web` | Run on Web browser |

## 🎨 Application Schema

### Current Features

1. **Splash Screen**
   - App logo and name display
   - Event information
   - Smooth loading animation

### Planned Features

- Recipe listing view
- Recipe detail view
- Favorites management
- Search functionality
- User profile
- Recipe creation

## 🔧 Configuration

### Expo Configuration (`app.json`)

- **Name**: Recipio
- **Slug**: recipio
- **Version**: 1.0.0
- **Platforms**: iOS, Android, Web
- **Orientation**: Portrait

### Bundle Identifiers

- **iOS**: `com.recipio.app`
- **Android**: `com.recipio.app`

## 📝 Development Notes

- Uses TypeScript for type safety
- Follows React Native best practices
- Expo managed workflow
- Hot reload enabled for fast development

## 🤝 Contributing

This project is part of the "Create Mobile App Session I" event. Contributions and improvements are welcome!

## 📄 License

Private project - All rights reserved

---

**Built with ❤️ for Create Mobile App Session I**
