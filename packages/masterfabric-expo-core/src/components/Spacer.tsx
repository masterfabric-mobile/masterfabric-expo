import React from 'react';
import { View, ViewStyle } from 'react-native';
import { Sizing } from '../constants/Sizing';

type SpacerProps = {
  size?: keyof typeof Sizing.spacer;
  horizontal?: boolean;
};

export const Spacer = ({ size = 'm', horizontal = false }: SpacerProps) => {
  const style: ViewStyle = {
    [horizontal ? 'width' : 'height']: Sizing.spacer[size],
  };
  return <View style={style} />;
};

