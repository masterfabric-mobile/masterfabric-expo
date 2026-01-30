import { Button } from '@/src/shared/components';
import { ScreenHeader } from '@/src/shared/components/ScreenHeader';
import { t } from '@/src/shared/i18n';
import { getThemeColors, useTheme } from 'masterfabric-expo-core';
import type { LocationInfo } from 'masterfabric-expo-core';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkHelperViewModel } from '../hooks/use-network-helper-view-model';
import { networkHelperScreenStyles } from '../styles/network-helper-screen.styles';
import { InfoRow, NetworkInfoCard } from './network-info-card';
import { createDefaultHelperItems } from '@/src/screens/helpers/utils';

export function NetworkHelperScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const colors = getThemeColors(isDark);
  const [showPlaceholders, setShowPlaceholders] = useState(true);

  const {
    networkInfo,
    isMonitoring,
    isLoading,
    lastCheckTime,
    monitoringInterval,
    startMonitoring,
    stopMonitoring,
    checkNetwork,
    performSpeedTest,
    updateInterval,
  } = useNetworkHelperViewModel();

  useEffect(() => {
    // If we already have network info from splash, don't show placeholders
    if (networkInfo && networkInfo.isOnline !== null) {
      setShowPlaceholders(false);
    } else {
      // Initial check on mount only if we don't have data
      checkNetwork();
      // Hide placeholders after initial load
      const timer = setTimeout(() => {
        setShowPlaceholders(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [checkNetwork, networkInfo]);

  // Get other UI helpers (excluding network-helper)
  const otherHelpers = createDefaultHelperItems()
    .filter(helper => helper.id !== 'network-helper' && helper.category === 'ui-helpers')
    .slice(0, 6); // Show first 6 UI helpers

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
            value={networkInfo?.isOnline === true ? 'Online' : networkInfo?.isOnline === false ? 'Offline' : (isLoading ? 'Checking...' : null)}
            delay={0}
            showPlaceholder={showPlaceholders}
            placeholder="Checking..."
          />
          <InfoRow
            label="Connection Type"
            value={networkInfo?.connectionType?.toUpperCase() || null}
            delay={100}
            showPlaceholder={showPlaceholders}
            placeholder="Detecting..."
          />
          <InfoRow
            label="Last Checked"
            value={formatDate(lastCheckTime)}
            delay={200}
            showPlaceholder={showPlaceholders}
            placeholder="Never"
            isLast
          />
        </NetworkInfoCard>

        {/* Speed Test Card */}
        {networkInfo?.isOnline === true && (
          <NetworkInfoCard title="Speed Test" icon="speedometer">
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
            ) : (
              <View style={{ alignItems: 'center', padding: 16 }}>
                <Text style={{ color: colors.bodyText, fontSize: 14, textAlign: 'center', marginBottom: 16 }}>
                  Speed test is not performed yet. Click the button below to start a speed test.
                </Text>
                <Button
                  title={isLoading ? 'Running Speed Test...' : 'Start Speed Test'}
                  onPress={performSpeedTest}
                  disabled={isLoading}
                  icon={isLoading ? undefined : 'speedometer'}
                />
              </View>
            )}
          </NetworkInfoCard>
        )}

        {/* Network Details Card */}
        <NetworkInfoCard title="Network Details" icon="information-circle">
          <InfoRow 
            label="IP Address" 
            value={networkInfo?.ip || null}
            delay={300}
            showPlaceholder={showPlaceholders}
            placeholder="Fetching..."
          />
          <InfoRow 
            label="DNS" 
            value={networkInfo?.dns || null}
            delay={400}
            showPlaceholder={showPlaceholders}
            placeholder="Detecting..."
          />
          <InfoRow
            label="VPN"
            value={
              networkInfo?.vpn === true
                ? 'Detected'
                : networkInfo?.vpn === false
                ? 'Not Detected'
                : null
            }
            delay={500}
            showPlaceholder={showPlaceholders}
            placeholder="Checking..."
          />
          <InfoRow
            label="Location"
            value={formatLocation(networkInfo?.location || null)}
            delay={600}
            showPlaceholder={showPlaceholders}
            placeholder="Locating..."
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

        {/* Other UI Helpers Card */}
        {otherHelpers.length > 0 && (
          <NetworkInfoCard title="Other UI Helpers" icon="apps">
            <View style={{ gap: 8 }}>
              {otherHelpers.map((helper, index) => (
                <TouchableOpacity
                  key={helper.id}
                  onPress={() => router.push(helper.route as any)}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: colors.surfaceBackground,
                      borderWidth: 1,
                      borderColor: colors.surfaceBorder,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: helper.color + '20',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 12,
                    }}
                  >
                    <Ionicons 
                      name={helper.icon as any} 
                      size={20} 
                      color={helper.color} 
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.titleText, fontSize: 14, fontWeight: '600' }}>
                      {helper.name}
                    </Text>
                    <Text style={{ color: colors.bodyText, fontSize: 12, marginTop: 2, opacity: 0.7 }}>
                      {helper.description}
                    </Text>
                  </View>
                  <Ionicons 
                    name="chevron-forward" 
                    size={20} 
                    color={colors.bodyText} 
                    style={{ opacity: 0.5 }} 
                  />
                </TouchableOpacity>
              ))}
            </View>
          </NetworkInfoCard>
        )}

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

