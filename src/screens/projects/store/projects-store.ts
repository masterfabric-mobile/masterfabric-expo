import { create } from 'zustand';
import { GitHubProject } from '../models/project-models';

interface ProjectsState {
  projects: GitHubProject[];
  isLoading: boolean;
  error: string | null;
  selectedProject: GitHubProject | null;
  searchQuery: string;
  
  // Actions
  setProjects: (projects: GitHubProject[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedProject: (project: GitHubProject | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
}

const initialState = {
  projects: [],
  isLoading: false,
  error: null,
  selectedProject: null,
  searchQuery: '',
};

export const useProjectsStore = create<ProjectsState>((set) => ({
  ...initialState,
  
  setProjects: (projects: GitHubProject[]) => 
    set({ projects }),
    
  setLoading: (loading: boolean) => 
    set({ isLoading: loading }),
    
  setError: (error: string | null) => 
    set({ error }),

  setSelectedProject: (project: GitHubProject | null) =>
    set({ selectedProject: project }),

  setSearchQuery: (query: string) =>
    set({ searchQuery: query }),
    
  reset: () => 
    set(initialState),
}));
