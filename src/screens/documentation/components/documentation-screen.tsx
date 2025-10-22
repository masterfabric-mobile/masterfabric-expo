import React from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import {
    useMasterView,
    useThemeColors
} from 'masterfabric-expo-core';
import { useDocumentationViewModel } from '../hooks/use-documentation-view-model';
import { documentationStyles } from '../styles/documentation-styles';
import { DocumentationAccordion } from './documentation-accordion';

// Hook-based MasterView implementation for Documentation Screen
function DocumentationScreenContent() {
  const colors = useThemeColors();
  const { trackActivity } = useMasterView();
  
  const {
    documentationSections,
    navigateBack
  } = useDocumentationViewModel();

  // Track activity when component mounts
  React.useEffect(() => {
    trackActivity('documentation_initialized');
    
    return () => {
      trackActivity('documentation_destroyed');
    };
  }, [trackActivity]);

  return (
    <SafeAreaView 
      style={[documentationStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader 
        title={t('documentation.title')}
        subtitle={t('documentation.subtitle')}
        onBackPress={navigateBack}
        variant="minimal"
      />
      
      <ScrollView 
        style={documentationStyles.content}
        contentContainerStyle={documentationStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <DocumentationAccordion sections={documentationSections} />
      </ScrollView>
    </SafeAreaView>
  );
}

export function DocumentationScreen() {
  return <DocumentationScreenContent />;
}
