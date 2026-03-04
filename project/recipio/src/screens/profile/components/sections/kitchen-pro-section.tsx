import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useI18n } from '@/shared/i18n';
import { profileStyles } from '../../styles/profile.styles';
import { RecipioColors } from '@/shared/constants/recipio-colors';

const GOLD = '#FFD700';

export function KitchenProSection() {
  const { t } = useI18n();

  const handleUpgrade = () => {
    // TODO: Navigate to paywall; after successful purchase call:
    // import { updateUserPlan, PLAN_SLUGS } from '@/shared/services/user-service';
    // await updateUserPlan(PLAN_SLUGS.KITCHEN_PRO, expiryDate);
    // Plan is stored in Supabase profiles.plan_slug and shown on home (Current Plan card).
  };

  return (
    <View style={profileStyles.kitchenProSection}>
      <View style={profileStyles.kitchenProCard}>
        <View style={profileStyles.kitchenProContent}>
          <View style={profileStyles.kitchenProTitleRow}>
            <Ionicons name="trophy" size={22} color={GOLD} />
            <Text style={profileStyles.kitchenProTitle}>
              {t('profile.kitchenPro.title')}
            </Text>
          </View>
          <Text style={profileStyles.kitchenProDescription}>
            {t('profile.kitchenPro.description')}
          </Text>
          <TouchableOpacity
            style={profileStyles.kitchenProButton}
            onPress={handleUpgrade}
            activeOpacity={0.8}
          >
            <Text style={profileStyles.kitchenProButtonText}>
              {t('profile.kitchenPro.upgradeNow')}
            </Text>
          </TouchableOpacity>
        </View>
        <View style={profileStyles.kitchenProImage} />
      </View>
    </View>
  );
}
