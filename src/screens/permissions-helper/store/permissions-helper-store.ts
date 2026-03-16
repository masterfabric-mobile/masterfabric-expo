import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PermissionStatus } from 'masterfabric-expo-core';
import { create } from 'zustand';
import {
  PERMISSION_KEYS,
  STORAGE_KEY_LAST_STATUSES,
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

function persistAllStatuses(statuses: Record<PermissionKey, PermissionStatus | null>) {
  AsyncStorage.setItem(STORAGE_KEY_LAST_STATUSES, JSON.stringify(statuses)).catch((err) => {
    if (__DEV__) {
      console.warn('[PermissionsHelper] persistAllStatuses failed', err);
    }
  });
}

interface PermissionsHelperStore {
  statuses: Record<PermissionKey, PermissionStatus | null>;
  loading: Record<PermissionKey, boolean>;
  requestAttempted: Record<PermissionKey, boolean>;
  setStatus: (key: PermissionKey, status: PermissionStatus | null) => void;
  rehydrateStatuses: (partial: Partial<Record<PermissionKey, PermissionStatus | null>>) => void;
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
      set(state => {
        const next = { ...state.statuses, [key]: status };
        persistAllStatuses(next);
        return { statuses: next };
      }),
    rehydrateStatuses: (partial) =>
      set(state => ({ statuses: { ...state.statuses, ...partial } })),
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
