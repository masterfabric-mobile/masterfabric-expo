/**
 * Dietary preferences — load/save from Supabase profiles
 */

import { getAuthUser, getSupabaseClient } from './supabase-service';
import type { DietaryPreferences } from '@/screens/dietary-preferences/models/dietary-preferences-models';

export async function getDietaryPreferences(): Promise<DietaryPreferences | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const user = await getAuthUser(supabase);
    if (!user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('diet_slugs, allergy_slugs, custom_allergies')
      .eq('id', user.id)
      .maybeSingle();

    const row = profile as { diet_slugs?: string[]; allergy_slugs?: string[]; custom_allergies?: string[] } | null;
    return {
      dietSlugs: Array.isArray(row?.diet_slugs) ? row.diet_slugs : [],
      allergySlugs: Array.isArray(row?.allergy_slugs) ? row.allergy_slugs : [],
      customAllergies: Array.isArray(row?.custom_allergies) ? row.custom_allergies : [],
    };
  } catch {
    return null;
  }
}

export async function updateDietaryPreferences(prefs: DietaryPreferences): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const user = await getAuthUser(supabase);
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        diet_slugs: prefs.dietSlugs,
        allergy_slugs: prefs.allergySlugs,
        custom_allergies: prefs.customAllergies,
      })
      .eq('id', user.id);

    return !error;
  } catch {
    return false;
  }
}
