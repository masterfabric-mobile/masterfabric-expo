import { Ionicons } from '@expo/vector-icons';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { dashboardStyles } from '../styles/dashboard.styles';

interface DashboardHeaderProps {
  greeting: string;
  userName: string;
  avatarUrl?: string;
  onSearchPress?: () => void;
}

export function DashboardHeader({
  greeting,
  userName,
  avatarUrl,
  onSearchPress = () => {},
}: DashboardHeaderProps) {
  return (
    <View style={dashboardStyles.header}>
      <View style={dashboardStyles.headerContent}>
        <View style={dashboardStyles.profileSection}>
          {avatarUrl ? (
            <Image
              source={{ uri: avatarUrl }}
              style={dashboardStyles.avatar}
            />
          ) : (
            <View style={[dashboardStyles.avatar, { justifyContent: 'center', alignItems: 'center' }]}>
              <Ionicons name="person" size={24} color="#8E8E93" />
            </View>
          )}
          <View>
            <Text style={dashboardStyles.greetingText}>{greeting}</Text>
            <Text style={dashboardStyles.userNameText}>Welcome, {userName}!</Text>
          </View>
        </View>
        <TouchableOpacity
          style={dashboardStyles.searchButton}
          onPress={onSearchPress}
        >
          <Ionicons name="search" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
