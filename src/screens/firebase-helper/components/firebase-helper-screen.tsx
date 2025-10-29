import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
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
          <Text style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}>Firestore</Text>
          <Button title={state.isLoading ? 'Loading…' : 'Load items from collection "items"'} onPress={() => { actions.loadItems().catch((e: any) => Alert.alert('Failed to load items', e?.message ?? String(e))); }} disabled={state.isLoading} />
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


