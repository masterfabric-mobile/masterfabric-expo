/**
 * Web View Input Field Component
 * 
 * Input fields for testing Web Viewer Helper with HTML content and URLs
 */

import { Button } from '@/src/shared/components/button';
import { t } from '@/src/shared/i18n';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React, { useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { CONTENT_TYPES, HTTP_METHODS } from '../constants/web-viewer-helper.constants';
import { WebViewInputFieldProps } from '../models/models';
import { webViewInputFieldStyles } from '../styles/web-view-input-field.styles';

export function WebViewInputField({
  testInput,
  onInputChange,
  onRunTests,
  onLoadContent,
  isLoading,
}: WebViewInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <ThemedView
        style={[
          webViewInputFieldStyles.container,
          {
            backgroundColor: colors.surfaceBackground,
            borderColor: colors.surfaceBorder + '50',
            shadowColor: colors.surfaceShadow || '#000',
          },
        ]}
    >
      <ThemedText
        type="subtitle"
        style={[webViewInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.webViewerHelper.testInput')}
      </ThemedText>

      {/* Content Type Selection */}
      <View style={webViewInputFieldStyles.contentTypeContainer}>
        <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
          {t('helpers.webViewerHelper.contentType')}
        </ThemedText>
        <View style={webViewInputFieldStyles.contentTypeButtons}>
          {CONTENT_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                webViewInputFieldStyles.contentTypeButton,
                {
                  backgroundColor:
                    testInput.contentType === type
                      ? colors.primary
                      : colors.inputBackground,
                  borderColor:
                    testInput.contentType === type
                      ? colors.primary
                      : colors.surfaceBorder,
                },
              ]}
              onPress={() => {
                // When switching content type, load default values for that type
                if (type === 'html') {
                  onInputChange({ 
                    contentType: type,
                    htmlContent: '<html><body><h1>Hello World!</h1></body></html>',
                  });
                } else if (type === 'url') {
                  onInputChange({ 
                    contentType: type,
                    urlContent: 'https://example.com',
                  });
                } else {
                  // Auto-detect - keep existing values or use defaults
                  onInputChange({ 
                    contentType: type,
                    htmlContent: testInput.htmlContent || '<html><body><h1>Hello World!</h1></body></html>',
                    urlContent: testInput.urlContent || 'https://example.com',
                  });
                }
              }}
              activeOpacity={0.7}
            >
              <ThemedText
                style={[
                  webViewInputFieldStyles.contentTypeButtonText,
                  {
                    color:
                      testInput.contentType === type
                        ? colors.text
                        : colors.bodyText,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit={true}
                minimumFontScale={0.8}
              >
                {t(`helpers.webViewerHelper.${type === 'auto' ? 'autoDetect' : type === 'html' ? 'htmlContent' : 'urlContent'}`)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* HTML Content Input */}
      {testInput.contentType === 'html' && (
        <View style={webViewInputFieldStyles.inputGroup}>
          <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
            {t('helpers.webViewerHelper.htmlInput')}
          </ThemedText>
          <TextInput
            style={[
              webViewInputFieldStyles.textArea,
              {
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              },
            ]}
            value={testInput.htmlContent}
            onChangeText={(text) => onInputChange({ htmlContent: text })}
            placeholder={t('helpers.webViewerHelper.htmlPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>
      )}

      {/* URL Content Input */}
      {testInput.contentType === 'url' && (
        <View style={webViewInputFieldStyles.inputGroup}>
          <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
            {t('helpers.webViewerHelper.urlInput')}
          </ThemedText>
          <TextInput
            style={[
              webViewInputFieldStyles.textInput,
              {
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              },
            ]}
            value={testInput.urlContent}
            onChangeText={(text) => onInputChange({ urlContent: text })}
            placeholder={t('helpers.webViewerHelper.urlPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
          />
        </View>
      )}

      {/* Auto-detect Content Input */}
      {testInput.contentType === 'auto' && (
        <View style={webViewInputFieldStyles.inputGroup}>
          <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
            {t('helpers.webViewerHelper.contentInput')}
          </ThemedText>
          <TextInput
            style={[
              webViewInputFieldStyles.textArea,
              {
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              },
            ]}
            value={testInput.htmlContent || testInput.urlContent || ''}
            onChangeText={(text) => {
              // Update both fields for auto-detect
              onInputChange({ htmlContent: text, urlContent: text });
            }}
            placeholder={t('helpers.webViewerHelper.contentPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
      )}

      {/* Advanced Options Toggle */}
      <TouchableOpacity
        style={[
          webViewInputFieldStyles.advancedToggle,
          {
            backgroundColor: showAdvanced ? colors.primary + '10' : 'transparent',
            borderColor: colors.surfaceBorder,
          },
        ]}
        onPress={() => setShowAdvanced(!showAdvanced)}
        activeOpacity={0.7}
      >
        <ThemedText style={[webViewInputFieldStyles.advancedToggleText, { color: colors.primary }]}>
          {showAdvanced ? '▼' : '▶'} {t('helpers.webViewerHelper.headersInput')}
        </ThemedText>
      </TouchableOpacity>

      {/* Advanced Options */}
      {showAdvanced && (
        <View style={webViewInputFieldStyles.advancedContainer}>
          {/* Base URL */}
          <View style={webViewInputFieldStyles.inputGroup}>
            <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
              {t('helpers.webViewerHelper.baseUrlInput')}
            </ThemedText>
            <TextInput
              style={[
                webViewInputFieldStyles.textInput,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                },
              ]}
              value={testInput.baseUrl || ''}
              onChangeText={(text) => onInputChange({ baseUrl: text })}
              placeholder={t('helpers.webViewerHelper.baseUrlPlaceholder')}
              placeholderTextColor={colors.placeholderText}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
            />
          </View>

          {/* Headers */}
          <View style={webViewInputFieldStyles.inputGroup}>
            <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
              {t('helpers.webViewerHelper.headersInput')}
            </ThemedText>
            <TextInput
              style={[
                webViewInputFieldStyles.textArea,
                {
                  backgroundColor: colors.inputBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                },
              ]}
              value={testInput.headers || ''}
              onChangeText={(text) => onInputChange({ headers: text })}
              placeholder={t('helpers.webViewerHelper.headersPlaceholder')}
              placeholderTextColor={colors.placeholderText}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>

          {/* Method (for URL only) */}
          {(testInput.contentType === 'url' || testInput.contentType === 'auto') && (
            <View style={webViewInputFieldStyles.inputGroup}>
              <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
                {t('helpers.webViewerHelper.methodInput')}
              </ThemedText>
              <View style={webViewInputFieldStyles.methodButtons}>
                {HTTP_METHODS.map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      webViewInputFieldStyles.methodButton,
                      {
                        backgroundColor:
                          testInput.method === method ? colors.primary : colors.inputBackground,
                        borderColor:
                          testInput.method === method ? colors.primary : colors.surfaceBorder,
                      },
                    ]}
                    onPress={() => onInputChange({ method })}
                    activeOpacity={0.7}
                  >
                    <ThemedText
                      style={[
                        webViewInputFieldStyles.methodButtonText,
                        {
                          color:
                            testInput.method === method
                              ? colors.text
                              : colors.bodyText,
                        },
                      ]}
                    >
                      {t(`helpers.webViewerHelper.method${method === 'GET' ? 'Get' : 'Post'}`)}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Body (for POST requests) */}
          {testInput.method === 'POST' && (
            <View style={webViewInputFieldStyles.inputGroup}>
              <ThemedText style={[webViewInputFieldStyles.label, { color: colors.bodyText }]}>
                {t('helpers.webViewerHelper.bodyInput')}
              </ThemedText>
              <TextInput
                style={[
                  webViewInputFieldStyles.textArea,
                  {
                    backgroundColor: colors.inputBackground,
                    color: colors.bodyText,
                    borderColor: colors.surfaceBorder,
                  },
                ]}
                value={testInput.body || ''}
                onChangeText={(text) => onInputChange({ body: text })}
                placeholder={t('helpers.webViewerHelper.bodyPlaceholder')}
                placeholderTextColor={colors.placeholderText}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          )}
        </View>
      )}

      {/* Action Buttons */}
      <View style={[webViewInputFieldStyles.buttonContainer, { borderTopColor: colors.surfaceBorder }]}>
        <Button
          title={t('helpers.webViewerHelper.runTests')}
          onPress={onRunTests}
          disabled={isLoading}
          variant="primary"
          style={webViewInputFieldStyles.button}
        />
        <Button
          title={t('helpers.webViewerHelper.loadContent')}
          onPress={onLoadContent}
          disabled={isLoading}
          variant="secondary"
          style={webViewInputFieldStyles.button}
          textStyle={{ color: colors.text }}
        />
      </View>
    </ThemedView>
  );
}
