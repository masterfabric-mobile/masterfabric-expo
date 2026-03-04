import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '@/shared/i18n';
import type { ProfileSettings } from '../../models/profile-models';
import { profileStyles } from '../../styles/profile.styles';
import { RecipioColors } from '@/shared/constants/recipio-colors';

interface SettingsSectionProps {
  settings: ProfileSettings;
  locale: string;
  isSignedIn: boolean;
  onLanguagePress?: () => void;
  onThemePress?: () => void;
  onDietaryPreferencesPress?: () => void;
  onHelpSupportPress?: () => void;
  onSignOutPress?: () => void;
}

export function SettingsSection({
  settings,
  locale,
  isSignedIn,
  onLanguagePress,
  onThemePress,
  onDietaryPreferencesPress,
  onHelpSupportPress,
  onSignOutPress,
}: SettingsSectionProps) {
  const { t } = useI18n();

  return (
    <View style={profileStyles.settingsSection}>
      <Text style={profileStyles.accountSectionTitle}>
        {t('profile.settings.accountSettings')}
      </Text>
      <View style={profileStyles.settingsCard}>
        <TouchableOpacity
          style={profileStyles.settingsRow}
          onPress={onDietaryPreferencesPress}
          activeOpacity={0.7}
        >
          <View style={profileStyles.settingsRowLeft}>
            <View style={profileStyles.settingsRowIcon}>
              <Ionicons name="heart-outline" size={22} color={RecipioColors.text} />
            </View>
            <Text style={profileStyles.settingsRowLabel}>
              {t('profile.settings.dietaryPreferences')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={RecipioColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={profileStyles.settingsRow}
          onPress={onLanguagePress}
          activeOpacity={0.7}
        >
          <View style={profileStyles.settingsRowLeft}>
            <View style={profileStyles.settingsRowIcon}>
              <Ionicons name="language-outline" size={22} color={RecipioColors.text} />
            </View>
            <Text style={profileStyles.settingsRowLabel}>
              {t('profile.settings.language')}
            </Text>
          </View>
          <Text style={[profileStyles.settingsRowLabel, { marginRight: 4 }]}>
            {locale === 'tr' ? t('profile.settings.languageValueTr') : t('profile.settings.languageValue')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={RecipioColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={profileStyles.settingsRow}
          onPress={onThemePress}
          activeOpacity={0.7}
        >
          <View style={profileStyles.settingsRowLeft}>
            <View style={profileStyles.settingsRowIcon}>
              <Ionicons name="contrast-outline" size={22} color={RecipioColors.text} />
            </View>
            <Text style={profileStyles.settingsRowLabel}>
              {t('profile.settings.theme')}
            </Text>
          </View>
          <Text style={[profileStyles.settingsRowLabel, { marginRight: 4 }]}>
            {settings.theme === 'dark' ? t('profile.settings.themeValue') : t('profile.settings.themeLight')}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={RecipioColors.textSecondary} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[profileStyles.settingsRow, !isSignedIn && profileStyles.settingsRowLast]}
          onPress={onHelpSupportPress}
          activeOpacity={0.7}
        >
          <View style={profileStyles.settingsRowLeft}>
            <View style={profileStyles.settingsRowIcon}>
              <Ionicons name="help-circle-outline" size={22} color={RecipioColors.text} />
            </View>
            <Text style={profileStyles.settingsRowLabel}>
              {t('profile.settings.helpSupport')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={RecipioColors.textSecondary} />
        </TouchableOpacity>

        {isSignedIn && (
          <TouchableOpacity
            style={[profileStyles.settingsRow, profileStyles.settingsRowLast]}
            onPress={onSignOutPress}
            activeOpacity={0.7}
          >
            <View style={profileStyles.settingsRowLeft}>
              <View style={profileStyles.settingsRowIcon}>
                <Ionicons name="log-out-outline" size={22} color={RecipioColors.primaryAccent} />
              </View>
              <Text style={profileStyles.settingsRowLabelLogout}>
                {t('profile.signOut')}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
