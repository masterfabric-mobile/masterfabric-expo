import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import {
    permissionsHandler,
    type PermissionStatus,
    type PermissionType,
} from 'masterfabric-expo-core';
import { useCallback, useEffect, useMemo, useState } from 'react';
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
  const { statuses, loading, setStatus, setLoading } = usePermissionsHelperStore();
  const snackbar = useSnackbar();
  const [locationInfo, setLocationInfo] = useState<LocationPermissionInfo | null>(null);

  const REQUEST_TIMEOUT_MS = 15000;
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
      if (!silent) {
        const labelI18n = t(PERMISSION_LABEL_KEYS[key] ?? key);
        const statusKey =
          status.status === 'granted'
            ? 'helpers.permissionsHelper.statusGranted'
            : status.status === 'denied'
              ? 'helpers.permissionsHelper.statusDenied'
              : status.status === 'blocked'
                ? 'helpers.permissionsHelper.statusBlocked'
                : status.status === 'limited'
                  ? 'helpers.permissionsHelper.statusLimited'
                  : 'helpers.permissionsHelper.statusUnavailable';
        const resultMessage = `${labelI18n}: ${t(statusKey)}`;
        if (status.granted) {
          snackbar.success(resultMessage, 3000);
        } else {
          snackbar.error(resultMessage, 3500);
        }
        if (status.status === 'blocked' || status.blocked) {
          permissionsHandler.showSettingsAlert({
            permission: key,
            openSettings: true,
            message: t('helpers.permissionsHelper.rationale.settingsMessage'),
          });
        }
      }
      return status;
    } catch (e) {
      const labelI18n = t(PERMISSION_LABEL_KEYS[key] ?? key);
      snackbar.error(`${labelI18n}: ${e instanceof Error ? e.message : 'error'}`, 3500);
      throw e;
    } finally {
      setLoading(key, false);
    }
  }, [setStatus, setLoading, snackbar]);

  const checkAll = useCallback(async () => {
    for (const key of PERMISSION_KEYS) {
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
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        checkAll();
        PERMISSION_KEYS.forEach((k) => setLoading(k, false));
      }
    });
    return () => sub.remove();
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
    iosEntries,
    androidEntries,
    locationPermissionInfo: locationInfo,
  };
}
