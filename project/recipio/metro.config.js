const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Avoid "Cannot use 'import.meta' outside a module" on web: use legacy resolution
// instead of package.json "exports" (which can pull in ESM-only builds).
config.resolver.unstable_enablePackageExports = false;

config.watchFolders = [workspaceRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

config.resolver.extraNodeModules = {
  '@masterfabric-expo/core': path.resolve(
    workspaceRoot,
    'packages/masterfabric-expo-core/src'
  ),
};

config.resolver.disableHierarchicalLookup = true;

module.exports = config;
