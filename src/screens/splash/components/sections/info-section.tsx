import React from 'react';
import { View } from 'react-native';

import { StageBadge } from '../stage-badge';
import { VersionInfo } from '../version-info';

export function InfoSection() {
  return (
    <View style={{ alignItems: 'center' }}>
      <StageBadge />
      <VersionInfo />
    </View>
  );
}
