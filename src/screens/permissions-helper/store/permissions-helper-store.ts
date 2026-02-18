import { create } from 'zustand';
import type { PermissionStatus } from 'masterfabric-expo-core';
import type { PermissionKey } from '../constants/permissions-helper.constants';
import { PERMISSION_KEYS } from '../constants/permissions-helper.constants';

const initialStatuses = Object.fromEntries(
  PERMISSION_KEYS.map((key) => [key, null as PermissionStatus | null])
) as Record<PermissionKey, PermissionStatus | null>;

const initialLoading = Object.fromEntries(
  PERMISSION_KEYS.map((key) => [key, false])
) as Record<PermissionKey, boolean>;

interface PermissionsHelperStore {
  statuses: Record<PermissionKey, PermissionStatus | null>;
  loading: Record<PermissionKey, boolean>;
  setStatus: (key: PermissionKey, status: PermissionStatus | null) => void;
  setLoading: (key: PermissionKey, loading: boolean) => void;
  reset: () => void;
}

export const usePermissionsHelperStore = create<PermissionsHelperStore>((set) => ({
  statuses: { ...initialStatuses },
  loading: { ...initialLoading },
  setStatus: (key, status) =>
    set((state) => ({ statuses: { ...state.statuses, [key]: status } })),
  setLoading: (key, loading) =>
    set((state) => ({ loading: { ...state.loading, [key]: loading } })),
  reset: () => set({ statuses: { ...initialStatuses }, loading: { ...initialLoading } }),
}));

export { PERMISSION_KEYS } from '../constants/permissions-helper.constants';
export type { PermissionKey } from '../constants/permissions-helper.constants';
