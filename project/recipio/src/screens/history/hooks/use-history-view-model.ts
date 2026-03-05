import { useCallback, useEffect, useState } from 'react';
import { Alert, Platform } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import { useI18n } from '@/shared/i18n';
import { getRecipesByIds } from '@/shared/services/recipe-service';
import { useProfileStore } from '@/screens/profile/store/profile-store';
import { useHistoryStore } from '../store/history-store';
import * as historyService from '../services/history-service';
import { isInDateRange } from '../utils/history-utils';
import type { DateFilterType } from '../models/history-models';
import type { HistoryItemDisplay } from '../models/history-models';

export function useHistoryViewModel() {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [clearConfirmVisible, setClearConfirmVisible] = useState(false);
  const dietaryPreferences = useProfileStore((s) => s.settings.dietaryPreferences);
  const {
    items,
    dateFilter,
    displayList,
    isLoading,
    setLoading,
    setItems,
    setDisplayList,
    setDateFilter,
    clear: clearStore,
  } = useHistoryStore();

  const loadHistory = useCallback(async () => {
    setLoading(true);
    try {
      const entries = await historyService.getAllHistoryEntries();
      setItems(entries);
      const filtered = entries.filter((e) => isInDateRange(e.lastUpdatedAt, dateFilter));
      if (filtered.length === 0) {
        setDisplayList([]);
        setLoading(false);
        return;
      }
      const ids = filtered.map((e) => e.recipeId);
      const cards = await getRecipesByIds(ids, {
        locale,
        dietaryPreferences: dietaryPreferences ?? undefined,
      });
      const cardMap = new Map(cards.map((c) => [c.id, c]));
      const display: HistoryItemDisplay[] = filtered
        .map((e) => {
          const card = cardMap.get(e.recipeId);
          if (!card) return null;
          return {
            entry: e,
            recipeId: card.id,
            title: card.title,
            description: card.description,
            imageUrl: card.imageUrl,
            time: card.time,
            difficulty: card.difficulty,
          };
        })
        .filter((x): x is HistoryItemDisplay => x != null);
      setDisplayList(display);
    } catch (err) {
      console.warn('loadHistory error:', err);
      setDisplayList([]);
    } finally {
      setLoading(false);
    }
  }, [dateFilter, locale, dietaryPreferences, setItems, setDisplayList, setLoading]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [loadHistory])
  );

  const onDateFilterChange = useCallback(
    (filter: DateFilterType) => {
      setDateFilter(filter);
    },
    [setDateFilter]
  );

  const performClearHistory = useCallback(async () => {
    setLoading(true);
    try {
      await historyService.clearHistory();
      clearStore();
    } finally {
      setLoading(false);
    }
  }, [clearStore, setLoading]);

  const onClearHistory = useCallback(() => {
    if (Platform.OS === 'web') {
      setClearConfirmVisible(true);
      return;
    }
    const title = t('history.clearConfirmTitle');
    const message = t('history.clearConfirmMessage');
    const cancelText = t('history.clearConfirmCancel');
    const clearText = t('history.clearConfirmClear');
    Alert.alert(title, message, [
      { text: cancelText, style: 'cancel' },
      { text: clearText, onPress: performClearHistory },
    ]);
  }, [t, performClearHistory]);

  const onConfirmClearHistory = useCallback(async () => {
    await performClearHistory();
    setClearConfirmVisible(false);
  }, [performClearHistory]);

  const onRecipePress = useCallback(
    (recipeId: number) => {
      router.push(`/recipe-detail/${recipeId}`);
    },
    [router]
  );

  return {
    isLoading,
    displayList,
    dateFilter,
    onDateFilterChange,
    onClearHistory,
    onConfirmClearHistory,
    clearConfirmVisible,
    setClearConfirmVisible,
    onRecipePress,
    refresh: loadHistory,
  };
}
