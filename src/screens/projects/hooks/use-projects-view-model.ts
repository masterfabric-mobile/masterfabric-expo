import { useEffect, useMemo } from 'react';
import { GitHubProject } from '../models/project-models';
import { useProjectsStore } from '../store/projects-store';
import { fetchGitHubProjects, openProjectUrl, searchProjects } from '../utils';

export function useProjectsViewModel() {
  const { 
    projects,
    isLoading,
    error,
    searchQuery,
    setProjects,
    setLoading,
    setError,
    setSearchQuery
  } = useProjectsStore();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const fetchedProjects = await fetchGitHubProjects();
      setProjects(fetchedProjects);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load projects';
      setError(errorMessage);
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    return searchProjects(projects, searchQuery);
  }, [projects, searchQuery]);

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

  return {
    projects: filteredProjects,
    isLoading,
    error,
    searchQuery,
    handleProjectPress,
    handleRefresh,
    handleSearch,
  };
}
