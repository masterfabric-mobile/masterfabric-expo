import { create } from 'zustand';
import { GitHubProject } from '../models/project-models';

export type ProjectTab = 'masterfabric' | 'masterfabricMobile';

interface ProjectsState {
  projects: GitHubProject[];
  masterfabricProjects: GitHubProject[];
  masterfabricMobileProjects: GitHubProject[];
  isLoading: boolean;
  error: string | null;
  selectedProject: GitHubProject | null;
  searchQuery: string;
  activeTab: ProjectTab;
  
  // Actions
  setProjects: (projects: GitHubProject[]) => void;
  setMasterfabricProjects: (projects: GitHubProject[]) => void;
  setMasterfabricMobileProjects: (projects: GitHubProject[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProject: (project: GitHubProject | null) => void;
  setSearchQuery: (query: string) => void;
  setActiveTab: (tab: ProjectTab) => void;
  reset: () => void;
}

const initialState = {
  projects: [],
  masterfabricProjects: [],
  masterfabricMobileProjects: [],
  isLoading: false,
  error: null,
  selectedProject: null,
  searchQuery: '',
  activeTab: 'masterfabric' as ProjectTab,
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  ...initialState,
  
  setProjects: (projects: GitHubProject[]) => 
    set({ projects }),
    
  setMasterfabricProjects: (projects: GitHubProject[]) => 
    set({ masterfabricProjects: projects }),
    
  setMasterfabricMobileProjects: (projects: GitHubProject[]) => 
    set({ masterfabricMobileProjects: projects }),
    
  setLoading: (loading: boolean) => 
    set({ isLoading: loading }),
    
  setError: (error: string | null) => 
    set({ error }),

  setSelectedProject: (project: GitHubProject | null) =>
    set({ selectedProject: project }),

  setSearchQuery: (query: string) =>
    set({ searchQuery: query }),
    
  setActiveTab: (tab: ProjectTab) =>
    set({ activeTab: tab }),
    
  reset: () => 
    set(initialState),
}));
