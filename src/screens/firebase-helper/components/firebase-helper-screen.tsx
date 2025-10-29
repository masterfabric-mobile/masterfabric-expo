import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme, firebaseIntegration } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseHelperViewModel } from '../hooks/use-firebase-helper-view-model';
import { firebaseHelperScreenStyles } from '../styles/firebase-helper-screen.styles';

export function FirebaseHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const { state, actions } = useFirebaseHelperViewModel();

  useEffect(() => {
    const unsub = actions.subscribeAuth();
    return () => unsub?.();
  }, [actions]);

  return (
    <SafeAreaView style={[firebaseHelperScreenStyles.container, { backgroundColor: colors.background }]} edges={['top']}>
      <ScreenHeader 
        title={t('helpers.firebaseHelper.title') || 'Firebase Helper'}
        subtitle={t('helpers.firebaseHelper.description') || 'Auth, Analytics (web), Firestore'}
        variant="minimal"
      />
      <ScrollView 
        style={firebaseHelperScreenStyles.scrollView}
        contentContainerStyle={firebaseHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Initialization guard card */}
        {(() => { try { return !(firebaseIntegration && typeof firebaseIntegration.isInitialized === 'function' && firebaseIntegration.isInitialized()); } catch { return true; } })() ? (
          <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Firebase not initialized</Text>
            <Text style={{ color: colors.bodyText, marginBottom: 8 }}>
              Enable Firebase in initMasterView config and set Expo env vars in your .env (EXPO_PUBLIC_FIREBASE_*).
            </Text>
            <Text style={{ color: colors.bodyText }}>Required: API_KEY, PROJECT_ID, APP_ID</Text>
          </View>
        ) : null}
        <View style={firebaseHelperScreenStyles.section}>
          <Text style={{ color: colors.labelText }}>Email</Text>
          <TextInput
            value={state.email}
            onChangeText={actions.setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            placeholder="user@example.com"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <Text style={{ color: colors.labelText }}>Password</Text>
          <TextInput
            value={state.password}
            onChangeText={actions.setPassword}
            secureTextEntry
            placeholder="••••••••"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <View style={firebaseHelperScreenStyles.section}>
            <Button title={state.isLoading ? 'Signing in…' : 'Sign In'} onPress={async () => {
              try { await actions.signIn(); Alert.alert('Signed in'); } catch (e: any) { Alert.alert('Sign-in failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading} />
            <Button title={state.isLoading ? 'Signing out…' : 'Sign Out'} color="#b91c1c" onPress={async () => {
              try { await actions.signOut(); Alert.alert('Signed out'); } catch (e: any) { Alert.alert('Sign-out failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading} />
            <Button title={state.isLoading ? 'Creating…' : 'Sign Up (email/password)'} onPress={async () => {
              try { await actions.signUpWithEmail(); Alert.alert('Account created'); } catch (e: any) { Alert.alert('Sign-up failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading} />
            <Button title={state.isLoading ? 'Signing…' : 'Sign In Anonymously'} onPress={async () => {
              try { await actions.signInAnonymously(); Alert.alert('Signed in anonymously'); } catch (e: any) { Alert.alert('Anonymous sign-in failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading} />
          </View>
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={{ color: colors.labelText, fontWeight: '600' }}>Auth User ID</Text>
          <Text style={{ color: colors.text }}>{state.authUserId ?? '-'}</Text>
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={{ color: colors.labelText, fontWeight: '600' }}>Analytics</Text>
          <Text style={{ color: colors.bodyText }}>Web-only with Firebase Web SDK</Text>
          <Button title="Log Demo Event" onPress={() => { try { actions.logDemoEvent(); Alert.alert('Analytics', 'Event logged (if supported)'); } catch (e: any) { Alert.alert('Analytics failed', e?.message ?? String(e)); } }} disabled={!state.canUseAnalytics} />
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Social Sign-in</Text>
          <Button title={state.isLoading ? 'Google Popup…' : 'Sign in with Google (Web Popup)'} onPress={() => { actions.signInWithGoogleWeb().catch((e: any) => Alert.alert('Google sign-in failed', e?.message ?? String(e))); }} disabled={state.isLoading} />
          <View style={{ height: 8 }} />
          <Text style={{ color: colors.bodyText }}>Google ID Token</Text>
          <TextInput
            value={state.googleIdToken}
            onChangeText={actions.setGoogleIdToken}
            placeholder="Paste Google ID token"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <Text style={{ color: colors.bodyText }}>Google Access Token (optional)</Text>
          <TextInput
            value={state.googleAccessToken}
            onChangeText={actions.setGoogleAccessToken}
            placeholder="Paste Google access token (optional)"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <Button title={state.isLoading ? 'Signing…' : 'Sign in with Google tokens'} onPress={() => { actions.signInWithGoogleTokens().then(() => Alert.alert('Signed in with Google')).catch((e: any) => Alert.alert('Google token sign-in failed', e?.message ?? String(e))); }} disabled={state.isLoading} />
          <View style={{ height: 8 }} />
          <Text style={{ color: colors.bodyText }}>Apple ID Token</Text>
          <TextInput
            value={state.appleIdToken}
            onChangeText={actions.setAppleIdToken}
            placeholder="Paste Apple ID token"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <Button title={state.isLoading ? 'Signing…' : 'Sign in with Apple token'} onPress={() => { actions.signInWithAppleToken().then(() => Alert.alert('Signed in with Apple')).catch((e: any) => Alert.alert('Apple sign-in failed', e?.message ?? String(e))); }} disabled={state.isLoading} />
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Firestore</Text>
          <Button title={state.isLoading ? 'Loading…' : 'Load items from collection "items"'} onPress={() => { actions.loadItems().catch((e: any) => Alert.alert('Failed to load items', e?.message ?? String(e))); }} disabled={state.isLoading} />
          <View style={{ height: 8 }} />
          <Button title={state.isLoading ? 'Adding…' : 'Create sample item'} onPress={() => { actions.createSampleItem().then(() => Alert.alert('Item created')).catch((e: any) => Alert.alert('Create failed', e?.message ?? String(e))); }} disabled={state.isLoading} />
          {state.items.map((item) => (
            <View key={item.id} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.surfaceBorder }}>
              <Text style={{ color: colors.text, fontWeight: '500' }}>{item.id}</Text>
              <Text style={{ color: colors.bodyText }}>{JSON.stringify(item)}</Text>
            </View>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

export default FirebaseHelperScreen;


