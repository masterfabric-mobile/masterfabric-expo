import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ThemedText, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Platform, TextInput, TouchableOpacity, View } from 'react-native';
import {
  AUTH_ERROR_COLORS,
  EMAIL_MAX_LENGTH,
  FONT_WEIGHTS,
  FULL_NAME_MAX_LENGTH,
  ICON_SIZES,
  PASSWORD_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  SOCIAL_LOGIN_ICON_COLORS,
  SOCIAL_LOGIN_PROVIDERS,
  TRANSPARENT_COLOR,
  USERNAME_MAX_LENGTH,
  WHITE_COLOR,
} from '../constants/validator-helper-constants';
import { useValidatorAuthFormViewModel } from '../hooks/use-validator-auth-form-view-model';
import { validatorAuthFormStyles } from '../styles/validator-auth-form.styles';
import {
  getAuthColors,
  getButtonPrimaryColor,
  getHeaderBackgroundColor,
} from '../utils/validator-helper-utils';

export function ValidatorAuthForm() {
  const { currentTheme, colors } = useTheme();
  const isDark = currentTheme === 'dark';
  
  const {
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
    checkPasswordRequirements,
  } = useValidatorAuthFormViewModel();

  // Theme-aware colors
  const authColors = getAuthColors(isDark);
  const headerBackground = getHeaderBackgroundColor(isDark);
  const buttonBlue = getButtonPrimaryColor(colors.tint);

  return (
    <View style={[validatorAuthFormStyles.wrapper, { backgroundColor: authColors.background }]}>
      {/* Header Section with Dark Background */}
      <View style={[validatorAuthFormStyles.headerContainer, { backgroundColor: headerBackground }]}>
        <View style={validatorAuthFormStyles.logoContainer}>
          <Image
            source={require('@/src/assets/images/masterfabric-logo.svg')}
            style={validatorAuthFormStyles.logo}
            contentFit="contain"
          />
        </View>
      </View>

      {/* White Card Section */}
      <View style={[validatorAuthFormStyles.cardContainer, { backgroundColor: authColors.background }]}>
        {/* Tab Switcher */}
        <View style={[validatorAuthFormStyles.tabContainer, { borderBottomColor: authColors.border }]}>
          <TouchableOpacity
            style={[
              validatorAuthFormStyles.tabButton,
              activeTab === 'login' && validatorAuthFormStyles.tabButtonActive,
            ]}
            onPress={() => handleTabChange('login')}
          >
            <ThemedText
              style={[
                validatorAuthFormStyles.tabButtonText,
                activeTab === 'login' && { color: buttonBlue, fontWeight: FONT_WEIGHTS.semiBold },
              ]}
            >
              {t('auth.signIn')}
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              validatorAuthFormStyles.tabButton,
              activeTab === 'register' && validatorAuthFormStyles.tabButtonActive,
            ]}
            onPress={() => handleTabChange('register')}
          >
            <ThemedText
              style={[
                validatorAuthFormStyles.tabButtonText,
                activeTab === 'register' && { color: buttonBlue, fontWeight: FONT_WEIGHTS.semiBold },
              ]}
            >
              {t('auth.signUp')}
            </ThemedText>
          </TouchableOpacity>
        </View>

      {/* Email Form */}
      <View style={validatorAuthFormStyles.formContainer}>
        {activeTab === 'login' ? (
          <>
            {/* Email Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.emailAddress')}
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: authColors.border,
                  },
                ]}
                value={loginEmail.value}
                onChangeText={(text) => {
                  // Enforce max length for email
                  if (text.length <= EMAIL_MAX_LENGTH) {
                    loginEmail.setValue(text);
                    handleFieldTouch('loginEmail');
                  }
                }}
                onFocus={() => {
                  handleFieldTouch('loginEmail');
                }}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                maxLength={EMAIL_MAX_LENGTH}
              />
              {/* No validation errors shown in login (user already registered) */}
            </View>

            {/* Password Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.password')} *
              </ThemedText>
              <View style={validatorAuthFormStyles.passwordInputContainer}>
                <TextInput
                  style={[
                    validatorAuthFormStyles.passwordInput,
                    {
                      backgroundColor: authColors.inputBackground,
                      color: authColors.text,
                      borderColor: authColors.border,
                    },
                  ]}
                  value={showPassword.login ? loginPassword.value : displayValues.login}
                  onChangeText={(text) => {
                    if (showPassword.login) {
                      // When password is visible, handle input directly
                      if (text.length <= PASSWORD_MAX_LENGTH) {
                        loginPassword.setValue(text);
                        setDisplayValues(prev => ({ ...prev, login: '•'.repeat(text.length) }));
                        handleFieldTouch('loginPassword');
                      }
                    } else {
                      // When password is hidden, use the bullet masking logic
                      handlePasswordChange(text, 'login', loginPassword.setValue, 'loginPassword');
                    }
                  }}
                  onFocus={() => {
                    handleFieldTouch('loginPassword');
                  }}
                  placeholder={t('auth.passwordPlaceholder')}
                  placeholderTextColor={authColors.textSecondary}
                  secureTextEntry={!showPassword.login}
                  maxLength={PASSWORD_MAX_LENGTH}
                  autoCapitalize="none"
                  autoComplete="password"
                />
                <TouchableOpacity
                  style={validatorAuthFormStyles.passwordToggleButton}
                  onPress={() => setShowPassword(prev => ({ ...prev, login: !prev.login }))}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword.login ? 'eye-off-outline' : 'eye-outline'}
                    size={ICON_SIZES.medium}
                    color={authColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {/* No validation errors shown in login (user already registered) */}
            </View>

            {/* Remember Me Checkbox */}
            <TouchableOpacity
              style={validatorAuthFormStyles.rememberMeContainer}
              onPress={() => setRememberMe(!rememberMe)}
              activeOpacity={0.7}
            >
              <View
                style={[
                  validatorAuthFormStyles.checkbox,
                  {
                    backgroundColor: rememberMe ? buttonBlue : TRANSPARENT_COLOR,
                    borderColor: rememberMe ? buttonBlue : authColors.border,
                  },
                ]}
              >
                {rememberMe && (
                  <Ionicons name="checkmark" size={ICON_SIZES.small} color={WHITE_COLOR} />
                )}
              </View>
              <ThemedText style={[validatorAuthFormStyles.rememberMeText, { color: authColors.text }]}>
                {t('auth.rememberMe')}
              </ThemedText>
            </TouchableOpacity>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                validatorAuthFormStyles.continueButton,
                {
                  backgroundColor: isLoginFormValid && !isSubmitting ? buttonBlue : authColors.border,
                },
              ]}
              onPress={handleLogin}
              disabled={!isLoginFormValid || isSubmitting}
            >
              <ThemedText
                style={[
                  validatorAuthFormStyles.continueButtonText,
                  {
                    color: isLoginFormValid && !isSubmitting ? WHITE_COLOR : authColors.textSecondary,
                  },
                ]}
              >
                {isSubmitting ? t('auth.signingIn') : t('auth.continue')}
              </ThemedText>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Full Name Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.fullName')} *
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: (!touched.registerFullName || registerFullName.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={registerFullName.value}
                onChangeText={(text) => {
                  // Enforce max length for full name
                  if (text.length <= FULL_NAME_MAX_LENGTH) {
                    registerFullName.setValue(text);
                    handleFieldTouch('registerFullName');
                  }
                }}
                onFocus={() => {
                  handleFieldTouch('registerFullName');
                }}
                placeholder={t('auth.fullNamePlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                autoCapitalize="words"
                autoComplete="name"
                maxLength={FULL_NAME_MAX_LENGTH}
              />
              {!registerFullName.isValid && touched.registerFullName && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerFullName.error}
                </ThemedText>
              )}
            </View>

            {/* Email Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.emailAddress')} *
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: (!touched.registerEmail || registerEmail.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={registerEmail.value}
                onChangeText={(text) => {
                  // Enforce max length for email
                  if (text.length <= EMAIL_MAX_LENGTH) {
                    registerEmail.setValue(text);
                    handleFieldTouch('registerEmail');
                  }
                }}
                onFocus={() => {
                  handleFieldTouch('registerEmail');
                }}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                editable={true}
                maxLength={EMAIL_MAX_LENGTH}
              />
              {!registerEmail.isValid && touched.registerEmail && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerEmail.error}
                </ThemedText>
              )}
            </View>

            {/* Username Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.username')} *
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: (!touched.registerUsername || registerUsername.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={registerUsername.value}
                onChangeText={(text) => {
                  // Enforce max length for username
                  if (text.length <= USERNAME_MAX_LENGTH) {
                    registerUsername.setValue(text);
                    handleFieldTouch('registerUsername');
                  }
                }}
                onFocus={() => {
                  handleFieldTouch('registerUsername');
                }}
                placeholder={t('auth.usernamePlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                autoCapitalize="none"
                autoComplete="username"
                maxLength={USERNAME_MAX_LENGTH}
              />
              {!registerUsername.isValid && touched.registerUsername && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerUsername.error}
                </ThemedText>
              )}
            </View>

            {/* Phone Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.phoneNumber')} *
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: (!touched.registerPhone || registerPhone.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={registerPhone.value}
                onChangeText={(text) => {
                  // Only allow numbers and common phone characters (+, -, spaces, parentheses)
                  const phoneRegex = /^[\d+\-\s()]*$/;
                  if (phoneRegex.test(text) && text.length <= PHONE_MAX_LENGTH) {
                    registerPhone.setValue(text);
                    handleFieldTouch('registerPhone');
                  }
                }}
                onFocus={() => {
                  handleFieldTouch('registerPhone');
                }}
                placeholder={t('auth.phonePlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                keyboardType="phone-pad"
                autoCapitalize="none"
                autoComplete="tel"
                maxLength={PHONE_MAX_LENGTH}
              />
              {!registerPhone.isValid && touched.registerPhone && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerPhone.error}
                </ThemedText>
              )}
            </View>

            {/* Password Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.password')} *
              </ThemedText>
              <View style={validatorAuthFormStyles.passwordInputContainer}>
                <TextInput
                  style={[
                    validatorAuthFormStyles.passwordInput,
                    {
                      backgroundColor: authColors.inputBackground,
                      color: authColors.text,
                      borderColor: (!touched.registerPassword || registerPassword.isValid)
                        ? authColors.border
                        : AUTH_ERROR_COLORS.error,
                    },
                  ]}
                  value={showPassword.register ? registerPassword.value : displayValues.register}
                  onChangeText={(text) => {
                    if (showPassword.register) {
                      // When password is visible, handle input directly
                      if (text.length <= PASSWORD_MAX_LENGTH) {
                        registerPassword.setValue(text);
                        setDisplayValues(prev => ({ ...prev, register: '•'.repeat(text.length) }));
                        handleFieldTouch('registerPassword');
                      }
                    } else {
                      // When password is hidden, use the bullet masking logic
                      handlePasswordChange(text, 'register', registerPassword.setValue, 'registerPassword');
                    }
                  }}
                  onFocus={() => {
                    handleFieldTouch('registerPassword');
                  }}
                  placeholder={t('auth.passwordPlaceholderCreate')}
                  placeholderTextColor={authColors.textSecondary}
                  secureTextEntry={!showPassword.register}
                  maxLength={PASSWORD_MAX_LENGTH}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  style={validatorAuthFormStyles.passwordToggleButton}
                  onPress={() => setShowPassword(prev => ({ ...prev, register: !prev.register }))}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword.register ? 'eye-off-outline' : 'eye-outline'}
                    size={ICON_SIZES.medium}
                    color={authColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {registerPassword.value && (
                <View style={validatorAuthFormStyles.requirementsContainer}>
                  {checkPasswordRequirements(registerPassword.value).map((req, index) => (
                    <View key={index} style={validatorAuthFormStyles.requirementItem}>
                      <Ionicons
                        name={req.met ? 'checkmark-circle' : 'ellipse-outline'}
                        size={ICON_SIZES.small}
                        color={req.met ? AUTH_ERROR_COLORS.success : authColors.textSecondary}
                      />
                      <ThemedText
                        style={[
                          validatorAuthFormStyles.requirementText,
                          {
                            color: req.met ? AUTH_ERROR_COLORS.success : authColors.textSecondary,
                          },
                        ]}
                      >
                        {req.label}
                      </ThemedText>
                    </View>
                  ))}
                </View>
              )}
              {!registerPassword.isValid && touched.registerPassword && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerPassword.error}
                </ThemedText>
              )}
            </View>

            {/* Confirm Password Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.confirmPassword')} *
              </ThemedText>
              <View style={validatorAuthFormStyles.passwordInputContainer}>
                <TextInput
                  style={[
                    validatorAuthFormStyles.passwordInput,
                    {
                      backgroundColor: authColors.inputBackground,
                      color: authColors.text,
                      borderColor:
                        (!touched.registerConfirmPassword ||
                          (isConfirmPasswordValid && passwordsMatch))
                          ? authColors.border
                          : AUTH_ERROR_COLORS.error,
                    },
                  ]}
                  value={showPassword.registerConfirm ? registerConfirmPassword.value : displayValues.registerConfirm}
                  onChangeText={(text) => {
                    if (showPassword.registerConfirm) {
                      // When password is visible, handle input directly
                      if (text.length <= PASSWORD_MAX_LENGTH) {
                        registerConfirmPassword.setValue(text);
                        setDisplayValues(prev => ({ ...prev, registerConfirm: '•'.repeat(text.length) }));
                        handleFieldTouch('registerConfirmPassword');
                      }
                    } else {
                      // When password is hidden, use the bullet masking logic
                      handlePasswordChange(text, 'registerConfirm', registerConfirmPassword.setValue, 'registerConfirmPassword');
                    }
                  }}
                  onFocus={() => {
                    handleFieldTouch('registerConfirmPassword');
                  }}
                  placeholder={t('auth.confirmPasswordPlaceholder')}
                  placeholderTextColor={authColors.textSecondary}
                  secureTextEntry={!showPassword.registerConfirm}
                  maxLength={PASSWORD_MAX_LENGTH}
                  autoCapitalize="none"
                  autoComplete="password-new"
                />
                <TouchableOpacity
                  style={validatorAuthFormStyles.passwordToggleButton}
                  onPress={() => setShowPassword(prev => ({ ...prev, registerConfirm: !prev.registerConfirm }))}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={showPassword.registerConfirm ? 'eye-off-outline' : 'eye-outline'}
                    size={ICON_SIZES.medium}
                    color={authColors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              {touched.registerConfirmPassword &&
                registerConfirmPassword.value &&
                registerPassword.value &&
                registerPassword.value !== registerConfirmPassword.value && (
                  <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                    {t('validation.passwordsNoMatch')}
                  </ThemedText>
                )}
              {touched.registerConfirmPassword &&
                registerConfirmPassword.value &&
                registerPassword.value &&
                registerPassword.value === registerConfirmPassword.value && (
                  <View style={validatorAuthFormStyles.matchContainer}>
                    <Ionicons name="checkmark-circle" size={ICON_SIZES.small} color={AUTH_ERROR_COLORS.success} />
                    <ThemedText style={[validatorAuthFormStyles.matchText, { color: AUTH_ERROR_COLORS.success }]}>
                      {t('validation.passwordsMatch')}
                    </ThemedText>
                  </View>
                )}
              {!registerConfirmPassword.isValid && touched.registerConfirmPassword && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerConfirmPassword.error}
                </ThemedText>
              )}
            </View>

            {/* Continue Button */}
            <TouchableOpacity
              style={[
                validatorAuthFormStyles.continueButton,
                {
                  backgroundColor: isRegisterFormValid && !isSubmitting ? buttonBlue : authColors.border,
                },
              ]}
              onPress={handleRegister}
              disabled={!isRegisterFormValid || isSubmitting}
            >
              <ThemedText
                style={[
                  validatorAuthFormStyles.continueButtonText,
                  {
                    color: isRegisterFormValid && !isSubmitting ? WHITE_COLOR : authColors.textSecondary,
                  },
                ]}
              >
                {isSubmitting ? t('auth.creatingAccount') : t('auth.continue')}
              </ThemedText>
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Divider */}
      <View style={validatorAuthFormStyles.dividerContainer}>
        <View style={[validatorAuthFormStyles.divider, { backgroundColor: authColors.border }]} />
        <ThemedText style={[validatorAuthFormStyles.dividerText, { color: authColors.textSecondary }]}>
          {t('auth.or')}
        </ThemedText>
        <View style={[validatorAuthFormStyles.divider, { backgroundColor: authColors.border }]} />
      </View>

      {/* Social Login Buttons */}
      <View style={validatorAuthFormStyles.socialContainer}>
        <TouchableOpacity
          style={[validatorAuthFormStyles.socialButton, { backgroundColor: authColors.cardBackground, borderColor: authColors.border }]}
          onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.GOOGLE)}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-google" size={ICON_SIZES.medium} color={SOCIAL_LOGIN_ICON_COLORS.google} />
          <ThemedText style={[validatorAuthFormStyles.socialButtonText, { color: authColors.text }]}>
            {t('auth.continueWithGoogle')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[validatorAuthFormStyles.socialButton, { backgroundColor: authColors.cardBackground, borderColor: authColors.border }]}
          onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.GITHUB)}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-github" size={ICON_SIZES.medium} color={authColors.text} />
          <ThemedText style={[validatorAuthFormStyles.socialButtonText, { color: authColors.text }]}>
            {t('auth.continueWithGitHub')}
          </ThemedText>
        </TouchableOpacity>

        {Platform.OS === 'ios' && (
          <TouchableOpacity
            style={[validatorAuthFormStyles.socialButton, { backgroundColor: authColors.cardBackground, borderColor: authColors.border }]}
            onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.APPLE)}
            activeOpacity={0.7}
          >
            <Ionicons name="logo-apple" size={ICON_SIZES.medium} color={authColors.text} />
            <ThemedText style={[validatorAuthFormStyles.socialButtonText, { color: authColors.text }]}>
              {t('auth.continueWithApple')}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      </View>
    </View>
  );
}

