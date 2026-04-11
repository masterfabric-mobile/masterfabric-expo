import { Image, Text, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import type { ProfileUser } from '../../models/profile-models';
import { createProfileStyles } from '../../styles/profile.styles';
import { getDefaultAvatarUrl } from '../../utils/profile-utils';

interface UserInfoSectionProps {
  user: ProfileUser | null;
  isSignedIn: boolean;
  profileStyles: ReturnType<typeof createProfileStyles>;
}

export function UserInfoSection({ user, isSignedIn, profileStyles }: UserInfoSectionProps) {
  const { t } = useI18n();
  const avatarUri = user?.photoUrl ?? getDefaultAvatarUrl(user?.id ?? user?.email ?? 'guest');

  return (
    <View style={profileStyles.userSection}>
      <View style={profileStyles.avatarWrapper}>
        <Image
          source={{ uri: avatarUri }}
          style={profileStyles.avatar}
          resizeMode="cover"
        />
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
