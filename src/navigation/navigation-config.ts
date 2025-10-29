/**
 * Navigation configuration following Expo development rules
 * Centralized configuration for navigation behavior
 */
export const navigationConfig = {
  // Screen options
  defaultScreenOptions: {
    headerShown: false,
    gestureEnabled: true,
    animation: 'default' as const,
  },

  // Tab bar configuration
  tabBarOptions: {
    activeTintColor: '#007AFF',
    inactiveTintColor: '#8E8E93',
    style: {
      backgroundColor: '#FFFFFF',
      borderTopWidth: 0.5,
      borderTopColor: '#E5E5E5',
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: '500' as const,
    },
  },

  // Animation configurations
  animations: {
    push: {
      gestureDirection: 'horizontal' as const,
      transitionSpec: {
        open: {
          animation: 'timing' as const,
          config: {
            duration: 300,
          },
        },
        close: {
          animation: 'timing' as const,
          config: {
            duration: 300,
          },
        },
      },
    },
    modal: {
      gestureDirection: 'vertical' as const,
      transitionSpec: {
        open: {
          animation: 'spring' as const,
          config: {
            damping: 15,
            stiffness: 100,
          },
        },
        close: {
          animation: 'spring' as const,
          config: {
            damping: 15,
            stiffness: 100,
          },
        },
      },
    },
  },

  // Deep linking configuration
  linking: {
    prefixes: ['masterfabricexpo://'],
    config: {
      screens: {
        splash: '/splash',
        onboarding: '/onboarding',
        settings: '/settings',
        helpers: '/helpers',
        'string-helper': '/string-helper',
        'toast-helper': '/toast-helper',
        documentation: '/documentation',
        '(tabs)': {
          screens: {
            index: '/home',
            explore: '/explore',
          },
        },
        '+not-found': '*',
      },
    },
  },

  // Navigation state persistence
  persistNavigation: __DEV__,
} as const;
