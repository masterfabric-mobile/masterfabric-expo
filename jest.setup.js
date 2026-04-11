// RNTL v12+ built-in matchers (replaces deprecated @testing-library/jest-native)
require('@testing-library/react-native/matchers');

// Native modules pulled in via masterfabric-expo-core (e.g. MasterViewCore) need Jest mocks
jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);
