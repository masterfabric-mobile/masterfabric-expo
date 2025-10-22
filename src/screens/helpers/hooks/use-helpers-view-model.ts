import { t } from '@/src/shared/i18n';
import { useCallback, useMemo } from 'react';
import { HelperItem } from '../models/helpers-models';
import { useHelpersStore } from '../store/helpers-store';
import { createDefaultHelperItems } from '../utils';

export function useHelpersViewModel() {
  const { helpers, isLoading, setHelpers, setIsLoading } = useHelpersStore();

  const defaultHelpers = useMemo((): HelperItem[] => {
    const helpers = createDefaultHelperItems();
    // Update with localized titles
    return helpers.map(helper => ({
      ...helper,
      name: t(`helpers.stringHelper.title`) || helper.name,
      description: t(`helpers.stringHelper.description`) || helper.description,
    }));
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

