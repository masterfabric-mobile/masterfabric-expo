import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';

SplashScreen.preventAutoHideAsync();

export default function App() {
  React.useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.emoji}>🍳</Text>
      <Text style={styles.appName}>Recipio</Text>
      <Text style={styles.subtitle}>Create Mobile App Session I</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 56,
    fontWeight: 'bold',
    color: '#000000',
    letterSpacing: 2,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    color: '#666666',
    fontWeight: '500',
    letterSpacing: 0.5,
    textAlign: 'center',
    marginTop: 8,
  },
});
