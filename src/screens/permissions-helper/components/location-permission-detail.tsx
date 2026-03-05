import React from 'react';
import { View } from 'react-native';
import { ThemedText } from 'masterfabric-expo-core';
import type { LocationPermissionDetailProps } from '../models/permissions-helper-models';

type ThemedTextStyle = React.ComponentProps<typeof ThemedText>['style'];

export function LocationPermissionDetail({
  info,
  labels,
  styles: styleSet,
  labelStyle,
  foregroundStatusStyle,
  backgroundStatusStyle,
  preciseStatusStyle,
}: LocationPermissionDetailProps) {
  return (
    <View style={styleSet.block}>
      <View style={styleSet.row}>
        <ThemedText style={[styleSet.labelText, labelStyle] as ThemedTextStyle}>
          {labels.foregroundLabel}
        </ThemedText>
        <ThemedText style={[styleSet.statusText, foregroundStatusStyle] as ThemedTextStyle}>
          {labels.foregroundStatus}
        </ThemedText>
      </View>
      <View style={styleSet.row}>
        <ThemedText style={[styleSet.labelText, labelStyle] as ThemedTextStyle}>
          {labels.backgroundLabel}
        </ThemedText>
        <ThemedText style={[styleSet.statusText, backgroundStatusStyle] as ThemedTextStyle}>
          {labels.backgroundStatus}
        </ThemedText>
      </View>
      <View style={styleSet.row}>
        <ThemedText style={[styleSet.labelText, labelStyle] as ThemedTextStyle}>
          {labels.preciseLabel}
        </ThemedText>
        <ThemedText style={[styleSet.statusText, preciseStatusStyle] as ThemedTextStyle}>
          {labels.preciseStatus}
        </ThemedText>
      </View>
    </View>
  );
}
