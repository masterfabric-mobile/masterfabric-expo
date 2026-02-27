/**
 * Auth screen — login/register form (validator-helper pattern).
 * Uses useValidator-based view model and Recipio theming.
 */

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { useI18n } from '@/shared/i18n';
import {
  AUTH_ERROR_COLORS,
  EMAIL_MAX_LENGTH,
  FULL_NAME_MAX_LENGTH,
  ICON_SIZES,
  PASSWORD_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  SOCIAL_LOGIN_ICON_COLORS,
  SOCIAL_LOGIN_PROVIDERS,
  USERNAME_MAX_LENGTH,
} from '../constants/auth-constants';
import { useAuthViewModel } from '../hooks/use-auth-view-model';
import { authScreenStyles } from '../styles/auth-screen.styles';

export function AuthScreen() {
  const { t } = useI18n();
  const router = useRouter();
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
  } = useAuthViewModel();

  return (
    <SafeAreaView
      style={[authScreenStyles.container, { backgroundColor: RecipioColors.background }]}
      edges={['top']}
    >
      <View style={authScreenStyles.headerContainer}>
        <TouchableOpacity
          style={{ position: 'absolute', left: 24, top: 16, padding: 8 }}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color={RecipioColors.text} />
        </TouchableOpacity>
        <View style={authScreenStyles.logoPlaceholder} />
      </View>

      <ScrollView
        style={authScreenStyles.scrollView}
        contentContainerStyle={authScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={authScreenStyles.cardContainer}>
          <View style={authScreenStyles.tabContainer}>
            <TouchableOpacity
              style={[
                authScreenStyles.tabButton,
                activeTab === 'login' && authScreenStyles.tabButtonActive,
              ]}
              onPress={() => handleTabChange('login')}
            >
              <Text
                style={[
                  authScreenStyles.tabButtonText,
                  activeTab === 'login' && {
                    color: RecipioColors.primaryAccent,
                    fontWeight: '600',
                  },
                ]}
              >
                {t('auth.signIn')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                authScreenStyles.tabButton,
                activeTab === 'register' && authScreenStyles.tabButtonActive,
              ]}
              onPress={() => handleTabChange('register')}
            >
              <Text
                style={[
                  authScreenStyles.tabButtonText,
                  activeTab === 'register' && {
                    color: RecipioColors.primaryAccent,
                    fontWeight: '600',
                  },
                ]}
              >
                {t('auth.signUp')}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={authScreenStyles.formContainer}>
            {activeTab === 'login' ? (
              <>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.emailAddress')}</Text>
                  <TextInput
                    style={authScreenStyles.input}
                    value={loginEmail.value}
                    onChangeText={(text) => {
                      if (text.length <= EMAIL_MAX_LENGTH) {
                        loginEmail.setValue(text);
                        handleFieldTouch('loginEmail');
                      }
                    }}
                    onFocus={() => handleFieldTouch('loginEmail')}
                    placeholder={t('auth.emailPlaceholder')}
                    placeholderTextColor={RecipioColors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    maxLength={EMAIL_MAX_LENGTH}
                  />
                </View>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.password')} *</Text>
                  <View style={authScreenStyles.passwordInputContainer}>
                    <TextInput
                      style={authScreenStyles.passwordInput}
                      value={
                        showPassword.login
                          ? loginPassword.value
                          : displayValues.login
                      }
                      onChangeText={(text) => {
                        if (showPassword.login) {
                          if (text.length <= PASSWORD_MAX_LENGTH) {
                            loginPassword.setValue(text);
                            setDisplayValues((prev) => ({
                              ...prev,
                              login: '•'.repeat(text.length),
                            }));
                            handleFieldTouch('loginPassword');
                          }
                        } else {
                          handlePasswordChange(
                            text,
                            'login',
                            loginPassword.setValue,
                            'loginPassword'
                          );
                        }
                      }}
                      onFocus={() => handleFieldTouch('loginPassword')}
                      placeholder={t('auth.passwordPlaceholder')}
                      placeholderTextColor={RecipioColors.textSecondary}
                      secureTextEntry={!showPassword.login}
                      maxLength={PASSWORD_MAX_LENGTH}
                      autoCapitalize="none"
                      autoComplete="password"
                    />
                    <TouchableOpacity
                      style={authScreenStyles.passwordToggleButton}
                      onPress={() =>
                        setShowPassword((prev) => ({ ...prev, login: !prev.login }))
                      }
                    >
                      <Ionicons
                        name={
                          showPassword.login
                            ? 'eye-off-outline'
                            : 'eye-outline'
                        }
                        size={ICON_SIZES.medium}
                        color={RecipioColors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity
                  style={authScreenStyles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View
                    style={[
                      authScreenStyles.checkbox,
                      {
                        backgroundColor: rememberMe
                          ? RecipioColors.primaryAccent
                          : 'transparent',
                        borderColor: rememberMe
                          ? RecipioColors.primaryAccent
                          : RecipioColors.border,
                      },
                    ]}
                  >
                    {rememberMe && (
                      <Ionicons
                        name="checkmark"
                        size={ICON_SIZES.small}
                        color="#FFF"
                      />
                    )}
                  </View>
                  <Text style={authScreenStyles.rememberMeText}>
                    {t('auth.rememberMe')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    authScreenStyles.continueButton,
                    {
                      backgroundColor:
                        isLoginFormValid && !isSubmitting
                          ? RecipioColors.primaryAccent
                          : RecipioColors.border,
                    },
                  ]}
                  onPress={handleLogin}
                  disabled={!isLoginFormValid || isSubmitting}
                >
                  <Text
                    style={[
                      authScreenStyles.continueButtonText,
                      {
                        color:
                          isLoginFormValid && !isSubmitting
                            ? '#FFF'
                            : RecipioColors.textSecondary,
                      },
                    ]}
                  >
                    {isSubmitting ? t('auth.signingIn') : t('auth.continue')}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.fullName')} *</Text>
                  <TextInput
                    style={[
                      authScreenStyles.input,
                      {
                        borderColor:
                          !touched.registerFullName || registerFullName.isValid
                            ? RecipioColors.border
                            : RecipioColors.error,
                      },
                    ]}
                    value={registerFullName.value}
                    onChangeText={(text) => {
                      if (text.length <= FULL_NAME_MAX_LENGTH) {
                        registerFullName.setValue(text);
                        handleFieldTouch('registerFullName');
                      }
                    }}
                    onFocus={() => handleFieldTouch('registerFullName')}
                    placeholder={t('auth.fullNamePlaceholder')}
                    placeholderTextColor={RecipioColors.textSecondary}
                    autoCapitalize="words"
                    autoComplete="name"
                    maxLength={FULL_NAME_MAX_LENGTH}
                  />
                  {!registerFullName.isValid && touched.registerFullName && registerFullName.error ? (
                    <Text
                      style={[authScreenStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}
                    >
                      {registerFullName.error}
                    </Text>
                  ) : null}
                </View>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.emailAddress')} *</Text>
                  <TextInput
                    style={[
                      authScreenStyles.input,
                      {
                        borderColor:
                          !touched.registerEmail || registerEmail.isValid
                            ? RecipioColors.border
                            : RecipioColors.error,
                      },
                    ]}
                    value={registerEmail.value}
                    onChangeText={(text) => {
                      if (text.length <= EMAIL_MAX_LENGTH) {
                        registerEmail.setValue(text);
                        handleFieldTouch('registerEmail');
                      }
                    }}
                    onFocus={() => handleFieldTouch('registerEmail')}
                    placeholder={t('auth.emailPlaceholder')}
                    placeholderTextColor={RecipioColors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    maxLength={EMAIL_MAX_LENGTH}
                  />
                  {!registerEmail.isValid && touched.registerEmail && registerEmail.error ? (
                    <Text
                      style={[authScreenStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}
                    >
                      {registerEmail.error}
                    </Text>
                  ) : null}
                </View>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.username')} *</Text>
                  <TextInput
                    style={[
                      authScreenStyles.input,
                      {
                        borderColor:
                          !touched.registerUsername || registerUsername.isValid
                            ? RecipioColors.border
                            : RecipioColors.error,
                      },
                    ]}
                    value={registerUsername.value}
                    onChangeText={(text) => {
                      if (text.length <= USERNAME_MAX_LENGTH) {
                        registerUsername.setValue(text);
                        handleFieldTouch('registerUsername');
                      }
                    }}
                    onFocus={() => handleFieldTouch('registerUsername')}
                    placeholder={t('auth.usernamePlaceholder')}
                    placeholderTextColor={RecipioColors.textSecondary}
                    autoCapitalize="none"
                    autoComplete="username"
                    maxLength={USERNAME_MAX_LENGTH}
                  />
                  {!registerUsername.isValid && touched.registerUsername && registerUsername.error ? (
                    <Text
                      style={[authScreenStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}
                    >
                      {registerUsername.error}
                    </Text>
                  ) : null}
                </View>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.phoneNumber')} *</Text>
                  <TextInput
                    style={[
                      authScreenStyles.input,
                      {
                        borderColor:
                          !touched.registerPhone || registerPhone.isValid
                            ? RecipioColors.border
                            : RecipioColors.error,
                      },
                    ]}
                    value={registerPhone.value}
                    onChangeText={(text) => {
                      const phoneRegex = /^[\d+\-\s()]*$/;
                      if (phoneRegex.test(text) && text.length <= PHONE_MAX_LENGTH) {
                        registerPhone.setValue(text);
                        handleFieldTouch('registerPhone');
                      }
                    }}
                    onFocus={() => handleFieldTouch('registerPhone')}
                    placeholder={t('auth.phonePlaceholder')}
                    placeholderTextColor={RecipioColors.textSecondary}
                    keyboardType="phone-pad"
                    autoCapitalize="none"
                    autoComplete="tel"
                    maxLength={PHONE_MAX_LENGTH}
                  />
                  {!registerPhone.isValid && touched.registerPhone && registerPhone.error ? (
                    <Text
                      style={[authScreenStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}
                    >
                      {registerPhone.error}
                    </Text>
                  ) : null}
                </View>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>{t('auth.password')} *</Text>
                  <View style={authScreenStyles.passwordInputContainer}>
                    <TextInput
                      style={[
                        authScreenStyles.passwordInput,
                        {
                          borderColor:
                            !touched.registerPassword || registerPassword.isValid
                              ? RecipioColors.border
                              : RecipioColors.error,
                        },
                      ]}
                      value={
                        showPassword.register
                          ? registerPassword.value
                          : displayValues.register
                      }
                      onChangeText={(text) => {
                        if (showPassword.register) {
                          if (text.length <= PASSWORD_MAX_LENGTH) {
                            registerPassword.setValue(text);
                            setDisplayValues((prev) => ({
                              ...prev,
                              register: '•'.repeat(text.length),
                            }));
                            handleFieldTouch('registerPassword');
                          }
                        } else {
                          handlePasswordChange(
                            text,
                            'register',
                            registerPassword.setValue,
                            'registerPassword'
                          );
                        }
                      }}
                      onFocus={() => handleFieldTouch('registerPassword')}
                      placeholder={t('auth.passwordPlaceholderCreate')}
                      placeholderTextColor={RecipioColors.textSecondary}
                      secureTextEntry={!showPassword.register}
                      maxLength={PASSWORD_MAX_LENGTH}
                      autoCapitalize="none"
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      style={authScreenStyles.passwordToggleButton}
                      onPress={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          register: !prev.register,
                        }))
                      }
                    >
                      <Ionicons
                        name={
                          showPassword.register
                            ? 'eye-off-outline'
                            : 'eye-outline'
                        }
                        size={ICON_SIZES.medium}
                        color={RecipioColors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  {registerPassword.value ? (
                    <View style={authScreenStyles.requirementsContainer}>
                      {checkPasswordRequirements(registerPassword.value).map(
                        (req, idx) => (
                          <View
                            key={idx}
                            style={authScreenStyles.requirementItem}
                          >
                            <Ionicons
                              name={
                                req.met ? 'checkmark-circle' : 'ellipse-outline'
                              }
                              size={ICON_SIZES.small}
                              color={
                                req.met
                                  ? AUTH_ERROR_COLORS.success
                                  : RecipioColors.textSecondary
                              }
                            />
                            <Text
                              style={[
                                authScreenStyles.requirementText,
                                {
                                  color: req.met
                                    ? AUTH_ERROR_COLORS.success
                                    : RecipioColors.textSecondary,
                                },
                              ]}
                            >
                              {typeof req.label === 'string' ? req.label : ''}
                            </Text>
                          </View>
                        )
                      )}
                    </View>
                  ) : null}
                  {!registerPassword.isValid && touched.registerPassword && registerPassword.error ? (
                    <Text
                      style={[authScreenStyles.errorText, { color: AUTH_ERROR_COLORS.error }]}
                    >
                      {registerPassword.error}
                    </Text>
                  ) : null}
                </View>
                <View style={authScreenStyles.fieldContainer}>
                  <Text style={authScreenStyles.label}>
                    {t('auth.confirmPassword')} *
                  </Text>
                  <View style={authScreenStyles.passwordInputContainer}>
                    <TextInput
                      style={[
                        authScreenStyles.passwordInput,
                        {
                          borderColor:
                            !touched.registerConfirmPassword ||
                            (isConfirmPasswordValid && passwordsMatch)
                              ? RecipioColors.border
                              : RecipioColors.error,
                        },
                      ]}
                      value={
                        showPassword.registerConfirm
                          ? registerConfirmPassword.value
                          : displayValues.registerConfirm
                      }
                      onChangeText={(text) => {
                        if (showPassword.registerConfirm) {
                          if (text.length <= PASSWORD_MAX_LENGTH) {
                            registerConfirmPassword.setValue(text);
                            setDisplayValues((prev) => ({
                              ...prev,
                              registerConfirm: '•'.repeat(text.length),
                            }));
                            handleFieldTouch('registerConfirmPassword');
                          }
                        } else {
                          handlePasswordChange(
                            text,
                            'registerConfirm',
                            registerConfirmPassword.setValue,
                            'registerConfirmPassword'
                          );
                        }
                      }}
                      onFocus={() =>
                        handleFieldTouch('registerConfirmPassword')
                      }
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      placeholderTextColor={RecipioColors.textSecondary}
                      secureTextEntry={!showPassword.registerConfirm}
                      maxLength={PASSWORD_MAX_LENGTH}
                      autoCapitalize="none"
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      style={authScreenStyles.passwordToggleButton}
                      onPress={() =>
                        setShowPassword((prev) => ({
                          ...prev,
                          registerConfirm: !prev.registerConfirm,
                        }))
                      }
                    >
                      <Ionicons
                        name={
                          showPassword.registerConfirm
                            ? 'eye-off-outline'
                            : 'eye-outline'
                        }
                        size={ICON_SIZES.medium}
                        color={RecipioColors.textSecondary}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.registerConfirmPassword &&
                    registerConfirmPassword.value &&
                    registerPassword.value &&
                    registerPassword.value !==
                      registerConfirmPassword.value && (
                      <Text
                        style={[
                          authScreenStyles.errorText,
                          { color: AUTH_ERROR_COLORS.error },
                        ]}
                      >
                        {t('validation.passwordsNoMatch')}
                      </Text>
                    )}
                  {touched.registerConfirmPassword &&
                    registerConfirmPassword.value &&
                    registerPassword.value ===
                      registerConfirmPassword.value && (
                      <View style={authScreenStyles.matchContainer}>
                        <Ionicons
                          name="checkmark-circle"
                          size={ICON_SIZES.small}
                          color={AUTH_ERROR_COLORS.success}
                        />
                        <Text
                          style={[
                            authScreenStyles.matchText,
                            { color: AUTH_ERROR_COLORS.success },
                          ]}
                        >
                          {t('validation.passwordsMatch')}
                        </Text>
                      </View>
                    )}
                  {!registerConfirmPassword.isValid &&
                    touched.registerConfirmPassword &&
                    registerConfirmPassword.error ? (
                      <Text
                        style={[
                          authScreenStyles.errorText,
                          { color: AUTH_ERROR_COLORS.error },
                        ]}
                      >
                        {registerConfirmPassword.error}
                      </Text>
                    ) : null}
                </View>
                <TouchableOpacity
                  style={[
                    authScreenStyles.continueButton,
                    {
                      backgroundColor:
                        isRegisterFormValid && !isSubmitting
                          ? RecipioColors.primaryAccent
                          : RecipioColors.border,
                    },
                  ]}
                  onPress={handleRegister}
                  disabled={!isRegisterFormValid || isSubmitting}
                >
                  <Text
                    style={[
                      authScreenStyles.continueButtonText,
                      {
                        color:
                          isRegisterFormValid && !isSubmitting
                            ? '#FFF'
                            : RecipioColors.textSecondary,
                      },
                    ]}
                  >
                    {isSubmitting
                      ? t('auth.creatingAccount')
                      : t('auth.continue')}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <View style={authScreenStyles.dividerContainer}>
            <View style={authScreenStyles.divider} />
            <Text style={authScreenStyles.dividerText}>{t('auth.or')}</Text>
            <View style={authScreenStyles.divider} />
          </View>

          <View style={authScreenStyles.socialContainer}>
            <TouchableOpacity
              style={authScreenStyles.socialButton}
              onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.GOOGLE)}
            >
              <Ionicons
                name="logo-google"
                size={ICON_SIZES.medium}
                color={SOCIAL_LOGIN_ICON_COLORS.google}
              />
              <Text style={authScreenStyles.socialButtonText}>
                {t('auth.continueWithGoogle')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={authScreenStyles.socialButton}
              onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.GITHUB)}
            >
              <Ionicons
                name="logo-github"
                size={ICON_SIZES.medium}
                color={RecipioColors.text}
              />
              <Text style={authScreenStyles.socialButtonText}>
                {t('auth.continueWithGitHub')}
              </Text>
            </TouchableOpacity>
            {Platform.OS === 'ios' ? (
              <TouchableOpacity
                style={authScreenStyles.socialButton}
                onPress={() => handleSocialLogin(SOCIAL_LOGIN_PROVIDERS.APPLE)}
              >
                <Ionicons
                  name="logo-apple"
                  size={ICON_SIZES.medium}
                  color={RecipioColors.text}
                />
                <Text style={authScreenStyles.socialButtonText}>
                  {t('auth.continueWithApple')}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
