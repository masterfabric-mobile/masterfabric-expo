import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { ThemedText, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Platform, TextInput, TouchableOpacity, View } from 'react-native';
import {
  AUTH_ERROR_COLORS,
  PASSWORD_MAX_LENGTH,
  SOCIAL_LOGIN_ICON_COLORS,
  SOCIAL_LOGIN_PROVIDERS,
  TRANSPARENT_COLOR,
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
    loginEmail,
    loginPassword,
    registerFullName,
    registerEmail,
    registerUsername,
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
    <View style={validatorAuthFormStyles.wrapper}>
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
                activeTab === 'login' && { color: buttonBlue, fontWeight: '600' },
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
                activeTab === 'register' && { color: buttonBlue, fontWeight: '600' },
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
                    borderColor: (!touched.loginEmail || loginEmail.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={loginEmail.value}
                onChangeText={(text) => {
                  loginEmail.setValue(text);
                  handleFieldTouch('loginEmail');
                }}
                onFocus={() => {
                  handleFieldTouch('loginEmail');
                }}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
              {/* No validation errors shown in login (user already registered) */}
            </View>

            {/* Password Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.password')} *
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: (!touched.loginPassword || loginPassword.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={displayValues.login}
                onChangeText={(text) => {
                  handlePasswordChange(text, 'login', loginPassword.setValue, 'loginPassword');
                }}
                onFocus={() => {
                  handleFieldTouch('loginPassword');
                }}
                placeholder={t('auth.passwordPlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                secureTextEntry={false}
                maxLength={PASSWORD_MAX_LENGTH}
                autoCapitalize="none"
                autoComplete="password"
              />
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
                  <Ionicons name="checkmark" size={16} color={WHITE_COLOR} />
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
                  registerFullName.setValue(text);
                  handleFieldTouch('registerFullName');
                }}
                onFocus={() => {
                  handleFieldTouch('registerFullName');
                }}
                placeholder={t('auth.fullNamePlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                autoCapitalize="words"
                autoComplete="name"
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
                  registerEmail.setValue(text);
                  handleFieldTouch('registerEmail');
                }}
                onFocus={() => {
                  handleFieldTouch('registerEmail');
                }}
                placeholder={t('auth.emailPlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
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
                  registerUsername.setValue(text);
                  handleFieldTouch('registerUsername');
                }}
                onFocus={() => {
                  handleFieldTouch('registerUsername');
                }}
                placeholder={t('auth.usernamePlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                autoCapitalize="none"
                autoComplete="username"
              />
              {!registerUsername.isValid && touched.registerUsername && (
                <ThemedText style={[validatorAuthFormStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}>
                  {registerUsername.error}
                </ThemedText>
              )}
            </View>

            {/* Password Field */}
            <View style={validatorAuthFormStyles.fieldContainer}>
              <ThemedText style={[validatorAuthFormStyles.label, { color: authColors.text }]}>
                {t('auth.password')} *
              </ThemedText>
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
                  {
                    backgroundColor: authColors.inputBackground,
                    color: authColors.text,
                    borderColor: (!touched.registerPassword || registerPassword.isValid)
                      ? authColors.border
                      : AUTH_ERROR_COLORS.error,
                  },
                ]}
                value={displayValues.register}
                onChangeText={(text) => {
                  handlePasswordChange(text, 'register', registerPassword.setValue, 'registerPassword');
                }}
                onFocus={() => {
                  handleFieldTouch('registerPassword');
                }}
                placeholder={t('auth.passwordPlaceholderCreate')}
                placeholderTextColor={authColors.textSecondary}
                secureTextEntry={false}
                maxLength={PASSWORD_MAX_LENGTH}
                autoCapitalize="none"
                autoComplete="password-new"
              />
              {registerPassword.value && (
                <View style={validatorAuthFormStyles.requirementsContainer}>
                  {checkPasswordRequirements(registerPassword.value).map((req, index) => (
                    <View key={index} style={validatorAuthFormStyles.requirementItem}>
                      <Ionicons
                        name={req.met ? 'checkmark-circle' : 'ellipse-outline'}
                        size={16}
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
              <TextInput
                style={[
                  validatorAuthFormStyles.input,
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
                value={displayValues.registerConfirm}
                onChangeText={(text) => {
                  handlePasswordChange(text, 'registerConfirm', registerConfirmPassword.setValue, 'registerConfirmPassword');
                }}
                onFocus={() => {
                  handleFieldTouch('registerConfirmPassword');
                }}
                placeholder={t('auth.confirmPasswordPlaceholder')}
                placeholderTextColor={authColors.textSecondary}
                secureTextEntry={false}
                maxLength={PASSWORD_MAX_LENGTH}
                autoCapitalize="none"
                autoComplete="password-new"
              />
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
                    <Ionicons name="checkmark-circle" size={16} color={AUTH_ERROR_COLORS.success} />
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
          <Ionicons name="logo-google" size={20} color={SOCIAL_LOGIN_ICON_COLORS.google} />
          <ThemedText style={[validatorAuthFormStyles.socialButtonText, { color: authColors.text }]}>
            {t('auth.continueWithGoogle')}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[validatorAuthFormStyles.socialButton, { backgroundColor: authColors.cardBackground, borderColor: authColors.border }]}
          onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.GITHUB)}
          activeOpacity={0.7}
        >
          <Ionicons name="logo-github" size={20} color={authColors.text} />
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
            <Ionicons name="logo-apple" size={20} color={authColors.text} />
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

