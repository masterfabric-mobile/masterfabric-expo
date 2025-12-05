import { ThemedText } from '@/src/shared/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { caseCardStyles } from '../styles/case-card.styles';

interface CaseCardProps {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  onPress: (caseId: string) => void;
}

export function CaseCard({ id, title, description, icon, color, onPress }: CaseCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <TouchableOpacity
      onPress={() => onPress(id)}
      activeOpacity={0.8}
    >
      <View
        style={[
          caseCardStyles.card,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: color + '30',
          },
        ]}
      >
        <View style={caseCardStyles.header}>
          <View
            style={[
              caseCardStyles.iconContainer,
              {
                backgroundColor: color + '15',
                borderColor: color + '25',
              },
            ]}
          >
            <Ionicons name={icon as any} size={24} color={color} />
          </View>
          <View style={caseCardStyles.content}>
            <ThemedText
              type="defaultSemiBold"
              style={[
                caseCardStyles.title,
                {
                  color: colors.bodyText,
                },
              ]}
            >
              {title}
            </ThemedText>
            <ThemedText
              style={[
                caseCardStyles.description,
                {
                  color: colors.actionDescription,
                },
              ]}
            >
              {description}
            </ThemedText>
          </View>
          <View style={caseCardStyles.arrow}>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

