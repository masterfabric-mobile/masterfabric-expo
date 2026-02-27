import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '@/shared/i18n';
import type { ProfileUser } from '../../models/profile-models';
import { profileStyles } from '../../styles/profile.styles';
import { RecipioColors } from '@/shared/constants/recipio-colors';

interface UserInfoSectionProps {
  user: ProfileUser | null;
  isSignedIn: boolean;
  onEditPress?: () => void;
}

export function UserInfoSection({ user, isSignedIn, onEditPress }: UserInfoSectionProps) {
  const { t } = useI18n();

  return (
    <View style={profileStyles.userSection}>
      <View style={profileStyles.avatarWrapper}>
        {user?.photoUrl ? (
          <Image
            source={{ uri: user.photoUrl }}
            style={profileStyles.avatar}
            resizeMode="cover"
          />
        ) : (
          <View style={profileStyles.avatar} />
        )}
        {isSignedIn && (
          <TouchableOpacity
            style={profileStyles.avatarEditBadge}
            onPress={onEditPress}
            activeOpacity={0.8}
          >
            <Ionicons name="pencil" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>
      {isSignedIn && user ? (
        <>
          <Text style={profileStyles.userName}>{user.name}</Text>
          <Text style={profileStyles.userEmail}>{user.email}</Text>
        </>
      ) : (
        <>
          <Text style={profileStyles.userName}>Guest</Text>
          <Text style={profileStyles.guestSubtext}>{t('profile.guestSubtext')}</Text>
        </>
      )}
    </View>
  );
}
