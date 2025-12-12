import { urlLauncherHelper } from 'masterfabric-expo-core';
import { useCallback } from 'react';

/**
 * Hook for URL launcher operations
 * Provides convenient access to URL launcher helper methods
 */
export function useUrlLauncher() {
  const openUrl = useCallback(async (url: string) => {
    return await urlLauncherHelper.openUrl(url);
  }, []);

  const openEmail = useCallback(async (
    recipient: string,
    options?: Parameters<typeof urlLauncherHelper.openEmail>[1]
  ) => {
    return await urlLauncherHelper.openEmail(recipient, options);
  }, []);

  const openPhone = useCallback(async (
    phoneNumber: string,
    options?: Parameters<typeof urlLauncherHelper.openPhone>[1]
  ) => {
    return await urlLauncherHelper.openPhone(phoneNumber, options);
  }, []);

  const openSMS = useCallback(async (
    recipients: string | string[],
    options?: Parameters<typeof urlLauncherHelper.openSMS>[1]
  ) => {
    return await urlLauncherHelper.openSMS(recipients, options);
  }, []);

  const openMap = useCallback(async (
    location: Parameters<typeof urlLauncherHelper.openMap>[0],
    options?: Parameters<typeof urlLauncherHelper.openMap>[1]
  ) => {
    return await urlLauncherHelper.openMap(location, options);
  }, []);

  const openInBrowser = useCallback(async (
    url: string,
    options?: Parameters<typeof urlLauncherHelper.openInBrowser>[1]
  ) => {
    return await urlLauncherHelper.openInBrowser(url, options);
  }, []);

  const openDeepLink = useCallback(async (
    url: string,
    options?: Parameters<typeof urlLauncherHelper.openDeepLink>[1]
  ) => {
    return await urlLauncherHelper.openDeepLink(url, options);
  }, []);

  const openAppStore = useCallback(async (
    appId: string,
    options?: Parameters<typeof urlLauncherHelper.openAppStore>[1]
  ) => {
    return await urlLauncherHelper.openAppStore(appId, options);
  }, []);

  const openSettings = useCallback(async (
    options?: Parameters<typeof urlLauncherHelper.openSettings>[0]
  ) => {
    return await urlLauncherHelper.openSettings(options);
  }, []);

  return {
    openUrl,
    openEmail,
    openPhone,
    openSMS,
    openMap,
    openInBrowser,
    openDeepLink,
    openAppStore,
    openSettings,
    validateUrl: urlLauncherHelper.validateUrl.bind(urlLauncherHelper),
    normalizeUrl: urlLauncherHelper.normalizeUrl.bind(urlLauncherHelper),
    parseUrl: urlLauncherHelper.parseUrl.bind(urlLauncherHelper),
    buildUrl: urlLauncherHelper.buildUrl.bind(urlLauncherHelper),
    canOpenUrl: urlLauncherHelper.canOpenUrl.bind(urlLauncherHelper),
    getSupportedSchemes: urlLauncherHelper.getSupportedSchemes.bind(urlLauncherHelper),
  };
}

