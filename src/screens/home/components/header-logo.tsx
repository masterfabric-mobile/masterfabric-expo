import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';

import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { headerLogoStyles } from '../styles/header-logo.styles';

interface HeaderLogoProps {
  logoSize?: number;
  showText?: boolean;
  textStyle?: any;
}

export function HeaderLogo({ logoSize = 32, showText = true, textStyle }: HeaderLogoProps) {
  return (
    <View style={headerLogoStyles.container}>
      <Image
        source={require('@/src/assets/images/masterfabric-logo.svg')}
        style={[headerLogoStyles.logo, { width: logoSize, height: logoSize }]}
        contentFit="contain"
      />
      {showText && (
        <ThemedText type="defaultSemiBold" style={[headerLogoStyles.appName, textStyle]}>
          {t('app.name')}
        </ThemedText>
      )}
    </View>
  );
}
