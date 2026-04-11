import { loggerService } from '@/src/shared/services/logger-service';
import { Ionicons } from '@expo/vector-icons';
import { Sizing, getThemeColors, typographyHelper, useTheme } from 'masterfabric-expo-core';
import type { LogLevel } from 'masterfabric-expo-core';
import React, { useEffect, useMemo, useState } from 'react';
import { Text, View } from 'react-native';

// Component for displaying log entries in reverse chronological order
export function LogViewer() {
  const { currentTheme } = useTheme();
  const colors = getThemeColors(currentTheme === 'dark');
  const [logs, setLogs] = useState(() => loggerService.getLogs(true));

  // Subscribe to log updates and unsubscribe on unmount
  useEffect(() => {
    const unsubscribe = loggerService.subscribeFull((list) => setLogs(list));
    return unsubscribe;
  }, []);

  // Reverse logs to show newest entries first
  const filtered = useMemo(() => {
    return [...logs].reverse();
  }, [logs]);

  // Icon and color mapping for each log level
  const iconByLevel: Record<LogLevel, { name: keyof typeof Ionicons.glyphMap; color: string }> = {
    info: { name: 'information-circle', color: colors.tint },
    debug: { name: 'bug', color: '#34C759' },
    warning: { name: 'warning', color: '#FF9500' },
    error: { name: 'close-circle', color: '#FF3B30' },
    verbose: { name: 'ellipsis-horizontal-circle', color: colors.labelText },
  };

  return (
    <View style={{ gap: Sizing.gap.s }}>
      {filtered.map((item) => {
        const icon = iconByLevel[item.level];
        return (
          <View key={item.id} style={{ flexDirection: Sizing.layout.flexDirection.row, alignItems: Sizing.layout.alignItems.flexStart, gap: Sizing.gap.s, paddingVertical: Sizing.padding.xxs }}>
            <Ionicons name={icon.name} size={Sizing.icon.s} color={icon.color} />
            <View style={{ flex: Sizing.flexNumber.full }}>
              <Text style={[{ color: colors.titleText }, typographyHelper.fromSizing.createStyle(Sizing, 'm', 'semibold', 'normal')]}>
                {' '}{item.level.toUpperCase()} {item.showTimestamp ? `${item.timestamp.toLocaleTimeString()} ` : ''}{item.component ? `[${item.component}]` : ''}
              </Text>
              <Text style={[{ color: colors.bodyText }, typographyHelper.fromSizing.createStyle(Sizing, 's', 'normal', 'normal')]}>{item.message}</Text>
              {item.metadata ? (
                <Text style={[{ color: colors.labelText }, typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal')]}>{JSON.stringify(item.metadata)}</Text>
              ) : null}
              {item.stackTrace ? (
                <Text style={[{ color: colors.labelText }, typographyHelper.fromSizing.createStyle(Sizing, 'xs', 'normal', 'normal')]}>{item.stackTrace}</Text>
              ) : null}
            </View>
          </View>
        );
      })}
      {filtered.length === 0 ? (
        <Text style={[{ color: colors.labelText }, typographyHelper.fromSizing.createStyle(Sizing, 'm', 'normal', 'normal')]}>No logs</Text>
      ) : null}
    </View>
  );
}
