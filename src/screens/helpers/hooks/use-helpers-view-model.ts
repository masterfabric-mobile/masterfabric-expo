import { t } from '@/src/shared/i18n';
import { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { HelperItem } from '../models/helpers-models';
import { useHelpersStore } from '../store/helpers-store';
import { createDefaultHelperItems } from '../utils';

const toCamelCase = (str: string) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase());
};

export function useHelpersViewModel() {
  const { helpers, isLoading, setHelpers, setIsLoading } = useHelpersStore();

  const defaultHelpers = useMemo((): HelperItem[] => {
    const helpers = createDefaultHelperItems();
    const isWeb = Platform.OS === 'web';
    
    // Update with localized titles and platform-specific availability
    return helpers.map(helper => {
      const camelCaseId = toCamelCase(helper.id);
      // BLE Helper is not available on web, but should still be shown (disabled)
      const isBleHelper = helper.id === 'ble-helper';
      const available = isBleHelper && isWeb ? false : helper.available;
      
      return {
        ...helper,
        name: t(`helpers.${camelCaseId}.title`) || helper.name,
        description: t(`helpers.${camelCaseId}.description`) || helper.description,
        available,
      };
    });
  }, []);

  const loadHelpers = useCallback(() => {
    setIsLoading(true);
    // Simulate loading
    setTimeout(() => {
      setHelpers(defaultHelpers);
      setIsLoading(false);
    }, 500);
  }, [defaultHelpers, setHelpers, setIsLoading]);

  return {
    helpers: helpers.length > 0 ? helpers : defaultHelpers,
    isLoading,
    loadHelpers,
  };
}

