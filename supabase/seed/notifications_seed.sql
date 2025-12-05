-- Seed data for notifications table
-- Mobile developer-focused notifications including React Native, Expo, and general mobile dev tips

INSERT INTO public.notifications (title, message, type, category, icon, language, created_at) VALUES
-- React Native Notifications
('React Native 0.74 Released', 'React Native 0.74 brings improved performance, new architecture updates, and better TypeScript support. Upgrade your projects to take advantage of the latest features!', 'info', 'react-native', 'logo-react', 'en', NOW() - INTERVAL '2 hours'),
('New React Native Performance Tips', 'Use React.memo() for expensive components, implement virtualized lists for long lists, and leverage Hermes engine optimizations for better app performance.', 'info', 'react-native', 'speedometer', 'en', NOW() - INTERVAL '5 hours'),
('React Native Navigation Best Practices', 'Use React Navigation v6 for type-safe navigation, implement deep linking properly, and optimize your navigation stack for better user experience.', 'success', 'react-native', 'navigate', 'en', NOW() - INTERVAL '1 day'),
('React Native State Management Guide', 'Consider using Zustand or Jotai for lightweight state management, or Redux Toolkit for complex apps. Choose based on your app complexity.', 'info', 'react-native', 'layers', 'en', NOW() - INTERVAL '2 days'),
('React Native Testing Updates', 'React Native Testing Library v12 now supports better async testing, improved matchers, and enhanced accessibility testing capabilities.', 'success', 'react-native', 'flask', 'en', NOW() - INTERVAL '3 days'),
('React Native Memory Leaks Prevention', 'Always clean up event listeners, unsubscribe from observables, and properly dispose of timers in useEffect cleanup functions to prevent memory leaks.', 'warning', 'react-native', 'warning', 'en', NOW() - INTERVAL '4 days'),
('React Native 0.73 Security Updates', 'Important security patches released for React Native 0.73. Update immediately to protect your apps from potential vulnerabilities.', 'error', 'react-native', 'shield-checkmark', 'en', NOW() - INTERVAL '5 days'),

-- Expo Notifications
('Expo SDK 51 Available', 'Expo SDK 51 includes React Native 0.76, new Expo Router features, improved EAS Build performance, and enhanced development tools. Start upgrading today!', 'success', 'expo', 'rocket', 'en', NOW() - INTERVAL '3 hours'),
('Expo Router v3 Released', 'Expo Router v3 introduces file-based routing improvements, better TypeScript support, and enhanced navigation patterns. Check out the migration guide!', 'info', 'expo', 'map', 'en', NOW() - INTERVAL '6 hours'),
('EAS Build Performance Improvements', 'EAS Build now supports incremental builds, faster build times, and improved caching. Your builds should complete 30% faster on average.', 'success', 'expo', 'build', 'en', NOW() - INTERVAL '1 day'),
('Expo Updates: Over-the-Air Deployment', 'Use Expo Updates for instant OTA updates without app store review. Perfect for bug fixes, content updates, and feature flags.', 'info', 'expo', 'cloud-upload', 'en', NOW() - INTERVAL '2 days'),
('Expo Dev Tools Enhancement', 'New Expo Dev Tools include better error reporting, network inspection, and performance profiling. Install the latest version for improved debugging.', 'success', 'expo', 'bug', 'en', NOW() - INTERVAL '3 days'),
('Expo Config Plugins Guide', 'Learn how to create custom Expo config plugins to extend your app configuration and integrate native modules seamlessly.', 'info', 'expo', 'extension-puzzle', 'en', NOW() - INTERVAL '4 days'),
('EAS Submit: App Store Automation', 'Automate your app store submissions with EAS Submit. Supports both iOS App Store and Google Play Store with a single command.', 'success', 'expo', 'storefront', 'en', NOW() - INTERVAL '5 days'),

-- General Mobile Development
('iOS 18 Developer Features', 'iOS 18 introduces new SwiftUI improvements, enhanced WidgetKit capabilities, and improved App Store Connect APIs. Start exploring the new features!', 'info', 'general', 'logo-apple', 'en', NOW() - INTERVAL '4 hours'),
('Android 15 Preview Available', 'Android 15 preview includes new Material Design 3 components, improved performance APIs, and enhanced privacy features for developers.', 'info', 'general', 'logo-android', 'en', NOW() - INTERVAL '7 hours'),
('Mobile App Architecture Patterns', 'Consider MVVM, Clean Architecture, or MVI patterns for better code organization. Choose based on your team size and project complexity.', 'info', 'general', 'business', 'en', NOW() - INTERVAL '1 day'),
('Mobile Performance Optimization', 'Optimize images with WebP format, implement code splitting, use lazy loading, and minimize bundle size for faster app startup times.', 'success', 'general', 'trending-up', 'en', NOW() - INTERVAL '2 days'),
('Mobile Security Best Practices', 'Always use HTTPS for API calls, implement certificate pinning, store sensitive data securely with Keychain/Keystore, and validate all user inputs.', 'warning', 'general', 'lock-closed', 'en', NOW() - INTERVAL '3 days'),
('Mobile Accessibility Guidelines', 'Follow WCAG 2.1 guidelines, implement proper semantic labels, ensure sufficient color contrast, and test with screen readers for better accessibility.', 'info', 'general', 'accessibility', 'en', NOW() - INTERVAL '4 days'),
('Mobile CI/CD Best Practices', 'Set up automated testing, use feature flags for gradual rollouts, implement crash reporting, and monitor app performance in production.', 'success', 'general', 'git-branch', 'en', NOW() - INTERVAL '5 days'),
('Mobile Analytics Integration', 'Track user behavior, monitor app crashes, measure performance metrics, and use analytics to make data-driven decisions for your app.', 'info', 'general', 'analytics', 'en', NOW() - INTERVAL '6 days'),

