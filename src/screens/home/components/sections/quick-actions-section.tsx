import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, Sizing, typographyHelper, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { quickActionsStyles } from '../../styles/quick-actions.styles';
import { QuickAction } from '../../utils';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

interface QuickActionsSectionProps {
  quickActions: QuickAction[];
  onActionPress: (actionId: string, actionTitle: string) => void;
  getIconName: (actionId: string) => any;
}

export function QuickActionsSection({ 
  quickActions, 
  onActionPress, 
  getIconName 
}: QuickActionsSectionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <View style={quickActionsStyles.section}>
      <ThemedText 
        type="subtitle" 
        style={[
          quickActionsStyles.sectionTitle,
          { color: colors.sectionTitle }
        ]}
      >
        {t('home.quickActions')}
      </ThemedText>
      
      <View style={quickActionsStyles.actionsList}>
        {quickActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => onActionPress(action.id, action.title)}
            activeOpacity={0.8}
          >
            <View 
              style={[
                quickActionsStyles.actionCard,
                { 
                  backgroundColor: colors.surfaceBackground,
                  borderColor: colors.surfaceBorder + '30',
                  borderWidth: Sizing.borderWidth.m,
                  shadowOffset: { width: 0, height: Sizing.spacing.xxs },
                  shadowOpacity: 0.08,
                  shadowRadius: Sizing.gap.s,
                  elevation: 3,
                }
              ]}
            >
              <View style={[
                quickActionsStyles.actionIcon,
                { 
                  backgroundColor: action.color + '15',
                  borderWidth: Sizing.borderWidth.s,
                  borderColor: action.color + '25',
                } 
              ]}>
                <Ionicons 
                  name={getIconName(action.id)} 
                  size={Sizing.icon.m} 
                  color={action.color} 
                />
              </View>
              
              <View style={quickActionsStyles.actionContent}>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[
                    quickActionsStyles.actionTitle,
                    { 
                      color: colors.bodyText,
                      ...getTypographyStyle('m', 'bold', 'normal'),
                    }
                  ]}
                >
                  {action.title}
                </ThemedText>
                
                <ThemedText 
                  style={[
                    quickActionsStyles.actionDescription,
                    { 
                      color: colors.actionDescription,
                      ...getTypographyStyle('s', 'normal', 'normal'),
                    }
                  ]}
                >
                  {action.description}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
