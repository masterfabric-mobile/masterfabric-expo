/**
 * Auth screen utils — password requirements and checks (validator-helper pattern).
 */

import type { PasswordRequirement } from '../models/auth-models';

export function getPasswordRequirements(t: (key: string) => string): PasswordRequirement[] {
  return [
    { label: t('validation.passwordRequirements.minLength'), check: (p) => p.length >= 8 },
    { label: t('validation.passwordRequirements.uppercase'), check: (p) => /[A-Z]/.test(p) },
    { label: t('validation.passwordRequirements.lowercase'), check: (p) => /[a-z]/.test(p) },
    { label: t('validation.passwordRequirements.number'), check: (p) => /\d/.test(p) },
    {
      label: t('validation.passwordRequirements.specialChar'),
      check: (p) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(p),
    },
  ];
}

export function checkPasswordRequirements(
  password: string,
  t: (key: string) => string
): Array<PasswordRequirement & { met: boolean }> {
  return getPasswordRequirements(t).map((req) => ({
    ...req,
    met: req.check(password),
  }));
}
