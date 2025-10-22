import { ThemedText } from '@/src/shared/components/ThemedText';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { DocumentationSection } from '../models/documentation-models';
import { accordionStyles } from '../styles/accordion.styles';

interface AccordionProps {
  sections: DocumentationSection[];
}

export function DocumentationAccordion({ sections }: AccordionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const renderSection = (section: DocumentationSection) => {
    const isExpanded = expandedSections.has(section.id);
    
    return (
      <View key={section.id} style={accordionStyles.section}>
        <TouchableOpacity
          style={[
            accordionStyles.sectionHeader,
            { 
              backgroundColor: colors.surfaceBackground,
              borderColor: colors.surfaceBorder + '30',
              borderWidth: 1,
            }
          ]}
          onPress={() => toggleSection(section.id)}
          activeOpacity={0.8}
        >
          <View style={accordionStyles.sectionHeaderContent}>
            <View style={[
              accordionStyles.sectionIcon,
              { backgroundColor: section.color + '15' }
            ]}>
              <Ionicons 
                name={section.icon as any} 
                size={24} 
                color={section.color} 
              />
            </View>
            
            <View style={accordionStyles.sectionTitleContainer}>
              <ThemedText 
                type="subtitle" 
                style={[
                  accordionStyles.sectionTitle,
                  { color: colors.sectionTitle }
                ]}
              >
                {t(section.titleKey)}
              </ThemedText>
              <ThemedText 
                style={[
                  accordionStyles.sectionDescription,
                  { color: colors.actionDescription }
                ]}
                numberOfLines={2}
              >
                {t(section.descriptionKey)}
              </ThemedText>
            </View>
            
            <Ionicons 
              name={isExpanded ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={colors.labelText} 
            />
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={[
            accordionStyles.sectionContent,
            { 
              backgroundColor: colors.background,
              borderLeftColor: section.color + '40',
              borderLeftWidth: 3,
            }
          ]}>
            {section.items.map((item) => (
              <View
                key={item.id}
                style={[
                  accordionStyles.itemCard,
                  { 
                    backgroundColor: colors.surfaceBackground,
                    borderColor: colors.surfaceBorder + '20',
                    borderWidth: 1,
                  }
                ]}
              >
                <View style={accordionStyles.itemContent}>
                  <ThemedText 
                    type="defaultSemiBold" 
                    style={[
                      accordionStyles.itemTitle,
                      { color: colors.bodyText }
                    ]}
                  >
                    {t(item.titleKey)}
                  </ThemedText>
                  
                  <ThemedText 
                    style={[
                      accordionStyles.itemDescription,
                      { color: colors.actionDescription }
                    ]}
                  >
                    {t(item.descriptionKey)}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={accordionStyles.container}>
      {sections.map(renderSection)}
    </View>
  );
}
