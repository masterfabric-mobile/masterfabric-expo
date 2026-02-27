/**
 * User service - profile and greeting
 */

import { getSupabaseClient } from './supabase-service';

export interface UserProfile {
  id?: string;
  name: string;
  avatarUrl?: string;
  currentPlan: {
    name: string;
    isActive: boolean;
  };
}

export interface MonthlyRecipesCount {
  saved: number;
  limit: number;
}

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'GOOD MORNING';
  if (hour < 18) return 'GOOD AFTERNOON';
  return 'GOOD EVENING';
}

function getAnonymousProfile(): UserProfile {
  return {
    name: 'Guest',
    avatarUrl: undefined,
    currentPlan: { name: '', isActive: false },
  };
}

export async function getCurrentUserProfile(): Promise<UserProfile> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return getAnonymousProfile();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return getAnonymousProfile();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle();

    return {
      id: user.id,
      name: profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatarUrl: profile?.avatar_url,
      currentPlan: {
        name: 'Pro Chef',
        isActive: true,
      },
    };
  } catch {
    return getAnonymousProfile();
  }
}

export async function getMonthlyRecipesCount(): Promise<MonthlyRecipesCount> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return { saved: 0, limit: 50 };

    const now = new Date();
    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    ).toISOString();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return { saved: 0, limit: 50 };

    const limit = 50;

    // Saved count: try user_activities (type='saved') per docs, fallback to saved_recipes
    let saved = 0;
    const { count: activitiesCount } = await supabase
      .from('user_activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('type', 'saved')
      .gte('created_at', startOfMonth);
    if (activitiesCount !== null && activitiesCount !== undefined) {
      saved = activitiesCount;
    } else {
      const { count: savedCount } = await supabase
        .from('saved_recipes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth);
      saved = savedCount ?? 0;
    }

    return { saved, limit };
  } catch {
    return { saved: 0, limit: 50 };
  }
}
