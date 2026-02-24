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
import {
  CONFIG_PREVIEW_PERMISSIONS,
  PERMISSION_KEYS,
  PERMISSION_LABEL_KEYS,
} from '../constants/permissions-helper.constants';
import type { LocationPermissionInfo } from '../models/permissions-helper-models';
import { usePermissionsHelperStore } from '../store/permissions-helper-store';

export function usePermissionsHelperViewModel() {
  const { statuses, loading, requestAttempted, setStatus, setLoading, setRequestAttempted } =
    usePermissionsHelperStore();
  const snackbar = useSnackbar();
  const [locationInfo, setLocationInfo] = useState<LocationPermissionInfo | null>(null);

  const REQUEST_TIMEOUT_MS = 20000;
  const SKIP_CHECK_AFTER_REQUEST_MS = 5000;
  const lastRequestedRef = useRef<{ key: PermissionKey; time: number } | null>(null);
  const requestInProgressRef = useRef(false);
  const currentRequestKeyRef = useRef<PermissionKey | null>(null);
  const withTimeout = <T>(p: Promise<T>) =>
    Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Permission request timed out')), REQUEST_TIMEOUT_MS)
      ),
    ]);

  const requestPermission = useCallback(
    async (key: PermissionKey, silent = false) => {
      if (requestInProgressRef.current) return;
      requestInProgressRef.current = true;
      currentRequestKeyRef.current = key;
      setLoading(key, true);
      try {
        const fetchStatus = async (): Promise<PermissionStatus> => {
          switch (key) {
            case 'camera':
              return permissionsHandler.requestCamera({
                rationale: t('helpers.permissionsHelper.rationale.camera'),
                showSettingsAlert: true,
                includePhotoLibrary: false,
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
            case 'location':
              return permissionsHandler.requestLocation({
                rationale: t('helpers.permissionsHelper.rationale.location'),
                showSettingsAlert: true,
                accuracy: 'high',
                background: true,
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
            case 'notifications':
              return permissionsHandler.requestNotifications({
                rationale: t('helpers.permissionsHelper.rationale.notifications'),
                showSettingsAlert: true,
              });
            case 'bluetooth':
              return permissionsHandler.request('bluetooth', {
                rationale: t('helpers.permissionsHelper.rationale.bluetooth'),
                showSettingsAlert: true,
              });
            case 'sms':
              return permissionsHandler.request('sms', {
                rationale: t('helpers.permissionsHelper.rationale.sms'),
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
      setRequestAttempted(key, true);
      if (!silent && (status.status === 'blocked' || status.blocked)) {
        permissionsHandler.showSettingsAlert({
          permission: key,
          openSettings: true,
          message: t('helpers.permissionsHelper.rationale.settingsMessage'),
        });
      }
      return status;
    } catch (e) {
      const fallbackStatus = await permissionsHandler.check(key as PermissionType).catch(() => null);
      if (fallbackStatus) {
        setStatus(key, fallbackStatus);
        setRequestAttempted(key, true);
      }
      throw e;
    } finally {
      currentRequestKeyRef.current = null;
      requestInProgressRef.current = false;
      setLoading(key, false);
    }
  }, [setStatus, setLoading, setRequestAttempted, snackbar]);

  const checkAll = useCallback(async () => {
    const now = Date.now();
    for (const key of PERMISSION_KEYS) {
      if (currentRequestKeyRef.current === key) continue;
      const recentlyRequested =
        lastRequestedRef.current?.key === key &&
        now - lastRequestedRef.current.time < SKIP_CHECK_AFTER_REQUEST_MS;
      if (recentlyRequested) continue;
      try {
        const type: PermissionType = key;
        const status = await permissionsHandler.check(type);
        const prev = usePermissionsHelperStore.getState().statuses[key];
        const resolved =
          !status.granted && prev?.status === 'blocked'
            ? { ...status, status: 'blocked' as const, blocked: true, canAskAgain: false }
            : status;
        setStatus(key, resolved);
      } catch {
        setStatus(key, null);
      }
    }
  }, [setStatus]);

  const refreshStatuses = useCallback(async () => {
    await checkAll();
    snackbar.success(t('helpers.permissionsHelper.refreshCompleted'), 2500);
  }, [checkAll, snackbar]);

  /** Refresh statuses from system without snackbar (e.g. when screen gains focus). */
  const refreshStatusesSilent = useCallback(() => {
    checkAll();
  }, [checkAll]);

  const openSettings = useCallback(() => {
    permissionsHandler.openSettings();
  }, []);

  // checkAll runs when app returns to foreground (AppState) and when screen gains focus (call refreshStatusesSilent from screen).

  const activeCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        const currentKey = currentRequestKeyRef.current;
        PERMISSION_KEYS.forEach((k) => {
          if (k !== currentKey) setLoading(k, false);
        });
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

  const isAnyRequestInProgress = Object.values(loading).some(Boolean);

  return {
    statuses,
    loading,
    requestPermission,
    openSettings,
    refreshStatuses,
    refreshStatusesSilent,
    permissionKeys: PERMISSION_KEYS,
    requestAttempted,
    isAnyRequestInProgress,
    iosEntries,
    androidEntries,
    locationPermissionInfo: locationInfo,
  };
}
