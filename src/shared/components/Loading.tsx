import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native';
import { t } from '../i18n';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  style?: ViewStyle;
  textStyle?: TextStyle;
  testID?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'large',
  color = '#007AFF',
  text,
  style,
  textStyle,
  testID = 'loading-indicator',
}) => {
  const loadingText = text || t('common.loading');
  
  return (
    <View 
      style={[styles.container, style]}
      testID={testID}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={loadingText}
    >
      <ActivityIndicator 
        size={size} 
        color={color}
        accessibilityLabel={t('accessibility.loadingIndicator')}
      />
      {loadingText && (
        <Text 
          style={[styles.text, textStyle]}
          accessible={true}
          accessibilityRole="text"
        >
          {loadingText}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});
