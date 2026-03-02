import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import {
  permissionsHandler,
  type PermissionStatus,
  type PermissionType,
} from 'masterfabric-expo-core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import type { PermissionKey } from '../constants/permissions-helper.constants';
import {
  PERMISSION_KEYS,
  REQUEST_TIMEOUT_MS,
  REQUEST_TIMEOUT_PHOTOLIBRARY_MS,
  SKIP_CHECK_AFTER_REQUEST_MS,
} from '../constants/permissions-helper.constants';
import type { LocationPermissionInfo } from '../models/permissions-helper-models';
import { usePermissionsHelperStore } from '../store/permissions-helper-store';

export function usePermissionsHelperViewModel() {
  const {
    statuses,
    loading,
    requestAttempted,
    setStatus,
    setLoading,
    setRequestAttempted,
  } = usePermissionsHelperStore();
  const snackbar = useSnackbar();
  const [locationInfo, setLocationInfo] =
    useState<LocationPermissionInfo | null>(null);

  const lastRequestedRef = useRef<{ key: PermissionKey; time: number } | null>(
    null
  );
  const requestInProgressRef = useRef(false);
  const currentRequestKeyRef = useRef<PermissionKey | null>(null);
  const withTimeout = <T>(p: Promise<T>, timeoutMs = REQUEST_TIMEOUT_MS) =>
    Promise.race([
      p,
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error('Permission request timed out')),
          timeoutMs
        )
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
                accessLevel: 'readWrite',
                rationale: t(
                  'helpers.permissionsHelper.rationale.photoLibrary'
                ),
                showSettingsAlert: true,
              });
            case 'location':
              return permissionsHandler.requestLocation({
                rationale: t('helpers.permissionsHelper.rationale.location'),
                showSettingsAlert: true,
                accuracy: 'high',
                background: false,
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
                rationale: t(
                  'helpers.permissionsHelper.rationale.notifications'
                ),
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
            case 'phone':
              return permissionsHandler.requestPhone({
                rationale: t('helpers.permissionsHelper.rationale.phone'),
                showSettingsAlert: true,
              });
            case 'storage':
              return permissionsHandler.request('storage', {
                rationale: t('helpers.permissionsHelper.rationale.storage'),
                showSettingsAlert: true,
              });
            case 'biometrics':
              return permissionsHandler.request('biometrics', {
                rationale: t('helpers.permissionsHelper.rationale.biometrics'),
                showSettingsAlert: true,
              });
            default:
              return permissionsHandler.request(key as PermissionType, {
                showSettingsAlert: true,
              });
          }
        };
        let status: PermissionStatus;
        const fetchPromise = fetchStatus();
        fetchPromise.catch(() => {});
        // Do not timeout when system dialog is shown (user may take time to respond; rely on AppState when they return).
        // photoLibrary and notifications use timeout: can hang in Expo Go / some runtimes; timeout + check() shows status.
        const noTimeoutKeys: PermissionKey[] = [
          'camera',
          'sms',
          'microphone',
          'location',
          'calendar',
          'contacts',
          'phone',
          'storage',
          'biometrics',
          'bluetooth',
        ];
        const useTimeout = !noTimeoutKeys.includes(key);
        const timeoutMs =
          key === 'photoLibrary' || key === 'notifications'
            ? REQUEST_TIMEOUT_PHOTOLIBRARY_MS
            : REQUEST_TIMEOUT_MS;
        try {
          status = useTimeout
            ? await withTimeout(fetchPromise, timeoutMs)
            : await fetchPromise;
        } catch (timeoutErr) {
          const isTimeout =
            timeoutErr instanceof Error &&
            timeoutErr.message === 'Permission request timed out';
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
        const fallbackStatus = await permissionsHandler
          .check(key as PermissionType)
          .catch(() => null);
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
    },
    [setStatus, setLoading, setRequestAttempted, snackbar]
  );

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
        // Only keep "blocked" if current check also says canAskAgain: false (user really chose "Don't ask again")
        const resolved =
          !status.granted &&
          prev?.status === 'blocked' &&
          status.canAskAgain === false
            ? {
                ...status,
                status: 'blocked' as const,
                blocked: true,
                canAskAgain: false,
              }
            : key === 'biometrics' && prev?.status === 'granted' && !status.granted
              ? prev
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

  const activeCheckTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  useEffect(() => {
    const sub = AppState.addEventListener(
      'change',
      (nextState: AppStateStatus) => {
        if (nextState === 'active') {
          const currentKey = currentRequestKeyRef.current;
          PERMISSION_KEYS.forEach(k => {
            if (k !== currentKey) setLoading(k, false);
          });
          if (activeCheckTimeoutRef.current != null)
            clearTimeout(activeCheckTimeoutRef.current);
          activeCheckTimeoutRef.current = setTimeout(async () => {
            activeCheckTimeoutRef.current = null;
            // User returned from system dialog: update status for the requested key and clear loading
            // so UI updates immediately (request promise can be very slow to resolve)
            if (currentKey != null) {
              try {
                const status = await permissionsHandler.check(
                  currentKey as PermissionType
                );
                setStatus(currentKey, status);
                setRequestAttempted(currentKey, true);
              } catch {
                // ignore
              }
              setLoading(currentKey, false);
              // Allow next request: the pending promise may never resolve, so clear refs here
              currentRequestKeyRef.current = null;
              requestInProgressRef.current = false;
            }
            await checkAll();
          }, 400);
        }
      }
    );
    return () => {
      sub.remove();
      if (activeCheckTimeoutRef.current != null)
        clearTimeout(activeCheckTimeoutRef.current);
    };
  }, [checkAll, setLoading]);

  useEffect(() => {
    permissionsHandler
      .getLocationPermissionInfo()
      .then(setLocationInfo)
      .catch(() => setLocationInfo(null));
  }, []);
  useEffect(() => {
    if (statuses.location != null) {
      permissionsHandler
        .getLocationPermissionInfo()
        .then(setLocationInfo)
        .catch(() => setLocationInfo(null));
    }
  }, [statuses.location]);

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
    locationPermissionInfo: locationInfo,
  };
}
