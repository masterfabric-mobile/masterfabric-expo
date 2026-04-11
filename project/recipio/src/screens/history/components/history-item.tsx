import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import type { RecipioColorsPalette } from '@/shared/constants/recipio-colors';
import { formatRecipeDifficulty, formatRecipeTime } from '@/shared/utils/recipe-display';
import type { HistoryItemDisplay } from '../models/history-models';
import { createHistoryStyles, getStatusBadgeColor } from '../styles/history.styles';

interface HistoryItemProps {
  historyStyles: ReturnType<typeof createHistoryStyles>;
  colors: RecipioColorsPalette;
  item: HistoryItemDisplay;
  onPress: (recipeId: number) => void;
}

const STATUS_KEYS: Record<HistoryItemDisplay['entry']['status'], string> = {
  viewed: 'history.viewed',
  started: 'history.started',
  in_progress: 'history.inProgress',
  completed: 'history.cooked',
  abandoned: 'history.abandoned',
};

export function HistoryItem({ historyStyles, colors, item, onPress }: HistoryItemProps) {
  const { t } = useI18n();
  const statusKey = STATUS_KEYS[item.entry.status];
  const statusLabel = t(statusKey);

  return (
    <TouchableOpacity
      style={historyStyles.card}
      onPress={() => onPress(item.recipeId)}
      activeOpacity={0.85}
    >
      <View style={historyStyles.cardImageWrap}>
        {item.imageUrl ? (
          <Image
            source={{ uri: item.imageUrl }}
            style={historyStyles.cardImage}
            resizeMode="cover"
          />
        ) : (
          <View
            style={[
              historyStyles.cardImageWrap,
              { justifyContent: 'center', alignItems: 'center' },
            ]}
          >
            <Text style={{ fontSize: 40 }}>🍳</Text>
          </View>
        )}
        <View
          style={[
            historyStyles.statusBadge,
            getStatusBadgeColor(colors, item.entry.status),
          ]}
        >
          <Text style={historyStyles.statusBadgeText} numberOfLines={1}>
            {statusLabel}
          </Text>
        </View>
      </View>
      <View style={historyStyles.cardBody}>
        <Text style={historyStyles.cardTitle} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={historyStyles.cardMeta}>
          <Text style={historyStyles.cardMetaText}>
            {formatRecipeTime(t, item.time)}
          </Text>
          <Text style={historyStyles.cardMetaText}>•</Text>
          <Text style={historyStyles.cardMetaText}>
            {formatRecipeDifficulty(t, item.difficulty)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
