import React from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface SafeAreaScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
}

export const SafeAreaScrollView: React.FC<SafeAreaScrollViewProps> = ({
  children,
  style,
  ...scrollViewProps
}) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={[{ flex: 1 }, style]}
        showsVerticalScrollIndicator={false}
        {...scrollViewProps}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
};
