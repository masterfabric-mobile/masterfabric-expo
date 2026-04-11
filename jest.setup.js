// RNTL v12+ built-in matchers (replaces deprecated @testing-library/jest-native)
require('@testing-library/react-native/matchers');

// Reanimated 4 pulls in react-native-worklets; use the official Jest mock (no native runtime)
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Native modules pulled in via masterfabric-expo-core (e.g. MasterViewCore) need Jest mocks
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
