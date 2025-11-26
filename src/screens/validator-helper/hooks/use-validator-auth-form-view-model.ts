import { useValidator } from '@/src/shared/hooks/use-validator';
import { t } from '@/src/shared/i18n';
import { ValidatorType } from 'masterfabric-expo-core';
import { useEffect, useRef, useState } from 'react';
import {
  PASSWORD_MAX_LENGTH,
  type SocialLoginProvider,
} from '../constants/validator-helper-constants';
import {
  type AuthFormTouchedState,
  type AuthTab,
} from '../models/validator-helper-models';
import { checkPasswordRequirements } from '../utils/validator-helper-utils';

export function useValidatorAuthFormViewModel() {
  const [activeTab, setActiveTab] = useState<AuthTab>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Password display values (for showing last character briefly)
  const [displayValues, setDisplayValues] = useState({
    login: '',
    register: '',
    registerConfirm: '',
  });

  const showCharacterTimers = useRef({
    login: null as NodeJS.Timeout | null,
    register: null as NodeJS.Timeout | null,
    registerConfirm: null as NodeJS.Timeout | null,
  });

  // Login validators
  const loginEmail = useValidator(ValidatorType.EMAIL);
  const loginPassword = useValidator(ValidatorType.PASSWORD, { minLength: 8 });

  // Register validators
  const registerFullName = useValidator(ValidatorType.FULL_NAME);
  const registerEmail = useValidator(ValidatorType.EMAIL);
  const registerUsername = useValidator(ValidatorType.USERNAME, { minLength: 3, maxLength: 20 });
  const registerPassword = useValidator(ValidatorType.PASSWORD, { minLength: 8 });
  // Confirm password doesn't need regex validation, only matching check
  const registerConfirmPassword = useValidator(ValidatorType.NON_EMPTY);

  // Track touched state for each field
  const [touched, setTouched] = useState<AuthFormTouchedState>({
    loginEmail: false,
    loginPassword: false,
    registerFullName: false,
    registerEmail: false,
    registerUsername: false,
    registerPassword: false,
    registerConfirmPassword: false,
  });

  const handleLogin = async () => {
    setIsSubmitting(true);
    
    // Validate all fields
    const emailValid = loginEmail.validate(loginEmail.value);
    const passwordValid = loginPassword.validate(loginPassword.value);

    if (emailValid.isValid && passwordValid.isValid) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Login successful:', { email: loginEmail.value });
      alert(t('auth.loginSuccess'));
    } else {
      alert(t('auth.fixErrors'));
    }
    
    setIsSubmitting(false);
  };

  const handleRegister = async () => {
    setIsSubmitting(true);
    
    // Validate all fields
    const fullNameValid = registerFullName.validate(registerFullName.value);
    const emailValid = registerEmail.validate(registerEmail.value);
    const usernameValid = registerUsername.validate(registerUsername.value);
    const passwordValid = registerPassword.validate(registerPassword.value);
    // Confirm password only needs to be non-empty and match
    const confirmPasswordNonEmpty = registerConfirmPassword.validate(registerConfirmPassword.value);

    // Check if passwords match (no regex needed, just compare)
    const passwordsMatch = registerPassword.value === registerConfirmPassword.value;

    if (
      fullNameValid.isValid &&
      emailValid.isValid &&
      usernameValid.isValid &&
      passwordValid.isValid &&
      confirmPasswordNonEmpty.isValid &&
      passwordsMatch
    ) {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Registration successful:', {
        fullName: registerFullName.value,
        email: registerEmail.value,
        username: registerUsername.value,
      });
      alert(t('auth.registrationSuccess'));
    } else {
      if (!passwordsMatch) {
        alert(t('auth.passwordsNoMatchAlert'));
      } else {
        alert(t('auth.fixErrors'));
      }
    }
    
    setIsSubmitting(false);
  };

  const handleSocialLogin = (provider: SocialLoginProvider) => {
    console.log(`Login with ${provider}`);
    alert(t('auth.socialLoginDemo', { provider }));
  };

  const handleTabChange = (tab: AuthTab) => {
    setActiveTab(tab);
    setTouched({
      loginEmail: false,
      loginPassword: false,
      registerFullName: false,
      registerEmail: false,
      registerUsername: false,
      registerPassword: false,
      registerConfirmPassword: false,
    });
  };

  const handleFieldTouch = (field: keyof AuthFormTouchedState) => {
    if (!touched[field]) {
      setTouched(prev => ({ ...prev, [field]: true }));
    }
  };

  // Sync display values with actual values on mount/tab change
  useEffect(() => {
    setDisplayValues({
      login: '•'.repeat(loginPassword.value.length),
      register: '•'.repeat(registerPassword.value.length),
      registerConfirm: '•'.repeat(registerConfirmPassword.value.length),
    });
  }, [activeTab]);

  const handlePasswordChange = (
    text: string,
    field: 'login' | 'register' | 'registerConfirm',
    setValue: (value: string) => void,
    touchField: keyof AuthFormTouchedState
  ) => {
    const currentValue = field === 'login'
      ? loginPassword.value
      : field === 'register'
      ? registerPassword.value
      : registerConfirmPassword.value;

    const currentDisplay = displayValues[field];

    // Calculate difference in length
    const lengthDiff = text.length - currentDisplay.length;

    if (lengthDiff === 0 && text === currentDisplay) {
      // No change
      return;
    }

    let newPasswordValue = currentValue;

    if (text.length === 0) {
      // Empty - clear everything
      newPasswordValue = '';
    } else if (lengthDiff < 0) {
      // Character(s) deleted - remove from end
      const deletedCount = Math.abs(lengthDiff);
      newPasswordValue = currentValue.slice(0, -deletedCount);
    } else if (lengthDiff > 0) {
      // Character(s) added
      // Extract new characters from text (remove bullets)
      // The new characters are the ones that are not bullets at the end
      const newChars = text.slice(currentDisplay.length);
      
      // Get actual characters (non-bullet characters)
      const actualNewChars = newChars.split('').filter(char => char !== '•').join('');
      
      if (actualNewChars.length > 0) {
        // Add the new character(s) to password
        newPasswordValue = currentValue + actualNewChars;
      } else {
        // No actual characters (only bullets or display update)
        // This shouldn't happen, but keep current value
        newPasswordValue = currentValue;
      }
    } else {
      // Same length but different - might be replacement (shouldn't happen)
      newPasswordValue = currentValue;
    }

    // Limit max length
    if (newPasswordValue.length > PASSWORD_MAX_LENGTH) {
      return;
    }

    // Update the actual password value (this triggers validation)
    setValue(newPasswordValue);
    handleFieldTouch(touchField);

    // Clear existing timer immediately
    if (showCharacterTimers.current[field]) {
      clearTimeout(showCharacterTimers.current[field]!);
      showCharacterTimers.current[field] = null;
    }

    // Update display based on what happened
    if (newPasswordValue.length === 0) {
      setDisplayValues(prev => ({ ...prev, [field]: '' }));
    } else if (lengthDiff > 0) {
      // New character added - show only the last character briefly
      const hiddenPart = '•'.repeat(newPasswordValue.length - 1);
      const lastChar = newPasswordValue[newPasswordValue.length - 1];
      setDisplayValues(prev => ({ ...prev, [field]: hiddenPart + lastChar }));

      // Hide last character after 600ms
      showCharacterTimers.current[field] = setTimeout(() => {
        setDisplayValues(prev => {
          const actualLength = field === 'login'
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
      // Character deleted or no change - hide all immediately
      setDisplayValues(prev => ({ ...prev, [field]: '•'.repeat(newPasswordValue.length) }));
    }
  };

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(showCharacterTimers.current).forEach(timer => {
        if (timer) clearTimeout(timer);
      });
    };
  }, []);

  // Form validation states
  const isLoginFormValid = loginEmail.isValid && loginPassword.isValid;
  
  const passwordsMatch = registerPassword.value && 
                         registerConfirmPassword.value && 
                         registerPassword.value === registerConfirmPassword.value;
  
  const isRegisterFormValid =
    registerFullName.isValid &&
    registerEmail.isValid &&
    registerUsername.isValid &&
    registerPassword.isValid &&
    registerConfirmPassword.isValid &&
    passwordsMatch;
  
  // Confirm password validation (only check if non-empty and matches)
  const isConfirmPasswordValid = registerConfirmPassword.value.length > 0 && passwordsMatch;

  return {
    // State
    activeTab,
    isSubmitting,
    touched,
    rememberMe,
    setRememberMe,
    displayValues,
    
    // Validators
    loginEmail,
    loginPassword,
    registerFullName,
    registerEmail,
    registerUsername,
    registerPassword,
    registerConfirmPassword,
    
    // Handlers
    handleLogin,
    handleRegister,
    handleSocialLogin,
    handleTabChange,
    handleFieldTouch,
    handlePasswordChange,
    
    // Validation states
    isLoginFormValid,
    isRegisterFormValid,
    passwordsMatch,
    isConfirmPasswordValid,
    
    // Utils
    checkPasswordRequirements,
  };
}

