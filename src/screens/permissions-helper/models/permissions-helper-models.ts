import type { PermissionStatus } from 'masterfabric-expo-core';
import type { PermissionKey } from '../constants/permissions-helper.constants';

/** State for a single permission row (status + loading). */
export interface PermissionRowState {
  status: PermissionStatus | null;
  loading: boolean;
}

/** Full screen state: statuses and loading per permission key. */
export type PermissionsHelperState = Record<PermissionKey, PermissionRowState>;

/** Props for the permissions helper screen (reserved for future use). */
export interface PermissionsHelperScreenProps {
  // optional: initialPermissionKeys?, onResult?
}

export type { PermissionKey } from '../constants/permissions-helper.constants';
