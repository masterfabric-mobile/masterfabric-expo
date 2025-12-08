import { DocumentationSection } from '../models/documentation-models';

export const createDocumentationSections = (): DocumentationSection[] => [
  {
    id: 'helpers',
    titleKey: 'documentation.sections.helpers.title',
    descriptionKey: 'documentation.sections.helpers.description',
    icon: 'build-outline',
    color: '#5856D6',
    items: [
      {
        id: 'string-helper',
        titleKey: 'documentation.sections.helpers.stringHelper.title',
        descriptionKey: 'documentation.sections.helpers.stringHelper.description',
        route: '/string-helper',
      },
      {
        id: 'logger-helper',
        titleKey: 'documentation.sections.helpers.loggerHelper.title',
        descriptionKey: 'documentation.sections.helpers.loggerHelper.description',
        route: '/logger-helper',
      },
      {
        id: 'snackbar-helper',
        titleKey: 'documentation.sections.helpers.snackbarHelper.title',
        descriptionKey: 'documentation.sections.helpers.snackbarHelper.description',
        route: '/snackbar-helper',
      },
      {
        id: 'firebase-helper',
        titleKey: 'documentation.sections.helpers.firebaseHelper.title',
        descriptionKey: 'documentation.sections.helpers.firebaseHelper.description',
        route: '/firebase-helper',
      },
      {
        id: 'toast-helper',
        titleKey: 'documentation.sections.helpers.toastHelper.title',
        descriptionKey: 'documentation.sections.helpers.toastHelper.description',
        route: '/toast-helper',
      },
      {
        id: 'time-helper',
        titleKey: 'documentation.sections.helpers.timeHelper.title',
        descriptionKey: 'documentation.sections.helpers.timeHelper.description',
        route: '/time-helper',
      },
      {
        id: 'battery-helper',
        titleKey: 'documentation.sections.helpers.batteryHelper.title',
        descriptionKey: 'documentation.sections.helpers.batteryHelper.description',
        route: '/battery-helper',
      },
      {
        id: 'rich-text-helper',
        titleKey: 'documentation.sections.helpers.richTextHelper.title',
        descriptionKey: 'documentation.sections.helpers.richTextHelper.description',
        route: '/rich-text-helper',
      },
      {
        id: 'typography-helper',
        titleKey: 'documentation.sections.helpers.typographyHelper.title',
        descriptionKey: 'documentation.sections.helpers.typographyHelper.description',
        route: '/typography-helper',
      },
      {
        id: 'validator-helper',
        titleKey: 'documentation.sections.helpers.validatorHelper.title',
        descriptionKey: 'documentation.sections.helpers.validatorHelper.description',
        route: '/validator-helper',
      },
      {
        id: 'ui-size-helper',
        titleKey: 'documentation.sections.helpers.uiSizeHelper.title',
        descriptionKey: 'documentation.sections.helpers.uiSizeHelper.description',
        route: '/ui-size-helper',
      },
    ],
  },
  {
    id: 'core',
    titleKey: 'documentation.sections.core.title',
    descriptionKey: 'documentation.sections.core.description',
    icon: 'layers-outline',
    color: '#007AFF',
    items: [
      {
        id: 'theme-system',
        titleKey: 'documentation.sections.core.themeSystem.title',
        descriptionKey: 'documentation.sections.core.themeSystem.description',
      },
      {
        id: 'navigation',
        titleKey: 'documentation.sections.core.navigation.title',
        descriptionKey: 'documentation.sections.core.navigation.description',
      },
      {
        id: 'state-management',
        titleKey: 'documentation.sections.core.stateManagement.title',
        descriptionKey: 'documentation.sections.core.stateManagement.description',
      },
    ],
  },
  {
    id: 'components',
    titleKey: 'documentation.sections.components.title',
    descriptionKey: 'documentation.sections.components.description',
    icon: 'cube-outline',
    color: '#34C759',
    items: [
      {
        id: 'themed-components',
        titleKey: 'documentation.sections.components.themedComponents.title',
        descriptionKey: 'documentation.sections.components.themedComponents.description',
      },
      {
        id: 'form-components',
        titleKey: 'documentation.sections.components.formComponents.title',
        descriptionKey: 'documentation.sections.components.formComponents.description',
      },
      {
        id: 'layout-components',
        titleKey: 'documentation.sections.components.layoutComponents.title',
        descriptionKey: 'documentation.sections.components.layoutComponents.description',
      },
    ],
  },
  {
    id: 'guides',
    titleKey: 'documentation.sections.guides.title',
    descriptionKey: 'documentation.sections.guides.description',
    icon: 'book-outline',
    color: '#FF9500',
    items: [
      {
        id: 'getting-started',
        titleKey: 'documentation.sections.guides.gettingStarted.title',
        descriptionKey: 'documentation.sections.guides.gettingStarted.description',
      },
      {
        id: 'best-practices',
        titleKey: 'documentation.sections.guides.bestPractices.title',
        descriptionKey: 'documentation.sections.guides.bestPractices.description',
      },
      {
        id: 'troubleshooting',
        titleKey: 'documentation.sections.guides.troubleshooting.title',
        descriptionKey: 'documentation.sections.guides.troubleshooting.description',
      },
    ],
  },
];
