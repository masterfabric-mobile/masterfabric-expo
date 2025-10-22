import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import { StringTestResult } from '../models/string-helper-models';
import { stringTestCardStyles } from '../styles/string-test-card.styles';

interface StringTestCardProps {
  result: StringTestResult;
}

export function StringTestCard({ result }: StringTestCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView 
      style={[
        stringTestCardStyles.container,
        { 
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <View style={stringTestCardStyles.header}>
        <ThemedText 
          type="defaultSemiBold" 
          style={[stringTestCardStyles.functionName, { color: colors.titleText }]}
        >
          {result.functionName}()
        </ThemedText>
      </View>

      <ThemedText 
        style={[stringTestCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={stringTestCardStyles.inputOutputContainer}>
        <View style={stringTestCardStyles.inputOutputGroup}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[stringTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.stringHelper.input')}
          </ThemedText>
          <ThemedView 
            style={[
              stringTestCardStyles.inputOutputBox,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText 
              style={[stringTestCardStyles.inputOutputText, { color: colors.bodyText }]}
            >
              {result.input}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={stringTestCardStyles.inputOutputGroup}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[stringTestCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.stringHelper.output')}
          </ThemedText>
          <ThemedView 
            style={[
              stringTestCardStyles.inputOutputBox,
              { 
                backgroundColor: colors.successBackground || colors.inputBackground,
                borderColor: colors.successBorder || colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText 
              style={[
                stringTestCardStyles.inputOutputText, 
                { color: colors.successText || colors.bodyText }
              ]}
            >
              {result.output}
            </ThemedText>
          </ThemedView>
        </View>
      </View>
    </ThemedView>
  );
}
