import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useHomeViewModel } from '../../hooks/use-home-view-model';
import { quickActionsStyles } from '../../styles/quick-actions.styles';
import { getDeveloperIconName } from '../../utils';

interface DeveloperSectionProps {
  onActionPress: (actionId: string, actionTitle: string) => void;
}

export function DeveloperSection({ onActionPress }: DeveloperSectionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const { developerActions } = useHomeViewModel();

  if (!__DEV__) return null;

  return (
    <View style={[quickActionsStyles.section, { marginBottom: 40 }]}>
      <ThemedText 
        type="subtitle" 
        style={[
          quickActionsStyles.sectionTitle,
          { color: colors.sectionTitle }
        ]}
      >
        {t('home.developerTools')}
      </ThemedText>
      
      <View style={quickActionsStyles.actionsList}>
        {developerActions.map((action) => (
          <TouchableOpacity
            key={action.id}
            onPress={() => onActionPress(action.id, t(action.title))}
            activeOpacity={0.7}
          >
            <View 
              style={[
                quickActionsStyles.actionCard,
                { 
                  backgroundColor: colors.surfaceBackground,
                  borderColor: colors.surfaceBorder,
                  borderWidth: 1,
                }
              ]}
            >
              <View style={[
                quickActionsStyles.actionIcon,
                { backgroundColor: action.color + '20' }
              ]}>
                <Ionicons 
                  name={getDeveloperIconName(action.id) as any}
                  size={22}
                  color={action.color}
                />
              </View>
              
              <View style={quickActionsStyles.actionContent}>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[
                    quickActionsStyles.actionTitle,
                    { color: colors.bodyText }
                  ]}
                >
                  {t(action.title)}
                </ThemedText>
                
                <ThemedText 
                  style={[
                    quickActionsStyles.actionDescription,
                    { color: colors.actionDescription }
                  ]}
                >
                  {t(action.description)}
                </ThemedText>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
