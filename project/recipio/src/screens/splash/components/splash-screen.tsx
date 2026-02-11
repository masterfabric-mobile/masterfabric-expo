import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ThemedText } from '@masterfabric-expo/core';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RecipioColors } from '../../../shared/constants/recipio-colors';
import { splashScreenStyles } from '../styles/splash-screen.styles';

export function SplashScreen() {
  return (
    <SafeAreaView style={splashScreenStyles.container}>
      <View style={splashScreenStyles.content}>
        <View style={splashScreenStyles.logoBadge}>
          <MaterialCommunityIcons
            name="chef-hat"
            size={52}
            color={RecipioColors.splash.logoBadgeText}
          />
        </View>
        <ThemedText style={splashScreenStyles.title}>Recipio</ThemedText>
        <ThemedText style={splashScreenStyles.subtitle}>
          TASTE THE DIFFERENCE
        </ThemedText>
      </View>
      <View style={splashScreenStyles.loaderContainer}>
        <ActivityIndicator
          size="large"
          color={RecipioColors.primaryAccent}
          style={splashScreenStyles.loaderSpinner}
        />
        <ThemedText style={splashScreenStyles.loaderText}>LOADING</ThemedText>
      </View>
    </SafeAreaView>
  );
}
