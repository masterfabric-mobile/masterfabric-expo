import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
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
  const isDark = useColorScheme() === 'dark';

  return (
    <View style={quickActionsStyles.section}>
      <ThemedText type="subtitle" style={quickActionsStyles.sectionTitle}>
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
                { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
              ]}
            >
              <View style={[
                quickActionsStyles.actionIcon,
                { backgroundColor: action.color }
              ]}>
                <Ionicons 
                  name={getIconName(action.id)} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </View>
              
              <View style={quickActionsStyles.actionContent}>
                <ThemedText type="defaultSemiBold" style={quickActionsStyles.actionTitle}>
                  {action.title}
                </ThemedText>
                
                <ThemedText style={quickActionsStyles.actionDescription}>
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
