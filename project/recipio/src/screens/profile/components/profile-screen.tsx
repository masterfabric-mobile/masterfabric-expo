import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/i18n';
import { useProfileViewModel } from '../hooks/use-profile-view-model';
import { UserInfoSection } from './sections/user-info-section';
import { StatsSection } from './sections/stats-section';
import { KitchenProSection } from './sections/kitchen-pro-section';
import { SettingsSection } from './sections/settings-section';
import { profileStyles } from '../styles/profile.styles';
import { RecipioColors } from '@/shared/constants/recipio-colors';

export function ProfileScreen() {
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
    handleEditProfilePress,
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
            <Ionicons name="chevron-back" size={24} color={RecipioColors.text} />
          </TouchableOpacity>
        </View>
        <Text style={profileStyles.title}>{t('profile.title')}</Text>
        <View style={[profileStyles.headerSide, profileStyles.headerSideRight]}>
          <TouchableOpacity
            style={profileStyles.headerButton}
            onPress={handleNotificationsPress}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={RecipioColors.text} />
          </TouchableOpacity>
        </View>
      </View>
      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 48 }}>
          <ActivityIndicator size="large" color={RecipioColors.primaryAccent} />
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
          onEditPress={handleEditProfilePress}
        />
        {isSignedIn && <StatsSection stats={stats} />}
        <KitchenProSection />
        <SettingsSection
          settings={settings}
          locale={locale}
          isSignedIn={isSignedIn}
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
