import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSupabaseCasesViewModel } from '../hooks/use-supabase-cases-view-model';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';
import { AuthCaseView } from './auth-case-view';
import { CaseCard } from './case-card';
import { DatabaseFunctionsCaseView } from './database-functions-case-view';
import { EdgeFunctionsCaseView } from './edge-functions-case-view';
import { OrderViewCaseView } from './order-view-case-view';
import { PixelCanvasCaseView } from './pixel-canvas-case-view';
import { ProductListCaseView } from './product-list-case-view';
import { RealtimeChatCaseView } from './realtime-chat-case-view';
import { StorageCaseView } from './storage-case-view';

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
  {
    id: 'order-view',
    title: 'Order View',
    description: 'View detailed orders with items, totals, and status',
    icon: 'receipt',
    color: '#5856D6',
  },
  {
    id: 'pixel-canvas',
    title: 'Pixel Canvas',
    description: 'Collaborative pixel art game with real-time updates',
    icon: 'grid',
    color: '#FF6B6B',
  },
  {
    id: 'realtime-chat',
    title: 'Realtime Chat',
    description: 'Real-time messaging with Supabase Realtime',
    icon: 'chatbubbles',
    color: '#10B981',
  },
  {
    id: 'database-functions',
    title: 'Database Functions',
    description: 'PostgreSQL functions and stored procedures',
    icon: 'code',
    color: '#8B5CF6',
  },
  {
    id: 'storage',
    title: 'Storage',
    description: 'File upload and download with Supabase Storage',
    icon: 'cloud-upload',
    color: '#3B82F6',
  },
  {
    id: 'edge-functions',
    title: 'Edge Functions',
    description: 'Serverless functions with Supabase Edge Functions',
    icon: 'flash',
    color: '#F59E0B',
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
    if (state.selectedCase === 'order-view' && state.orders.length === 0 && !state.isLoadingOrders) {
      actions.fetchOrders();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedCase, state.products.length, state.isLoadingProducts, state.orders.length, state.isLoadingOrders]);

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

  if (state.selectedCase === 'order-view') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Order view example"
          variant="minimal"
        />
        <OrderViewCaseView
          orders={state.orders}
          isLoading={state.isLoadingOrders}
          error={state.lastError}
          onBack={() => actions.selectCase(null)}
          onRefresh={() => actions.fetchOrders()}
        />
      </SafeAreaView>
    );
  }

  if (state.selectedCase === 'pixel-canvas') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Pixel Canvas game"
          variant="minimal"
        />
        <PixelCanvasCaseView
          user={state.user}
          isConnected={state.isConnected}
          onBack={() => actions.selectCase(null)}
        />
      </SafeAreaView>
    );
  }

  if (state.selectedCase === 'realtime-chat') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Realtime Chat example"
          variant="minimal"
        />
        <RealtimeChatCaseView
          user={state.user}
          isConnected={state.isConnected}
          onBack={() => actions.selectCase(null)}
        />
      </SafeAreaView>
    );
  }

  if (state.selectedCase === 'database-functions') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Database Functions example"
          variant="minimal"
        />
        <DatabaseFunctionsCaseView
          user={state.user}
          isConnected={state.isConnected}
          onBack={() => actions.selectCase(null)}
        />
      </SafeAreaView>
    );
  }

  if (state.selectedCase === 'storage') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Storage example"
          variant="minimal"
        />
        <StorageCaseView
          user={state.user}
          isConnected={state.isConnected}
          onBack={() => actions.selectCase(null)}
        />
      </SafeAreaView>
    );
  }

  if (state.selectedCase === 'edge-functions') {
    return (
      <SafeAreaView
        style={[supabaseCasesScreenStyles.container, { backgroundColor: colors.background }]}
        edges={['top']}
      >
        <ScreenHeader
          title="Supabase Cases"
          subtitle="Edge Functions example"
          variant="minimal"
        />
        <EdgeFunctionsCaseView
          user={state.user}
          isConnected={state.isConnected}
          onBack={() => actions.selectCase(null)}
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
            <Text
              style={{
                color: colors.actionDescription,
                fontSize: 14,
                lineHeight: 20,
                marginBottom: 12,
              }}
            >
              This status indicator confirms that your application has successfully established a connection to the{' '}
              <Text style={{ color: supabaseGreen, fontWeight: '700', textDecorationLine: 'underline' }}>
                Supabase
              </Text>{' '}
              backend infrastructure. When connected, you can access all{' '}
              <Text style={{ color: supabaseGreen, fontWeight: '700' }}>Supabase</Text> services including{' '}
              <Text style={{ fontWeight: '600', textDecorationLine: 'underline' }}>authentication</Text>,{' '}
              <Text style={{ fontWeight: '600', textDecorationLine: 'underline' }}>database operations</Text>,{' '}
              <Text style={{ fontWeight: '600', textDecorationLine: 'underline' }}>real-time subscriptions</Text>,{' '}
              <Text style={{ fontWeight: '600', textDecorationLine: 'underline' }}>storage</Text>, and{' '}
              <Text style={{ fontWeight: '600', textDecorationLine: 'underline' }}>edge functions</Text>.
            </Text>
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

