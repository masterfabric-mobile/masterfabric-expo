import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { supabaseCasesScreenStyles } from '../styles/supabase-cases-screen.styles';

const supabaseGreen = '#3ECF8E';

interface AuthCaseViewProps {
  user: any | null;
  isConnected: boolean;
  onBack: () => void;
}

export function AuthCaseView({ user, isConnected, onBack }: AuthCaseViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ScrollView
      style={supabaseCasesScreenStyles.scrollView}
      contentContainerStyle={supabaseCasesScreenStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Header with back button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
        <TouchableOpacity
          onPress={onBack}
          style={{ marginRight: 12, padding: 8 }}
        >
          <Ionicons name="arrow-back" size={24} color={colors.bodyText} />
        </TouchableOpacity>
        <ThemedText
          type="subtitle"
          style={{ fontSize: 20, fontWeight: '700', color: colors.sectionTitle }}
        >
          Auth Case
        </ThemedText>
      </View>

      {/* Supabase Logo */}
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
          Authentication Status
        </ThemedText>
      </View>

      {/* Connection Status */}
      <View
        style={[
          supabaseCasesScreenStyles.card,
          {
            borderColor: isConnected ? supabaseGreen + '30' : colors.surfaceBorder,
            backgroundColor: colors.surfaceBackground,
          },
        ]}
      >
        <ThemedText
          style={{ color: colors.labelText, fontWeight: '600', marginBottom: 8 }}
        >
          Connection Status
        </ThemedText>
        <Text
          style={{
            color: colors.actionDescription,
            fontSize: 14,
            lineHeight: 20,
            marginBottom: 12,
          }}
        >
          This indicator shows whether your application has successfully established a connection to the{' '}
          <Text style={{ color: supabaseGreen, fontWeight: '700', textDecorationLine: 'underline' }}>
            Supabase
          </Text>{' '}
          backend service. A successful connection means that all{' '}
          <Text style={{ fontWeight: '600', textDecorationLine: 'underline' }}>authentication operations</Text>, including{' '}
          <Text style={{ fontWeight: '600' }}>sign-in</Text>,{' '}
          <Text style={{ fontWeight: '600' }}>sign-up</Text>, and{' '}
          <Text style={{ fontWeight: '600' }}>session management</Text>, are fully operational and ready to use.
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: isConnected ? supabaseGreen : '#ef4444',
            }}
          />
          <ThemedText
            style={[
              supabaseCasesScreenStyles.statusText,
              {
                color: isConnected ? supabaseGreen : '#ef4444',
                fontWeight: '600',
              },
            ]}
          >
            {isConnected ? '✓ Connected' : '✗ Not Connected'}
          </ThemedText>
        </View>
      </View>

      {/* User Information */}
      {isConnected && (
        <View
          style={[
            supabaseCasesScreenStyles.card,
            {
              borderColor: user ? supabaseGreen + '30' : colors.surfaceBorder,
              backgroundColor: colors.surfaceBackground,
            },
          ]}
        >
          <ThemedText
            style={{ color: colors.labelText, fontWeight: '600', marginBottom: 12 }}
          >
            Authentication Status
          </ThemedText>
          {user ? (
            <View style={{ gap: 12 }}>
              <View
                style={{
                  padding: 16,
                  borderRadius: 12,
                  backgroundColor: supabaseGreen + '15',
                  borderWidth: 1,
                  borderColor: supabaseGreen + '30',
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Ionicons name="checkmark-circle" size={20} color={supabaseGreen} />
                  <ThemedText
                    style={{
                      color: colors.bodyText,
                      fontSize: 16,
                      fontWeight: '600',
                    }}
                  >
                    Signed In
                  </ThemedText>
                </View>
                <View style={{ marginTop: 8, gap: 8 }}>
                  <View style={{ gap: 4 }}>
                    <ThemedText
                      style={{
                        color: colors.labelText,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      Email:
                    </ThemedText>
                    <ThemedText
                      style={{
                        color: colors.bodyText,
                        fontSize: 13,
                        fontFamily: 'monospace',
                      }}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {user.email || 'N/A'}
                    </ThemedText>
                  </View>
                  <View style={{ gap: 4 }}>
                    <ThemedText
                      style={{
                        color: colors.labelText,
                        fontSize: 13,
                        fontWeight: '600',
                      }}
                    >
                      User ID:
                    </ThemedText>
                    <ThemedText
                      style={{
                        color: colors.bodyText,
                        fontSize: 13,
                        fontFamily: 'monospace',
                      }}
                      numberOfLines={2}
                      ellipsizeMode="middle"
                    >
                      {user.id}
                    </ThemedText>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View
              style={{
                padding: 16,
                borderRadius: 12,
                backgroundColor: colors.inputBackground || colors.surfaceBackground,
                borderWidth: 1,
                borderColor: colors.surfaceBorder,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="information-circle-outline" size={20} color={colors.actionDescription} />
                <ThemedText
                  style={{
                    color: colors.actionDescription,
                    fontSize: 14,
                  }}
                >
                  Not signed in. Please sign in to see your authentication status.
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      )}

      {/* Info Card */}
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
          About This Case
        </ThemedText>
        <ThemedText
          style={{
            color: colors.actionDescription,
            fontSize: 14,
            lineHeight: 20,
          }}
        >
          This case demonstrates how to check authentication status and display signed-in user information using Supabase Auth. The authentication state is automatically updated when users sign in or out.
        </ThemedText>
      </View>
    </ScrollView>
  );
}

