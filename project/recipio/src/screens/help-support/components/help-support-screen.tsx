import { useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { useHelpSupportViewModel } from '../hooks/use-help-support-view-model';
import { createHelpSupportStyles } from '../styles/help-support.styles';

const FAQ_ITEMS = [
  { q: 'helpSupport.faqQ1', a: 'helpSupport.faqA1' },
  { q: 'helpSupport.faqQ2', a: 'helpSupport.faqA2' },
  { q: 'helpSupport.faqQ3', a: 'helpSupport.faqA3' },
] as const;

export function HelpSupportScreen() {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const helpSupportStyles = useMemo(
    () => createHelpSupportStyles(colors),
    [colors],
  );
  const { handleBack, openEmail } = useHelpSupportViewModel();

  return (
    <SafeAreaView style={helpSupportStyles.container} edges={['top', 'bottom', 'left', 'right']}>
      <View style={helpSupportStyles.header}>
        <View style={helpSupportStyles.headerSide}>
          <TouchableOpacity onPress={handleBack} activeOpacity={0.7} hitSlop={12}>
            <Ionicons name="chevron-back" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
        <Text style={helpSupportStyles.headerTitle}>
          {t('helpSupport.title')}
        </Text>
        <View style={helpSupportStyles.headerSide} />
      </View>

      <ScrollView
        style={helpSupportStyles.scroll}
        contentContainerStyle={helpSupportStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={helpSupportStyles.section}>
          <Text style={helpSupportStyles.sectionTitle}>
            {t('helpSupport.faqTitle')}
          </Text>
          {FAQ_ITEMS.map(({ q, a }) => (
            <View key={q} style={helpSupportStyles.card}>
              <Text style={helpSupportStyles.faqQuestion}>{t(q)}</Text>
              <Text style={helpSupportStyles.faqAnswer}>{t(a)}</Text>
            </View>
          ))}
        </View>

        <View style={helpSupportStyles.section}>
          <Text style={helpSupportStyles.sectionTitle}>
            {t('helpSupport.contactTitle')}
          </Text>
          <View style={helpSupportStyles.card}>
            <Text style={helpSupportStyles.contactText}>
              {t('helpSupport.contactDescription')}
            </Text>
            <TouchableOpacity onPress={openEmail} activeOpacity={0.7}>
              <Text style={helpSupportStyles.emailLink}>
                {t('helpSupport.contactEmail')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={helpSupportStyles.section}>
          <Text style={helpSupportStyles.sectionTitle}>
            {t('helpSupport.feedbackTitle')}
          </Text>
          <View style={helpSupportStyles.card}>
            <Text style={helpSupportStyles.contactText}>
              {t('helpSupport.feedbackDescription')}
            </Text>
            <TouchableOpacity
              onPress={openEmail}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center' }}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.primaryAccent}
                style={{ marginRight: 6 }}
              />
              <Text style={helpSupportStyles.emailLink}>
                {t('helpSupport.contactEmail')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
