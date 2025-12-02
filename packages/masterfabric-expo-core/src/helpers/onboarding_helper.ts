
import { storage } from '../utils/storage';

const ONBOARDING_STORAGE_KEY = '@masterfabric_onboarding_completed';

/**
 * Returns the storage key used for onboarding completion status.
 * @returns The storage key.
 */
export function getOnboardingStorageKey(): string {
  return ONBOARDING_STORAGE_KEY;
}

/**
 * Checks if the user has completed or skipped the onboarding process.
 * @returns A promise that resolves to true if onboarding is completed/skipped, false otherwise.
 */
export async function hasCompletedOnboarding(): Promise<boolean> {
  const completed = await storage.get<boolean>(ONBOARDING_STORAGE_KEY);
  return completed === true;
}

/**
 * Marks the onboarding process as completed.
 * @returns A promise that resolves when the state is saved.
 */
export async function markOnboardingCompleted(): Promise<void> {
  await storage.set(ONBOARDING_STORAGE_KEY, true);
}

/**
 * Marks the onboarding process as skipped. This has the same effect as completing it.
 * @returns A promise that resolves when the state is saved.
 */
export async function markOnboardingSkipped(): Promise<void> {
  await storage.set(ONBOARDING_STORAGE_KEY, true);
}

/**
 * Resets the onboarding completion state. Useful for development and testing.
 * @returns A promise that resolves when the state is removed.
 */
export async function resetOnboarding(): Promise<void> {
  await storage.remove(ONBOARDING_STORAGE_KEY);
}

/**
 * Determines if the onboarding screen should be shown.
 * @returns A promise that resolves to true if onboarding should be shown, false otherwise.
 */
export async function shouldShowOnboarding(): Promise<boolean> {
  const hasCompleted = await hasCompletedOnboarding();
  return !hasCompleted;
}
