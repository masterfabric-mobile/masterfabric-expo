import { MasterViewProps } from '../types/MasterView';

// Validation utilities for MasterView
export const validation = {
  // Validate MasterView props
  validateMasterViewProps: (props: MasterViewProps): boolean => {
    if (!props.id || typeof props.id !== 'string') {
      return false;
    }
    
    if (!props.name || typeof props.name !== 'string') {
      return false;
    }
    
    return true;
  },
  
  // Validate theme mode
  validateThemeMode: (theme: string): boolean => {
    return ['light', 'dark', 'system'].includes(theme);
  },
  
  // Validate color format
  validateColor: (color: string): boolean => {
    // Basic hex color validation
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
  },
  
  // Validate activity action type
  validateActivityAction: (action: string): boolean => {
    const validActions = [
      'theme_change',
      'language_change',
      'notification_settings',
      'general_settings',
      'device_info',
      'dev_tool',
      'app_start',
      'new_project',
      'templates',
      'documentation',
      'settings'
    ];
    return validActions.includes(action);
  },
  
  // Validate user object
  validateUser: (user: any): boolean => {
    return user && 
           typeof user.id === 'string' && 
           typeof user.name === 'string' && 
           typeof user.email === 'string';
  },
  
  // Validate configuration object
  validateConfig: (config: any): boolean => {
    if (!config || typeof config !== 'object') {
      return false;
    }
    
    // Check required config properties
    const requiredProps = [
      'enableActivityTracking',
      'enableErrorBoundary',
      'enableThemeSupport',
      'enableLocalization',
      'enableLoadingStates',
      'enableNavigationTracking'
    ];
    
    return requiredProps.every(prop => prop in config);
  }
};
