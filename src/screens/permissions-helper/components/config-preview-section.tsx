import { ThemedText } from 'masterfabric-expo-core';
import React from 'react';
import { View } from 'react-native';
import type { ConfigPreviewSectionProps } from '../models/permissions-helper-models';

export function ConfigPreviewSection({
  title,
  content,
  titleStyle,
  blockStyle,
  codeStyle,
  styles: styleSet,
}: ConfigPreviewSectionProps) {
  return (
    <View style={styleSet.section}>
      <ThemedText
        style={
          [styleSet.title, titleStyle] as React.ComponentProps<
            typeof ThemedText
          >['style']
        }
      >
        {title}
      </ThemedText>
      <View style={[styleSet.block, blockStyle]}>
        <ThemedText
          style={
            [styleSet.code, codeStyle] as React.ComponentProps<
              typeof ThemedText
            >['style']
          }
          selectable
        >
          {content}
        </ThemedText>
      </View>
    </View>
  );
}
