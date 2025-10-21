import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Platform, Pressable, StyleSheet } from 'react-native';

import { getThemeColors, useMasterView } from 'masterfabric-expo-core';

export function HapticTab(props: BottomTabBarButtonProps) {
  const { isDark } = useMasterView();
  const colors = getThemeColors(isDark);

  return (
    <Pressable
      {...props}
      style={[
        styles.tabButton,
        props.accessibilityState?.selected && [
          styles.selectedTab,
          { backgroundColor: colors.activeButton + '15' }
        ]
      ]}
      onPressIn={(ev) => {
        if (Platform.OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}

const styles = StyleSheet.create({
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 16,
  },
  selectedTab: {
    transform: [{ scale: 1.05 }],
  },
});
