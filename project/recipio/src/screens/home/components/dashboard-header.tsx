import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { createHomeStyles } from '../styles/home.styles';

interface DashboardHeaderProps {
  homeStyles: ReturnType<typeof createHomeStyles>;
  greeting: string;
  userName: string;
  avatarUrl?: string;
  onSearchPress?: () => void;
  onProfilePress?: () => void;
}

export function DashboardHeader({
  homeStyles,
  greeting,
  userName,
  avatarUrl,
  onSearchPress,
  onProfilePress,
}: DashboardHeaderProps) {
  const { t } = useI18n();
  return (
    <View style={homeStyles.header}>
      <View style={homeStyles.searchRow}>
        <TouchableOpacity
          style={homeStyles.searchTouchable}
          onPress={onSearchPress}
          activeOpacity={0.8}
          accessibilityLabel={t('recipeSearch.placeholder')}
        >
          <Ionicons
            name="search"
            size={22}
            color={homeStyles.viewAllText.color}
            style={homeStyles.searchIcon}
          />
          <Text style={homeStyles.searchPlaceholder} numberOfLines={1}>
            {t('recipeSearch.placeholder')}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={homeStyles.viewAllText.color} />
        </TouchableOpacity>
        <TouchableOpacity
          style={homeStyles.avatarButton}
          onPress={onProfilePress}
          activeOpacity={0.7}
          accessibilityLabel={t('home.welcome', { name: userName })}
        >
          {avatarUrl ? (
            <Image source={{ uri: avatarUrl }} style={homeStyles.avatar} />
          ) : (
            <Ionicons name="person" size={24} color={homeStyles.greetingText.color} />
          )}
        </TouchableOpacity>
      </View>
      <View style={homeStyles.welcomeBlock}>
        <View>
          <Text style={homeStyles.greetingText}>{greeting}</Text>
          <Text style={homeStyles.userNameText} numberOfLines={1}>
            {t('home.welcome', { name: userName })}
          </Text>
        </View>
      </View>
    </View>
  );
}
