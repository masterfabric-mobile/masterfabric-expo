# Overview

Recipio is an AI-powered recipe recommendation mobile application built with React Native and Expo.

## Application Features

- AI-powered recipe suggestions based on available ingredients
- Step-by-step cooking guides
- Recipe management (favorites, history)
- User profiles with subscription tiers

## Tech Stack

- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **State Management**: Zustand
- **Backend**: Supabase (PostgreSQL Database, Authentication, Storage)
- **UI Components**: Custom component library (Shadcn-inspired) with React Native StyleSheet
- **Styling**: React Native StyleSheet with theme-aware components
- **Animations**: React Native Reanimated
- **i18n**: Multi-language support (English, Turkish)
- **Error Tracking**: Sentry (optional)
- **Testing**: Jest + React Native Testing Library

## Subscription Model

Recipio supports three subscription tiers:

1. **Bronze (Free)** - Basic features with limitations
2. **Gold (Standard)** - Enhanced features for regular users
3. **Diamond (Premium)** - Unlimited access to all features

Features vary by tier:
- Recipe suggestions (daily limits)
- Favorites storage limits
- Cooking history retention
- Custom recipes creation limits
- Ad experience (Bronze includes ads, Gold and Diamond are ad-free)
- Support priority

Subscription management is handled in the Profile view.

## Project Structure

```
project/recipio/
├── app/              # Expo Router routes
├── src/
│   ├── assets/       # Static assets
│   ├── navigation/   # Navigation config
│   ├── screens/      # Feature-based screens
│   └── shared/       # Shared code
```

For detailed structure, see [Architecture](./architecture.md).

## Architecture Principles

- **Feature-Based**: Each screen in its own folder
- **MasterFabric MasterView Pattern**: Uses MasterView component and useMasterView hook from masterfabric-expo-core for activity tracking, theme, and locale management
- **TypeScript**: Type-safe development
- **Expo Router**: File-based routing

For detailed architecture documentation, see [Architecture](./architecture.md).

