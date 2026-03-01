import type { PermissionStatus } from 'masterfabric-expo-core';
import { create } from 'zustand';
import {
  PERMISSION_KEYS,
  type PermissionKey,
} from '../constants/permissions-helper.constants';

const initialStatuses = Object.fromEntries(
  PERMISSION_KEYS.map(key => [key, null as PermissionStatus | null])
) as Record<PermissionKey, PermissionStatus | null>;

const initialLoading = Object.fromEntries(
  PERMISSION_KEYS.map(key => [key, false])
) as Record<PermissionKey, boolean>;

const initialRequestAttempted = Object.fromEntries(
  PERMISSION_KEYS.map(key => [key, false])
) as Record<PermissionKey, boolean>;

interface PermissionsHelperStore {
  statuses: Record<PermissionKey, PermissionStatus | null>;
  loading: Record<PermissionKey, boolean>;
  requestAttempted: Record<PermissionKey, boolean>;
  setStatus: (key: PermissionKey, status: PermissionStatus | null) => void;
  setLoading: (key: PermissionKey, loading: boolean) => void;
  setRequestAttempted: (key: PermissionKey, attempted: boolean) => void;
  reset: () => void;
}

export const usePermissionsHelperStore = create<PermissionsHelperStore>(
  set => ({
    statuses: { ...initialStatuses },
    loading: { ...initialLoading },
    requestAttempted: { ...initialRequestAttempted },
    setStatus: (key, status) =>
      set(state => ({ statuses: { ...state.statuses, [key]: status } })),
    setLoading: (key, loading) =>
      set(state => ({ loading: { ...state.loading, [key]: loading } })),
    setRequestAttempted: (key, attempted) =>
      set(state => ({
        requestAttempted: { ...state.requestAttempted, [key]: attempted },
      })),
    reset: () =>
      set({
        statuses: { ...initialStatuses },
        loading: { ...initialLoading },
        requestAttempted: { ...initialRequestAttempted },
      }),
  })
);
