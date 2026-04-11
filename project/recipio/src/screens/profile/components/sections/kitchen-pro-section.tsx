import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useI18n } from '@/shared/i18n';
import { createProfileStyles } from '../../styles/profile.styles';

const GOLD = '#FFD700';

// Premium kitchen mockup (Unsplash – free to use)
const KITCHEN_PRO_MOCKUP_URI =
  'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=80';

interface KitchenProSectionProps {
  profileStyles: ReturnType<typeof createProfileStyles>;
}

export function KitchenProSection({ profileStyles }: KitchenProSectionProps) {
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
        <View style={profileStyles.kitchenProImage}>
          <Image
            source={{ uri: KITCHEN_PRO_MOCKUP_URI }}
            style={profileStyles.kitchenProImagePhoto}
            resizeMode="cover"
          />
          <View style={profileStyles.kitchenProImageBadge}>
            <MaterialCommunityIcons name="diamond-stone" size={20} color={GOLD} />
          </View>
        </View>
      </View>
    </View>
  );
}
