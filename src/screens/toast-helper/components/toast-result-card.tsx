import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ToastResult } from '../models/toast-helper.models';

interface ToastResultCardProps {
  result: ToastResult;
}

export function ToastResultCard({ result }: ToastResultCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView style={[toastResultCardStyles.card, { borderColor: colors.surfaceBorder }]}>
      <View style={toastResultCardStyles.header}>
        <ThemedText 
          type="subtitle" 
          style={[toastResultCardStyles.operationName, { color: colors.sectionTitle }]}
        >
          {result.operationName}
        </ThemedText>
      </View>

      <View style={toastResultCardStyles.content}>
        <View style={toastResultCardStyles.section}>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.label, { color: colors.labelText }]}
          >
            Input:
          </ThemedText>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.value, { color: colors.bodyText }]}
          >
            {result.input}
          </ThemedText>
        </View>

        <View style={toastResultCardStyles.section}>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.label, { color: colors.labelText }]}
          >
            Output:
          </ThemedText>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.value, { color: colors.bodyText }]}
          >
            {result.output}
          </ThemedText>
        </View>

        <View style={toastResultCardStyles.section}>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.label, { color: colors.labelText }]}
          >
            Description:
          </ThemedText>
          <ThemedText 
            type="default" 
            style={[toastResultCardStyles.description, { color: colors.bodyText }]}
          >
            {result.description}
          </ThemedText>
        </View>
      </View>
    </ThemedView>
  );
}

const toastResultCardStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
    overflow: 'hidden',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  operationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  section: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  value: {
    fontSize: 14,
    fontFamily: 'monospace',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
});