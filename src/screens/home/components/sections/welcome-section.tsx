import React from 'react';
import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { welcomeSectionStyles } from '../../styles/welcome-section.styles';
import { User } from '../../models/home-models';

interface WelcomeSectionProps {
  greeting: string;
  user: User | null;
}

export function WelcomeSection({ greeting, user }: WelcomeSectionProps) {
  return (
    <ThemedView style={welcomeSectionStyles.container}>
      <ThemedText type="title" style={welcomeSectionStyles.greeting}>
        {greeting}
      </ThemedText>
      {user && (
        <ThemedText type="subtitle" style={welcomeSectionStyles.userName}>
          {user.name}
        </ThemedText>
      )}
    </ThemedView>
  );
}
