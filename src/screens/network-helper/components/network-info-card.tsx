import { IconSymbol } from '@/src/shared/components/ui/IconSymbol';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Text, View } from 'react-native';
import { networkHelperScreenStyles } from '../styles/network-helper-screen.styles';

interface NetworkInfoCardProps {
  title: string;
  icon: string;
  children: React.ReactNode;
  statusBadge?: {
    text: string;
    color: string;
  };
}

export function NetworkInfoCard({ title, icon, children, statusBadge }: NetworkInfoCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View
      style={[
        networkHelperScreenStyles.card,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder,
        },
      ]}
    >
      <View style={networkHelperScreenStyles.cardHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <IconSymbol name={icon as any} size={20} color={colors.tint} />
          <Text style={[networkHelperScreenStyles.cardTitle, { color: colors.labelText }]}>
            {title}
          </Text>
        </View>
        {statusBadge && (
          <View
            style={[
              networkHelperScreenStyles.statusBadge,
              {
                backgroundColor: statusBadge.color,
                opacity: 0.2,
              },
            ]}
          >
            <Text style={{ color: statusBadge.color, fontWeight: '600' }}>{statusBadge.text}</Text>
          </View>
        )}
      </View>
      {children}
    </View>
  );
}

interface InfoRowProps {
  label: string;
  value: string | number | null;
  unit?: string;
  isLast?: boolean;
}

export function InfoRow({ label, value, unit, isLast }: InfoRowProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const displayValue = value !== null && value !== undefined ? String(value) : 'N/A';
  const displayText = unit ? `${displayValue} ${unit}` : displayValue;

  return (
    <View
      style={[
        networkHelperScreenStyles.infoRow,
        isLast && networkHelperScreenStyles.infoRowLast,
        { borderBottomColor: colors.surfaceBorder },
      ]}
    >
      <Text style={[networkHelperScreenStyles.infoLabel, { color: colors.bodyText }]}>
        {label}
      </Text>
      <Text style={[networkHelperScreenStyles.infoValue, { color: colors.titleText }]}>
        {displayText}
      </Text>
    </View>
  );
}

