# Folder Structure

The project's folder structure is organized to reflect the architectural principles of modularity and separation of concerns.

```
/
├── app/                  # Expo Router: Entry point and root navigation
└── src/
    ├── api/                # Backend AI service communication
    ├── assets/             # Static assets (images, fonts)
    ├── components/         # Shared, reusable UI components
    ├── config/             # Third-party service configurations
    ├── constants/          # App-wide constants
    ├── contexts/           # Global React contexts
    ├── features/           # Core application features (domain-based)
    ├── hooks/              # Shared, reusable React hooks
    ├── navigation/         # Navigation logic and types
    ├── screens/            # Top-level screens (auth, settings)
    ├── services/           # Third-party service integrations
    ├── store/              # Global state management (Zustand)
    ├── styles/             # Global styles and theme
    └── utils/              # Utility and helper functions
```

### Description of Key Directories

- **`app/`**: The entry point for the application, managed by **Expo Router**. It defines the root navigation structure and screen layouts.

- **`src/api/`**: Contains the logic for making direct calls to the backend AI services. This abstracts the raw HTTP requests from the rest of the application.

- **`src/components/`**: Home to shared, "dumb" UI components that are used across multiple features (e.g., `Button`, `Card`, `Input`).

- **`src/config/`**: A centralized location for initializing and configuring all third-party services. This is where API keys and environment-specific settings are loaded and exported.

- **`src/constants/`**: Stores static, app-wide data that does not change at runtime. Examples include color palettes, dimension guidelines, and subscription plan details.

- **`src/contexts/`**: Manages global state that needs to be accessible across the entire app, such as user authentication status (`AuthContext`) and subscription level (`SubscriptionContext`).

- **`src/features/`**: The heart of the application. Each sub-directory is a self-contained feature module, encapsulating all the components, screens, and logic related to a specific domain (e.g., `tasks`).

- **`src/hooks/`**: Contains shared, reusable React hooks that encapsulate complex logic (e.g., `useAuthentication`, `useApi`).

- **`src/screens/`**: Holds top-level screens that are not tied to a specific feature, such as the Onboarding flow, Authentication screens (Sign In/Up), and the main app container.

- **`src/services/`**: Provides a clean, abstracted API for the rest of the app to interact with external services. For instance, `services/auth/supabase_auth.ts` contains all the logic for Supabase authentication, hiding the implementation details from the UI.
