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
        id: 'device-info-helper',
        titleKey: 'documentation.sections.helpers.deviceInfo.title',
        descriptionKey: 'documentation.sections.helpers.deviceInfo.description',
      },
      {
        id: 'validation-helper',
        titleKey: 'documentation.sections.helpers.validation.title',
        descriptionKey: 'documentation.sections.helpers.validation.description',
      },
      {
        id: 'formatting-helper',
        titleKey: 'documentation.sections.helpers.formatting.title',
        descriptionKey: 'documentation.sections.helpers.formatting.description',
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
