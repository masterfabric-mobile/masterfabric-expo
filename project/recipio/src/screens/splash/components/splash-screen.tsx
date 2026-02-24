import { RecipioColors } from '@/shared/constants/recipio-colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  splashScreenStyles,
  splashIconSize,
} from '../styles/splash-screen.styles';

export function SplashScreen() {
  return (
    <SafeAreaView style={splashScreenStyles.container}>
      <View style={splashScreenStyles.content}>
        <View style={splashScreenStyles.iconWrapper}>
          <MaterialCommunityIcons
            name="chef-hat"
            size={splashIconSize}
            style={splashScreenStyles.icon}
          />
        </View>
        <Text style={splashScreenStyles.title}>Recipe App</Text>
        <Text style={splashScreenStyles.slogan}>TASTE THE DIFFERENCE</Text>
      </View>
      <View style={splashScreenStyles.loaderSection}>
        <ActivityIndicator
          size="large"
          color={RecipioColors.primaryAccent}
          style={splashScreenStyles.loader}
        />
        <Text style={splashScreenStyles.loadingLabel}>LOADING</Text>
      </View>
    </SafeAreaView>
  );
}
