import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { quickActionsStyles } from '../../styles/quick-actions.styles';
import { QuickAction } from '../../utils';

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
                  name={getIconName(action.id)} 
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
                  {action.title}
                </ThemedText>
                
                <ThemedText 
                  style={[
                    quickActionsStyles.actionDescription,
                    { color: colors.actionDescription }
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
