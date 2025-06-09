import { ThemedText } from '@/src/shared/components/ThemedText';
import React from 'react';
import { View } from 'react-native';
import { User } from '../../models/home-models';
import { welcomeSectionStyles } from '../../styles/welcome-section.styles';

interface WelcomeSectionProps {
  greeting: string;
  user: User | null;
}

export function WelcomeSection({ greeting, user }: WelcomeSectionProps) {
  return (
    <View style={welcomeSectionStyles.container}>
      <ThemedText type="title" style={welcomeSectionStyles.greeting}>
        {greeting}
      </ThemedText>
      {user && (
        <ThemedText style={welcomeSectionStyles.userName}>
          {user.name}
        </ThemedText>
      )}
    </View>
  );
}
