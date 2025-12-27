# Recipio Mobile App

AI-powered recipe recommendation mobile application built with React Native and Expo.

## 📱 About

Recipio is a mobile application that provides AI-powered recipe suggestions based on available ingredients, step-by-step cooking guides, and comprehensive recipe management features.

## ✨ Features

- **AI-Powered Recipe Suggestions** - Get recipe recommendations based on your available ingredients
- **Step-by-Step Cooking Guides** - Follow detailed cooking instructions with progress tracking
- **Recipe Management** - Save favorites, track cooking history, and manage your recipe library
- **User Profiles** - Subscription tiers (Bronze, Gold, Diamond) with varying feature access
- **Multi-language Support** - English and Turkish language support
- **Offline Support** - View cached recipes without internet connection

## 🗺️ Development Roadmap

| # | Phase | Description | Status | Progress |
|---|-------|-------------|--------|----------|
| **1** | 🏗️ Foundation | Project setup, navigation, core screens, Supabase integration | 📋 Planned | 0% |
| **2** | 🔐 Auth & User Features | Authentication, user profiles, favorites, history | 📋 Planned | 0% |
| **3** | 🤖 AI Integration | Recipe matching algorithm, ingredient analysis | 📋 Planned | 0% |
| **4** | 💳 Subscription & Payments | Subscription tiers, payment integration | 📋 Planned | 0% |
| **5** | 🎨 UI/UX Polish | Design system, animations, final polish | 📋 Planned | 0% |

## 📊 Application Screens

| Screen | Purpose | Navigation |
|--------|---------|------------|
| **Splash** | Initial loading and app initialization | → Onboarding / Dashboard |
| **Onboarding** | User introduction and feature explanation | → Dashboard |
| **Dashboard** | Main hub with quick access to features | → All screens |
| **Ingredient Entry** | Manual ingredient input | → Recipe Suggestions |
| **Recipe Suggestions** | AI-powered recipe recommendations | → Recipe Detail |
| **Recipe Detail** | Complete recipe information | → Cooking Mode |
| **Cooking Mode** | Step-by-step cooking guide | → Dashboard / Recipe Detail |
| **Favorites** | Saved favorite recipes | → Recipe Detail |
| **History** | Cooking history and statistics | → Recipe Detail |
| **Profile** | User profile and settings | → Settings screens |
| **Search** | Recipe search | → Recipe Detail |

## 🔄 Navigation Flow (MasterFabric Expo Pattern)

The Recipio app follows the **MasterFabric Expo navigation pattern**, using centralized navigation utilities and Expo Router file-based routing.

### Initial Navigation Flow

```
App Launch
    ↓
app/index.tsx (Redirects to /splash)
    ↓
app/splash.tsx → src/screens/splash/
    ↓
[Check: shouldShowOnboarding()]
    ├─→ YES → app/onboarding.tsx → src/screens/onboarding/
    │           ↓
    │       [Onboarding Complete]
    │           ↓
    └─→ NO → app/(tabs)/index.tsx → src/screens/home/
                ↓
            Main App (Tabs Navigation)
```

### Navigation Implementation

**1. App Initialization:**
- `app/index.tsx` - Redirects to `/splash` on app launch
- `app/_layout.tsx` - Root layout with Stack navigator configuration
- All screens registered in Stack: `splash`, `onboarding`, `(tabs)`, etc.

**2. Splash Screen Navigation:**
- Location: `src/screens/splash/hooks/use-splash-view-model.ts`
- Uses `shouldShowOnboarding()` from `masterfabric-expo-core` to check if user needs onboarding
- Navigation methods:
  - First-time users: `router.push('/onboarding')`
  - Returning users: `navigationUtils.replace('(tabs)')` → Home tabs

**3. Navigation Utilities:**
- Centralized in `src/navigation/utils.ts`
- Methods: `navigate()`, `replace()`, `goBack()`, `goToHome()`, `goToSplash()`
- All navigation uses type-safe `RootStackParamList` from `src/navigation/types.ts`

**4. Navigation Configuration:**
- `src/navigation/navigation-config.ts` - Screen options, animations, deep linking
- `src/navigation/app-navigator.tsx` - Stack navigator with theme support
- `src/navigation/navigation-container.tsx` - Navigation container wrapper

### Complete Navigation Map

```
App Start (app/index.tsx)
    ↓
Splash (app/splash.tsx → src/screens/splash/)
    ├─→ Onboarding (app/onboarding.tsx → src/screens/onboarding/)
    │       ↓
    └─→ Home Tabs (app/(tabs)/index.tsx → src/screens/home/)
            ├─→ Ingredient Entry → Recipe Suggestions → Recipe Detail → Cooking Mode
            ├─→ Favorites ────────────────────────────────┐
            ├─→ History ───────────────────────────────────┼─→ Recipe Detail
            ├─→ Search ────────────────────────────────────┘
            └─→ Profile → Settings
```

### Navigation Pattern (MasterFabric Expo)

**Screen Structure:**
- Each screen in `src/screens/{screen-name}/` with required `index.ts` export
- Route files in `app/` import from screen index: `import { ScreenName } from '@/screens/screen-name'`
- Navigation logic in screen hooks: `use-{screen}-view-model.ts`

**Navigation Methods:**
```typescript
// From src/navigation/utils.ts
import { navigationUtils } from '@/navigation';

// Navigate to screen
navigationUtils.navigate('(tabs)');

// Replace current screen (used for splash → home)
navigationUtils.replace('(tabs)');

// Go back
navigationUtils.goBack();

// Go to home
navigationUtils.goToHome();
```

