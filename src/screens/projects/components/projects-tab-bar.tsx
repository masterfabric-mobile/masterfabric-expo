import { Sizing, getThemeColors, typographyHelper, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ProjectTab } from '../store/projects-store';
import { projectsTabBarStyles } from '../styles/projects-tab-bar.styles';

interface ProjectsTabBarProps {
  activeTab: ProjectTab;
  onTabChange: (tab: ProjectTab) => void;
}

export function ProjectsTabBar({ activeTab, onTabChange }: ProjectsTabBarProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const tabs: { key: ProjectTab; label: string }[] = [
    { key: 'masterfabric', label: 'MasterFabric' },
    { key: 'masterfabricMobile', label: 'MasterFabric Mobile' },
  ];

  return (
    <View style={[projectsTabBarStyles.container, { backgroundColor: colors.background }]}>
      <View style={[
        projectsTabBarStyles.tabContainer,
        { 
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        }
      ]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                projectsTabBarStyles.tab,
                isActive
                  ? [
                      projectsTabBarStyles.activeTab,
                      { 
                        backgroundColor: '#1a1a1a', // Koyu codebase rengi
                        shadowColor: '#1a1a1a',
                      }
                    ]
                  : { backgroundColor: '#f5f5f5' } // Gri renk
              ]}
              onPress={() => onTabChange(tab.key)}
              activeOpacity={Sizing.opacity.xl}
            >
              <Text
                style={[
                  projectsTabBarStyles.tabText,
                  { 
                    color: isActive ? '#FFFFFF' : '#666666', // Active: beyaz, Inactive: koyu gri
                    ...(isActive 
                      ? typographyHelper.fromSizing.createStyle(Sizing, 's', 'semibold', 'normal')
                      : typographyHelper.fromSizing.createStyle(Sizing, 's', 'medium', 'normal')
                    )
                  }
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
