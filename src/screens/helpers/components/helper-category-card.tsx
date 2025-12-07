import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { getThemeColors, Sizing, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { HelperCategory } from '../models/helpers-models';
import { helperCategoryCardStyles } from '../styles/helper-category-card.styles';

interface HelperCategoryCardProps {
  category: HelperCategory;
}

export function HelperCategoryCard({ category }: HelperCategoryCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const handlePress = () => {
    if (category.available && category.route) {
      console.log(`Navigating to ${category.route}`);
      router.push(category.route as any);
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.8}
      disabled={!category.available}
    >
      <ThemedView 
        style={[
          helperCategoryCardStyles.container,
          { 
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + '30',
            opacity: category.available ? 1 : 0.6,
          }
        ]}
      >
        <View style={[
          helperCategoryCardStyles.iconContainer,
          { 
            backgroundColor: category.color + '12',
            borderColor: category.color + '20',
          }
        ]}>
          <Ionicons 
            name={category.icon as any} 
            size={Sizing.icon.l} 
            color={category.color} 
          />
        </View>
        
        <View style={helperCategoryCardStyles.content}>
          <ThemedText 
            type="defaultSemiBold" 
            style={[
              helperCategoryCardStyles.title,
              { 
                color: colors.text,
              }
            ]}
          >
            {category.title}
          </ThemedText>
          
          <ThemedText 
            style={[
              helperCategoryCardStyles.description,
              { 
                color: colors.bodyText,
                opacity: 0.85
              }
            ]}
          >
            {category.description}
          </ThemedText>

          {!category.available && (
            <View style={helperCategoryCardStyles.comingSoonContainer}>
              <ThemedText 
                style={[
                  helperCategoryCardStyles.comingSoonText,
                  { color: '#FF9500' }
                ]}
              >
                Coming Soon
              </ThemedText>
            </View>
          )}
        </View>

        <View style={helperCategoryCardStyles.arrowContainer}>
          <Ionicons 
            name="chevron-forward" 
            size={Sizing.icon.s} 
            color={colors.icon} 
          />
        </View>
      </ThemedView>
    </TouchableOpacity>
  );
}
