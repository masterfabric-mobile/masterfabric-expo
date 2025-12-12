import { Button } from '@/src/shared/components/button';
import { useSnackbar } from '@/src/shared/hooks/use-snackbar';
import { t } from '@/src/shared/i18n';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Clipboard, View } from 'react-native';
import { UrlResultCardProps } from '../models/url-launcher-helper-models';
import { urlResultCardStyles } from '../styles/url-result-card.styles';
import { buildCopyText, formatTimestamp } from '../utils';

export function UrlResultCard({ 
  result, 
  showTimestamp = false,
  onReLaunch,
  showActions = false,
}: UrlResultCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const snackbar = useSnackbar();

  const handleCopy = async () => {
    try {
      const textToCopy = buildCopyText(result);
      Clipboard.setString(textToCopy);
      snackbar.success(t('helpers.urlLauncherHelper.historyCopied'));
    } catch (error) {
      console.error('Copy error:', error);
      snackbar.error(t('helpers.urlLauncherHelper.copyError'));
    }
  };

  const handleReLaunch = () => {
    if (onReLaunch) {
      onReLaunch(result);
    }
  };

  return (
    <ThemedView 
      style={[
        urlResultCardStyles.container,
        { 
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '25',
        }
      ]}
    >
      <View style={urlResultCardStyles.header}>
        <ThemedText 
          type="defaultSemiBold" 
          style={[urlResultCardStyles.functionName, { color: colors.titleText }]}
        >
          {t(`helpers.urlLauncherHelper.functionNames.${result.functionName}`, { defaultValue: result.functionName })}
        </ThemedText>
        <View
          style={[
            urlResultCardStyles.successBadge,
            {
              backgroundColor: result.success 
                ? (colors.successBackground || '#34C75920')
                : (colors.errorColor ? `${colors.errorColor}20` : '#FF3B3020'),
            }
          ]}
        >
          <ThemedText
            style={[
              urlResultCardStyles.successBadge,
              {
                color: result.success 
                  ? (colors.successText || '#34C759')
                  : (colors.errorColor || '#FF3B30'),
              }
            ]}
          >
            {result.success ? '✓' : '✗'}
          </ThemedText>
        </View>
      </View>

      <ThemedText 
        style={[urlResultCardStyles.description, { color: colors.bodyText }]}
      >
        {result.description}
      </ThemedText>

      <View style={urlResultCardStyles.inputOutputContainer}>
        <View style={urlResultCardStyles.inputOutputGroup}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[urlResultCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.urlLauncherHelper.input')}
          </ThemedText>
          <ThemedView 
            style={[
              urlResultCardStyles.inputOutputBox,
              { 
                backgroundColor: colors.inputBackground,
                borderColor: colors.surfaceBorder,
              }
            ]}
          >
            <ThemedText 
              style={[urlResultCardStyles.inputOutputText, { color: colors.bodyText }]}
            >
              {result.input || '-'}
            </ThemedText>
          </ThemedView>
        </View>

        <View style={urlResultCardStyles.inputOutputGroup}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[urlResultCardStyles.label, { color: colors.sectionTitle }]}
          >
            {t('helpers.urlLauncherHelper.output')}
          </ThemedText>
          <ThemedView 
            style={[
              urlResultCardStyles.inputOutputBox,
              { 
                backgroundColor: result.success 
                  ? (colors.successBackground || colors.inputBackground)
                  : (colors.inputBackground),
                borderColor: result.success 
                  ? (colors.successBorder || colors.surfaceBorder)
                  : (colors.errorColor || colors.surfaceBorder),
              }
            ]}
          >
            <ThemedText 
              style={[
                urlResultCardStyles.inputOutputText, 
                { 
                  color: result.success
                    ? (colors.successText || colors.bodyText)
                    : (colors.errorColor || colors.bodyText)
                }
              ]}
            >
              {result.output}
            </ThemedText>
          </ThemedView>
        </View>
      </View>

      <View style={urlResultCardStyles.footer}>
        {showTimestamp && (
          <ThemedText 
            style={[urlResultCardStyles.timestamp, { color: colors.bodyText }]}
          >
            {formatTimestamp(result.timestamp)}
          </ThemedText>
        )}
        
        {showActions && (
          <View style={urlResultCardStyles.actions}>
            <Button
              title={t('helpers.urlLauncherHelper.historyCopy')}
              onPress={handleCopy}
              variant="outline"
              size="small"
              style={[
                urlResultCardStyles.actionButton,
                {
                  backgroundColor: colors.inputBackground,
                  borderColor: colors.surfaceBorder,
                  borderWidth: 1,
                },
              ] as any}
              textStyle={{ color: colors.bodyText }}
            />
            {onReLaunch && (
              <Button
                title={t('helpers.urlLauncherHelper.historyReLaunch')}
                onPress={handleReLaunch}
                variant="primary"
                size="small"
                style={urlResultCardStyles.actionButton}
              />
            )}
          </View>
        )}
      </View>
    </ThemedView>
  );
}

