import { Ionicons } from '@expo/vector-icons';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { UrlLauncherAccordionProps } from '../models/url-launcher-helper-models';
import { urlLauncherAccordionStyles } from '../styles/url-launcher-accordion.styles';

export function UrlLauncherAccordion({ 
  title, 
  children, 
  defaultExpanded = false 
}: UrlLauncherAccordionProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <ThemedView 
      style={[
        urlLauncherAccordionStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <TouchableOpacity
        style={[
          urlLauncherAccordionStyles.header,
          {
            backgroundColor: colors.surfaceBackground,
            borderBottomColor: isExpanded ? colors.surfaceBorder + '30' : 'transparent',
          }
        ]}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <ThemedText 
          type="defaultSemiBold"
          style={[urlLauncherAccordionStyles.title, { color: colors.sectionTitle }]}
        >
          {title}
        </ThemedText>
        <Ionicons
          name={isExpanded ? 'chevron-down' : 'chevron-forward'}
          size={20}
          color={colors.sectionTitle}
        />
      </TouchableOpacity>
      
      {isExpanded && (
        <ThemedView 
          style={[
            urlLauncherAccordionStyles.content,
            {
              backgroundColor: colors.surfaceBackground,
            }
          ]}
        >
          {children}
        </ThemedView>
      )}
    </ThemedView>
  );
}

