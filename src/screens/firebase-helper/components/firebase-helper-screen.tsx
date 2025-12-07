import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import { t } from '@/src/shared/i18n';
import { firebaseIntegration, getThemeColors, Sizing, typographyHelper, useTheme } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Button, Modal, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFirebaseHelperViewModel } from '../hooks/use-firebase-helper-view-model';
import { firebaseHelperScreenStyles } from '../styles/firebase-helper-screen.styles';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export function FirebaseHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const { state, actions } = useFirebaseHelperViewModel();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetTitle, setSheetTitle] = useState<string>('Working...');
  const [sheetDesc, setSheetDesc] = useState<string>('Please wait while we complete the action');
  const [firestoreConnected, setFirestoreConnected] = useState(false);
  const [signInModalVisible, setSignInModalVisible] = useState(false);
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [signInError, setSignInError] = useState('');
  const [signInLoading, setSignInLoading] = useState(false);

  useEffect(() => {
    // Initialize once on mount
    console.log('[FirebaseHelper] Screen mounted, initializing...');
    actions.refreshStatus();
    const unsub = actions.subscribeAuth();
    
    return () => {
      if (unsub) {
        console.log('[FirebaseHelper] Screen unmounting, cleaning up auth listener');
        unsub();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const envRows = [
    { key: 'EXPO_PUBLIC_FIREBASE_API_KEY', label: 'API Key', icon: 'lock' },
    { key: 'EXPO_PUBLIC_FIREBASE_PROJECT_ID', label: 'Project ID', icon: 'number' },
    { key: 'EXPO_PUBLIC_FIREBASE_APP_ID', label: 'App ID', icon: 'info.circle' },
    { key: 'EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN', label: 'Auth Domain', icon: 'globe' },
    { key: 'EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET', label: 'Storage Bucket', icon: 'archivebox' },
    { key: 'EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID', label: 'Sender ID', icon: 'envelope' },
    { key: 'EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID', label: 'Measurement ID', icon: 'ruler' },
  ];

  async function handleFirestoreCheck() {
    setSheetTitle('Checking'); setSheetDesc('Connecting to Firestore...'); setSheetVisible(true);
    setSignInError('');
    try {
      const auth = firebaseIntegration.getAuth();
      if (auth && !auth.currentUser) {
        const { signInAnonymously } = require('firebase/auth');
        try { await signInAnonymously(auth); }
        catch (_e) {
          setSheetVisible(false);
          setSignInModalVisible(true);
          return;
        }
      }
      const db = firebaseIntegration.getFirestore();
      if (!db) throw new Error('No DB');
      const { collection, getDocs } = require('firebase/firestore');
      await Promise.race([
        getDocs(collection(db, 'items')),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 8000)),
      ]);
      setFirestoreConnected(true);
      setSheetVisible(false);
      Alert.alert('Firestore Connected');
    } catch (e) {
      setFirestoreConnected(false);
      setSheetVisible(false);
      Alert.alert('No connection', (e as any)?.message || e?.toString() || String(e));
    }
  }

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
        {/* Status card */}
        {(() => { try { return !state.isReady; } catch { return true; } })() ? (
          <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
            <Text style={[{ color: colors.labelText, marginBottom: Sizing.spacing.s }, getTypographyStyle('m', 'semibold', 'normal')]}>Firebase status</Text>
            <Text style={[{ color: colors.bodyText, marginBottom: Sizing.spacing.s }, getTypographyStyle('s', 'normal', 'normal')]}>
              Not initialized. Enable Firebase in initMasterView config and set Expo env vars in your .env (EXPO_PUBLIC_FIREBASE_*).
            </Text>
            <Text style={[{ color: colors.bodyText, marginBottom: Sizing.spacing.s }, getTypographyStyle('s', 'normal', 'normal')]}>Required: API_KEY, PROJECT_ID, APP_ID</Text>
            <Button title="Refresh" onPress={actions.refreshStatus} />
          </View>
        ) : null}
        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={[{ color: colors.labelText }, getTypographyStyle('m', 'semibold', 'normal')]}>Environment</Text>
          <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Ready: {String(state.isReady)} | Auth: {String(state.authAvailable)}</Text>
          <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Project: {firebaseIntegration.getConfig()?.projectId ?? '-'}</Text>
          {state.lastError ? (<Text style={{ color: colors.errorColor ?? '#ef4444' }}>Last error: {state.lastError}</Text>) : null}
        </View>
        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>  
          <Text style={[{ color: colors.labelText, marginBottom: Sizing.spacing.s }, getTypographyStyle('m', 'semibold', 'normal')]}>Firebase Env Config (.env)</Text>
          {envRows.map(({ key, label, icon }) => (
            <View key={key} style={{ marginBottom: Sizing.spacing.m }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconSymbol name={icon} color={colors.labelText} size={Sizing.icon.s} style={{ marginRight: Sizing.spacing.s }} />
                <Text style={[{ color: colors.bodyText }, getTypographyStyle('xs', 'medium', 'normal')]}>{key}</Text>
              </View>
              <Text style={[{ color: colors.bodyText, marginTop: Sizing.spacing.xxs }, getTypographyStyle('s', 'normal', 'normal')]} selectable>{String((process.env as any)[key] ?? 'not set')}</Text>
            </View>
          ))}
        </View>
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
              setSheetTitle('Signing in'); setSheetDesc('Authenticating with Firebase...'); setSheetVisible(true);
              try { await actions.signIn(); setSheetVisible(false); Alert.alert('Success', 'Signed in'); } catch (e: any) { setSheetVisible(false); Alert.alert('Sign-in failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading || !state.authAvailable || !state.email.trim() || !state.password.trim()} />
            <Button title={state.isLoading ? 'Signing out…' : 'Sign Out'} color="#b91c1c" onPress={async () => {
              setSheetTitle('Signing out'); setSheetDesc('Closing your session...'); setSheetVisible(true);
              try { await actions.signOut(); setSheetVisible(false); Alert.alert('Success', 'Signed out'); } catch (e: any) { setSheetVisible(false); Alert.alert('Sign-out failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading || !state.authAvailable} />
            <Button title={state.isLoading ? 'Creating…' : 'Sign Up (email/password)'} onPress={async () => {
              setSheetTitle('Creating account'); setSheetDesc('Registering your credentials...'); setSheetVisible(true);
              try { 
                await actions.signUpWithEmail(); 
                setSheetVisible(false); 
                Alert.alert('Success', 'Account created'); 
              } catch (e: any) { 
                setSheetVisible(false); 
                const errorMsg = e?.message || e?.toString() || 'Unknown error occurred';
                console.error('[FirebaseHelper] Sign-up error:', errorMsg);
                Alert.alert('Sign-up failed', errorMsg); 
              }
            }} disabled={state.isLoading || !state.authAvailable || !state.email.trim() || !state.password.trim()} />
            <Button title={state.isLoading ? 'Signing…' : 'Sign In Anonymously'} onPress={async () => {
              setSheetTitle('Signing in'); setSheetDesc('Starting anonymous session...'); setSheetVisible(true);
              try { await actions.signInAnonymously(); setSheetVisible(false); Alert.alert('Success', 'Signed in anonymously'); } catch (e: any) { setSheetVisible(false); Alert.alert('Anonymous sign-in failed', e?.message ?? String(e)); }
            }} disabled={state.isLoading || !state.authAvailable} />
          </View>
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={[{ color: colors.labelText, marginBottom: Sizing.spacing.s }, getTypographyStyle('m', 'semibold', 'normal')]}>Forgot Password</Text>
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
            onChangeText={actions.setEmail}
          />
          <Button title="Send Password Reset Email" onPress={async () => {
            setSheetTitle('Sending Email'); setSheetDesc('Please wait...'); setSheetVisible(true);
            try { 
              await actions.sendPasswordReset(state.email); 
              setSheetVisible(false); 
              Alert.alert('Success', 'Password reset email sent'); 
            } catch (e: any) { 
              setSheetVisible(false); 
              Alert.alert('Error', e?.message ?? String(e)); 
            }
          }} />
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={[{ color: colors.labelText }, getTypographyStyle('m', 'semibold', 'normal')]}>Auth User ID</Text>
          <Text style={[{ color: colors.text }, getTypographyStyle('s', 'normal', 'normal')]}>{state.authUserId ?? '-'}</Text>
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={[{ color: colors.labelText }, getTypographyStyle('m', 'semibold', 'normal')]}>Analytics</Text>
          <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Web-only with Firebase Web SDK</Text>
          <Button title="Log Demo Event" onPress={() => { setSheetTitle('Logging event'); setSheetDesc('Sending analytics event...'); setSheetVisible(true); try { actions.logDemoEvent(); setSheetVisible(false); Alert.alert('Analytics', 'Event logged (if supported)'); } catch (e: any) { setSheetVisible(false); Alert.alert('Analytics failed', e?.message ?? String(e)); } }} disabled={!state.canUseAnalytics} />
        </View>

        <View style={[firebaseHelperScreenStyles.card, { borderColor: colors.surfaceBorder, backgroundColor: colors.surfaceBackground }]}>
          <Text style={[{ color: colors.labelText, marginBottom: Sizing.spacing.s }, getTypographyStyle('m', 'semibold', 'normal')]}>Social Sign-in</Text>
          <Button title={state.isLoading ? 'Google Popup…' : 'Sign in with Google (Web Popup)'} onPress={() => { actions.signInWithGoogleWeb().catch((e: any) => Alert.alert('Google sign-in failed', e?.message ?? String(e))); }} disabled={state.isLoading} />
          <View style={{ height: Sizing.spacing.s }} />
          <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Google ID Token</Text>
          <TextInput
            value={state.googleIdToken}
            onChangeText={actions.setGoogleIdToken}
            placeholder="Paste Google ID token"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Google Access Token (optional)</Text>
          <TextInput
            value={state.googleAccessToken}
            onChangeText={actions.setGoogleAccessToken}
            placeholder="Paste Google access token (optional)"
            placeholderTextColor={colors.placeholderText}
            style={[firebaseHelperScreenStyles.input, { color: colors.text, backgroundColor: colors.inputBackground, borderColor: colors.surfaceBorder }]}
          />
          <Button title={state.isLoading ? 'Signing…' : 'Sign in with Google tokens'} onPress={() => { actions.signInWithGoogleTokens().then(() => Alert.alert('Signed in with Google')).catch((e: any) => Alert.alert('Google token sign-in failed', e?.message ?? String(e))); }} disabled={state.isLoading} />
          <View style={{ height: Sizing.spacing.s }} />
          <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Apple ID Token</Text>
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
          <Text style={[{ color: colors.labelText, marginBottom: Sizing.spacing.s }, getTypographyStyle('m', 'semibold', 'normal')]}>Firestore</Text>
          <Button
            title={firestoreConnected ? "✓ Firestore Connected" : "Check Firestore Connection"}
            onPress={handleFirestoreCheck}
            color={firestoreConnected ? colors.successColor ?? '#22c55e' : undefined}
          />
          <View style={{ height: Sizing.spacing.s }} />
          <Button title={state.isLoading ? 'Loading…' : 'Load items from collection "items"'} onPress={async () => { setSheetTitle('Loading data'); setSheetDesc('Fetching Firestore items...'); setSheetVisible(true); try { await actions.loadItems(); setSheetVisible(false); Alert.alert('Success', 'Loaded items'); } catch (e: any) { setSheetVisible(false); Alert.alert('Failed to load items', e?.message ?? String(e)); } }} disabled={state.isLoading || !firestoreConnected} />
          <View style={{ height: Sizing.spacing.s }} />
          <Button title={state.isLoading ? 'Adding…' : 'Create sample item'} onPress={async () => { setSheetTitle('Creating item'); setSheetDesc('Writing to Firestore...'); setSheetVisible(true); try { await actions.createSampleItem(); setSheetVisible(false); Alert.alert('Success', 'Item created'); } catch (e: any) { setSheetVisible(false); Alert.alert('Create failed', e?.message ?? String(e)); } }} disabled={state.isLoading || !firestoreConnected} />
          <View style={{ marginTop: Sizing.spacing.s }}>
            <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>Session write count: {state.writeCount}</Text>
          </View>
          {state.items.map((item) => (
            <View key={item.id} style={{ paddingVertical: Sizing.padding.s, borderBottomWidth: Sizing.borderWidth.s, borderBottomColor: colors.surfaceBorder }}>
              <Text style={[{ color: colors.text }, getTypographyStyle('s', 'medium', 'normal')]}>{item.id}</Text>
              <Text style={[{ color: colors.bodyText }, getTypographyStyle('s', 'normal', 'normal')]}>{JSON.stringify(item)}</Text>
            </View>
          ))}
        </View>

      </ScrollView>

      {/* Bottom sheet modal */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View style={{ backgroundColor: colors.surfaceBackground, borderTopLeftRadius: Sizing.card.borderRadius.m, borderTopRightRadius: Sizing.card.borderRadius.m, padding: Sizing.padding.m, borderColor: colors.surfaceBorder, borderWidth: Sizing.borderWidth.s }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Sizing.spacing.s }}>
              <Text style={[{ color: colors.labelText }, getTypographyStyle('m', 'semibold', 'normal')]}>{sheetTitle}</Text>
              <Button title="Cancel" onPress={() => setSheetVisible(false)} />
            </View>
            <Text style={[{ color: colors.bodyText, marginBottom: Sizing.spacing.m }, getTypographyStyle('s', 'normal', 'normal')]}>{sheetDesc}</Text>
            <ActivityIndicator size="small" color={colors.tint} />
          </View>
        </View>
      </Modal>

      <Modal visible={signInModalVisible} transparent animationType="fade" onRequestClose={() => setSignInModalVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.2)' }}>
          <View style={{ backgroundColor: colors.surfaceBackground, padding: Sizing.padding.l, borderRadius: Sizing.card.borderRadius.m, minWidth: 300, maxWidth: 340 }}>
            <Text style={[{ marginBottom: Sizing.spacing.s, color: colors.labelText }, getTypographyStyle('l', 'semibold', 'normal')]}>Sign in required for Firestore</Text>
            <TextInput placeholder="Email"
              value={signInEmail}
              onChangeText={setSignInEmail}
              style={{ padding: Sizing.padding.s, marginBottom: Sizing.spacing.m, borderWidth: Sizing.borderWidth.s, borderColor: colors.surfaceBorder, borderRadius: Sizing.borderRadius.small, backgroundColor: colors.inputBackground, color: colors.text }}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <TextInput placeholder="Password"
              value={signInPassword}
              onChangeText={setSignInPassword}
              style={{ padding: Sizing.padding.s, marginBottom: Sizing.spacing.m, borderWidth: Sizing.borderWidth.s, borderColor: colors.surfaceBorder, borderRadius: Sizing.borderRadius.small, backgroundColor: colors.inputBackground, color: colors.text }}
              secureTextEntry
            />
            {signInError ? <Text style={[{ color: colors.errorColor ?? '#ef4444', marginBottom: Sizing.spacing.s }, getTypographyStyle('s', 'normal', 'normal')]}>{signInError}</Text> : null}
            <Button
              title={signInLoading ? 'Signing in...' : 'Sign in and continue'}
              onPress={async () => {
                setSignInLoading(true);
                setSignInError('');
                try {
                  await firebaseIntegration.signInWithEmail(signInEmail.trim(), signInPassword);
                  setSignInModalVisible(false);
                  setSignInLoading(false);
                  setSignInEmail('');
                  setSignInPassword('');
                  // Rerun connection test as signed-in user
                  setTimeout(() => {
                    handleFirestoreCheck();
                  }, 350);
                } catch (err) {
                  setSignInError((err as any)?.message || err?.toString() || String(err));
                  setSignInLoading(false);
                }
              }}
              disabled={signInLoading || !signInEmail || !signInPassword}
            />
            <View style={{ height: Sizing.spacing.s }} />
            <Button title="Cancel" color="#888" onPress={() => { setSignInModalVisible(false); setSignInError(''); setSignInEmail(''); setSignInPassword(''); }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

export default FirebaseHelperScreen;


