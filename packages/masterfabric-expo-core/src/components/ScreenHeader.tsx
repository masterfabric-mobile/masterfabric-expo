import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../contexts/ThemeContext';
import { ScreenHeaderProps } from '../types';
import { ThemedText } from './ThemedText';

export function ScreenHeader({ 
  title, 
  subtitle, 
  onBackPress,
  showBackButton = true,
  showStageBadge = false
}: ScreenHeaderProps) {
  const colors = useThemeColors();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  // Stage badge logic (can be customized based on your needs)
  const shouldShowBadge = showStageBadge && __DEV__;

  return (
    <View style={[styles.header, { 
      backgroundColor: colors.headerBackground,
      borderBottomColor: colors.headerBorder,
    }]}>
      {showBackButton && (
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          {/* @ts-ignore */}
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </TouchableOpacity>
      )}
      
      <View style={[styles.headerContent, { marginLeft: showBackButton ? 8 : 0 }]}>
        <View style={styles.titleContainer}>
          <ThemedText style={[styles.headerTitle, { color: colors.text }]}>
            {title}
          </ThemedText>
          {shouldShowBadge && (
            <View style={[styles.stageBadge, { backgroundColor: colors.activeButton }]}>
              <ThemedText style={styles.stageBadgeText}>DEV</ThemedText>
            </View>
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
    borderBottomWidth: StyleSheet.hairlineWidth,
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
  stageBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  stageBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
