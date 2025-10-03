import { BlurView } from 'expo-blur';
import React from 'react';
import { StyleSheet } from 'react-native';

import { useMasterView } from 'masterfabric-expo-core';

export default function TabBarBackground() {
  const { isDark } = useMasterView();

  return (
    <BlurView
      intensity={100}
      tint={isDark ? 'dark' : 'light'}
      style={StyleSheet.absoluteFill}
    />
  );
}