-- App & System Notifications
('Welcome to MasterFabric', 'Your account has been successfully created. Start exploring our features and build amazing mobile apps with React Native and Expo!', 'success', 'app', 'checkmark-circle', 'en', NOW() - INTERVAL '30 minutes'),
('New Template Available', 'Check out our latest React Native template with advanced navigation, state management, and TypeScript support. Perfect for starting new projects!', 'info', 'app', 'code-slash', 'en', NOW() - INTERVAL '8 hours'),
('System Maintenance Scheduled', 'Scheduled maintenance will occur tonight from 12 AM to 2 AM EST. Some features may be temporarily unavailable during this time.', 'warning', 'system', 'construct', 'en', NOW() - INTERVAL '1 day'),
('New Feature: Real-time Collaboration', 'Collaborate with your team in real-time using our new Pixel Canvas feature. Build together and see changes instantly!', 'success', 'app', 'people', 'en', NOW() - INTERVAL '2 days'),
('API Rate Limits Updated', 'We have updated our API rate limits to provide better service. Check the documentation for new limits and best practices.', 'info', 'system', 'server', 'en', NOW() - INTERVAL '3 days'),
('Security Alert: Update Required', 'We detected unusual activity. Please review your recent login sessions and update your password if you notice anything suspicious.', 'error', 'system', 'shield-checkmark', 'en', NOW() - INTERVAL '4 days'),
('Documentation Updated', 'Our documentation has been updated with new guides, API references, and code examples. Check out the latest improvements!', 'info', 'app', 'document-text', 'en', NOW() - INTERVAL '5 days'),
('Community Forum Launched', 'Join our new community forum to ask questions, share knowledge, and connect with other mobile developers building amazing apps!', 'success', 'app', 'chatbubbles', 'en', NOW() - INTERVAL '6 days'),

-- Additional React Native Tips
('React Native Debugging Tips', 'Use Flipper for advanced debugging, enable Hermes debugger, use React DevTools, and leverage console logging strategically for better debugging experience.', 'info', 'react-native', 'bug', 'en', NOW() - INTERVAL '7 hours'),
('React Native Animation Performance', 'Use Animated API for simple animations, Reanimated 3 for complex animations, and avoid layout animations on the main thread for better performance.', 'success', 'react-native', 'flash', 'en', NOW() - INTERVAL '1 day'),
('React Native Code Splitting', 'Implement code splitting with React.lazy(), use dynamic imports, and split vendor bundles to reduce initial bundle size and improve load times.', 'info', 'react-native', 'code', 'en', NOW() - INTERVAL '2 days'),

-- Additional Expo Tips
('Expo Development Build Guide', 'Create custom development builds with native modules using EAS Build. Perfect for testing native features before production deployment.', 'info', 'expo', 'hammer', 'en', NOW() - INTERVAL '8 hours'),
('Expo Environment Variables', 'Use app.config.js for environment variables, implement different configs for dev/staging/prod, and never commit sensitive keys to version control.', 'warning', 'expo', 'key', 'en', NOW() - INTERVAL '1 day'),
('Expo Notifications Setup', 'Set up push notifications with Expo Notifications API. Supports both FCM (Android) and APNs (iOS) with a unified interface.', 'success', 'expo', 'notifications', 'en', NOW() - INTERVAL '2 days'),

-- Additional General Mobile Dev Tips
('Mobile App Store Optimization', 'Optimize your app store listings with compelling screenshots, clear descriptions, relevant keywords, and regular updates to improve discoverability.', 'info', 'general', 'search', 'en', NOW() - INTERVAL '1 day'),
('Mobile App Monetization Strategies', 'Consider in-app purchases, subscriptions, ads, or freemium models. Choose based on your app type and target audience.', 'info', 'general', 'cash', 'en', NOW() - INTERVAL '2 days'),
('Mobile Testing Strategies', 'Implement unit tests, integration tests, and E2E tests. Use Detox for React Native E2E testing and ensure good test coverage.', 'success', 'general', 'checkmark-done', 'en', NOW() - INTERVAL '3 days'),
('Mobile App Localization', 'Plan for internationalization from the start, use i18n libraries, test with different languages, and consider RTL support for better global reach.', 'info', 'general', 'globe', 'en', NOW() - INTERVAL '4 days');

