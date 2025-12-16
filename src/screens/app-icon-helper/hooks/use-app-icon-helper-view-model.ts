import { appIconHelper } from 'masterfabric-expo-core';
import { useCallback, useEffect, useState } from 'react';

export const useAppIconHelperViewModel = () => {
  const [isSupported, setIsSupported] = useState(false);
  const [currentIcon, setCurrentIcon] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkSupport = useCallback(async () => {
    try {
      setIsLoading(true);
      const supported = await appIconHelper.supportsAlternateIcons();
      setIsSupported(supported);

      if (supported) {
        const iconName = await appIconHelper.getAlternateIconName();
        setCurrentIcon(iconName);
      }
    } catch (error) {
      console.error('Error checking icon support:', error);
      setIsSupported(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const changeIcon = useCallback(async (iconName: string) => {
    try {
      setIsLoading(true);
      await appIconHelper.changeToIcon(iconName);
      setCurrentIcon(iconName);
    } catch (error) {
      console.error('Error changing icon:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const resetToPrimary = useCallback(async () => {
    try {
      setIsLoading(true);
      await appIconHelper.resetToPrimaryIcon();
      setCurrentIcon(null);
    } catch (error) {
      console.error('Error resetting icon:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSupport();
  }, [checkSupport]);

  return {
    isSupported,
    currentIcon,
    isLoading,
    checkSupport,
    changeIcon,
    resetToPrimary,
  };
};

