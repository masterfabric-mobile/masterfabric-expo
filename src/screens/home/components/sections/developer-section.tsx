import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, useColorScheme, View } from 'react-native';
import { quickActionsStyles } from '../../styles/quick-actions.styles';

interface DeveloperSectionProps {
  onActionPress: (actionId: string, actionTitle: string) => void;
}

export function DeveloperSection({ onActionPress }: DeveloperSectionProps) {
  const isDark = useColorScheme() === 'dark';

  if (!__DEV__) return null;

  return (
    <ThemedView style={quickActionsStyles.section}>
      <ThemedText type="subtitle" style={quickActionsStyles.sectionTitle}>
        {t('home.developerTools')}
      </ThemedText>
      
      <View style={quickActionsStyles.actionsList}>
        <TouchableOpacity
          onPress={() => onActionPress('dev-onboarding', t('home.developer.onboarding.title'))}
          activeOpacity={0.7}
        >
          <ThemedView 
            style={[
              quickActionsStyles.actionCard,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
            ]}
          >
            <View style={[
              quickActionsStyles.actionIcon,
              { backgroundColor: '#FF9500' }
            ]}>
              <Ionicons 
                name="build" 
                size={20} 
                color="#FFFFFF" 
              />
            </View>
            
            <View style={quickActionsStyles.actionContent}>
              <ThemedText type="defaultSemiBold" style={quickActionsStyles.actionTitle}>
                {t('home.developer.onboarding.title')}
              </ThemedText>
              
              <ThemedText style={quickActionsStyles.actionDescription}>
                {t('home.developer.onboarding.description')}
              </ThemedText>
            </View>
          </ThemedView>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={() => onActionPress('dev-device-info', t('home.developer.deviceInfo.title'))}
          activeOpacity={0.7}
        >
          <ThemedView 
            style={[
              quickActionsStyles.actionCard,
              { backgroundColor: isDark ? '#1C1C1E' : '#F2F2F7' }
            ]}
          >
            <View style={[
              quickActionsStyles.actionIcon,
              { backgroundColor: '#007AFF' }
            ]}>
              <Ionicons 
                name="phone-portrait" 
                size={20} 
                color="#FFFFFF" 
              />
            </View>
            
            <View style={quickActionsStyles.actionContent}>
              <ThemedText type="defaultSemiBold" style={quickActionsStyles.actionTitle}>
                {t('home.developer.deviceInfo.title')}
              </ThemedText>
              
              <ThemedText style={quickActionsStyles.actionDescription}>
                {t('home.developer.deviceInfo.description')}
              </ThemedText>
            </View>
          </ThemedView>
        </TouchableOpacity>
      </View>
    </ThemedView>
  );
}
