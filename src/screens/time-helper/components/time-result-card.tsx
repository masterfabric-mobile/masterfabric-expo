import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { TimeTestResult } from '../models/time-helper-models';
import { timeResultCardStyles } from '../styles/time-result-card.styles';

interface TimeResultCardProps {
  result: TimeTestResult;
}

/**
 * Time Result Card Component
 * Displays test results for time helper functions
 */
export function TimeResultCard({ result }: TimeResultCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView 
      style={[
        timeResultCardStyles.card,
        { 
          backgroundColor: colors.surfaceBackground,
          borderWidth: 1,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      {/* Header Section - Function Name and Success Badge */}
      <View style={timeResultCardStyles.header}>
        <ThemedText 
          type="defaultSemiBold" 
          style={[timeResultCardStyles.functionName, { color: colors.titleText }]}
        >
          {result.functionName}()
        </ThemedText>
        {result.success && (
          <View 
            style={[
              timeResultCardStyles.badge,
              { backgroundColor: colors.successColor + '20' }
            ]}
          >
            <ThemedText 
              style={[
                timeResultCardStyles.badgeText,
                { color: colors.successColor }
              ]}
            >
              {t('common.ok')}
            </ThemedText>
          </View>
        )}
      </View>

      {/* Description Section */}
      <ThemedText 
        style={[timeResultCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      {/* Input Section */}
      <View style={timeResultCardStyles.section}>
        <ThemedText 
          type="defaultSemiBold" 
          style={[timeResultCardStyles.sectionTitle, { color: colors.sectionTitle }]}
        >
          {t('helpers.timeHelper.input')}
        </ThemedText>
        <ThemedView 
          style={[
            {
              backgroundColor: colors.inputBackground,
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              borderRadius: 8,
              padding: 12,
              marginTop: 4,
            }
          ]}
        >
          <ThemedText 
            style={[timeResultCardStyles.sectionContent, { color: colors.bodyText }]}
            numberOfLines={10}
          >
            {result.input}
          </ThemedText>
        </ThemedView>
      </View>

      {/* Output Section */}
      <View style={timeResultCardStyles.section}>
        <ThemedText 
          type="defaultSemiBold" 
          style={[timeResultCardStyles.sectionTitle, { color: colors.sectionTitle }]}
        >
          {t('helpers.timeHelper.output')}
        </ThemedText>
        <ThemedView 
          style={[
            {
              backgroundColor: colors.inputBackground,
              borderWidth: 1,
              borderColor: colors.surfaceBorder,
              borderRadius: 8,
              padding: 12,
              marginTop: 4,
            }
          ]}
        >
          <ThemedText 
            style={[
              timeResultCardStyles.sectionContent, 
              { color: colors.bodyText }
            ]}
            numberOfLines={10}
          >
            {result.output}
          </ThemedText>
        </ThemedView>
      </View>
    </ThemedView>
  );
}
