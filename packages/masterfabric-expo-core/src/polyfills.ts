/**
 * Polyfills Entry Point
 * 
 * This file automatically imports required polyfills for MasterFabric Expo Core.
 * Import this file at the top of your app's entry point to ensure all polyfills
 * are loaded before other code runs.
 * 
 * @example
 * ```typescript
 * // At the top of your app entry file (e.g., index.js or _layout.tsx)
 * import 'masterfabric-expo-core/polyfills';
 * 
 * // Then import other modules
 * import { useAutoInitMasterView } from 'masterfabric-expo-core';
 * ```
 */

// Import required polyfills
import 'react-native-get-random-values';

// Re-export everything from main index
export * from './index';

