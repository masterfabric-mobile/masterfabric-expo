import { StageBadge } from '@/src/shared/components/StageBadge';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

// Import package.json to check stage
const packageInfo = require('@/package.json');

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  showStageBadge?: boolean;
}

export function ScreenHeader({ 
  title, 
  subtitle, 
  onBackPress,
  showBackButton = true,
  showStageBadge = false
}: ScreenHeaderProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const stage = packageInfo.stage || 'development';
  const shouldShowBadge = showStageBadge && (stage === 'development' || stage === 'debug' || stage === 'dev');

  return (
    <View style={[styles.header, { 
      backgroundColor: colors.headerBackground,
      borderBottomColor: colors.headerBorder,
      borderBottomWidth: StyleSheet.hairlineWidth,
    }]}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel={t('common.back')}
        >
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
      
      <View style={[styles.headerContent, { marginLeft: showBackButton ? 8 : 0 }]}>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: colors.text }]}>
            {title}
          </ThemedText>
          {shouldShowBadge && (
            <StageBadge type="text" />
          )}
        </View>
        {subtitle && (
          <ThemedText style={[styles.headerSubtitle, { color: colors.icon }]}>
            {subtitle}
          </ThemedText>
        )}
      </View>
      
      {showBackButton && <View style={styles.headerSpacer} />}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 1,
  },
  headerSubtitle: {
    fontSize: 12,
    opacity: 0.7,
  },
  headerSpacer: {
    width: 32,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
