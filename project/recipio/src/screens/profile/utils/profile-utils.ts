/** Placeholder until profile API exists */
export const PROFILE_PLACEHOLDER = {
  title: 'Profile (Phase 3)',
  subtext: 'Your profile and settings will appear here',
} as const;

const DICEBEAR_AVATAR_SIZE = 96;

/**
 * Returns a deterministic avatar image URL for the given seed (e.g. user id or email).
 * When the user has no profile photo, this gives a consistent random-looking avatar per user.
 */
export function getDefaultAvatarUrl(seed: string): string {
  const encoded = encodeURIComponent(seed || 'guest');
  return `https://api.dicebear.com/7.x/avataaars/png?seed=${encoded}&size=${DICEBEAR_AVATAR_SIZE}`;
}
