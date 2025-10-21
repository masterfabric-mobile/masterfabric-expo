// Formatting utilities for MasterView
export const formatting = {
  // Format timestamp to readable string
  formatTimestamp: (timestamp: string | Date): string => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    return date.toLocaleString();
  },
  
  // Format duration in milliseconds to human readable
  formatDuration: (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds % 60}s`;
    } else {
      return `${seconds}s`;
    }
  },
  
  // Format file size
  formatFileSize: (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  },
  
  // Format user name
  formatUserName: (user: { name?: string; email?: string }): string => {
    if (user.name) {
      return user.name;
    }
    if (user.email) {
      return user.email.split('@')[0];
    }
    return 'Unknown User';
  },
  
  // Format activity description
  formatActivityDescription: (action: string, details?: any): string => {
    switch (action) {
      case 'theme_change':
        return `Theme changed from ${details?.from || 'unknown'} to ${details?.to || 'unknown'}`;
      case 'language_change':
        return `Language changed to ${details?.to || 'unknown'}`;
      case 'settings_opened':
        return 'Settings opened';
      case 'project_created':
        return 'New project created';
      default:
        return action.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  },
  
  // Truncate text
  truncateText: (text: string, maxLength: number): string => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength - 3) + '...';
  },
  
  // Capitalize first letter
  capitalize: (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  },
  
  // Format error message
  formatErrorMessage: (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message) {
      return error.message;
    }
    if (error?.error) {
      return error.error;
    }
    return 'An unknown error occurred';
  }
};
