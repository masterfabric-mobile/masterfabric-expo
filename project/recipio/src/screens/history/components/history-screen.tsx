import { useMemo } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useI18n } from '@/shared/i18n';
import { useRecipioColors } from '@/shared/hooks/use-recipio-colors';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { useHistoryViewModel } from '../hooks/use-history-view-model';
import { HistoryList } from './sections/history-list';
import { createHistoryStyles } from '../styles/history.styles';
import { createRecipeSearchStyles } from '@/screens/recipe-search/styles/recipe-search.styles';

export function HistoryScreen() {
  const { t } = useI18n();
  const colors = useRecipioColors();
  const historyStyles = useMemo(() => createHistoryStyles(colors), [colors]);
  const recipeRowStyles = useMemo(() => createRecipeSearchStyles(colors), [colors]);
  const {
    isLoading,
    displayList,
    onClearHistory,
    onConfirmClearHistory,
    clearConfirmVisible,
    setClearConfirmVisible,
    onRecipePress,
    refresh,
  } = useHistoryViewModel();

  // Early return for confirm modal (needed in all branches)
  const confirmModal = (
    <ConfirmModal
      visible={clearConfirmVisible}
      title={t('history.clearConfirmTitle')}
      message={t('history.clearConfirmMessage')}
      cancelText={t('history.clearConfirmCancel')}
      confirmText={t('history.clearConfirmClear')}
      onCancel={() => setClearConfirmVisible(false)}
      onConfirm={onConfirmClearHistory}
      destructive
    />
  );

  if (isLoading && displayList.length === 0) {
    return (
      <View style={historyStyles.container}>
        <View style={historyStyles.header}>
          <View style={historyStyles.headerContent}>
            <Text style={historyStyles.headerTitle}>{t('history.title')}</Text>
          </View>
        </View>
        <View style={[historyStyles.empty, { flex: 1 }]}>
          <ActivityIndicator size="large" color={colors.primaryAccent} />
        </View>
        {confirmModal}
      </View>
    );
  }

  if (displayList.length === 0) {
    return (
      <View style={historyStyles.container}>
        <View style={historyStyles.header}>
          <View style={historyStyles.headerContent}>
            <Text style={historyStyles.headerTitle}>{t('history.title')}</Text>
            <Text style={historyStyles.headerSubtitle}>
              {t('history.subtitleEmpty')}
            </Text>
          </View>
        </View>
        <View style={historyStyles.empty}>
          <Text style={historyStyles.emptyIcon}>🕒</Text>
          <Text style={historyStyles.emptyText}>{t('history.emptyTitle')}</Text>
          <Text style={historyStyles.emptySubtext}>{t('history.emptySubtext')}</Text>
        </View>
        {confirmModal}
      </View>
    );
  }

  return (
    <View style={historyStyles.container}>
      <View style={historyStyles.header}>
        <View style={historyStyles.headerContent}>
          <Text style={historyStyles.headerTitle}>{t('history.title')}</Text>
          <Text style={historyStyles.headerSubtitle}>
            {t('history.subtitleCount', { count: displayList.length })}
          </Text>
        </View>
        <TouchableOpacity
          style={historyStyles.headerClearButton}
          onPress={onClearHistory}
          activeOpacity={0.8}
        >
          <Text style={historyStyles.clearButtonText}>{t('history.clear')}</Text>
        </TouchableOpacity>
      </View>
      <HistoryList
        historyStyles={historyStyles}
        recipeRowStyles={recipeRowStyles}
        colors={colors}
        items={displayList}
        isLoading={isLoading}
        onRefresh={refresh}
        onRecipePress={onRecipePress}
      />
      {confirmModal}
    </View>
  );
}
