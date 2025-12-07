import { Button } from '@/src/shared/components/button';
import { t } from '@/src/shared/i18n';
import { ThemedText, ThemedView, getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { TextInput, View } from 'react-native';
import { UrlInputFieldProps } from '../models/url-launcher-helper-models';
import { urlInputFieldStyles } from '../styles/url-input-field.styles';
import { canLaunchEmail } from '../utils';
import { UrlLauncherAccordion } from './url-launcher-accordion';

export function UrlInputField({ 
  testInput, 
  onInputChange, 
  onRunTests,
  onLaunchUrl,
  onLaunchEmail,
  onLaunchPhone,
  onLaunchSMS,
  onLaunchMap,
  onLaunchInBrowser,
  onLaunchAppStore,
  onLaunchSettings,
  onLaunchDeepLink,
  isLoading 
}: UrlInputFieldProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  // Check if email can be launched (recipient OR subject/body)
  const emailCanLaunch = canLaunchEmail(testInput);

  return (
    <ThemedView 
      style={[
        urlInputFieldStyles.container,
        { 
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '25',
        }
      ]}
    >
      <ThemedText 
        type="subtitle" 
        style={[urlInputFieldStyles.title, { color: colors.sectionTitle }]}
      >
        {t('helpers.urlLauncherHelper.testInput')}
      </ThemedText>

      {/* URL Section - Always visible */}
      <View style={urlInputFieldStyles.inputGroup}>
        <ThemedText 
          style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
        >
          {t('helpers.urlLauncherHelper.urlInput')}
        </ThemedText>
        <TextInput
          style={[
            urlInputFieldStyles.textInput,
            { 
              backgroundColor: colors.inputBackground,
              color: colors.bodyText,
              borderColor: colors.surfaceBorder,
            }
          ]}
          value={testInput.url}
          onChangeText={(url) => onInputChange({ url })}
          placeholder={t('helpers.urlLauncherHelper.urlPlaceholder')}
          placeholderTextColor={colors.placeholderText}
          autoCapitalize="none"
          keyboardType="url"
        />
        <View style={{ marginTop: 12 }}>
          <Button
            title={t('helpers.urlLauncherHelper.openUrl')}
            onPress={() => onLaunchUrl(testInput.url)}
            disabled={isLoading || !testInput.url}
            variant="primary"
            size="medium"
          />
        </View>
      </View>

      {/* Email Section - Accordion (default collapsed) */}
      <UrlLauncherAccordion 
        title={t('helpers.urlLauncherHelper.emailSection')}
        defaultExpanded={false}
      >
        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.emailInput')} ({t('helpers.urlLauncherHelper.optional')})
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.email || ''}
            onChangeText={(email) => onInputChange({ email })}
            placeholder={t('helpers.urlLauncherHelper.emailPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={urlInputFieldStyles.inputRow}>
          <View style={[urlInputFieldStyles.inputGroup, { flex: 1 }]}>
            <ThemedText 
              style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
            >
              {t('helpers.urlLauncherHelper.emailSubject')}
            </ThemedText>
            <TextInput
              style={[
                urlInputFieldStyles.textInput,
                { 
                  backgroundColor: colors.inputBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                }
              ]}
              value={testInput.emailSubject || ''}
              onChangeText={(emailSubject) => onInputChange({ emailSubject })}
              placeholder={t('helpers.urlLauncherHelper.emailSubjectPlaceholder')}
              placeholderTextColor={colors.placeholderText}
            />
          </View>
        </View>

        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.emailBody')}
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
                minHeight: 80,
                textAlignVertical: 'top',
              }
            ]}
            value={testInput.emailBody || ''}
            onChangeText={(emailBody) => onInputChange({ emailBody })}
            placeholder={t('helpers.urlLauncherHelper.emailBodyPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            multiline
          />
        </View>

        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.emailCc')} ({t('helpers.urlLauncherHelper.optional')})
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.emailCc || ''}
            onChangeText={(emailCc) => onInputChange({ emailCc })}
            placeholder={t('helpers.urlLauncherHelper.emailCcPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.emailBcc')} ({t('helpers.urlLauncherHelper.optional')})
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.emailBcc || ''}
            onChangeText={(emailBcc) => onInputChange({ emailBcc })}
            placeholder={t('helpers.urlLauncherHelper.emailBccPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            title={t('helpers.urlLauncherHelper.openEmail')}
            onPress={onLaunchEmail}
            disabled={isLoading || !emailCanLaunch}
            variant="primary"
            size="medium"
          />
        </View>
      </UrlLauncherAccordion>

      {/* Phone Section - Accordion (default collapsed) */}
      <UrlLauncherAccordion 
        title={t('helpers.urlLauncherHelper.phoneSection')}
        defaultExpanded={false}
      >
        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.phoneInput')}
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.phone || ''}
            onChangeText={(phone) => onInputChange({ phone })}
            placeholder={t('helpers.urlLauncherHelper.phonePlaceholder')}
            placeholderTextColor={colors.placeholderText}
            keyboardType="phone-pad"
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            title={t('helpers.urlLauncherHelper.openPhone')}
            onPress={onLaunchPhone}
            disabled={isLoading || !testInput.phone}
            variant="primary"
            size="medium"
          />
        </View>
      </UrlLauncherAccordion>

      {/* SMS Section - Accordion (default collapsed) */}
      <UrlLauncherAccordion 
        title={t('helpers.urlLauncherHelper.smsSection')}
        defaultExpanded={false}
      >
        <View style={urlInputFieldStyles.inputRow}>
          <View style={[urlInputFieldStyles.inputGroup, { flex: 1 }]}>
            <ThemedText 
              style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
            >
              {t('helpers.urlLauncherHelper.smsRecipients')}
            </ThemedText>
            <TextInput
              style={[
                urlInputFieldStyles.textInput,
                { 
                  backgroundColor: colors.inputBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                }
              ]}
              value={testInput.smsRecipients || ''}
              onChangeText={(smsRecipients) => onInputChange({ smsRecipients })}
              placeholder={t('helpers.urlLauncherHelper.smsRecipientsPlaceholder')}
              placeholderTextColor={colors.placeholderText}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.smsBody')}
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
                minHeight: 60,
                textAlignVertical: 'top',
              }
            ]}
            value={testInput.smsBody || ''}
            onChangeText={(smsBody) => onInputChange({ smsBody })}
            placeholder={t('helpers.urlLauncherHelper.smsBodyPlaceholder')}
            placeholderTextColor={colors.placeholderText}
            multiline
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            title={t('helpers.urlLauncherHelper.openSMS')}
            onPress={onLaunchSMS}
            disabled={isLoading || !testInput.smsRecipients}
            variant="primary"
            size="medium"
          />
        </View>
      </UrlLauncherAccordion>

      {/* Map Section - Accordion (default collapsed) */}
      <UrlLauncherAccordion 
        title={t('helpers.urlLauncherHelper.mapSection')}
        defaultExpanded={false}
      >
        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.mapAddress')}
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.mapAddress || ''}
            onChangeText={(mapAddress) => onInputChange({ mapAddress })}
            placeholder={t('helpers.urlLauncherHelper.mapAddressPlaceholder')}
            placeholderTextColor={colors.placeholderText}
          />
        </View>

        <View style={urlInputFieldStyles.inputRow}>
          <View style={[urlInputFieldStyles.inputGroup, { flex: 1 }]}>
            <ThemedText 
              style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
            >
              {t('helpers.urlLauncherHelper.mapLatitude')}
            </ThemedText>
            <TextInput
              style={[
                urlInputFieldStyles.numberInput,
                { 
                  backgroundColor: colors.inputBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                }
              ]}
              value={testInput.mapLatitude?.toString() || ''}
              onChangeText={(text) => onInputChange({ mapLatitude: parseFloat(text) || undefined })}
              placeholder={t('helpers.urlLauncherHelper.mapLatitudePlaceholder')}
              placeholderTextColor={colors.placeholderText}
              keyboardType="numeric"
            />
          </View>

          <View style={[urlInputFieldStyles.inputGroup, { flex: 1 }]}>
            <ThemedText 
              style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
            >
              {t('helpers.urlLauncherHelper.mapLongitude')}
            </ThemedText>
            <TextInput
              style={[
                urlInputFieldStyles.numberInput,
                { 
                  backgroundColor: colors.inputBackground,
                  color: colors.bodyText,
                  borderColor: colors.surfaceBorder,
                }
              ]}
              value={testInput.mapLongitude?.toString() || ''}
              onChangeText={(text) => onInputChange({ mapLongitude: parseFloat(text) || undefined })}
              placeholder={t('helpers.urlLauncherHelper.mapLongitudePlaceholder')}
              placeholderTextColor={colors.placeholderText}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={urlInputFieldStyles.inputGroup}>
          <ThemedText 
            style={[urlInputFieldStyles.label, { color: colors.bodyText }]}
          >
            {t('helpers.urlLauncherHelper.mapLabel')}
          </ThemedText>
          <TextInput
            style={[
              urlInputFieldStyles.textInput,
              { 
                backgroundColor: colors.inputBackground,
                color: colors.bodyText,
                borderColor: colors.surfaceBorder,
              }
            ]}
            value={testInput.mapLabel || ''}
            onChangeText={(mapLabel) => onInputChange({ mapLabel })}
            placeholder={t('helpers.urlLauncherHelper.mapLabelPlaceholder')}
            placeholderTextColor={colors.placeholderText}
          />
        </View>

        <View style={{ marginTop: 12 }}>
          <Button
            title={t('helpers.urlLauncherHelper.openMap')}
            onPress={onLaunchMap}
            disabled={isLoading || (!testInput.mapAddress && (!testInput.mapLatitude || !testInput.mapLongitude))}
            variant="primary"
            size="medium"
          />
        </View>
      </UrlLauncherAccordion>

      {/* Run All Tests Button */}
      <View style={{ marginTop: 24 }}>
        <Button
          title={isLoading ? t('helpers.urlLauncherHelper.runningTests') : t('helpers.urlLauncherHelper.runTests')}
          onPress={onRunTests}
          disabled={isLoading}
          variant="primary"
          size="large"
        />
      </View>
    </ThemedView>
  );
}
