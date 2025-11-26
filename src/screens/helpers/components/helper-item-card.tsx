import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Platform, TouchableOpacity, View } from 'react-native';
import { HelperItem } from '../models/helpers-models';
import { helperItemCardStyles } from '../styles/helper-item-card.styles';

interface HelperItemCardProps {
  helper: HelperItem;
}

export function HelperItemCard({ helper }: HelperItemCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const handlePress = () => {
    if (helper.available && helper.route) {
      console.log(`Navigating to ${helper.route}`);
      router.push(helper.route as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!helper.available}
    >
      <ThemedView 
        style={[
          helperItemCardStyles.container,
          { 
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + '30',
            opacity: helper.available ? 1 : 0.6,
          }
        ]}
      >
        <View style={[
          helperItemCardStyles.iconContainer,
          { 
            backgroundColor: helper.color + '12',
          }
        ]}>
          <Ionicons 
            name={helper.icon as any} 
            size={24} 
            color={helper.color} 
          />
        </View>
        
        <View style={helperItemCardStyles.content}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[
              helperItemCardStyles.name,
              { 
                color: colors.text,
              }
            ]}
          >
            {helper.name}
          </ThemedText>
          
          <ThemedText 
            style={[
              helperItemCardStyles.description,
              { 
                color: colors.bodyText,
              }
            ]}
          >
            {helper.description}
          </ThemedText>

          {!helper.available && (
            <View style={helperItemCardStyles.comingSoonContainer}>
              <ThemedText 
                style={[
                  helperItemCardStyles.comingSoonText,
                  { color: '#FF9500' }
                ]}
              >
                {helper.id === 'ble-helper' && Platform.OS === 'web'
                  ? t('helpers.bleHelper.notAvailableOnWeb')
                  : t('helpers.comingSoon') || 'Coming Soon'}
              </ThemedText>
            </View>
          )}
        </View>

        <View style={helperItemCardStyles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={24} 
            color={colors.icon} 
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
