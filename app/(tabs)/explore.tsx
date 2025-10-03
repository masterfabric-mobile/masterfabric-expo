import { Platform, StyleSheet } from 'react-native';

import { Collapsible } from '@/src/shared/components/Collapsible';
import { ExternalLink } from '@/src/shared/components/ExternalLink';
import ParallaxScrollView from '@/src/shared/components/ParallaxScrollView';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import { t } from '@/src/shared/i18n';

export default function TabTwoScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">{t('explore.title')}</ThemedText>
      </ThemedView>
      <ThemedText>{t('explore.description')}</ThemedText>
      <Collapsible title={t('explore.sections.fileBasedRouting.title')}>
        <ThemedText>
          {t('explore.sections.fileBasedRouting.description1')}{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
          <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
        </ThemedText>
        <ThemedText>
          {t('explore.sections.fileBasedRouting.description2')} <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
          {t('explore.sections.fileBasedRouting.description3')}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/router/introduction">
          <ThemedText type="link">{t('explore.sections.fileBasedRouting.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.sections.platformSupport.title')}>
        <ThemedText>
          {t('explore.sections.platformSupport.description')}{' '}
          <ThemedText type="defaultSemiBold">w</ThemedText> {t('explore.sections.platformSupport.description2')}
        </ThemedText>
      </Collapsible>
      <Collapsible title={t('explore.sections.images.title')}>
        <ThemedText>
          {t('explore.sections.images.description1')} <ThemedText type="defaultSemiBold">@2x</ThemedText> {t('explore.sections.images.description2')}{' '}
          <ThemedText type="defaultSemiBold">@3x</ThemedText> {t('explore.sections.images.description3')}
        </ThemedText>
        {/* Removed missing react-logo.png preview image */}
        <ExternalLink href="https://reactnative.dev/docs/images">
          <ThemedText type="link">{t('explore.sections.fileBasedRouting.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.sections.customFonts.title')}>
        <ThemedText>
          {t('explore.sections.customFonts.description1')} <ThemedText type="defaultSemiBold">app/_layout.tsx</ThemedText> {t('explore.sections.customFonts.description2')}{' '}
          <ThemedText style={{ fontFamily: 'SpaceMono' }}>
            {t('explore.sections.customFonts.description3')}
          </ThemedText>
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/versions/latest/sdk/font">
          <ThemedText type="link">{t('explore.sections.fileBasedRouting.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.sections.lightDarkMode.title')}>
        <ThemedText>
          {t('explore.sections.lightDarkMode.description1')}{' '}
          <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> {t('explore.sections.lightDarkMode.description2')}
        </ThemedText>
        <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
          <ThemedText type="link">{t('explore.sections.fileBasedRouting.learnMore')}</ThemedText>
        </ExternalLink>
      </Collapsible>
      <Collapsible title={t('explore.sections.animations.title')}>
        <ThemedText>
          {t('explore.sections.animations.description1')}{' '}
          <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> {t('explore.sections.animations.description2')}
          <ThemedText type="defaultSemiBold">react-native-reanimated</ThemedText>{' '}
          {t('explore.sections.animations.description3')}
        </ThemedText>
        {Platform.select({
          ios: (
            <ThemedText>
              {t('explore.sections.animations.description4')} <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
              {t('explore.sections.animations.description5')}
            </ThemedText>
          ),
        })}
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
