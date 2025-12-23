import { Button } from '@/src/shared/components';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import type { LocationInfo } from 'masterfabric-expo-core';
import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNetworkHelperViewModel } from '../hooks/use-network-helper-view-model';
import { networkHelperScreenStyles } from '../styles/network-helper-screen.styles';
import { InfoRow, NetworkInfoCard } from './network-info-card';

export function NetworkHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);

  const {
    networkInfo,
    isMonitoring,
    isLoading,
    lastCheckTime,
    monitoringInterval,
    startMonitoring,
    stopMonitoring,
    checkNetwork,
    updateInterval,
  } = useNetworkHelperViewModel();

  useEffect(() => {
    // Initial check on mount
    checkNetwork();
  }, [checkNetwork]);

  const formatDate = (date: Date | null): string => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
  };

  const formatLocation = (location: LocationInfo | null): string => {
    if (!location) return 'N/A';
    const parts = [location.city, location.region, location.country].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : location.country || 'N/A';
  };

  const getStatusBadge = () => {
    if (!networkInfo) return null;
    if (networkInfo.isOnline === true) {
      return { text: 'Online', color: colors.successColor };
    }
    if (networkInfo.isOnline === false) {
      return { text: 'Offline', color: colors.errorColor };
    }
    return { text: 'Unknown', color: colors.warningColor };
  };

  const intervalOptions = [
    { label: '10s', value: 10000 },
    { label: '30s', value: 30000 },
    { label: '1m', value: 60000 },
    { label: '5m', value: 300000 },
  ];

  return (
    <SafeAreaView
      style={[networkHelperScreenStyles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <ScreenHeader
        title={t('helpers.networkHelper.title') || 'Network Helper'}
        subtitle={t('helpers.networkHelper.description') || 'Network monitoring and diagnostics'}
        variant="minimal"
      />
      <ScrollView
        style={networkHelperScreenStyles.scrollView}
        contentContainerStyle={networkHelperScreenStyles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Connection Status Card */}
        <NetworkInfoCard
          title="Connection Status"
          icon="wifi"
          statusBadge={getStatusBadge()}
        >
          <InfoRow
            label="Status"
            value={networkInfo?.isOnline === true ? 'Online' : networkInfo?.isOnline === false ? 'Offline' : 'Checking...'}
          />
          <InfoRow
            label="Connection Type"
            value={networkInfo?.connectionType?.toUpperCase() || 'Unknown'}
          />
          <InfoRow
            label="Last Checked"
            value={formatDate(lastCheckTime)}
            isLast
          />
        </NetworkInfoCard>

        {/* Speed Test Card */}
        {networkInfo?.speedTest ? (
          <>
            {/* Download Speed */}
            <NetworkInfoCard title="Download Speed" icon="download">
              <View style={networkHelperScreenStyles.speedTestContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[networkHelperScreenStyles.speedValue, { color: colors.titleText }]}>
                    {networkInfo.speedTest.download.overall.speed.toFixed(2)}
                  </Text>
                  <Text style={[networkHelperScreenStyles.speedUnit, { color: colors.bodyText }]}>
                    {networkInfo.speedTest.unit}
                  </Text>
                </View>
                <InfoRow
                  label="Max"
                  value={`${networkInfo.speedTest.download.overall.max.toFixed(2)} ${networkInfo.speedTest.unit}`}
                />
                <InfoRow
                  label="Min"
                  value={`${networkInfo.speedTest.download.overall.min.toFixed(2)} ${networkInfo.speedTest.unit}`}
                />
                {networkInfo.speedTest.download.measurements['100kB'] && (
                  <InfoRow
                    label="100kB Test"
                    value={`${networkInfo.speedTest.download.measurements['100kB']!.average.toFixed(2)} ${networkInfo.speedTest.unit} (${networkInfo.speedTest.download.measurements['100kB']!.speeds.length} runs)`}
                  />
                )}
                {networkInfo.speedTest.download.measurements['1MB'] && (
                  <InfoRow
                    label="1MB Test"
                    value={`${networkInfo.speedTest.download.measurements['1MB']!.average.toFixed(2)} ${networkInfo.speedTest.unit} (${networkInfo.speedTest.download.measurements['1MB']!.speeds.length} runs)`}
                  />
                )}
                {networkInfo.speedTest.download.measurements['10MB'] && (
                  <InfoRow
                    label="10MB Test"
                    value={`${networkInfo.speedTest.download.measurements['10MB']!.average.toFixed(2)} ${networkInfo.speedTest.unit} (${networkInfo.speedTest.download.measurements['10MB']!.speeds.length} runs)`}
                    isLast
                  />
                )}
              </View>
            </NetworkInfoCard>

            {/* Upload Speed */}
            <NetworkInfoCard title="Upload Speed" icon="upload">
              <View style={networkHelperScreenStyles.speedTestContainer}>
                <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text style={[networkHelperScreenStyles.speedValue, { color: colors.titleText }]}>
                    {networkInfo.speedTest.upload.overall.speed.toFixed(2)}
                  </Text>
                  <Text style={[networkHelperScreenStyles.speedUnit, { color: colors.bodyText }]}>
                    {networkInfo.speedTest.unit}
                  </Text>
                </View>
                <InfoRow
                  label="Max"
                  value={`${networkInfo.speedTest.upload.overall.max.toFixed(2)} ${networkInfo.speedTest.unit}`}
                />
                <InfoRow
                  label="Min"
                  value={`${networkInfo.speedTest.upload.overall.min.toFixed(2)} ${networkInfo.speedTest.unit}`}
                />
                {networkInfo.speedTest.upload.measurements['100kB'] && (
                  <InfoRow
                    label="100kB Test"
                    value={`${networkInfo.speedTest.upload.measurements['100kB']!.average.toFixed(2)} ${networkInfo.speedTest.unit} (${networkInfo.speedTest.upload.measurements['100kB']!.speeds.length} runs)`}
                  />
                )}
                {networkInfo.speedTest.upload.measurements['1MB'] && (
                  <InfoRow
                    label="1MB Test"
                    value={`${networkInfo.speedTest.upload.measurements['1MB']!.average.toFixed(2)} ${networkInfo.speedTest.unit} (${networkInfo.speedTest.upload.measurements['1MB']!.speeds.length} runs)`}
                  />
                )}
                {networkInfo.speedTest.upload.measurements['10MB'] && (
                  <InfoRow
                    label="10MB Test"
                    value={`${networkInfo.speedTest.upload.measurements['10MB']!.average.toFixed(2)} ${networkInfo.speedTest.unit} (${networkInfo.speedTest.upload.measurements['10MB']!.speeds.length} runs)`}
                    isLast
                  />
                )}
              </View>
            </NetworkInfoCard>

            {/* Latency */}
            <NetworkInfoCard title="Latency" icon="time">
              <InfoRow
                label="Unloaded"
                value={`${networkInfo.speedTest.latency.unloaded.average.toFixed(2)} ms (${networkInfo.speedTest.latency.unloaded.min.toFixed(2)} - ${networkInfo.speedTest.latency.unloaded.max.toFixed(2)} ms)`}
              />
              <InfoRow
                label="During Download"
                value={`${networkInfo.speedTest.latency.duringDownload.average.toFixed(2)} ms`}
              />
              <InfoRow
                label="During Upload"
                value={`${networkInfo.speedTest.latency.duringUpload.average.toFixed(2)} ms`}
                isLast
              />
            </NetworkInfoCard>

            {/* Jitter & Packet Loss */}
            <NetworkInfoCard title="Network Quality" icon="stats-chart">
              <InfoRow
                label="Jitter"
                value={`${networkInfo.speedTest.jitter.average.toFixed(2)} ms (${networkInfo.speedTest.jitter.min.toFixed(2)} - ${networkInfo.speedTest.jitter.max.toFixed(2)} ms)`}
              />
              <InfoRow
                label="Packet Loss"
                value={`${networkInfo.speedTest.packetLoss.percentage.toFixed(2)}% (${networkInfo.speedTest.packetLoss.packetsReceived}/${networkInfo.speedTest.packetLoss.packetsSent})`}
              />
              {networkInfo.speedTest.networkQualityScore !== null && (
                <InfoRow
                  label="Quality Score"
                  value={`${networkInfo.speedTest.networkQualityScore}/100`}
                  isLast
                />
              )}
            </NetworkInfoCard>
          </>
        ) : networkInfo?.isOnline === true ? (
          <NetworkInfoCard title="Speed Test" icon="speedometer">
            <View style={{ alignItems: 'center', padding: 16 }}>
              <Text style={{ color: colors.bodyText, fontSize: 14, textAlign: 'center' }}>
                Speed test is running or failed. Please try again.
              </Text>
            </View>
          </NetworkInfoCard>
        ) : null}

        {/* Network Details Card */}
        <NetworkInfoCard title="Network Details" icon="information-circle">
          <InfoRow label="IP Address" value={networkInfo?.ip || 'N/A'} />
          <InfoRow label="DNS" value={networkInfo?.dns || 'N/A'} />
          <InfoRow
            label="VPN"
            value={
              networkInfo?.vpn === true
                ? 'Detected'
                : networkInfo?.vpn === false
                ? 'Not Detected'
                : 'Unknown'
            }
          />
          <InfoRow
            label="Location"
            value={formatLocation(networkInfo?.location || null)}
            isLast
          />
        </NetworkInfoCard>

        {/* Monitoring Controls Card */}
        <NetworkInfoCard title="Monitoring Controls" icon="settings">
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.bodyText, fontSize: 14 }}>Auto Monitoring</Text>
            <Switch
              value={isMonitoring}
              onValueChange={(value) => {
                if (value) {
                  startMonitoring();
                } else {
                  stopMonitoring();
                }
              }}
              trackColor={{ false: colors.surfaceBorder, true: colors.tint }}
            />
          </View>

          {isMonitoring && (
            <View style={networkHelperScreenStyles.intervalSelector}>
              <Text style={{ color: colors.bodyText, fontSize: 14, marginRight: 8 }}>
                Interval:
              </Text>
              {intervalOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    networkHelperScreenStyles.intervalButton,
                    {
                      backgroundColor:
                        monitoringInterval === option.value
                          ? colors.tint
                          : colors.surfaceBackground,
                      borderColor: colors.surfaceBorder,
                    },
                  ]}
                  onPress={() => updateInterval(option.value)}
                >
                  <Text
                    style={{
                      color:
                        monitoringInterval === option.value
                          ? colors.background
                          : colors.bodyText,
                      fontSize: 12,
                      fontWeight: monitoringInterval === option.value ? '600' : '400',
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={networkHelperScreenStyles.actionsContainer}>
            <Button
              title={isLoading ? 'Checking...' : 'Check Now'}
              onPress={checkNetwork}
              disabled={isLoading}
              variant="primary"
              size="medium"
            />
          </View>
        </NetworkInfoCard>

        {/* Loading Indicator */}
        {isLoading && (
          <View style={{ alignItems: 'center', padding: 16 }}>
            <ActivityIndicator size="small" color={colors.tint} />
            <Text style={{ color: colors.bodyText, marginTop: 8, fontSize: 12 }}>
              Checking network status...
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

