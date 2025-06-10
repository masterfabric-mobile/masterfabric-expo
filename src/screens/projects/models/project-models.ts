export interface GitHubProject {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  clone_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  topics: string[];
  private: boolean;
}

export interface ProjectsState {
  projects: GitHubProject[];
  isLoading: boolean;
  error: string | null;
  selectedProject: GitHubProject | null;
}

export interface ProjectCardProps {
  project: GitHubProject;
  onPress: (project: GitHubProject) => void;
}
