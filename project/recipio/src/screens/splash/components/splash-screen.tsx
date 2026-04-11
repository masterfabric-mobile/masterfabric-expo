import { useMemo } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ActivityIndicator, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import {
  createSplashScreenStyles,
  splashIconSize,
} from '../styles/splash-screen.styles';

export function SplashScreen() {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const splashScreenStyles = useMemo(
    () => createSplashScreenStyles(colors),
    [colors]
  );

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
        <Text style={splashScreenStyles.title}>{t('splash.title')}</Text>
        <Text style={splashScreenStyles.slogan}>{t('splash.slogan')}</Text>
      </View>
      <View style={splashScreenStyles.loaderSection}>
        <ActivityIndicator
          size="large"
          color={colors.primaryAccent}
          style={splashScreenStyles.loader}
        />
        <Text style={splashScreenStyles.loadingLabel}>{t('splash.loading')}</Text>
      </View>
    </SafeAreaView>
  );
}
