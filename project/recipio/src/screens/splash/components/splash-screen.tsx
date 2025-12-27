import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSplashNavigation } from '../hooks/use-splash-navigation';
import { splashScreenStyles } from '../styles/splash-screen.styles';

export function SplashScreen() {
  useSplashNavigation();

  return (
    <SafeAreaView style={splashScreenStyles.container}>
      <View style={splashScreenStyles.content}>
        <Text style={splashScreenStyles.title}>Recipio</Text>
        <Text style={splashScreenStyles.subtitle}>
          Find recipes based on your ingredients
        </Text>
        <ActivityIndicator size="large" color="#FF6B35" style={splashScreenStyles.loader} />
      </View>
    </SafeAreaView>
  );
}

