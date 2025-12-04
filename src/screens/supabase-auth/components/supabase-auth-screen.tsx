import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { validateEmail } from '@/src/shared/utils';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Clipboard, Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseAuthViewModel } from '../hooks/use-supabase-auth-view-model';
import { supabaseAuthScreenStyles } from '../styles/supabase-auth-screen.styles';

const supabaseGreen = '#3ECF8E';

export function SupabaseAuthScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { success, error } = useSnackbar();

  const copyToClipboard = (text: string, label: string) => {
    try {
      Clipboard.setString(text);
      success(`${label} copied to clipboard`);
    } catch (e: any) {
      error('Failed to copy to clipboard');
    }
  };

  const { state, actions } = useSupabaseAuthViewModel();
  
  // Validation states
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [envDialogVisible, setEnvDialogVisible] = useState(false);

  useEffect(() => {
    console.log('[SupabaseAuth] Screen mounted, initializing...');
    actions.refreshStatus();
    const unsub = actions.subscribeAuth();
    
    return () => {
      if (unsub) {
        console.log('[SupabaseAuth] Screen unmounting, cleaning up auth listener');
        unsub();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Validate email
  const validateEmailField = (email: string) => {
    if (!email.trim()) {
      setEmailError('Email is required');
      return false;
    }
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError(null);
    return true;
  };

  // Validate password
  const validatePasswordField = (password: string, isSignUp: boolean = false) => {
    if (!password.trim()) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return false;
    }
    if (isSignUp && password.length < 8) {
      setPasswordError('Password must be at least 8 characters for sign up');
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleEmailChange = (text: string) => {
    actions.setEmail(text);
    if (emailTouched) {
      validateEmailField(text);
    }
  };

  const handlePasswordChange = (text: string) => {
    actions.setPassword(text);
    if (passwordTouched) {
      validatePasswordField(text);
    }
  };

  const handleEmailBlur = () => {
    setEmailTouched(true);
    validateEmailField(state.email);
  };

  const handlePasswordBlur = () => {
    setPasswordTouched(true);
    validatePasswordField(state.password);
  };

  const isFormValid = () => {
    return !emailError && !passwordError && state.email.trim() && state.password.trim();
  };

  const envRows = [
    { key: 'EXPO_PUBLIC_SUPABASE_URL', label: 'Supabase URL', icon: 'globe' },
    { key: 'EXPO_PUBLIC_SUPABASE_ANON_KEY', label: 'Anon Key', icon: 'lock' },
  ];

  return (
    <SafeAreaView 
      style={[supabaseAuthScreenStyles.container, { backgroundColor: colors.background }]} 
      edges={['top']}
    >
      <ScreenHeader 
        title="Supabase Authentication"
        subtitle="Email/password authentication"
        variant="minimal"
      />
      <ScrollView 
        style={supabaseAuthScreenStyles.scrollView}
        contentContainerStyle={supabaseAuthScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Supabase Logo Header */}
        <View style={supabaseAuthScreenStyles.logoContainer}>
          <Image
            source={require('@/src/assets/images/supabase-logo-icon.svg')}
            style={supabaseAuthScreenStyles.logo}
            contentFit="contain"
          />
          <Text style={[supabaseAuthScreenStyles.logoTitle, { color: colors.sectionTitle }]}>
            Supabase
          </Text>
          <Text style={[supabaseAuthScreenStyles.logoSubtitle, { color: colors.actionDescription }]}>
            Authentication
          </Text>
        </View>

        {/* Environment Variables Card */}
        <View style={[supabaseAuthScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <View style={supabaseAuthScreenStyles.envCardHeader}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Environment Variables</Text>
            <TouchableOpacity
              onPress={() => setEnvDialogVisible(true)}
              style={[supabaseAuthScreenStyles.envBadge, { backgroundColor: supabaseGreen + '15', borderColor: supabaseGreen + '30' }]}
            >
              <Ionicons name="eye" size={14} color={supabaseGreen} />
              <Text style={[supabaseAuthScreenStyles.envBadgeText, { color: supabaseGreen }]}>View</Text>
            </TouchableOpacity>
          </View>
          {envRows.map((row) => (
            <View key={row.key} style={supabaseAuthScreenStyles.envRow}>
              <Text style={[supabaseAuthScreenStyles.envLabel, { color: colors.labelText }]}>{row.label}:</Text>
              <Text style={[supabaseAuthScreenStyles.envValue, { color: process.env[row.key as keyof typeof process.env] ? supabaseGreen : '#ef4444' }]}>
                {process.env[row.key as keyof typeof process.env] ? '✓ Set' : '✗ Missing'}
              </Text>
            </View>
          ))}
        </View>

        {/* Environment Values Dialog */}
        <Modal
          visible={envDialogVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setEnvDialogVisible(false)}
        >
          <TouchableOpacity
            style={supabaseAuthScreenStyles.modalOverlay}
            activeOpacity={1}
            onPress={() => setEnvDialogVisible(false)}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={[supabaseAuthScreenStyles.modalContent, { backgroundColor: colors.surfaceBackground, borderColor: colors.surfaceBorder }]}
              onPress={(e) => e.stopPropagation()}
            >
              <View style={supabaseAuthScreenStyles.modalHeader}>
                <Text style={[supabaseAuthScreenStyles.modalTitle, { color: colors.labelText }]}>Environment Variables</Text>
                <TouchableOpacity onPress={() => setEnvDialogVisible(false)}>
                  <Ionicons name="close" size={24} color={colors.bodyText} />
                </TouchableOpacity>
              </View>
              <ScrollView style={supabaseAuthScreenStyles.modalScrollView} showsVerticalScrollIndicator={false}>
                {envRows.map((row) => {
                  const value = process.env[row.key as keyof typeof process.env];
                  const displayValue = value || 'Not set';
                  return (
                    <View key={row.key} style={supabaseAuthScreenStyles.modalEnvRow}>
                      <Text style={[supabaseAuthScreenStyles.modalEnvLabel, { color: colors.labelText }]}>{row.label}:</Text>
                      <View style={supabaseAuthScreenStyles.modalEnvValueRow}>
                        <View style={[supabaseAuthScreenStyles.modalEnvValueContainer, { backgroundColor: colors.inputBackground || colors.surfaceBackground, borderColor: colors.surfaceBorder }]}>
                          <Text style={[supabaseAuthScreenStyles.modalEnvValue, { color: value ? colors.bodyText : '#ef4444' }]}>
                            {displayValue}
                          </Text>
                        </View>
                        {value && (
                          <TouchableOpacity
                            onPress={() => copyToClipboard(value, row.label)}
                            style={[supabaseAuthScreenStyles.copyButton, { backgroundColor: supabaseGreen + '15', borderColor: supabaseGreen + '30' }]}
                          >
                            <Ionicons name="copy-outline" size={18} color={supabaseGreen} />
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Status card */}
        {!state.isReady ? (
          <View style={[supabaseAuthScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Supabase Status</Text>
            <ActivityIndicator size="small" color={supabaseGreen} />
            <Text style={[supabaseAuthScreenStyles.statusText, { color: colors.bodyText }]}>
              Initializing...
            </Text>
          </View>
        ) : !state.authAvailable ? (
          <View style={[supabaseAuthScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Supabase Status</Text>
            <Text style={{ color: colors.bodyText }}>
              Not initialized. Enable Supabase in initMasterView config and set Expo env vars in your .env (EXPO_PUBLIC_SUPABASE_*).
            </Text>
          </View>
        ) : (
          <View style={[supabaseAuthScreenStyles.card, { borderColor: supabaseGreen + '30', backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Supabase Status</Text>
            <Text style={[supabaseAuthScreenStyles.statusText, { color: supabaseGreen, fontWeight: '600' }]}>
              ✓ Connected
            </Text>
            {state.user ? (
              <View style={supabaseAuthScreenStyles.userInfo}>
                <Text style={[supabaseAuthScreenStyles.userInfoText, { color: colors.bodyText }]}>
                  Signed in as: {state.user.email || state.user.id}
                </Text>
                <Text style={[supabaseAuthScreenStyles.userInfoText, { color: colors.actionDescription, marginTop: 4 }]}>
                  User ID: {state.user.id}
                </Text>
              </View>
            ) : (
              <Text style={[supabaseAuthScreenStyles.statusText, { color: colors.actionDescription }]}>
                Not signed in
              </Text>
            )}
          </View>
        )}

        {/* Error display */}
        {state.lastError && (
          <View style={[supabaseAuthScreenStyles.card, { borderColor: '#ef4444', backgroundColor: '#ef444410' }]}>
            <Text style={{ color: '#ef4444', fontWeight: '600', marginBottom: 4 }}>Error</Text>
            <Text style={{ color: '#ef4444', fontSize: 14 }}>{state.lastError}</Text>
          </View>
        )}

        {/* Auth form - Only show when user is not signed in */}
        {state.authAvailable && !state.user && (
          <View style={[supabaseAuthScreenStyles.card, { borderColor: supabaseGreen + '20', backgroundColor: colors.surfaceBackground }]}>
            <Text style={[supabaseAuthScreenStyles.formTitle, { color: colors.labelText }]}>
              Sign in to your account
            </Text>
            
            <View style={supabaseAuthScreenStyles.section}>
              <Text style={[supabaseAuthScreenStyles.label, { color: colors.labelText }]}>
                Email Address
              </Text>
              <TextInput
                style={[
                  supabaseAuthScreenStyles.input,
                  emailError ? supabaseAuthScreenStyles.inputError : {},
                  { 
                    backgroundColor: colors.inputBackground || colors.surfaceBackground,
                    borderColor: emailError ? '#ef4444' : (emailTouched && !emailError && state.email ? supabaseGreen + '50' : colors.surfaceBorder),
                    color: colors.bodyText,
                  }
                ]}
                placeholder="your.email@example.com"
                placeholderTextColor={colors.actionDescription}
                value={state.email}
                onChangeText={handleEmailChange}
                onBlur={handleEmailBlur}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!state.isLoading}
                autoComplete="email"
              />
              {emailError && (
                <Text style={supabaseAuthScreenStyles.errorText}>{emailError}</Text>
              )}
            </View>

            <View style={supabaseAuthScreenStyles.section}>
              <Text style={[supabaseAuthScreenStyles.label, { color: colors.labelText }]}>
                Password
              </Text>
              <TextInput
                style={[
                  supabaseAuthScreenStyles.input,
                  passwordError ? supabaseAuthScreenStyles.inputError : {},
                  { 
                    backgroundColor: colors.inputBackground || colors.surfaceBackground,
                    borderColor: passwordError ? '#ef4444' : (passwordTouched && !passwordError && state.password ? supabaseGreen + '50' : colors.surfaceBorder),
                    color: colors.bodyText,
                  }
                ]}
                placeholder="Enter your password"
                placeholderTextColor={colors.actionDescription}
                value={state.password}
                onChangeText={handlePasswordChange}
                onBlur={handlePasswordBlur}
                secureTextEntry
                editable={!state.isLoading}
                autoComplete="password"
              />
              {passwordError && (
                <Text style={supabaseAuthScreenStyles.errorText}>{passwordError}</Text>
              )}
              {!passwordError && passwordTouched && state.password && (
                <Text style={[supabaseAuthScreenStyles.helperText, { color: supabaseGreen }]}>
                  ✓ Password looks good
                </Text>
              )}
            </View>

            <View style={supabaseAuthScreenStyles.section}>
              <TouchableOpacity
                style={[
                  supabaseAuthScreenStyles.button,
                  supabaseAuthScreenStyles.buttonPrimary,
                  (!isFormValid() || state.isLoading) && supabaseAuthScreenStyles.buttonDisabled,
                  { backgroundColor: (!isFormValid() || state.isLoading) ? colors.surfaceBorder : supabaseGreen }
                ]}
                onPress={async () => {
                  setEmailTouched(true);
                  setPasswordTouched(true);
                  if (!validateEmailField(state.email) || !validatePasswordField(state.password)) {
                    return;
                  }
                  try { 
                    await actions.signIn(); 
                    success('Signed in successfully'); 
                  } catch (e: any) { 
                    error(e?.message ?? 'Sign-in failed'); 
                  }
                }}
                disabled={state.isLoading || !isFormValid()}
              >
                {state.isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={supabaseAuthScreenStyles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  supabaseAuthScreenStyles.button,
                  supabaseAuthScreenStyles.buttonSecondary,
                  (!isFormValid() || state.isLoading) && supabaseAuthScreenStyles.buttonDisabled,
                  { 
                    borderColor: (!isFormValid() || state.isLoading) ? colors.surfaceBorder : supabaseGreen,
                    backgroundColor: 'transparent'
                  }
                ]}
                onPress={async () => {
                  setEmailTouched(true);
                  setPasswordTouched(true);
                  if (!validateEmailField(state.email) || !validatePasswordField(state.password, true)) {
                    return;
                  }
                  try { 
                    await actions.signUp(); 
                    success('Account created successfully'); 
                  } catch (e: any) { 
                    error(e?.message ?? 'Sign-up failed'); 
                  }
                }}
                disabled={state.isLoading || !isFormValid()}
              >
                <Text style={[supabaseAuthScreenStyles.buttonTextSecondary, { color: (!isFormValid() || state.isLoading) ? colors.actionDescription : supabaseGreen }]}>
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Sign Out Button - Only show when user is signed in */}
        {state.authAvailable && state.user && (
          <View style={[supabaseAuthScreenStyles.card, { borderColor: supabaseGreen + '20', backgroundColor: colors.surfaceBackground }]}>
            <TouchableOpacity
              style={[
                supabaseAuthScreenStyles.button,
                { 
                  backgroundColor: '#b91c1c',
                  borderWidth: 0,
                }
              ]}
              onPress={async () => {
                try { 
                  await actions.signOut(); 
                  success('Signed out successfully'); 
                } catch (e: any) { 
                  error(e?.message ?? 'Sign-out failed'); 
                }
              }}
              disabled={state.isLoading}
            >
              {state.isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={supabaseAuthScreenStyles.buttonText}>Sign Out</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default SupabaseAuthScreen;

