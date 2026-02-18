import { t } from '@/src/shared/i18n';
import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import {
  permissionsHandler,
  type PermissionStatus,
  type PermissionType,
} from 'masterfabric-expo-core';
import { CONFIG_PREVIEW_PERMISSIONS, PERMISSION_KEYS } from '../constants/permissions-helper.constants';
import type { PermissionKey } from '../constants/permissions-helper.constants';
import { usePermissionsHelperStore } from '../store/permissions-helper-store';

const PERMISSION_LABEL_I18N: Record<PermissionKey, string> = {
  camera: 'helpers.permissionsHelper.permissionCamera',
  microphone: 'helpers.permissionsHelper.permissionMicrophone',
  photoLibrary: 'helpers.permissionsHelper.permissionPhotoLibrary',
  location: 'helpers.permissionsHelper.permissionLocation',
  notifications: 'helpers.permissionsHelper.permissionNotifications',
  calendar: 'helpers.permissionsHelper.permissionCalendar',
  contacts: 'helpers.permissionsHelper.permissionContacts',
  phone: 'helpers.permissionsHelper.permissionPhone',
};

export type LocationPermissionInfo = {
  foreground: 'granted' | 'denied' | 'unavailable';
  background: 'granted' | 'denied' | 'unavailable';
  precise: boolean;
};

export function usePermissionsHelperViewModel() {
  const { statuses, loading, setStatus, setLoading } = usePermissionsHelperStore();
  const snackbar = useSnackbar();
  const [locationInfo, setLocationInfo] = useState<LocationPermissionInfo | null>(null);

  const REQUEST_TIMEOUT_MS = 20000;
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
        const type: PermissionType = key;
        const existing = await permissionsHandler.check(type);
        if (existing.granted && existing.status !== 'limited') {
          setStatus(key, existing);
          return existing;
        }
        const fetchStatus = async (): Promise<PermissionStatus> => {
        switch (key) {
          case 'camera':
            return permissionsHandler.requestCamera({
              rationale: t('helpers.permissionsHelper.rationale.camera'),
              showSettingsAlert: true,
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
      fetchPromise.catch(() => {}); // Prevent unhandled rejection when timeout wins and fetch settles later
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
        // Blocked: native popup açılmaz – Ayarlar uyarısı göster
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
      const labelI18n = t(PERMISSION_LABEL_I18N[key] ?? key);
      snackbar.error(`${labelI18n}: ${e instanceof Error ? e.message : 'error'}`, 3500);
      throw e;
    } finally {
      setLoading(key, false);
    }
  }, [setStatus, setLoading, snackbar.error]);

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

  const openSettings = useCallback(() => {
    permissionsHandler.openSettings();
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (nextState === 'active') {
        checkAll();
      }
    });
    return () => sub.remove();
  }, [checkAll]);

  useEffect(() => {
    permissionsHandler.getLocationPermissionInfo().then(setLocationInfo).catch(() => setLocationInfo(null));
  }, [statuses.location]);

  const iosEntries = permissionsHandler.getIOSInfoPlistEntries(CONFIG_PREVIEW_PERMISSIONS);
  const androidEntries = permissionsHandler.getAndroidManifestEntries(CONFIG_PREVIEW_PERMISSIONS);

  return {
    statuses,
    loading,
    requestPermission,
    openSettings,
    refreshStatuses: checkAll,
    permissionKeys: PERMISSION_KEYS,
    iosEntries,
    androidEntries,
    locationPermissionInfo: locationInfo,
  };
}
