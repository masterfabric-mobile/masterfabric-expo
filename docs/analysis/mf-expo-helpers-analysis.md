# MasterFabric Expo Helpers: Analysis and Development Guide

This document provides an analysis of the existing helper modules within the MasterFabric Expo project and establishes a set of conventions and best practices for creating new helpers. The primary example used for this analysis is `src/shared/helpers/device-info.ts`.

## 1. Overview

Helpers in this project are designed to be self-contained modules that abstract complex logic, third-party library interactions, or platform-specific APIs. They provide a simple, consistent interface for other parts of the application to consume, promoting code reuse and separation of concerns.

A good helper:
- Has a clear, single responsibility (e.g., device info, string manipulation, date formatting).
- Is easy to use and understand.
- Handles its own errors gracefully.
- Is thoroughly documented.

## 2. File and Naming Conventions

- **File Location:** All shared helpers should be located in `src/shared/helpers/`.
- **File Naming:** Files should be named using kebab-case, describing their core functionality (e.g., `device-info.ts`, `date-formatter.ts`).
- **Function Naming:** Function names should be descriptive and use camelCase. Use prefixes like `get`, `is`, `check`, `format`, or `subscribeTo` to make their purpose immediately clear.
- **Interface Naming:** Interfaces should be named using PascalCase and clearly describe the data structure they represent (e.g., `DeviceInfo`, `DeviceInfoOptions`).

## 3. Core Principles

### Modularity and Single Responsibility
Each helper file should focus on a single domain. The `device-info.ts` helper, for example, deals exclusively with information related to the device, OS, and app. It does not include logic for user authentication or data fetching.

### TypeScript First
- **Strong Typing:** All helpers must be written in TypeScript. Define interfaces for all complex data structures and function signatures. This ensures type safety and improves developer experience with auto-completion.
- **Options Objects:** For functions that take multiple optional parameters, use an options object with a corresponding interface (e.g., `getDeviceInfo(options: DeviceInfoOptions = {})`). This makes the function more readable and extensible.

### Abstraction
Helpers should act as a facade, hiding the implementation details of the libraries they use. The `device-info.ts` helper uses `expo-constants`, `expo-device`, and `react-native` APIs, but the consumer of the helper only needs to call functions like `getDeviceInfo()` without needing to know about the underlying libraries.

### Graceful Error Handling
Helpers should be robust. If a function can fail (e.g., an API call or accessing a hardware feature), it must be wrapped in a `try...catch` block. Instead of crashing, the function should log a warning and return a sensible default value (like `null` or an empty array).

### Multiple Data Views
If a helper provides complex data, consider exporting multiple functions that return different "views" or formats of that data for specific use cases. `device-info.ts` provides:
- `getDeviceInfo()`: The comprehensive, configurable main function.
- `getBasicDeviceInfo()`: A lightweight, synchronous version for quick access to essential info.
- `getDeviceInfoForAPI()`: Data formatted specifically for sending to a backend.
- `getDeviceInfoForLogging()`: Data formatted for display in logs or debug screens.

## 4. Structure of a Helper File

A new helper file should generally follow this structure:

```typescript
// 1. Imports from external libraries and other parts of the app
import * as SomeLibrary from 'some-library';
import { Platform } from 'react-native';

// 2. Interface definitions for data structures and options
export interface MyHelperData {
  // ...
}

export interface MyHelperOptions {
  // ...
}

// 3. The primary, most comprehensive function (often async)
/**
 * JSDoc comment explaining what the function does.
 */
export async function getMyHelperData(options: MyHelperOptions = {}): Promise<MyHelperData> {
  // ... implementation
}

// 4. Specialized, synchronous, or formatted variations
/**
 * JSDoc for the lightweight version.
 */
export function getBasicData(): Partial<MyHelperData> {
  // ... implementation
}

// 5. Utility functions related to the helper's domain
/**
 * JSDoc for a utility function.
 */
export function checkCompatibility(): boolean {
  // ... implementation
}

// 6. Private helper functions (not exported)
function internalCalculation(): string {
  // ...
}
```

## 5. Exporting

- **From the Helper File:** Use the `export` keyword for all functions and interfaces that should be accessible outside the module.
- **From the Main Index:** To simplify imports across the app, every exported member from a new helper file must be re-exported from `src/shared/helpers/index.ts`.

For a new helper named `new-helper.ts`, you would add the following line to `src/shared/helpers/index.ts`:

```typescript
export * from './new-helper';
```

This allows other parts of the application to import any helper function from a single, consistent path: `import { getNewData } from '@/shared/helpers';`.
