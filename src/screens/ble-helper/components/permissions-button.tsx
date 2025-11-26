import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { permissionsButtonStyles } from '../styles/permissions-button.styles';

interface PermissionsButtonProps {
  hasPermissions: boolean;
  onRequestPermissions: () => Promise<boolean>;
}

/**
 * PermissionsButton Component
 * 
 * Button to request Bluetooth and Location permissions.
 * Shows permission status and allows requesting permissions.
 */
export function PermissionsButton({ 
  hasPermissions, 
  onRequestPermissions 
}: PermissionsButtonProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePress = async () => {
    setIsLoading(true);
    try {
      await onRequestPermissions();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemedView 
      style={[
        permissionsButtonStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <View style={permissionsButtonStyles.content}>
        <Ionicons 
          name={hasPermissions ? 'checkmark-circle' : 'alert-circle'} 
          size={24} 
          color={hasPermissions ? '#34C759' : '#FF9500'} 
        />
        <View style={permissionsButtonStyles.textContainer}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[permissionsButtonStyles.title, { color: colors.bodyText }]}
          >
            {t('helpers.bleHelper.permissions.title')}
          </ThemedText>
          <ThemedText 
            style={[permissionsButtonStyles.description, { color: colors.actionDescription }]}
          >
            {hasPermissions 
              ? t('helpers.bleHelper.permissions.granted')
              : t('helpers.bleHelper.permissions.required')
            }
          </ThemedText>
        </View>
      </View>

      {!hasPermissions && (
        <TouchableOpacity
          style={[
            permissionsButtonStyles.button,
            {
              backgroundColor: '#007AFF',
              opacity: isLoading ? 0.6 : 1,
            }
          ]}
          onPress={handlePress}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons name="lock-open" size={18} color="#FFFFFF" />
              <ThemedText style={permissionsButtonStyles.buttonText}>
                {t('helpers.bleHelper.permissions.request')}
              </ThemedText>
            </>
          )}
        </TouchableOpacity>
      )}
    </ThemedView>
  );
}

