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
            activeOpacity={0.8}
          >
            <View 
              style={[
                quickActionsStyles.actionCard,
                { 
                  backgroundColor: colors.surfaceBackground,
                  borderColor: colors.surfaceBorder + '30',
                  borderWidth: 1.5,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }
              ]}
            >
              <View style={[
                quickActionsStyles.actionIcon,
                { 
                  backgroundColor: action.color + '15',
                  borderWidth: 1,
                  borderColor: action.color + '25',
                } 
              ]}>
                <Ionicons 
                  name={getIconName(action.id)} 
                  size={24} 
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
                      fontSize: 17,
                      fontWeight: '700'
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
                      fontSize: 15,
                      lineHeight: 20
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
