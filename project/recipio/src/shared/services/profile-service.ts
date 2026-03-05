/**
 * Profile service — Supabase profile + stats for profile screen
 */

import { getSupabaseClient } from './supabase-service';
import { getDietaryPreferences } from './dietary-preferences-service';
import type {
  ProfileUser,
  ProfileStats,
  ProfileSettings,
  DietaryPreferencesInProfile,
} from '@/screens/profile/models/profile-models';

export async function getProfileFromSupabase(): Promise<ProfileUser | null> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    return {
      id: user.id,
      name: profile?.display_name ?? user.user_metadata?.full_name ?? user.email?.split('@')[0] ?? 'User',
      email: user.email ?? '',
      photoUrl: profile?.avatar_url ?? null,
    };
  } catch {
    return null;
  }
}

/** Consecutive calendar days (UTC date) with at least one tried recipe, ending today. */
function computeDayStreak(dates: string[]): number {
  if (dates.length === 0) return 0;
  const set = new Set(dates.map((d) => d.slice(0, 10)));
  let check = new Date().toISOString().slice(0, 10);
  let streak = 0;
  while (set.has(check)) {
    streak++;
    const t = new Date(check + 'T12:00:00Z').getTime() - 86400000;
    check = new Date(t).toISOString().slice(0, 10);
  }
  return streak;
}

export async function getProfileStatsFromSupabase(userId: string): Promise<ProfileStats> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { favorites: 0, recipesCooked: 0, dayStreak: 0 };

    const [favRes, triedRes, triedDatesRes] = await Promise.all([
      supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('tried_recipes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('tried_recipes').select('created_at').eq('user_id', userId),
    ]);

    const dates = (triedDatesRes.data ?? []).map((r: { created_at: string }) => r.created_at);
    const dayStreak = computeDayStreak(dates);

    return {
      favorites: favRes.count ?? 0,
      recipesCooked: triedRes.count ?? 0,
      dayStreak,
    };
  } catch {
    return { favorites: 0, recipesCooked: 0, dayStreak: 0 };
  }
}

const defaultDietaryPreferences: DietaryPreferencesInProfile = {
  dietSlugs: [],
  allergySlugs: [],
  customAllergies: [],
};

export async function syncSessionToStore(
  setSignedIn: (signedIn: boolean, user?: ProfileUser | null) => void,
  setStats: (stats: Partial<ProfileStats>) => void,
  setSettings?: (settings: Partial<ProfileSettings>) => void
): Promise<boolean> {
  const user = await getProfileFromSupabase();
  if (!user) {
    setSignedIn(false, null);
    setStats({ favorites: 0, recipesCooked: 0, dayStreak: 0 });
    if (setSettings) setSettings({ dietaryPreferences: null });
    return false;
  }
  const [stats, dietaryPrefs] = await Promise.all([
    getProfileStatsFromSupabase(user.id),
    getDietaryPreferences(),
  ]);
  setSignedIn(true, user);
  setStats(stats);
  if (setSettings) {
    setSettings({
      dietaryPreferences:
        dietaryPrefs ?? defaultDietaryPreferences,
    });
  }
  return true;
}
