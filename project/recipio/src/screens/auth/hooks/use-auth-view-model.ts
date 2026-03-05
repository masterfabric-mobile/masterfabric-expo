/**
 * Auth screen view model — login/register form state and validation (validator-helper pattern).
 * Uses useValidator from shared/hooks and masterfabric-expo-core ValidatorType.
 */

import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/i18n';
import { useValidator } from '@/shared/hooks/use-validator';
import { getSupabaseClient } from '@/shared/services/supabase-service';
import { syncSessionToStore } from '@/shared/services/profile-service';
import { ValidatorType } from '@masterfabric-expo/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert } from 'react-native';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import {
  PASSWORD_MAX_LENGTH,
  type SocialLoginProvider,
} from '../constants/auth-constants';
import type { AuthFormTouchedState, AuthTab } from '../models/auth-models';
import { checkPasswordRequirements } from '../utils/auth-utils';

/** Simple email regex that accepts common addresses like user@gmail.com */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function useAuthViewModel() {
  const { t } = useI18n();
  const router = useRouter();
  const { setSignedIn, setStats, setSettings } = useProfileStore();
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [displayValues, setDisplayValues] = useState({
    login: '',
    register: '',
    registerConfirm: '',
  });
  const showCharacterTimers = useRef<{
    login: ReturnType<typeof setTimeout> | null;
    register: ReturnType<typeof setTimeout> | null;
    registerConfirm: ReturnType<typeof setTimeout> | null;
  }>({
    login: null,
    register: null,
    registerConfirm: null,
  });

  const emailValidator = useCallback(
    (value: string): string | null =>
      !value || !EMAIL_REGEX.test(value) ? t('validation.invalidEmail') : null,
    [t]
  );

  const loginEmail = useValidator(ValidatorType.CUSTOM, {
    customValidator: emailValidator,
  });
  const loginPassword = useValidator(ValidatorType.NON_EMPTY);
  const registerFullName = useValidator(ValidatorType.FULL_NAME);
  const registerEmail = useValidator(ValidatorType.CUSTOM, {
    customValidator: emailValidator,
  });
  const registerUsername = useValidator(ValidatorType.USERNAME, {
    minLength: 3,
    maxLength: 20,
  });
  const registerPhone = useValidator(ValidatorType.PHONE_NUMBER);
  const registerPassword = useValidator(ValidatorType.PASSWORD, { minLength: 8 });
  const registerConfirmPassword = useValidator(ValidatorType.NON_EMPTY);

  const [showPassword, setShowPassword] = useState({
    login: false,
    register: false,
    registerConfirm: false,
  });
  const [touched, setTouched] = useState<AuthFormTouchedState>({
    loginEmail: false,
    loginPassword: false,
    registerFullName: false,
    registerEmail: false,
    registerUsername: false,
    registerPhone: false,
    registerPassword: false,
    registerConfirmPassword: false,
  });

  const showAlert = useCallback(
    (message: string, title?: string) => {
      Alert.alert(title ?? '', message);
    },
    []
  );

  const handleLogin = useCallback(async () => {
    setIsSubmitting(true);
    const emailValid = loginEmail.validate(loginEmail.value);
    const passwordValid = loginPassword.validate(loginPassword.value);

    if (
      emailValid.isValid &&
      passwordValid.isValid &&
      loginPassword.value.length > 0
    ) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: loginEmail.value.trim(),
          password: loginPassword.value,
        });
        if (error) {
          showAlert(error.message || t('auth.fixErrors'));
          setIsSubmitting(false);
          return;
        }
        const synced = await syncSessionToStore(setSignedIn, setStats, setSettings);
        if (synced) {
          showAlert(t('auth.loginSuccess'));
          router.replace('/(tabs)/profile');
        } else {
          showAlert(t('auth.fixErrors'));
        }
      } else {
        setSignedIn(true, {
          id: `auth-${Date.now()}`,
          name: loginEmail.value.split('@')[0] || 'User',
          email: loginEmail.value,
          photoUrl: null,
        });
        setStats({ favorites: 0, recipesCooked: 0, dayStreak: 0 });
        showAlert(t('auth.loginSuccess'));
        router.replace('/(tabs)/profile');
      }
    } else {
      showAlert(t('auth.fixErrors'));
    }
    setIsSubmitting(false);
  }, [
    loginEmail,
    loginPassword,
    t,
    showAlert,
    setSignedIn,
    setStats,
    setSettings,
    router,
  ]);

  const handleRegister = useCallback(async () => {
    setIsSubmitting(true);
    const fullNameValid = registerFullName.validate(registerFullName.value);
    const emailValid = registerEmail.validate(registerEmail.value);
    const usernameValid = registerUsername.validate(registerUsername.value);
    const phoneValid = registerPhone.validate(registerPhone.value);
    const passwordValid = registerPassword.validate(registerPassword.value);
    const confirmValid = registerConfirmPassword.validate(
      registerConfirmPassword.value
    );
    const passwordsMatch =
      registerPassword.value === registerConfirmPassword.value;

    if (
      fullNameValid.isValid &&
      emailValid.isValid &&
      usernameValid.isValid &&
      phoneValid.isValid &&
      passwordValid.isValid &&
      confirmValid.isValid &&
      passwordsMatch
    ) {
      const supabase = getSupabaseClient();
      if (supabase) {
        const { data, error } = await supabase.auth.signUp({
          email: registerEmail.value.trim(),
          password: registerPassword.value,
          options: {
            data: {
              full_name: registerFullName.value.trim(),
            },
          },
        });
        if (error) {
          showAlert(error.message || t('auth.fixErrors'));
          setIsSubmitting(false);
          return;
        }
        if (data.session) {
          const synced = await syncSessionToStore(setSignedIn, setStats, setSettings);
          if (synced) {
            showAlert(t('auth.registrationSuccess'));
            router.replace('/(tabs)/profile');
          } else {
            showAlert(t('auth.registrationSuccess'));
            router.replace('/(tabs)/profile');
          }
        } else {
          showAlert(t('auth.registrationSuccess'));
          router.replace('/(tabs)/profile');
        }
      } else {
        setSignedIn(true, {
          id: `auth-${Date.now()}`,
          name: registerFullName.value.trim(),
          email: registerEmail.value.trim(),
          photoUrl: null,
        });
        setStats({ favorites: 0, recipesCooked: 0, dayStreak: 0 });
        showAlert(t('auth.registrationSuccess'));
        router.replace('/(tabs)/profile');
      }
    } else {
      if (!passwordsMatch) {
        showAlert(t('auth.passwordsNoMatchAlert'));
      } else {
        showAlert(t('auth.fixErrors'));
      }
    }
    setIsSubmitting(false);
  }, [
    registerFullName,
    registerEmail,
    registerUsername,
    registerPhone,
    registerPassword,
    registerConfirmPassword,
    t,
    showAlert,
    setSignedIn,
    setStats,
    setSettings,
    router,
  ]);

  const handleSocialLogin = useCallback(
    (provider: SocialLoginProvider) => {
      const name =
        provider === 'google'
          ? 'Google'
          : provider === 'github'
            ? 'GitHub'
            : 'Apple';
      showAlert(t('auth.socialLoginDemo', { provider: name }));
    },
    [t, showAlert]
  );

  const handleTabChange = useCallback((tab: AuthTab) => {
    setActiveTab(tab);
    setTouched({
      loginEmail: false,
      loginPassword: false,
      registerFullName: false,
      registerEmail: false,
      registerUsername: false,
      registerPhone: false,
      registerPassword: false,
      registerConfirmPassword: false,
    });
    setShowPassword({
      login: false,
      register: false,
      registerConfirm: false,
    });
  }, []);

  const handleFieldTouch = useCallback((field: keyof AuthFormTouchedState) => {
    setTouched((prev) => (prev[field] ? prev : { ...prev, [field]: true }));
  }, []);

  useEffect(() => {
    setDisplayValues({
      login: '•'.repeat(loginPassword.value.length),
      register: '•'.repeat(registerPassword.value.length),
      registerConfirm: '•'.repeat(registerConfirmPassword.value.length),
    });
  }, [activeTab]);

  const handlePasswordChange = useCallback(
    (
      text: string,
      field: 'login' | 'register' | 'registerConfirm',
      setValue: (value: string) => void,
      touchField: keyof AuthFormTouchedState
    ) => {
      const currentValue =
        field === 'login'
          ? loginPassword.value
          : field === 'register'
            ? registerPassword.value
            : registerConfirmPassword.value;
      const currentDisplay = displayValues[field];
      const lengthDiff = text.length - currentDisplay.length;

      if (lengthDiff === 0 && text === currentDisplay) return;

      let newPasswordValue = currentValue;
      if (text.length === 0) {
        newPasswordValue = '';
      } else if (lengthDiff < 0) {
        const deletedCount = Math.abs(lengthDiff);
        newPasswordValue = currentValue.slice(0, -deletedCount);
      } else if (lengthDiff > 0) {
        const newChars = text.slice(currentDisplay.length);
        const actualNewChars = newChars
          .split('')
          .filter((char) => char !== '•')
          .join('');
        if (actualNewChars.length > 0) {
          newPasswordValue = currentValue + actualNewChars;
        }
      }

      if (newPasswordValue.length > PASSWORD_MAX_LENGTH) return;
      setValue(newPasswordValue);
      handleFieldTouch(touchField);

      if (showCharacterTimers.current[field]) {
        clearTimeout(showCharacterTimers.current[field]!);
        showCharacterTimers.current[field] = null;
      }

      if (newPasswordValue.length === 0) {
        setDisplayValues((prev) => ({ ...prev, [field]: '' }));
      } else if (lengthDiff > 0) {
        const hiddenPart = '•'.repeat(newPasswordValue.length - 1);
        const lastChar = newPasswordValue[newPasswordValue.length - 1];
        setDisplayValues((prev) => ({
          ...prev,
          [field]: hiddenPart + lastChar,
        }));
        showCharacterTimers.current[field] = setTimeout(() => {
          setDisplayValues((prev) => {
            const actualLength =
              field === 'login'
                ? loginPassword.value.length
                : field === 'register'
                  ? registerPassword.value.length
                  : registerConfirmPassword.value.length;
            if (prev[field].length === actualLength && actualLength > 0) {
              return { ...prev, [field]: '•'.repeat(actualLength) };
            }
            return prev;
          });
          showCharacterTimers.current[field] = null;
        }, 600);
      } else {
        setDisplayValues((prev) => ({
          ...prev,
          [field]: '•'.repeat(newPasswordValue.length),
        }));
      }
    },
    [
      displayValues,
      loginPassword.value,
      registerPassword.value,
      registerConfirmPassword.value,
      handleFieldTouch,
    ]
  );

  useEffect(() => {
    return () => {
      (Object.keys(showCharacterTimers.current) as (keyof typeof showCharacterTimers.current)[]).forEach(
        (k) => {
          const timer = showCharacterTimers.current[k];
          if (timer) clearTimeout(timer);
        }
      );
    };
  }, []);

  const isLoginFormValid = loginEmail.isValid && loginPassword.isValid;
  const passwordsMatch =
    !!registerPassword.value &&
    !!registerConfirmPassword.value &&
    registerPassword.value === registerConfirmPassword.value;
  const isRegisterFormValid =
    registerFullName.isValid &&
    registerEmail.isValid &&
    registerUsername.isValid &&
    registerPhone.isValid &&
    registerPassword.isValid &&
    registerConfirmPassword.isValid &&
    passwordsMatch;
  const isConfirmPasswordValid =
    registerConfirmPassword.value.length > 0 && passwordsMatch;

  const checkPasswordReqs = useCallback(
    (password: string) => checkPasswordRequirements(password, t),
    [t]
  );

  return {
    activeTab,
    isSubmitting,
    touched,
    rememberMe,
    setRememberMe,
    displayValues,
    setDisplayValues,
    showPassword,
    setShowPassword,
    loginEmail,
    loginPassword,
    registerFullName,
    registerEmail,
    registerUsername,
    registerPhone,
    registerPassword,
    registerConfirmPassword,
    handleLogin,
    handleRegister,
    handleSocialLogin,
    handleTabChange,
    handleFieldTouch,
    handlePasswordChange,
    isLoginFormValid,
    isRegisterFormValid,
    passwordsMatch,
    isConfirmPasswordValid,
    checkPasswordRequirements: checkPasswordReqs,
  };
}
