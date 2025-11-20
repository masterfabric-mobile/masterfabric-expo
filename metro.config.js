const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Ensure linked workspaces resolve modules from the app's node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
];

// Explicitly map shared deps so Metro picks the app's copy
config.resolver.extraNodeModules = {
  firebase: path.resolve(projectRoot, 'node_modules/firebase'),
  '@react-native-async-storage/async-storage': path.resolve(projectRoot, 'node_modules/@react-native-async-storage/async-storage'),
  '@firebase-helper': path.resolve(projectRoot, 'src/screens/firebase-helper'),
  // Map masterfabric-expo-core to use source files directly in development
  'masterfabric-expo-core': path.resolve(projectRoot, 'packages/masterfabric-expo-core/src'),
};

// Custom resolver for masterfabric-expo-core to use source TypeScript files
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === 'masterfabric-expo-core') {
    // Resolve to source index file directly
    const sourcePath = path.resolve(projectRoot, 'packages/masterfabric-expo-core/src/index.ts');
    return {
      filePath: sourcePath,
      type: 'sourceFile',
    };
  }
  // For other modules, use default resolution
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

// Support Firebase's .cjs files (required for React Native Firebase Auth)
config.resolver.sourceExts = [...(config.resolver.sourceExts || []), 'cjs'];

// Disable package.json exports field to allow Metro to resolve Firebase modules correctly
config.resolver.unstable_enablePackageExports = false;

// Watch the monorepo packages folder
config.watchFolders = [
  path.resolve(projectRoot, 'packages'),
];

module.exports = config;


