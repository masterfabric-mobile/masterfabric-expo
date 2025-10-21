import {
    ScreenHeader,
    ThemeProvider,
    useMasterView,
    useThemeColors
} from 'masterfabric-expo-core';
import React from 'react';
import { Alert, Button, StyleSheet, View } from 'react-native';

// Example MasterView implementation
function HomeScreenContent() {
  const colors = useThemeColors();
  const { trackActivity, captureException, captureMessage, addBreadcrumb } = useMasterView();

  React.useEffect(() => {
    trackActivity('home_screen_opened');
    
    // Add breadcrumb for Sentry
    addBreadcrumb({
      message: 'Home screen opened',
      category: 'navigation',
      level: 'info',
      data: { timestamp: new Date().toISOString() }
    });
  }, [trackActivity, addBreadcrumb]);

  const handleTestError = () => {
    try {
      // Simulate an error
      throw new Error('Test error for Sentry');
    } catch (error) {
      captureException(error as Error, {
        tags: { screen: 'home', action: 'test_error' },
        extra: { userId: '123', timestamp: new Date().toISOString() }
      });
      Alert.alert('Error', 'Test error captured by Sentry');
    }
  };

  const handleTestMessage = () => {
    captureMessage('Test message from home screen', 'info', {
      tags: { screen: 'home' },
      extra: { action: 'test_message' }
    });
    Alert.alert('Success', 'Test message sent to Sentry');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScreenHeader 
        title="Welcome to MasterView"
        subtitle="Your app is ready to go!"
      />
      
      <View style={styles.content}>
        <Button
          title="Test Sentry Error"
          onPress={handleTestError}
          color={colors.tint}
        />
        
        <View style={styles.buttonSpacer} />
        
        <Button
          title="Test Sentry Message"
          onPress={handleTestMessage}
          color={colors.tint}
        />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <ThemeProvider>
      <HomeScreenContent />
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
    justifyContent: 'center',
  },
  buttonSpacer: {
    height: 20,
  },
});
