/**
 * Profile service — Supabase profile + stats for profile screen
 */

import { getSupabaseClient } from './supabase-service';
import type { ProfileUser, ProfileStats } from '@/screens/profile/models/profile-models';

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

export async function getProfileStatsFromSupabase(userId: string): Promise<ProfileStats> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { saved: 0, created: 0, followers: 0 };

    const [savedRes, createdRes] = await Promise.all([
      supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', userId),
      supabase.from('recipes').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    ]);

    return {
      saved: savedRes.count ?? 0,
      created: createdRes.count ?? 0,
      followers: 0,
    };
  } catch {
    return { saved: 0, created: 0, followers: 0 };
  }
}

export async function syncSessionToStore(
  setSignedIn: (signedIn: boolean, user?: ProfileUser | null) => void,
  setStats: (stats: Partial<ProfileStats>) => void
): Promise<boolean> {
  const user = await getProfileFromSupabase();
  if (!user) {
    setSignedIn(false, null);
    setStats({ saved: 0, created: 0, followers: 0 });
    return false;
  }
  const stats = await getProfileStatsFromSupabase(user.id);
  setSignedIn(true, user);
  setStats(stats);
  return true;
}
