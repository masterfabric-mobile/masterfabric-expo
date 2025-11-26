import { ThemedText } from '@/src/shared/components/ThemedText';
import { ThemedView } from '@/src/shared/components/ThemedView';
import { t } from '@/src/shared/i18n';
import { Ionicons } from '@expo/vector-icons';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { BleLogEntry } from '../models/ble-helper-models';
import { logViewStyles } from '../styles/log-view.styles';

interface LogViewProps {
  logs: BleLogEntry[];
  onClearLogs: () => void;
}

/**
 * LogView Component
 * 
 * Displays a scrollable list of BLE operation logs.
 * Shows timestamped entries with different colors for info, success, error, and warning.
 */
export function LogView({ logs, onClearLogs }: LogViewProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const scrollViewRef = React.useRef<ScrollView>(null);

  React.useEffect(() => {
    // Auto-scroll to bottom when new logs are added
    if (logs.length > 0 && scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [logs.length]);

  const getLogColor = (type: BleLogEntry['type']) => {
    switch (type) {
      case 'success':
        return '#34C759';
      case 'error':
        return '#FF3B30';
      case 'warning':
        return '#FF9500';
      default:
        return colors.bodyText;
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  return (
    <ThemedView 
      style={[
        logViewStyles.container,
        {
          backgroundColor: colors.surfaceBackground,
          borderColor: colors.surfaceBorder + '30',
        }
      ]}
    >
      <View style={logViewStyles.header}>
        <ThemedText 
          type="subtitle" 
          style={[logViewStyles.title, { color: colors.sectionTitle }]}
        >
          {t('helpers.bleHelper.logs.title')} ({logs.length})
        </ThemedText>
        {logs.length > 0 && (
          <TouchableOpacity
            style={logViewStyles.clearButton}
            onPress={onClearLogs}
          >
            <Ionicons name="trash-outline" size={18} color={colors.labelText} />
            <ThemedText 
              style={[logViewStyles.clearButtonText, { color: colors.labelText }]}
            >
              {t('helpers.bleHelper.logs.clear')}
            </ThemedText>
          </TouchableOpacity>
        )}
      </View>

      {logs.length === 0 ? (
        <View style={logViewStyles.emptyContainer}>
          <Ionicons name="document-text-outline" size={48} color={colors.labelText} />
          <ThemedText 
            style={[logViewStyles.emptyText, { color: colors.labelText }]}
          >
            {t('helpers.bleHelper.logs.empty')}
          </ThemedText>
        </View>
      ) : (
        <ScrollView
          ref={scrollViewRef}
          style={logViewStyles.scrollView}
          contentContainerStyle={logViewStyles.scrollContent}
          showsVerticalScrollIndicator={true}
        >
          {logs.map((log) => (
            <View
              key={log.id}
              style={[
                logViewStyles.logEntry,
                {
                  backgroundColor: colors.background,
                  borderLeftColor: getLogColor(log.type),
                }
              ]}
            >
              <View style={logViewStyles.logHeader}>
                <Ionicons 
                  name={
                    log.type === 'success' ? 'checkmark-circle' :
                    log.type === 'error' ? 'close-circle' :
                    log.type === 'warning' ? 'warning' : 'information-circle'
                  }
                  size={16}
                  color={getLogColor(log.type)}
                />
                <ThemedText 
                  style={[logViewStyles.logTimestamp, { color: colors.labelText }]}
                >
                  {formatTimestamp(log.timestamp)}
                </ThemedText>
              </View>
              <ThemedText 
                style={[logViewStyles.logMessage, { color: getLogColor(log.type) }]}
              >
                {log.message}
              </ThemedText>
            </View>
          ))}
        </ScrollView>
      )}
    </ThemedView>
  );
}

