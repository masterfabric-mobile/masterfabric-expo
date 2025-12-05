import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseCasesViewModel } from '../hooks/use-supabase-cases-view-model';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';
import { AuthCaseView } from './auth-case-view';
import { CaseCard } from './case-card';
import { ProductListCaseView } from './product-list-case-view';

const supabaseGreen = '#3ECF8E';

const cases = [
  {
    id: 'auth',
    title: 'Auth',
    description: 'Check authentication status and see who is signed in',
    icon: 'lock-closed',
    color: supabaseGreen,
  },
  {
    id: 'product-list',
    title: 'Product List',
    description: 'Display products in a card grid layout',
    icon: 'cube',
    color: '#007AFF',
  },
];

export function SupabaseCasesScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { state, actions } = useSupabaseCasesViewModel();

  useEffect(() => {
    if (state.selectedCase === 'product-list' && state.products.length === 0 && !state.isLoadingProducts) {
      actions.fetchProducts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedCase, state.products.length, state.isLoadingProducts]);

  // Show case detail views
  if (state.selectedCase === 'auth') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Authentication example"
          variant="minimal"
        />
        <AuthCaseView
          user={state.user}
          isConnected={state.isConnected}
          onBack={() => actions.selectCase(null)}
        />
      </SafeAreaView>
    );
  }

  if (state.selectedCase === 'product-list') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Product list example"
          variant="minimal"
        />
        <ProductListCaseView
          products={state.products}
          isLoading={state.isLoadingProducts}
          error={state.lastError}
          onBack={() => actions.selectCase(null)}
          onRefresh={() => actions.fetchProducts()}
        />
      </SafeAreaView>
    );
  }

  // Main cases list view
  return (
    <SafeAreaView
      style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title="Supabase Cases"
        subtitle="Example use cases and implementations"
        variant="minimal"
      />
      <ScrollView
        style={supabaseCasesScreenStyles.scrollView}
        contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Supabase Logo Header */}
        <View style={supabaseCasesScreenStyles.logoContainer}>
          <Image
            source={require('@/src/assets/images/supabase-logo-icon.svg')}
            style={supabaseCasesScreenStyles.logo}
            contentFit="contain"
          />
          <ThemedText
            style={[
              supabaseCasesScreenStyles.logoTitle,
              { color: colors.sectionTitle },
            ]}
          >
            Supabase
          </ThemedText>
          <ThemedText
            style={[
              supabaseCasesScreenStyles.logoSubtitle,
              { color: colors.actionDescription },
            ]}
          >
            Cases
          </ThemedText>
        </View>

        {/* Status Card */}
        {!state.isReady ? (
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: colors.surfaceBorder,
                backgroundColor: colors.surfaceBackground,
              },
            ]}
          >
            <ThemedText
              style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}
            >
              Status
            </ThemedText>
            <ActivityIndicator size="small" color={supabaseGreen} />
            <ThemedText
              style={[
                supabaseCasesScreenStyles.statusText,
                { color: colors.bodyText },
              ]}
            >
              Initializing...
            </ThemedText>
          </View>
        ) : !state.isConnected ? (
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: colors.surfaceBorder,
                backgroundColor: colors.surfaceBackground,
              },
            ]}
          >
            <ThemedText
              style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}
            >
              Status
            </ThemedText>
            <ThemedText style={{ color: colors.bodyText }}>
              Not connected. Enable Supabase in initMasterView config and set Expo env vars in your .env (EXPO_PUBLIC_SUPABASE_*).
            </ThemedText>
          </View>
        ) : (
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: supabaseGreen + '30',
                backgroundColor: colors.surfaceBackground,
              },
            ]}
          >
            <ThemedText
              style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}
            >
              Status
            </ThemedText>
            <ThemedText
              style={[
                supabaseCasesScreenStyles.statusText,
                {
                  color: supabaseGreen,
                  fontWeight: '600',
                },
              ]}
            >
              ✓ Connected
            </ThemedText>
          </View>
        )}

        {/* Error Display */}
        {state.lastError && (
          <View
            style={[
              supabaseCasesScreenStyles.card,
              {
                borderColor: '#ef4444',
                backgroundColor: '#ef444410',
              },
            ]}
          >
            <ThemedText
              style={{ color: '#ef4444', fontWeight: '600', marginBottom: 4 }}
            >
              Error
            </ThemedText>
            <ThemedText style={{ color: '#ef4444', fontSize: 14 }}>
              {state.lastError}
            </ThemedText>
          </View>
        )}

        {/* Cases List */}
        <View>
          <ThemedText
            style={[
              supabaseCasesScreenStyles.sectionTitle,
              { color: colors.sectionTitle },
            ]}
          >
            Available Cases
          </ThemedText>
          <View style={supabaseCasesScreenStyles.casesList}>
            {cases.map((caseItem) => (
              <CaseCard
                key={caseItem.id}
                id={caseItem.id}
                title={caseItem.title}
                description={caseItem.description}
                icon={caseItem.icon}
                color={caseItem.color}
                onPress={actions.selectCase}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

