import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { TouchableOpacity, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { supabaseSectionStyles } from '../../styles/supabase-section.styles';
import { SupabaseAction } from '../../utils';

interface SupabaseSectionProps {
  supabaseActions: SupabaseAction[];
  supabaseUser: any | null;
  supabaseConnected: boolean;
  onActionPress: (actionId: string, actionTitle: string) => void;
}

export function SupabaseSection({ 
  supabaseActions, 
  supabaseUser,
  supabaseConnected,
  onActionPress
}: SupabaseSectionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  // Supabase green color
  const supabaseGreen = '#3ECF8E';

  // Pulse animation for connection status dot
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  useEffect(() => {
    if (supabaseConnected) {
      pulseScale.value = withRepeat(
        withTiming(2, {
          duration: 1500,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false
      );
      pulseOpacity.value = withRepeat(
        withTiming(0, {
          duration: 1500,
          easing: Easing.out(Easing.ease),
        }),
        -1,
        false
      );
    } else {
      pulseScale.value = 1;
      pulseOpacity.value = 0.5;
    }
  }, [supabaseConnected, pulseScale, pulseOpacity]);

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const dotColor = supabaseConnected ? supabaseGreen : '#ef4444';

  return (
    <View style={supabaseSectionStyles.section}>
      <View style={supabaseSectionStyles.header}>
        <View style={supabaseSectionStyles.logoTitleRow}>
          <Image
            source={require('@/src/assets/images/supabase-logo-icon.svg')}
            style={supabaseSectionStyles.logo}
            contentFit="contain"
          />
          <View style={supabaseSectionStyles.titleRow}>
            <ThemedText 
              type="subtitle" 
              style={[
                supabaseSectionStyles.sectionTitle,
                { color: colors.sectionTitle }
              ]}
            >
              {t('home.supabase.title')}
            </ThemedText>
            <View style={supabaseSectionStyles.statusDotContainer}>
              <View style={[supabaseSectionStyles.statusDot, { backgroundColor: dotColor }]} />
              {supabaseConnected && (
                <Animated.View 
                  style={[
                    supabaseSectionStyles.statusDotPulse,
                    { backgroundColor: dotColor },
                    pulseAnimatedStyle
                  ]} 
                />
              )}
            </View>
          </View>
        </View>
        <View style={supabaseSectionStyles.headerText}>
          <ThemedText 
            style={[
              supabaseSectionStyles.sectionDescription,
              { color: colors.actionDescription }
            ]}
          >
            {t('home.supabase.description')}
          </ThemedText>
          {supabaseUser && (
            <View style={[supabaseSectionStyles.signedInCard, { backgroundColor: supabaseGreen + '15', borderColor: supabaseGreen + '30' }]}>
              <View style={supabaseSectionStyles.signedInRow}>
                <Ionicons name="checkmark-circle" size={16} color={supabaseGreen} />
                <ThemedText style={[supabaseSectionStyles.signedInText, { color: colors.bodyText }]}>
                  Signed in as: {supabaseUser.email || supabaseUser.id}
                </ThemedText>
              </View>
            </View>
          )}
        </View>
      </View>
      
      <View style={supabaseSectionStyles.actionsList}>
        {supabaseActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => onActionPress(action.id, action.title)}
            activeOpacity={0.8}
          >
            <View 
              style={[
                supabaseSectionStyles.actionCard,
                { 
                  backgroundColor: colors.surfaceBackground,
                  borderColor: supabaseGreen + '30',
                  borderWidth: 1.5,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }
              ]}
            >
              <View style={[
                supabaseSectionStyles.actionIcon,
                { 
                  backgroundColor: supabaseGreen + '15',
                  borderWidth: 1,
                  borderColor: supabaseGreen + '25',
                } 
              ]}>
                {action.iconType === 'icon' && action.iconName ? (
                  <Ionicons 
                    name={action.iconName as any} 
                    size={24} 
                    color={supabaseGreen} 
                  />
                ) : action.iconType === 'image' && action.icon ? (
                  <Image
                    source={action.icon}
                    style={supabaseSectionStyles.iconImage}
                    contentFit="contain"
                  />
                ) : (
                  <ThemedText 
                    style={[
                      supabaseSectionStyles.iconText,
                      { color: supabaseGreen }
                    ]}
                  >
                    {action.iconText || '⚡'}
                  </ThemedText>
                )}
              </View>
              
              <View style={supabaseSectionStyles.actionContent}>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[
                    supabaseSectionStyles.actionTitle,
                    { 
                      color: colors.bodyText,
                      fontSize: 17,
                      fontWeight: '700'
                    }
                  ]}
                >
                  {action.title}
                </ThemedText>
                
                <ThemedText 
                  style={[
                    supabaseSectionStyles.actionDescription,
                    { 
                      color: colors.actionDescription,
                      fontSize: 15,
                      lineHeight: 20
                    }
                  ]}
                >
                  {action.description}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={supabaseSectionStyles.footer}>
        <ThemedText 
          style={[
            supabaseSectionStyles.footerParagraph,
            { color: colors.actionDescription }
          ]}
        >
          {t('home.supabase.footer.paragraph')}
        </ThemedText>
        <ThemedText 
          style={[
            supabaseSectionStyles.footerSlogan,
            { color: supabaseGreen }
          ]}
        >
          {t('home.supabase.footer.slogan')}
        </ThemedText>
      </View>
    </View>
  );
}

