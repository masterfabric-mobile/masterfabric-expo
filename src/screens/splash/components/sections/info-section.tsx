import React from 'react';
import { View } from 'react-native';

import { StageBadge } from '../../../../shared/components/StageBadge';
import { infoSectionStyles } from '../../styles/info-section.styles';
import { VersionInfo } from '../version-info';

export function InfoSection() {
  return (
    <View style={infoSectionStyles.container}>
      <StageBadge />
      <VersionInfo />
    </View>
  );
}
