/**
 * User service - profile and greeting
 * Current plan (Pro Chef, Kitchen Chef, Kitchen Pro) is stored in Supabase profiles.plan_slug
 */

import { getAuthUser, getSupabaseClient } from './supabase-service';

/** Plan slugs in DB; must match Supabase profiles.plan_slug */
export const PLAN_SLUGS = {
  FREE: 'free',
  PRO_CHEF: 'pro_chef',
  KITCHEN_CHEF: 'kitchen_chef',
  KITCHEN_PRO: 'kitchen_pro',
} as const;

export type PlanSlug = (typeof PLAN_SLUGS)[keyof typeof PLAN_SLUGS];

/** Display names for Current Plan card */
const PLAN_DISPLAY_NAMES: Record<string, string> = {
  [PLAN_SLUGS.FREE]: '',
  [PLAN_SLUGS.PRO_CHEF]: 'Pro Chef',
  [PLAN_SLUGS.KITCHEN_CHEF]: 'Kitchen Chef',
  [PLAN_SLUGS.KITCHEN_PRO]: 'Kitchen Pro',
};

function planSlugToCurrentPlan(
  planSlug: string | null | undefined,
  planExpiresAt: string | null | undefined
): { name: string; isActive: boolean } {
  const slug = (planSlug ?? PLAN_SLUGS.FREE).toLowerCase();
  const name = PLAN_DISPLAY_NAMES[slug] ?? (slug !== PLAN_SLUGS.FREE ? slug : '');
  if (slug === PLAN_SLUGS.FREE || !name) {
    return { name: '', isActive: false };
  }
  const isActive = !planExpiresAt || new Date(planExpiresAt) > new Date();
  return { name, isActive };
}

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

    const user = await getAuthUser(supabase);
    if (!user) {
      return getAnonymousProfile();
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name, avatar_url, plan_slug, plan_expires_at')
      .eq('id', user.id)
      .maybeSingle();

    const row = profile as { plan_slug?: string; plan_expires_at?: string } | undefined;
    const currentPlan = planSlugToCurrentPlan(row?.plan_slug, row?.plan_expires_at);

    return {
      id: user.id,
      name: profile?.display_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
      avatarUrl: profile?.avatar_url,
      currentPlan,
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

    const user = await getAuthUser(supabase);
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

/**
 * Update the current user's plan in Supabase (e.g. after upgrade).
 * Call this when user purchases Pro Chef, Kitchen Chef, Kitchen Pro.
 */
export async function updateUserPlan(planSlug: PlanSlug, expiresAt?: Date | null): Promise<boolean> {
  try {
    const supabase = getSupabaseClient();
    if (!supabase) return false;

    const user = await getAuthUser(supabase);
    if (!user) return false;

    const { error } = await supabase
      .from('profiles')
      .update({
        plan_slug: planSlug,
        plan_expires_at: expiresAt?.toISOString() ?? null,
      })
      .eq('id', user.id);

    return !error;
  } catch {
    return false;
  }
}
