import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import {
  getDietaryPreferences,
  updateDietaryPreferences,
} from '@/shared/services/dietary-preferences-service';
import type { DietaryPreferences } from '../models/dietary-preferences-models';
import { DIET_SLUGS, ALLERGY_SLUGS } from '../models/dietary-preferences-models';

const defaultPrefs: DietaryPreferences = {
  dietSlugs: [],
  allergySlugs: [],
  customAllergies: [],
};

export function useDietaryPreferencesViewModel() {
  const router = useRouter();
  const [prefs, setPrefs] = useState<DietaryPreferences>(defaultPrefs);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getDietaryPreferences();
    setPrefs(data ?? defaultPrefs);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleDiet = useCallback((slug: string) => {
    setPrefs((prev) => ({
      ...prev,
      dietSlugs: prev.dietSlugs.includes(slug)
        ? prev.dietSlugs.filter((s) => s !== slug)
        : [...prev.dietSlugs, slug],
    }));
  }, []);

  const toggleAllergy = useCallback((slug: string) => {
    setPrefs((prev) => ({
      ...prev,
      allergySlugs: prev.allergySlugs.includes(slug)
        ? prev.allergySlugs.filter((s) => s !== slug)
        : [...prev.allergySlugs, slug],
    }));
  }, []);

  const addCustomAllergy = useCallback((label: string) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setPrefs((prev) => ({
      ...prev,
      customAllergies: prev.customAllergies.includes(trimmed)
        ? prev.customAllergies
        : [...prev.customAllergies, trimmed],
    }));
  }, []);

  const removeCustomAllergy = useCallback((label: string) => {
    setPrefs((prev) => ({
      ...prev,
      customAllergies: prev.customAllergies.filter((s) => s !== label),
    }));
  }, []);

  const save = useCallback(async () => {
    setSaving(true);
    const ok = await updateDietaryPreferences(prefs);
    setSaving(false);
    if (ok) router.back();
  }, [prefs, router]);

  return {
    prefs,
    loading,
    saving,
    dietSlugs: DIET_SLUGS,
    allergySlugs: ALLERGY_SLUGS,
    toggleDiet,
    toggleAllergy,
    addCustomAllergy,
    removeCustomAllergy,
    handleBack: () => router.back(),
    save,
  };
}
