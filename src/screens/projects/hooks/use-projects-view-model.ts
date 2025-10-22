import { useEffect, useMemo } from 'react';
import { GitHubProject } from '../models/project-models';
import { useProjectsStore, ProjectTab } from '../store/projects-store';
import { fetchAllProjects, openProjectUrl, searchProjects } from '../utils';

export function useProjectsViewModel() {
  const { 
    masterfabricProjects,
    masterfabricMobileProjects,
    isLoading,
    error,
    searchQuery,
    activeTab,
    setMasterfabricProjects,
    setMasterfabricMobileProjects,
    setLoading,
    setError,
    setSearchQuery,
    setActiveTab
  } = useProjectsStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { masterfabric, masterfabricMobile } = await fetchAllProjects();
      setMasterfabricProjects(masterfabric);
      setMasterfabricMobileProjects(masterfabricMobile);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const currentProjects = useMemo(() => {
    return activeTab === 'masterfabric' ? masterfabricProjects : masterfabricMobileProjects;
  }, [activeTab, masterfabricProjects, masterfabricMobileProjects]);

  const filteredProjects = useMemo(() => {
    return searchProjects(currentProjects, searchQuery);
  }, [currentProjects, searchQuery]);

  const handleProjectPress = async (project: GitHubProject) => {
    try {
      await openProjectUrl(project.html_url);
    } catch (error) {
      console.error('Error opening project:', error);
    }
  };

  const handleRefresh = () => {
    loadProjects();
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleTabChange = (tab: ProjectTab) => {
    setActiveTab(tab);
  };

  return {
    projects: filteredProjects,
    masterfabricProjects,
    masterfabricMobileProjects,
    isLoading,
    error,
    searchQuery,
    activeTab,
    handleProjectPress,
    handleRefresh,
    handleSearch,
    handleTabChange,
  };
}
