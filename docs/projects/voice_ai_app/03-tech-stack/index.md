# 3. Technology Stack

This project leverages a modern and robust technology stack to deliver a high-quality mobile application. The core of the stack is the Expo and React Native ecosystem, enhanced by the MasterFabric architecture.

- **Core Framework**: **React Native with Expo**
  - Enables cross-platform development for iOS and Android from a single codebase.
  - Expo provides a managed workflow, simplifying builds, updates, and access to native APIs.

- **Architecture**: **MasterFabric (`@masterfabric-expo/core`)**
  - A specialized framework built on top of Expo to enforce a scalable, feature-based architecture.
  - Provides a suite of pre-built components, hooks, and utilities to accelerate development.

- **Navigation**: **Expo Router**
  - A file-based routing system that simplifies navigation and deep linking within the app.

- **Authentication**: **Supabase with Better Auth**
  - Supabase provides a backend-as-a-service (BaaS) with a full suite of tools, including a Postgres database, authentication, and instant APIs.
  - "Better Auth" likely refers to a custom or enhanced authentication pattern built on top of Supabase.

- **State Management**: **React Context & Zustand**
  - **React Context** is used for managing global state that is shared across many components, such as authentication status and user subscription info.
  - **Zustand** is used for more complex or high-frequency state changes, offering a simple and powerful alternative to Redux.

- **Analytics**: **Google Analytics**
  - Integrated to track user behavior, screen views, and custom events to gather insights on app usage.

- **Push Notifications**: **OneSignal**
  - A comprehensive service for managing push notifications, user segmentation, and in-app messaging.

- **Advertisements**: **Google AdSense & Meta AdSense**
  - Monetization platforms for displaying targeted ads, primarily for users on the free (Bronze) subscription tier.

- **Payments**: **Stripe & Iyzico**
  - **Stripe** is a global payment processing platform used for handling subscription payments.
  - **Iyzico** provides a regional payment gateway alternative.

- **AI Services**: **Custom AI Service Integration**
  - The application communicates with a custom-built backend service for AI-powered transcription and summarization.
