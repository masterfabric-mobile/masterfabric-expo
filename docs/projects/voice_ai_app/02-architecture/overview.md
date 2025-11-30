# Architecture Overview

The application follows a **feature-based architecture**, a scalable and modular approach where code is organized by domain or feature. This promotes a strong separation of concerns, making the codebase easier to maintain, test, and scale.

The core of this architecture relies on `@masterfabric-expo/core`, which provides a robust foundation of shared components, hooks, contexts, and utilities. This ensures consistency and reduces boilerplate code across the application.

### Core Principles

- **Modularity**: Each feature (e.g., `recording`, `summarization`) is a self-contained module. This means all the logic, UI, and state for a feature are grouped together.

- **Separation of Concerns**: A clear distinction is maintained between different layers of the application:
    - **UI Layer**: `components/`, `screens/`, `assets/`
    - **Business Logic Layer**: `hooks/`, `features/`, `store/`
    - **Data & Services Layer**: `services/`, `api/`, `config/`

- **Scalability**: The structure is designed to grow. Adding a new feature is as simple as creating a new directory under `src/features/` without disrupting existing code. This makes onboarding new developers and adding new functionality more efficient.
