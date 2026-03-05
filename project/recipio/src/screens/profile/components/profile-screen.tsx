import { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useProfileViewModel } from '../hooks/use-profile-view-model';
import { UserInfoSection } from './sections/user-info-section';
import { StatsSection } from './sections/stats-section';
import { KitchenProSection } from './sections/kitchen-pro-section';
import { SettingsSection } from './sections/settings-section';
import { createProfileStyles } from '../styles/profile.styles';

export function ProfileScreen() {
  const colors = useRecipioColors();
  const profileStyles = useMemo(() => createProfileStyles(colors), [colors]);
  const { t } = useI18n();
  const router = useRouter();
  const {
    isLoading,
    isSignedIn,
    user,
    stats,
    settings,
    handleSignInPress,
    handleSignOutPress,
    handleNotificationsPress,
    handleLanguagePress,
    handleThemePress,
    handleDietaryPreferencesPress,
    handleHelpSupportPress,
    locale,
  } = useProfileViewModel();

  return (
    <View style={profileStyles.container}>
      <View style={profileStyles.header}>
        <View style={profileStyles.headerSide}>
          <TouchableOpacity
            style={profileStyles.headerButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={profileStyles.title}>{t('profile.title')}</Text>
        <View style={[profileStyles.headerSide, profileStyles.headerSideRight]}>
          <TouchableOpacity
            style={profileStyles.headerButton}
            onPress={handleNotificationsPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={colors.primaryAccent} />
        </View>
      ) : (
      <ScrollView
        style={profileStyles.scroll}
        contentContainerStyle={profileStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <UserInfoSection
          user={user}
          isSignedIn={isSignedIn}
          profileStyles={profileStyles}
        />
        {isSignedIn && <StatsSection stats={stats} profileStyles={profileStyles} />}
        <KitchenProSection profileStyles={profileStyles} />
        <SettingsSection
          settings={settings}
          locale={locale}
          isSignedIn={isSignedIn}
          profileStyles={profileStyles}
          colors={colors}
          onLanguagePress={handleLanguagePress}
          onThemePress={handleThemePress}
          onDietaryPreferencesPress={handleDietaryPreferencesPress}
          onHelpSupportPress={handleHelpSupportPress}
          onSignOutPress={handleSignOutPress}
        />
        {!isSignedIn && (
          <View style={profileStyles.actionsSection}>
            <TouchableOpacity
              style={profileStyles.signInButton}
              onPress={handleSignInPress}
              activeOpacity={0.8}
            >
              <Text style={profileStyles.signInButtonText}>
                {t('profile.signIn')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
      )}
    </View>
  );
}
