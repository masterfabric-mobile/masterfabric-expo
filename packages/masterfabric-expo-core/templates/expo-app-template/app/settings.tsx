import {
    ScreenHeader,
    ThemeProvider,
    useMasterView,
    useThemeColors
} from 'masterfabric-expo-core';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Example Settings Screen using MasterView
function SettingsScreenContent() {
  const colors = useThemeColors();
  const { trackActivity, state } = useMasterView();

  React.useEffect(() => {
    trackActivity('settings_screen_opened');
  }, [trackActivity]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader 
        title="Settings"
        subtitle="Configure your app"
      />
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]}>
          MasterView Features
        </Text>
        
        <Text style={[styles.description, { color: colors.text }]}>
          This app is powered by MasterView architecture with:
        </Text>
        
        <Text style={[styles.feature, { color: colors.text }]}>
          ✅ Activity Tracking
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          ✅ Theme Support
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          ✅ Error Handling
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          ✅ Platform Detection
        </Text>
        <Text style={[styles.feature, { color: colors.text }]}>
          ✅ Accessibility Support
        </Text>
      </View>
    </View>
  );
}

export default function SettingsScreen() {
  return (
    <ThemeProvider>
      <SettingsScreenContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    lineHeight: 24,
  },
  feature: {
    fontSize: 16,
    marginBottom: 8,
  },
});
