import { Text, View } from 'react-native';
import { useProfileViewModel } from '../hooks/use-profile-view-model';
import { PROFILE_PLACEHOLDER } from '../utils/profile-utils';
import { profileStyles } from '../styles/profile.styles';

export function ProfileScreen() {
  useProfileViewModel();

  return (
    <View style={profileStyles.container}>
      <Text style={profileStyles.text}>{PROFILE_PLACEHOLDER.title}</Text>
      <Text style={profileStyles.subtext}>{PROFILE_PLACEHOLDER.subtext}</Text>
    </View>
  );
}
