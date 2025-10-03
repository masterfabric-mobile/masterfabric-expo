import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import { GitHubProject } from '../models/project-models';
import { projectCardStyles } from '../styles/project-card.styles';
import { formatProjectDate, getLanguageColor } from '../utils';

interface ProjectCardProps {
  project: GitHubProject;
  onPress: (project: GitHubProject) => void;
}

export function ProjectCard({ project, onPress }: ProjectCardProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const languageColor = getLanguageColor(project.language);

  return (
    <TouchableOpacity
      style={[
        projectCardStyles.card,
        {
          backgroundColor: isDark 
            ? colors.surfaceBackground + 'E6' 
            : colors.surfaceBackground,
          shadowColor: isDark ? '#000' : '#000',
        }
      ]}
      onPress={() => onPress(project)}
      activeOpacity={0.92}
    >
      <View style={projectCardStyles.header}>
        <Text 
          style={[
            projectCardStyles.title,
            { color: colors.bodyText }
          ]}
          numberOfLines={2}
        >
          {project.name}
        </Text>
        {project.language && (
          <View style={[
            projectCardStyles.languageIndicator,
            { backgroundColor: languageColor }
          ]} />
        )}
      </View>

      {project.description && (
        <Text 
          style={[
            projectCardStyles.description,
            { color: colors.labelText }
          ]}
          numberOfLines={2}
        >
          {project.description}
        </Text>
      )}

      <View style={[
        projectCardStyles.footer,
        { borderTopColor: colors.surfaceBorder + '40' }
      ]}>
        <View style={projectCardStyles.stats}>
          <View style={projectCardStyles.stat}>
            <Ionicons 
              name="star" 
              size={14} 
              color={colors.warningColor} 
            />
            <Text style={[
              projectCardStyles.statText,
              { color: colors.bodyText }
            ]}>
              {project.stargazers_count}
            </Text>
          </View>
          
          <View style={projectCardStyles.stat}>
            <Ionicons 
              name="git-branch" 
              size={14} 
              color={colors.labelText} 
            />
            <Text style={[
              projectCardStyles.statText,
              { color: colors.bodyText }
            ]}>
              {project.forks_count}
            </Text>
          </View>
        </View>

        <View style={projectCardStyles.rightSection}>
          {project.language && (
            <Text style={[
              projectCardStyles.language,
              { color: languageColor }
            ]}>
              {project.language}
            </Text>
          )}
          <Text style={[
            projectCardStyles.date,
            { color: colors.labelText }
          ]}>
            {formatProjectDate(project.updated_at)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
