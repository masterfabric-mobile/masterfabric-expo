import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DocumentationSection } from '../models/documentation-models';
import { documentationContentStyles } from '../styles/documentation-content.styles';

interface DocumentationContentProps {
  sections: DocumentationSection[];
}

export function DocumentationContent({ sections }: DocumentationContentProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const renderSection = (section: DocumentationSection) => (
    <View key={section.id} style={documentationContentStyles.section}>
      <View style={documentationContentStyles.sectionHeader}>
        <View style={[
          documentationContentStyles.sectionIcon,
          { backgroundColor: section.color + '15' }
        ]}>
          <Ionicons 
            name={section.icon as any} 
            size={24} 
            color={section.color} 
          />
        </View>
        <View style={documentationContentStyles.sectionTitleContainer}>
          <ThemedText 
            type="subtitle" 
            style={[
              documentationContentStyles.sectionTitle,
              { color: colors.sectionTitle }
            ]}
          >
            {t(section.titleKey)}
          </ThemedText>
          <ThemedText 
            style={[
              documentationContentStyles.sectionDescription,
              { color: colors.actionDescription }
            ]}
          >
            {t(section.descriptionKey)}
          </ThemedText>
        </View>
      </View>

      <View style={documentationContentStyles.itemsContainer}>
        {section.items.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              documentationContentStyles.itemCard,
              { 
                backgroundColor: colors.surfaceBackground,
                borderColor: colors.surfaceBorder + '30',
                borderWidth: 1,
              }
            ]}
            activeOpacity={0.8}
          >
            <View style={documentationContentStyles.itemContent}>
              <View style={documentationContentStyles.itemHeader}>
                <ThemedText 
                  type="defaultSemiBold" 
                  style={[
                    documentationContentStyles.itemTitle,
                    { color: colors.bodyText }
                  ]}
                >
                  {t(item.titleKey)}
                </ThemedText>
                <Ionicons 
                  name="chevron-forward" 
                  size={16} 
                  color={colors.labelText} 
                />
              </View>
              
              <ThemedText 
                style={[
                  documentationContentStyles.itemDescription,
                  { color: colors.actionDescription }
                ]}
                numberOfLines={2}
              >
                {t(item.descriptionKey)}
              </ThemedText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={documentationContentStyles.container}>
      {sections.map(renderSection)}
    </View>
  );
}
