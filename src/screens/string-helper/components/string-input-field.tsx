import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { Button } from '@/src/shared/components/button';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextInput, View } from 'react-native';
import { StringTestInput } from '../models/string-helper-models';
import { stringInputFieldStyles } from '../styles/string-input-field.styles';

interface StringInputFieldProps {
  testInput: StringTestInput;
  onInputChange: (updates: Partial<StringTestInput>) => void;
  onRunTests: () => void;
  isLoading: boolean;
}

export function StringInputField({ 
  testInput, 
  onInputChange, 
  onRunTests, 
  isLoading 
}: StringInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  return (
    <ThemedView 
      style={[
        stringInputFieldStyles.container,
        { 
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <ThemedText 
        type="subtitle" 
        style={[stringInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.stringHelper.testInput')}
      </ThemedText>

      <View style={stringInputFieldStyles.inputGroup}>
        <ThemedText 
          style={[stringInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.stringHelper.textInput')}
        </ThemedText>
        <TextInput
          style={[
            stringInputFieldStyles.textInput,
            { 
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            }
          ]}
          value={testInput.text}
          onChangeText={(text) => onInputChange({ text })}
          placeholder={t('helpers.stringHelper.textPlaceholder')}
          placeholderTextColor={colors.placeholderText}
        />
      </View>

      <View style={stringInputFieldStyles.inputRow}>
        <View style={stringInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[stringInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.stringHelper.length')}
          </ThemedText>
          <TextInput
            style={[
              stringInputFieldStyles.numberInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.length?.toString() || ''}
            onChangeText={(text) => onInputChange({ length: parseInt(text) || 10 })}
            placeholder="10"
            placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
          />
        </View>

        <View style={stringInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[stringInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.stringHelper.suffix')}
          </ThemedText>
          <TextInput
            style={[
              stringInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.suffix || ''}
            onChangeText={(suffix) => onInputChange({ suffix })}
            placeholder="..."
            placeholderTextColor={colors.placeholderText}
          />
        </View>
      </View>

      <View style={stringInputFieldStyles.inputRow}>
        <View style={stringInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[stringInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.stringHelper.currency')}
          </ThemedText>
          <TextInput
            style={[
              stringInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.currency || ''}
            onChangeText={(currency) => onInputChange({ currency })}
            placeholder="USD"
            placeholderTextColor={colors.placeholderText}
          />
        </View>

        <View style={stringInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[stringInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.stringHelper.decimals')}
          </ThemedText>
          <TextInput
            style={[
              stringInputFieldStyles.numberInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.decimals?.toString() || ''}
            onChangeText={(text) => onInputChange({ decimals: parseInt(text) || 2 })}
            placeholder="2"
            placeholderTextColor={colors.placeholderText}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={stringInputFieldStyles.inputGroup}>
        <ThemedText 
          style={[stringInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.stringHelper.count')}
        </ThemedText>
        <TextInput
          style={[
            stringInputFieldStyles.numberInput,
            { 
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            }
          ]}
          value={testInput.count?.toString() || ''}
          onChangeText={(text) => onInputChange({ count: parseInt(text) || 1 })}
          placeholder="1"
          placeholderTextColor={colors.placeholderText}
          keyboardType="numeric"
        />
      </View>

      <Button
        title={isLoading ? t('helpers.stringHelper.runningTests') : t('helpers.stringHelper.runTests')}
        onPress={onRunTests}
        disabled={isLoading}
        variant="primary"
        size="large"
      />
    </ThemedView>
  );
}
