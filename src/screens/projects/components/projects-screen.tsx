import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { Sizing, getThemeColors, typographyHelper, useTheme } from 'masterfabric-expo-core';
import { useProjectsViewModel } from '../hooks/use-projects-view-model';
import { GitHubProject } from '../models/project-models';
import { projectsScreenStyles } from '../styles/projects-screen.styles';
import { ProjectCard } from './project-card';
import { ProjectsTabBar } from './projects-tab-bar';

export function ProjectsScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const { 
    projects, 
    isLoading, 
    error, 
    activeTab,
    handleProjectPress, 
    handleRefresh, 
    handleTabChange
  } = useProjectsViewModel();

  const renderProject = ({ item }: { item: GitHubProject }) => (
    <ProjectCard
      project={item}
      onPress={handleProjectPress}
    />
  );

  const renderEmpty = () => (
    <View style={{ alignItems: Sizing.layout.alignItems.center, paddingTop: Sizing.padding.xxxl }}>
      <Ionicons 
        name="folder-open-outline" 
        size={Sizing.icon.xxxl + Sizing.icon.xl} 
        color={colors.icon + '60'} 
      />
      <Text style={[{ 
        color: colors.icon, 
        marginTop: Sizing.padding.l,
        textAlign: Sizing.layout.textAlign.center,
      }, typographyHelper.fromSizing.createStyle(Sizing, 'l', 'semibold', 'normal')]}>
        {error ? t('projects.loadError') : t('projects.noProjects')}
      </Text>
      {error && (
        <Text style={[{ 
          color: colors.icon, 
          marginTop: Sizing.gap.s,
          textAlign: Sizing.layout.textAlign.center,
          paddingHorizontal: Sizing.padding.xxl,
        }, typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal')]}>
          {t('projects.refreshHint')}
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView 
      style={[
        projectsScreenStyles.container, 
        { backgroundColor: colors.background }
      ]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
        variant="minimal"
      />
      
      {/* Tab Bar */}
      <ProjectsTabBar 
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />
      
      {/* Body Section - Projects List */}
      <View style={[projectsScreenStyles.bodySection, { backgroundColor: colors.background }]}>
        <FlatList
          data={projects}
          renderItem={renderProject}
          keyExtractor={(item) => item.id.toString()}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={handleRefresh}
              colors={[colors.tint]}
              tintColor={colors.tint}
            />
          }
          ListEmptyComponent={!isLoading ? renderEmpty : null}
          contentContainerStyle={{ 
            paddingBottom: Sizing.padding.xxl,
            flexGrow: Sizing.flexNumber.full,
            backgroundColor: 'transparent'
          }}
          style={{ backgroundColor: 'transparent' }}
        />
      </View>
    </SafeAreaView>
  );
}
