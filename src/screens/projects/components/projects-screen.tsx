import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, RefreshControl, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getThemeColors } from '@/src/shared/constants/Colors';
import { useTheme } from '@/src/shared/contexts/theme-context';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { useProjectsViewModel } from '../hooks/use-projects-view-model';
import { GitHubProject } from '../models/project-models';
import { projectsScreenStyles } from '../styles/projects-screen.styles';
import { ProjectCard } from './project-card';

export function ProjectsScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const { 
    projects, 
    isLoading, 
    error, 
    searchQuery,
    handleProjectPress, 
    handleRefresh, 
    handleSearch 
  } = useProjectsViewModel();

  const renderProject = ({ item }: { item: GitHubProject }) => (
    <ProjectCard
      project={item}
      onPress={handleProjectPress}
    />
  );

  const renderEmpty = () => (
    <View style={{ alignItems: 'center', paddingTop: 60 }}>
      <Ionicons 
        name="folder-open-outline" 
        size={80} 
        color={colors.icon + '60'} 
      />
      <Text style={{ 
        color: colors.icon, 
        fontSize: 18, 
        marginTop: 20,
        textAlign: 'center',
        fontWeight: '600'
      }}>
        {error ? t('projects.loadError') : t('projects.noProjects')}
      </Text>
      {error && (
        <Text style={{ 
          color: colors.icon, 
          fontSize: 14, 
          marginTop: 8,
          textAlign: 'center',
          paddingHorizontal: 40,
          lineHeight: 20
        }}>
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
      edges={['top', 'left', 'right']}
    >
      <ScreenHeader 
        title={t('projects.title')}
        subtitle={t('projects.subtitle')}
      />
      
      {/* Search Section */}
      <View style={[projectsScreenStyles.topSection, { paddingTop: 12, paddingBottom: 16 }]}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? colors.surfaceBackground + '40' : colors.surfaceBackground + '60',
          borderRadius: 28,
          paddingHorizontal: 18,
          paddingVertical: 12,
          borderWidth: 0,
        }}>
        <Ionicons 
          name="search" 
          size={16} 
          color={colors.labelText}
          style={{ marginRight: 10, opacity: 0.6 }}
        />
        <TextInput
          style={{
            flex: 1,
            fontSize: 15,
            color: colors.text,
            fontWeight: '400',
          }}
          placeholder={t('projects.searchPlaceholder')}
          placeholderTextColor={colors.labelText + '80'}
          value={searchQuery}
          onChangeText={handleSearch}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity 
            onPress={() => handleSearch('')}
            style={{ 
              marginLeft: 8, 
              padding: 6,
              borderRadius: 12,
              backgroundColor: colors.labelText + '10'
            }}
          >
            <Ionicons 
              name="close" 
              size={12} 
              color={colors.labelText} 
            />
          </TouchableOpacity>
        )}
        </View>
      </View>
      
      {/* Body Section - Projects List */}
      <View style={projectsScreenStyles.bodySection}>
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
            paddingBottom: 40,
            flexGrow: 1
          }}
        />
      </View>
    </SafeAreaView>
  );
}
