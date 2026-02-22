import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import {
    permissionsHandler,
    type PermissionStatus,
    type PermissionType,
} from 'masterfabric-expo-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { PermissionKey } from '../constants/permissions-helper.constants';
import { StorageService } from '@/src/shared/services/storage';
import {
  CONFIG_PREVIEW_PERMISSIONS,
  PERMISSION_KEYS,
  PERMISSION_LABEL_KEYS,
  STORAGE_KEY_REQUEST_ATTEMPTED,
} from '../constants/permissions-helper.constants';
import type { LocationPermissionInfo } from '../models/permissions-helper-models';
import { usePermissionsHelperStore } from '../store/permissions-helper-store';

export function usePermissionsHelperViewModel() {
  const { statuses, loading, setStatus, setLoading } = usePermissionsHelperStore();
  const snackbar = useSnackbar();
  const [locationInfo, setLocationInfo] = useState<LocationPermissionInfo | null>(null);
  const [requestAttempted, setRequestAttemptedState] = useState<Record<PermissionKey, boolean>>(
    () => Object.fromEntries(PERMISSION_KEYS.map((k) => [k, false])) as Record<PermissionKey, boolean>
  );

  const REQUEST_TIMEOUT_MS = 15000;
  const SKIP_CHECK_AFTER_REQUEST_MS = 2500;
  const lastRequestedRef = useRef<{ key: PermissionKey; time: number } | null>(null);
  const withTimeout = <T>(p: Promise<T>) =>
    Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Permission request timed out')), REQUEST_TIMEOUT_MS)
      ),
    ]);

  const requestPermission = useCallback(
    async (key: PermissionKey, silent = false) => {
      setLoading(key, true);
      try {
        const fetchStatus = async (): Promise<PermissionStatus> => {
          switch (key) {
            case 'camera':
              return permissionsHandler.requestCamera({
                rationale: t('helpers.permissionsHelper.rationale.camera'),
                showSettingsAlert: true,
                includePhotoLibrary: true,
              });
            case 'microphone':
              return permissionsHandler.requestMicrophone({
                rationale: t('helpers.permissionsHelper.rationale.microphone'),
                showSettingsAlert: true,
              });
            case 'photoLibrary':
              return permissionsHandler.requestPhotoLibrary({
                rationale: t('helpers.permissionsHelper.rationale.photoLibrary'),
                showSettingsAlert: true,
              });
            case 'storage':
              return permissionsHandler.requestStorage({
                rationale: t('helpers.permissionsHelper.rationale.storage'),
                showSettingsAlert: true,
              });
            case 'location':
              return permissionsHandler.requestLocation({
                rationale: t('helpers.permissionsHelper.rationale.location'),
                showSettingsAlert: true,
                accuracy: 'high',
                background: true,
              });
            case 'notifications':
              return permissionsHandler.requestNotifications({
                alert: true,
                badge: true,
                sound: true,
              });
            case 'calendar':
              return permissionsHandler.requestCalendar({
                rationale: t('helpers.permissionsHelper.rationale.calendar'),
                showSettingsAlert: true,
              });
            case 'contacts':
              return permissionsHandler.requestContacts({
                rationale: t('helpers.permissionsHelper.rationale.contacts'),
                showSettingsAlert: true,
              });
            case 'phone':
              return permissionsHandler.requestPhone({
                rationale: t('helpers.permissionsHelper.rationale.phone'),
                showSettingsAlert: true,
              });
            default:
              return permissionsHandler.request(key as PermissionType, { showSettingsAlert: true });
          }
        };
      let status: PermissionStatus;
      const fetchPromise = fetchStatus();
      fetchPromise.catch(() => {});
      try {
        status = await withTimeout(fetchPromise);
      } catch (timeoutErr) {
        const isTimeout =
          timeoutErr instanceof Error && timeoutErr.message === 'Permission request timed out';
        if (isTimeout) {
          const type: PermissionType = key;
          status = await permissionsHandler.check(type);
        } else {
          throw timeoutErr;
        }
      }
      setStatus(key, status);
      lastRequestedRef.current = { key, time: Date.now() };
      setRequestAttemptedState((prev) => {
        const next = { ...prev, [key]: true };
        StorageService.setItem(STORAGE_KEY_REQUEST_ATTEMPTED, next).catch(() => {});
        return next;
      });
      if (!silent && (status.status === 'blocked' || status.blocked)) {
        permissionsHandler.showSettingsAlert({
          permission: key,
          openSettings: true,
          message: t('helpers.permissionsHelper.rationale.settingsMessage'),
        });
      }
      return status;
    } catch (e) {
      throw e;
    } finally {
      setLoading(key, false);
    }
  }, [setStatus, setLoading, snackbar]);

  const checkAll = useCallback(async () => {
    const now = Date.now();
    for (const key of PERMISSION_KEYS) {
      const recentlyRequested =
        lastRequestedRef.current?.key === key &&
        now - lastRequestedRef.current.time < SKIP_CHECK_AFTER_REQUEST_MS;
      if (recentlyRequested) continue;
      try {
        const type: PermissionType = key;
        const status = await permissionsHandler.check(type);
        const prev = statuses[key];
        const resolved =
          !status.granted && prev?.status === 'blocked'
            ? { ...status, status: 'blocked' as const, blocked: true, canAskAgain: false }
            : status;
        setStatus(key, resolved);
      } catch {
        setStatus(key, null);
      }
    }
  }, [setStatus, statuses]);

  const refreshStatuses = useCallback(async () => {
    await checkAll();
    snackbar.success(t('helpers.permissionsHelper.refreshCompleted'), 2500);
  }, [checkAll, snackbar]);

  const openSettings = useCallback(() => {
    permissionsHandler.openSettings();
  }, []);

  useEffect(() => {
    checkAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    StorageService.getItem<Record<PermissionKey, boolean>>(STORAGE_KEY_REQUEST_ATTEMPTED).then(
      (stored) => {
        if (stored && typeof stored === 'object') {
          setRequestAttemptedState((prev) => ({ ...prev, ...stored }));
        }
      }
    );
  }, []);

  const activeCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        PERMISSION_KEYS.forEach((k) => setLoading(k, false));
        if (activeCheckTimeoutRef.current != null) clearTimeout(activeCheckTimeoutRef.current);
        activeCheckTimeoutRef.current = setTimeout(() => {
          activeCheckTimeoutRef.current = null;
          checkAll();
        }, 300);
      }
    });
    return () => {
      sub.remove();
      if (activeCheckTimeoutRef.current != null) clearTimeout(activeCheckTimeoutRef.current);
    };
  }, [checkAll, setLoading]);

  useEffect(() => {
    permissionsHandler.getLocationPermissionInfo().then(setLocationInfo).catch(() => setLocationInfo(null));
  }, [statuses.location]);

  const iosEntries = useMemo(
    () => permissionsHandler.getIOSInfoPlistEntries(CONFIG_PREVIEW_PERMISSIONS),
    []
  );
  const androidEntries = useMemo(
    () => permissionsHandler.getAndroidManifestEntries(CONFIG_PREVIEW_PERMISSIONS),
    []
  );

  return {
    statuses,
    loading,
    requestPermission,
    openSettings,
    refreshStatuses,
    permissionKeys: PERMISSION_KEYS,
    requestAttempted,
    iosEntries,
    androidEntries,
    locationPermissionInfo: locationInfo,
  };
}
