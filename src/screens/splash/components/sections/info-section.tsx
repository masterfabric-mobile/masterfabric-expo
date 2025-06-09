import React from 'react';
import { View } from 'react-native';

import { infoSectionStyles } from '../../styles/info-section.styles';
import { StageBadge } from '../stage-badge';
import { VersionInfo } from '../version-info';

export function InfoSection() {
  return (
    <View style={infoSectionStyles.container}>
      <StageBadge />
      <VersionInfo />
    </View>
  );
}
