import React from 'react';
import { ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { ThemedText } from 'masterfabric-expo-core';
import type { PermissionCardProps } from '../models/permissions-helper-models';

type ThemedTextStyle = React.ComponentProps<typeof ThemedText>['style'];

export function PermissionCard({
  label,
  labelStyle,
  statusContent,
  requestButtonLabel,
  isLoad,
  isAnyLoading,
  onRequest,
  cardStyle,
  requestBtnStyle,
  primaryBtnTextColor,
  styles: styleSet,
}: PermissionCardProps) {
  return (
    <View style={styleSet.cardContainer}>
      <View style={[styleSet.card, cardStyle]}>
        <View style={styleSet.cardRow}>
          <View style={styleSet.cardLabelBlock}>
            <ThemedText style={[styleSet.sectionTitle, labelStyle] as ThemedTextStyle}>
              {label}
            </ThemedText>
            {statusContent}
          </View>
          <TouchableOpacity
            onPress={onRequest}
            disabled={isAnyLoading}
            style={[styleSet.requestBtn, requestBtnStyle, { opacity: isAnyLoading ? 0.6 : 1 }]}
            activeOpacity={0.8}
          >
            {isLoad ? (
              <ActivityIndicator size="small" color={primaryBtnTextColor} />
            ) : (
              <ThemedText
                style={[styleSet.requestBtnText, { color: primaryBtnTextColor }] as ThemedTextStyle}
              >
                {requestButtonLabel}
              </ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
