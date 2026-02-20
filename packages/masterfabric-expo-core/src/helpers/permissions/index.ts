/**
 * Permissions helper – public API for easy imports.
 *
 * Re-exports all permission types (PermissionType, PermissionStatus, options, etc.)
 * and the permissions handler API (permissionsHandler, requestPermission, checkPermission,
 * showPermissionSettingsAlert, openAppSettings, checkMultiplePermissions, requestMultiplePermissions,
 * getPermissionRationale, areAllPermissionsGranted, getDeniedPermissions, usePermissions).
 *
 * Prefer Expo modules; Android uses PermissionsAndroid. For unsupported permissions
 * consider react-native-permissions. See permissions_handler_helper for strategy and edge cases.
 *
 * @example
 * import { permissionsHandler, PermissionStatus, requestPermission } from 'masterfabric-expo-core';
 * const status: PermissionStatus = await permissionsHandler.check('camera');
 */
export * from './types';
export * from '../permissions_handler_helper';
