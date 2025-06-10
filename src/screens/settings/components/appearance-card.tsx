import { ThemedText } from '@/src/shared/components/ThemedText';
import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { AppearanceCardProps } from '../models/settings-models';
import { appearanceStyles } from '../styles/appearance-styles';
import { cardStyles } from '../styles/card-styles';
import { getThemeOptions, getThemePreviewColors } from '../utils';

export function AppearanceCard({ selectedTheme, onThemeChange }: AppearanceCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const themeOptions = getThemeOptions(t);

  return (
    <View style={[cardStyles.card, { 
      backgroundColor: colors.settingsCardBackground,
      borderColor: colors.settingsCardBorder,
      borderWidth: 1
    }]}>
      <View style={cardStyles.cardHeader}>
        <View style={[cardStyles.iconContainer, { backgroundColor: colors.settingsIconBackground }]}>
          <Ionicons name="color-palette" size={22} color="#FF9500" />
        </View>
        <View style={cardStyles.cardHeaderContent}>
          <ThemedText style={[cardStyles.cardTitle, { color: colors.text }]}>
            {t('settings.appearanceCard.title')}
          </ThemedText>
          <ThemedText style={[cardStyles.cardSubtitle, { color: colors.settingsDescription }]}>
            {t('settings.appearanceCard.subtitle')}
          </ThemedText>
        </View>
      </View>
      
      <View style={cardStyles.cardBody}>
        <View style={appearanceStyles.themeGrid}>
          {themeOptions.map((theme) => {
            const isSelected = selectedTheme === theme.key;
            const previewColors = getThemePreviewColors(theme.key);
            
            return (
              <TouchableOpacity
                key={theme.key}
                style={[
                  appearanceStyles.modernThemeCard,
                  {
                    backgroundColor: isSelected ? colors.activeButton + '10' : colors.settingsThemeOptionBg,
                    borderColor: isSelected ? colors.activeButton : colors.settingsThemeOptionBorder,
                    borderWidth: 2,
                  }
                ]}
                onPress={() => onThemeChange(theme.key)}
                accessibilityRole="button"
                accessibilityLabel={`${t('settings.switchTo')} ${theme.label}`}
              >
                {/* Theme Preview */}
                <View style={[
                  appearanceStyles.themePreview,
                  { 
                    backgroundColor: previewColors.background,
                    borderColor: colors.settingsThemeOptionBorder
                  }
                ]}>
                  <View style={[
                    appearanceStyles.previewElement,
                    { backgroundColor: previewColors.element1 }
                  ]} />
                  <View style={[
                    appearanceStyles.previewElement,
                    { backgroundColor: previewColors.element2, width: '60%' }
                  ]} />
                </View>

                {/* Theme Info */}
                <View style={appearanceStyles.themeInfo}>
                  <View style={appearanceStyles.themeHeader}>
                    <Ionicons 
                      name={theme.icon as any} 
                      size={16} 
                      color={isSelected ? colors.activeButton : colors.settingsDescription}
                    />
                    <ThemedText style={[
                      appearanceStyles.modernThemeLabel,
                      { 
                        color: isSelected ? colors.activeButton : colors.text,
                        fontWeight: isSelected ? '700' : '600'
                      }
                    ]}>
                      {theme.label}
                    </ThemedText>
                    {isSelected && (
                      <Ionicons 
                        name="checkmark-circle" 
                        size={16} 
                        color={colors.activeButton}
                      />
                    )}
                  </View>
                  
                  <ThemedText style={[
                    appearanceStyles.modernThemeDescription,
                    { color: colors.settingsDescription }
                  ]}>
                    {theme.desc}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
}