**Important Notes:**
- Each screen folder in `src/screens/` **must** have an `index.ts` file for proper exports
- Route files should import from screen folders: `import { ScreenName } from '@/screens/screen-name'`
- Dynamic routes use descriptive parameter names: `[recipeId].tsx` instead of `[id].tsx`
- Navigation uses centralized utilities from `src/navigation/utils.ts`
- All navigation is type-safe using `RootStackParamList` from `src/navigation/types.ts`
- Common route errors: See [Architecture](./architecture.md#common-route-errors-and-solutions) for troubleshooting

For detailed screen information, see [Features](./features.md).

## 💎 Subscription Tiers

| Tier | Features | Recipe Suggestions | Favorites | History | Ads |
|------|----------|-------------------|-----------|---------|-----|
| **Bronze (Free)** | Basic features | 5/day | 10 recipes | 7 days | ✅ |
| **Gold (Standard)** | Enhanced features | 20/day | 100 recipes | 30 days | ❌ |
| **Diamond (Premium)** | Unlimited access | Unlimited | Unlimited | Unlimited | ❌ |

For more details, see [Overview](./overview.md).

## 🚀 Installation

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo CLI
- Supabase account (for backend services)

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/recipio-mobile.git
cd recipio-mobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

> 💡 Get your Supabase URL and key from Supabase Dashboard → Settings → API

### 4. Start Development Server

```bash
npm start
# or
expo start
```

Scan the QR code with Expo Go app on your device or press `i` for iOS simulator / `a` for Android emulator.

## 📁 Project Structure

```
project/recipio/
├── app/              # Expo Router routes
├── src/
│   ├── assets/       # Fonts, images
│   ├── navigation/   # Navigation config
│   ├── screens/      # Feature-based screens
│   └── shared/       # Shared code
```

For detailed structure, see [Architecture](./architecture.md).

## 🏗️ Architecture

- **Feature-Based**: Each screen in its own folder
- **MasterFabric MasterView Pattern**: Uses MasterView component and useMasterView hook from masterfabric-expo-core
- **TypeScript**: Type-safe development
- **Expo Router**: File-based routing
- **Custom UI Components**: Shadcn-inspired component library built with React Native StyleSheet
- **Theme System**: Automatic light/dark mode support via masterfabric-expo-core
- **API Services**: Supabase-based services with type-safe error handling

For detailed architecture documentation, see [Architecture](./architecture.md).

## 📜 Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android device/emulator
npm run ios        # Run on iOS device/simulator
npm run web        # Run in web browser
npm run build      # Build for production
npm run lint       # Run ESLint code check
```

## 📚 Documentation

- **[Overview](./overview.md)** - Application overview, tech stack, subscription model
- **[Architecture](./architecture.md)** - Project structure, navigation, state management, services, UI components, API endpoints, error handling, testing, deployment
- **[Features](./features.md)** - All screens and views
- **[Database Schema](./database.md)** - Complete database schema, tables, relationships, and policies
- **[Quick Summary](./QUICK_SUMMARY.md)** - Brief overview of all documentation files
- **[Presentation Guide](./PRESENTATION_GUIDE.md)** - Guide for presenting the project to others
- **[Database Guide](./database-guide.md)** - Friendly explanation of database structure for presentations

## 🎯 Phase 1: Foundation - Detailed

**Goals:**

* 🔲 Set up Expo project with TypeScript
* 🔲 Implement Expo Router navigation structure
* 🔲 Create core screens (Splash, Onboarding, Dashboard)
* 🔲 Set up Supabase integration
* 🔲 Implement i18n infrastructure
* 🔲 Build ingredient entry and recipe suggestion screens
* 🔲 Design minimal UI with theme support

**Files to Create:**

```
📁 app/
├── _layout.tsx                 # Root layout
├── splash.tsx                  # Splash screen
├── onboarding.tsx              # Onboarding flow
├── (tabs)/
│   ├── _layout.tsx            # Tab layout
│   ├── index.tsx               # Dashboard
│   ├── favorites.tsx
│   ├── history.tsx
│   └── profile.tsx
├── ingredient-entry.tsx
├── recipe-suggestions.tsx
├── recipe-detail/[recipeId].tsx    # Recipe detail (dynamic route)
└── cooking-mode/[recipeId].tsx     # Cooking mode (dynamic route)

📁 src/
├── assets/
│   ├── fonts/
│   └── images/
├── navigation/
│   ├── app-navigator.tsx
│   ├── navigation-container.tsx
│   └── navigation-config.ts
├── screens/
│   ├── splash/
│   ├── onboarding/
│   ├── dashboard/
│   ├── ingredient-entry/
│   ├── recipe-suggestions/
│   ├── recipe-detail/
│   └── cooking-mode/
└── shared/
    ├── components/             # Button, Card, ScreenHeader
    ├── hooks/                  # useColorScheme, useLocale
    ├── services/               # Supabase service, API service
    ├── store/                  # Global Zustand store
    ├── types/                  # TypeScript types
    ├── constants/              # Colors, StorageKeys
    ├── utils/                  # Utility functions
    ├── i18n/                   # Translations
    ├── contexts/               # React contexts
    └── helpers/                # Helper functions
```

**Acceptance Criteria:**

* App runs without errors on iOS and Android
* Navigation works between all screens
* Supabase connection established
* i18n switches between English and Turkish
* Core screens display correctly
* Theme support (light/dark mode)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Types

| Type     | Description        |
| -------- | ------------------ |
| feat     | New feature        |
| fix      | Bug fix            |
| docs     | Documentation      |
| style    | Code formatting    |
| refactor | Code restructuring |
| test     | Adding tests       |
| chore    | Maintenance        |

## 📄 License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Made with 🍳 by **W-OSS**
