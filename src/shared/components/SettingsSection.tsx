import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from './ThemedText';

interface SettingsSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  style?: any;
}

export function SettingsSection({ title, description, children, style }: SettingsSectionProps) {
  return (
    <View style={[styles.section, style]}>
      <View style={styles.header}>
        <ThemedText style={styles.title}>{title}</ThemedText>
        {description && (
          <ThemedText style={[styles.description, { opacity: 0.7 }]}>
            {description}
          </ThemedText>
        )}
      </View>
      <View style={styles.content}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
  },
  content: {
    gap: 12,
  },
});
