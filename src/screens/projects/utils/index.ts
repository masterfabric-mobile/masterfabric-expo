import { GitHubProject } from '../models/project-models';

const GITHUB_API_URL = 'https://api.github.com';

export const fetchGitHubProjects = async (organization: string): Promise<GitHubProject[]> => {
  try {
    const response = await fetch(`${GITHUB_API_URL}/orgs/${organization}/repos?sort=updated&per_page=50`);
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.filter((repo: GitHubProject) => !repo.private);
  } catch (error) {
    console.error(`Error fetching GitHub projects for ${organization}:`, error);
    throw error;
  }
};

export const fetchAllProjects = async (): Promise<{
  masterfabric: GitHubProject[];
  masterfabricMobile: GitHubProject[];
}> => {
  try {
    const [masterfabricProjects, masterfabricMobileProjects] = await Promise.all([
      fetchGitHubProjects('masterfabric'),
      fetchGitHubProjects('masterfabric-mobile')
    ]);

    return {
      masterfabric: masterfabricProjects,
      masterfabricMobile: masterfabricMobileProjects
    };
  } catch (error) {
    console.error('Error fetching all projects:', error);
    throw error;
  }
};

export const formatProjectDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getLanguageColor = (language: string | null): string => {
  const colors: { [key: string]: string } = {
    'TypeScript': '#3178c6',
    'JavaScript': '#f1e05a',
    'React': '#61dafb',
    'Swift': '#fa7343',
    'Kotlin': '#7f52ff',
    'Java': '#b07219',
    'Python': '#3572a5',
    'Dart': '#00b4ab',
    'HTML': '#e34c26',
    'CSS': '#1572b6',
    'Shell': '#89e051',
  };
  
  return colors[language || ''] || '#8b949e';
};

export const openProjectUrl = async (url: string): Promise<void> => {
  try {
    // Use dynamic import to avoid issues with Expo Go
    const Linking = require('react-native').Linking;
    
    console.log('🔗 Attempting to open URL:', url);
    
    // Check if URL can be opened
    const canOpen = await Linking.canOpenURL(url);
    
    if (canOpen) {
      console.log('✅ URL can be opened, opening:', url);
      await Linking.openURL(url);
    } else {
      console.warn('⚠️ Cannot open URL directly, trying alternative:', url);
      
      // Try alternative URL format for GitHub
      if (url.includes('github.com')) {
        const altUrl = url.replace('api.github.com/repos/', 'github.com/');
        console.log('🔄 Trying alternative GitHub URL:', altUrl);
        await Linking.openURL(altUrl);
      } else {
        throw new Error('URL cannot be opened');
      }
    }
  } catch (error) {
    console.error('❌ Error opening URL:', error);
    
    // Show user-friendly error using dynamic import
    try {
      const { Alert } = require('react-native');
      Alert.alert(
        'Unable to Open',
        'Could not open the project repository. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } catch (alertError) {
      console.error('Error showing alert:', alertError);
    }
  }
};

export const searchProjects = (projects: GitHubProject[], query: string): GitHubProject[] => {
  if (!query.trim()) return projects;
  
  const lowercaseQuery = query.toLowerCase();
  return projects.filter(project => 
    project.name.toLowerCase().includes(lowercaseQuery) ||
    project.description?.toLowerCase().includes(lowercaseQuery) ||
    project.language?.toLowerCase().includes(lowercaseQuery) ||
    project.topics.some(topic => topic.toLowerCase().includes(lowercaseQuery))
  );
};
