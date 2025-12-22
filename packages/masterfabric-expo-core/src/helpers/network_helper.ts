/**
 * Network Helper
 * 
 * Provides comprehensive network monitoring and diagnostics using Cloudflare Speed Test API.
 * Monitors network status, speed, DNS, VPN detection, location, and connectivity.
 * Automatically checks at regular intervals and shows popup alerts on connection loss.
 * 
 * @example
 * ```typescript
 * import { networkHelper } from 'masterfabric-expo-core';
 * 
 * // Start monitoring with 30 second intervals
 * networkHelper.start(30000);
 * 
 * // Check network status manually
 * const status = await networkHelper.checkNow();
 * 
 * // Get current network info
 * const info = networkHelper.getNetworkInfo();
 * 
 * // Listen to network changes
 * const unsubscribe = networkHelper.onChange((isOnline) => {
 *   console.log('Network status:', isOnline);
 * });
 * 
 * // Stop monitoring
 * networkHelper.stop();
 * ```
 */

import { AppState, AppStateStatus, Alert, Linking, Platform } from 'react-native';
import type { 
  NetworkInfo, 
  NetworkStatus, 
  SpeedTestResult, 
  NetworkListener,
  SpeedTestMeasurement 
} from './network_helper.types';

class NetworkHelper {
  private static instance: NetworkHelper;
  private intervalId: ReturnType<typeof setInterval> | null = null;
  private appStateSubscription: { remove: () => void } | null = null;
  private appState: AppStateStatus = AppState.currentState;
  private listeners: Set<NetworkListener> = new Set();
  private alertVisible = false;
  
  private networkInfo: NetworkInfo = {
    isOnline: null,
    lastChecked: null,
    speedTest: null,
    dns: null,
    ip: null,
    location: null,
    vpn: null,
    connectionType: null,
  };

  private constructor() {
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  static getInstance(): NetworkHelper {
    if (!NetworkHelper.instance) {
      NetworkHelper.instance = new NetworkHelper();
    }
    return NetworkHelper.instance;
  }

  /**
   * Start network monitoring with specified interval
   * @param pollIntervalMs - Interval in milliseconds (default: 30000 = 30 seconds)
   */
  start(pollIntervalMs: number = 30000): void {
    this.appStateSubscription = AppState.addEventListener('change', this.handleAppStateChange) as unknown as { remove: () => void };
    if (this.appState === 'active') {
      this.beginPolling(pollIntervalMs);
    }
  }

  /**
   * Stop network monitoring
   */
  stop(): void {
    if (this.appStateSubscription) {
      try {
        this.appStateSubscription.remove();
      } catch {}
      this.appStateSubscription = null;
    }
    this.endPolling();
    this.alertVisible = false;
  }

  /**
   * Subscribe to network status changes
   * @param listener - Callback function that receives network status
   * @returns Unsubscribe function
   */
  onChange(listener: NetworkListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Get current network information
   * @returns Current network info object
   */
  getNetworkInfo(): NetworkInfo {
    return { ...this.networkInfo };
  }

  /**
   * Get current network status
   * @returns Current network status
   */
  getStatus(): NetworkStatus {
    return {
      isOnline: this.networkInfo.isOnline ?? false,
      lastChecked: this.networkInfo.lastChecked,
      connectionType: this.networkInfo.connectionType,
    };
  }

  /**
   * Perform immediate network check
   * @returns Promise resolving to true if online, false otherwise
   */
  async checkNow(): Promise<boolean> {
    try {
      const result = await this.performNetworkCheck();
      this.updateNetworkInfo(result);
      
      if (!result.isOnline) {
        this.showOfflineAlert();
      } else {
        this.alertVisible = false;
      }
      
      return result.isOnline;
    } catch (error) {
      console.error('Network check error:', error);
      const offlineResult: NetworkInfo = {
        isOnline: false,
        lastChecked: new Date(),
        speedTest: null,
        dns: null,
        ip: null,
        location: null,
        vpn: null,
        connectionType: null,
      };
      this.updateNetworkInfo(offlineResult);
      this.showOfflineAlert();
      return false;
    }
  }

  private beginPolling(pollIntervalMs: number): void {
    if (this.intervalId) return;
    this.checkNow();
    this.intervalId = setInterval(() => this.checkNow(), pollIntervalMs);
  }

  private endPolling(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  private async performNetworkCheck(): Promise<NetworkInfo> {
    const startTime = Date.now();
    const checkDate = new Date();
    
    // Basic connectivity check
    const isOnline = await this.checkConnectivity();
    
    if (!isOnline) {
      return {
        isOnline: false,
        lastChecked: checkDate,
        speedTest: null,
        dns: null,
        ip: null,
        location: null,
        vpn: null,
        connectionType: null,
      };
    }

    // Perform speed test and gather network info in parallel
    // Add timeout to speed test (60 seconds max)
    const speedTestPromise = Promise.race([
      this.performSpeedTest(),
      new Promise<null>((resolve) => setTimeout(() => {
        console.warn('Speed test timeout after 60 seconds');
        resolve(null);
      }, 60000)),
    ]);

    const [speedTest, networkDetails] = await Promise.allSettled([
      speedTestPromise,
      this.gatherNetworkDetails(),
    ]);

    const speedTestResult = speedTest.status === 'fulfilled' ? speedTest.value : null;
    const details = networkDetails.status === 'fulfilled' ? networkDetails.value : {};
    
    // If speed test failed, try simple test as fallback
    let finalSpeedTest = speedTestResult;
    if (!finalSpeedTest) {
      console.log('Comprehensive speed test failed, trying simple fallback...');
      try {
        finalSpeedTest = await Promise.race([
          this.performSimpleSpeedTest(),
          new Promise<null>((resolve) => setTimeout(() => {
            console.warn('Simple speed test timeout after 30 seconds');
            resolve(null);
          }, 30000)),
        ]);
      } catch (error) {
        console.error('Simple speed test fallback also failed:', error);
      }
    }

    return {
      isOnline: true,
      lastChecked: checkDate,
      speedTest: finalSpeedTest,
      dns: details.dns ?? null,
      ip: details.ip ?? null,
      location: details.location ?? null,
      vpn: details.vpn ?? null,
      connectionType: details.connectionType ?? null,
    };
  }

  private async checkConnectivity(): Promise<boolean> {
    try {
      // Try Cloudflare Speed Test endpoint first
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      try {
        const response = await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeoutId);
        return response.ok;
      } catch (error) {
        clearTimeout(timeoutId);
        // Fallback to Google connectivity check
        const fallbackController = new AbortController();
        const fallbackTimeout = setTimeout(() => fallbackController.abort(), 3000);
        try {
          const response = await fetch('https://clients3.google.com/generate_204', {
            method: 'HEAD',
            signal: fallbackController.signal,
          });
          clearTimeout(fallbackTimeout);
          return response.ok;
        } catch {
          clearTimeout(fallbackTimeout);
          return false;
        }
      }
    } catch {
      return false;
    }
  }

  /**
   * Calculate percentile from sorted array
   */
  private calculatePercentile(sortedArray: number[], percentile: number): number {
    if (sortedArray.length === 0) return 0;
    const index = Math.ceil((percentile / 100) * sortedArray.length) - 1;
    return sortedArray[Math.max(0, Math.min(index, sortedArray.length - 1))];
  }

  /**
   * Calculate median from array
   */
  private calculateMedian(sortedArray: number[]): number {
    if (sortedArray.length === 0) return 0;
    const mid = Math.floor(sortedArray.length / 2);
    return sortedArray.length % 2 === 0
      ? (sortedArray[mid - 1] + sortedArray[mid]) / 2
      : sortedArray[mid];
  }

  /**
   * Measure latency by sending a small request and measuring response time
   */
  private async measureLatency(count: number = 20): Promise<number[]> {
    const latencies: number[] = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const startTime = Date.now();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        const response = await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
          method: 'HEAD', // Use HEAD to minimize data transfer
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);
        const endTime = Date.now();
        
        if (response.ok) {
          const latency = endTime - startTime;
          if (latency > 0 && latency < 10000) { // Valid latency between 0-10s
            latencies.push(latency);
          }
        }
        
        // Small delay between measurements
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch {
        // Skip failed measurements
        continue;
      }
    }
    
    return latencies;
  }

  /**
   * Measure download speed for a specific size with multiple runs
   */
  private async measureDownloadSpeed(size: number, runs: number = 10): Promise<number[]> {
    const speeds: number[] = [];
    
    for (let i = 0; i < runs; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const startTime = Date.now();
        const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${size}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });
        
        if (!response.ok) {
          clearTimeout(timeoutId);
          continue;
        }
        
        const contentLength = response.headers.get('content-length');
        const expectedSize = contentLength ? parseInt(contentLength, 10) : size;
        
        const blob = await response.blob();
        const endTime = Date.now();
        clearTimeout(timeoutId);
        
        const duration = (endTime - startTime) / 1000;
        const sizeInBytes = blob.size > 0 ? blob.size : expectedSize;
        
        if (duration >= 0.01 && sizeInBytes > 0) {
          const speedMbps = (sizeInBytes * 8) / (duration * 1000000);
          if (speedMbps > 0 && speedMbps < 10000 && isFinite(speedMbps)) {
            speeds.push(speedMbps);
          }
        }
      } catch {
        continue;
      }
    }
    
    return speeds;
  }

  /**
   * Measure upload speed for a specific size with multiple runs
   */
  private async measureUploadSpeed(size: number, runs: number = 8): Promise<number[]> {
    const speeds: number[] = [];
    
    for (let i = 0; i < runs; i++) {
      try {
        // Create test data for each run
        const testData = new Uint8Array(size);
        for (let j = 0; j < size; j++) {
          testData[j] = Math.floor(Math.random() * 256);
        }
        const blob = new Blob([testData]);
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000);
        
        const startTime = Date.now();
        const response = await fetch(`https://speed.cloudflare.com/__up?bytes=${size}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/octet-stream',
          },
          body: blob,
          signal: controller.signal,
        });
        
        const endTime = Date.now();
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const duration = (endTime - startTime) / 1000;
          if (duration >= 0.01) {
            const speedMbps = (size * 8) / (duration * 1000000);
            if (speedMbps > 0 && speedMbps < 10000 && isFinite(speedMbps)) {
              speeds.push(speedMbps);
            }
          }
        }
        
        // Small delay between upload tests
        if (i < runs - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch {
        continue;
      }
    }
    
    return speeds;
  }

  /**
   * Create speed test measurement object
   */
  private createSpeedMeasurement(
    size: number,
    sizeLabel: string,
    speeds: number[]
  ): SpeedTestMeasurement | null {
    if (speeds.length === 0) return null;
    
    const sorted = [...speeds].sort((a, b) => a - b);
    const average = speeds.reduce((a, b) => a + b, 0) / speeds.length;
    const median = this.calculateMedian(sorted);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const percentile25 = this.calculatePercentile(sorted, 25);
    const percentile75 = this.calculatePercentile(sorted, 75);
    
    return {
      size,
      sizeLabel,
      speeds,
      average,
      median,
      min,
      max,
      percentile25,
      percentile75,
    };
  }

  /**
   * Calculate jitter from latency measurements
   */
  private calculateJitter(latencies: number[]): { average: number; min: number; max: number; measurements: number[] } {
    if (latencies.length < 2) {
      return { average: 0, min: 0, max: 0, measurements: [] };
    }
    
    const jitters: number[] = [];
    for (let i = 1; i < latencies.length; i++) {
      const jitter = Math.abs(latencies[i] - latencies[i - 1]);
      jitters.push(jitter);
    }
    
    const sorted = [...jitters].sort((a, b) => a - b);
    const average = jitters.reduce((a, b) => a + b, 0) / jitters.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    return { average, min, max, measurements: jitters };
  }

  /**
   * Calculate network quality score (0-100)
   */
  private calculateNetworkQualityScore(
    downloadSpeed: number,
    uploadSpeed: number,
    latency: number,
    jitter: number,
    packetLoss: number
  ): number {
    // Normalize scores (0-100 scale)
    // Download speed: assume 100 Mbps = 100 points, scale down
    const downloadScore = Math.min(100, (downloadSpeed / 100) * 100);
    
    // Upload speed: assume 50 Mbps = 100 points
    const uploadScore = Math.min(100, (uploadSpeed / 50) * 100);
    
    // Latency: lower is better, 0ms = 100 points, 100ms = 0 points
    const latencyScore = Math.max(0, 100 - (latency / 100) * 100);
    
    // Jitter: lower is better, 0ms = 100 points, 20ms = 0 points
    const jitterScore = Math.max(0, 100 - (jitter / 20) * 100);
    
    // Packet loss: 0% = 100 points, 5% = 0 points
    const packetLossScore = Math.max(0, 100 - (packetLoss / 5) * 100);
    
    // Weighted average
    const score = (
      downloadScore * 0.3 +
      uploadScore * 0.2 +
      latencyScore * 0.2 +
      jitterScore * 0.15 +
      packetLossScore * 0.15
    );
    
    return Math.round(Math.max(0, Math.min(100, score)));
  }

  /**
   * Perform comprehensive speed test with all Cloudflare metrics
   * Optimized to complete faster while still providing accurate results
   */
  private async performSpeedTest(): Promise<SpeedTestResult | null> {
    try {
      // Step 1: Measure unloaded latency (reduced to 10 for faster completion)
      const unloadedLatencies = await this.measureLatency(10);
      if (unloadedLatencies.length === 0) {
        // If latency fails, try a simpler speed test
        return await this.performSimpleSpeedTest();
      }
      
      const unloadedLatency = {
        average: unloadedLatencies.reduce((a, b) => a + b, 0) / unloadedLatencies.length,
        min: Math.min(...unloadedLatencies),
        max: Math.max(...unloadedLatencies),
        measurements: unloadedLatencies,
      };
      
      // Step 2: Download speed tests (reduced runs for faster completion)
      // Run tests in parallel but with fewer runs
      const [download100kB, download1MB] = await Promise.all([
        this.measureDownloadSpeed(100000, 5), // Reduced from 10 to 5
        this.measureDownloadSpeed(1000000, 4), // Reduced from 8 to 4
      ]);
      // 10MB test separately (reduced from 6 to 3)
      const download10MB = await this.measureDownloadSpeed(10000000, 3);
      
      // Step 3: Upload speed tests (reduced runs)
      const [upload100kB, upload1MB] = await Promise.all([
        this.measureUploadSpeed(100000, 4), // Reduced from 8 to 4
        this.measureUploadSpeed(1000000, 3), // Reduced from 6 to 3
      ]);
      // 10MB upload test (reduced from 4 to 2)
      const upload10MB = await this.measureUploadSpeed(10000000, 2);
      
      // Measure latency during download (simplified - fewer measurements)
      const latencyDuringDownload: number[] = [];
      const downloadLoadPromise = this.measureDownloadSpeed(1000000, 2).catch(() => []);
      
      // Measure latency while download is running (reduced from 13 to 8)
      const downloadLatencyPromises = Array.from({ length: 8 }, async () => {
        try {
          const startTime = Date.now();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store',
          });
          clearTimeout(timeoutId);
          const latency = Date.now() - startTime;
          if (latency > 0 && latency < 10000) {
            latencyDuringDownload.push(latency);
          }
        } catch {
          // Ignore errors
        }
      });
      
      await Promise.all([downloadLoadPromise, ...downloadLatencyPromises]);
      
      // Measure latency during upload (simplified - fewer measurements)
      const latencyDuringUpload: number[] = [];
      const uploadLoadPromise = this.measureUploadSpeed(1000000, 2).catch(() => []);
      
      // Measure latency while upload is running (reduced from 16 to 10)
      const uploadLatencyPromises = Array.from({ length: 10 }, async () => {
        try {
          const startTime = Date.now();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
            method: 'HEAD',
            signal: controller.signal,
            cache: 'no-store',
          });
          clearTimeout(timeoutId);
          const latency = Date.now() - startTime;
          if (latency > 0 && latency < 10000) {
            latencyDuringUpload.push(latency);
          }
        } catch {
          // Ignore errors
        }
      });
      
      await Promise.all([uploadLoadPromise, ...uploadLatencyPromises]);
      
      // Calculate download statistics
      const allDownloadSpeeds = [
        ...download100kB,
        ...download1MB,
        ...download10MB,
      ];
      
      const downloadOverall = allDownloadSpeeds.length > 0 ? {
        speed: allDownloadSpeeds.reduce((a, b) => a + b, 0) / allDownloadSpeeds.length,
        max: Math.max(...allDownloadSpeeds),
        min: Math.min(...allDownloadSpeeds),
      } : { speed: 0, max: 0, min: 0 };
      
      // Calculate upload statistics
      const allUploadSpeeds = [
        ...upload100kB,
        ...upload1MB,
        ...upload10MB,
      ];
      
      const uploadOverall = allUploadSpeeds.length > 0 ? {
        speed: allUploadSpeeds.reduce((a, b) => a + b, 0) / allUploadSpeeds.length,
        max: Math.max(...allUploadSpeeds),
        min: Math.min(...allUploadSpeeds),
      } : { speed: 0, max: 0, min: 0 };
      
      // Calculate latency statistics
      const latencyDuringDownloadAvg = latencyDuringDownload.length > 0
        ? latencyDuringDownload.reduce((a, b) => a + b, 0) / latencyDuringDownload.length
        : unloadedLatency.average;
      
      const latencyDuringUploadAvg = latencyDuringUpload.length > 0
        ? latencyDuringUpload.reduce((a, b) => a + b, 0) / latencyDuringUpload.length
        : unloadedLatency.average;
      
      // Calculate jitter
      const jitter = this.calculateJitter(unloadedLatencies);
      
      // Calculate packet loss (simplified estimation)
      // In a real implementation, this would use ICMP ping, but React Native doesn't support that
      // We estimate based on failed requests vs total requests
      const totalLatencyRequests = 10; // Updated to match actual measurement count
      const totalDownloadRequests = 5 + 4 + 3; // 100kB + 1MB + 10MB (updated counts)
      const totalUploadRequests = 4 + 3 + 2; // 100kB + 1MB + 10MB (updated counts)
      const totalRequests = totalLatencyRequests + totalDownloadRequests + totalUploadRequests;
      
      const successfulLatency = unloadedLatencies.length;
      const successfulDownload = download100kB.length + download1MB.length + download10MB.length;
      const successfulUpload = upload100kB.length + upload1MB.length + upload10MB.length;
      const successfulRequests = successfulLatency + successfulDownload + successfulUpload;
      
      const packetLoss = totalRequests > 0 
        ? ((totalRequests - successfulRequests) / totalRequests) * 100 
        : 0;
      
      // Calculate network quality score
      const networkQualityScore = this.calculateNetworkQualityScore(
        downloadOverall.speed,
        uploadOverall.speed,
        unloadedLatency.average,
        jitter.average,
        packetLoss
      );
      
      return {
        download: {
          overall: downloadOverall,
          measurements: {
            '100kB': this.createSpeedMeasurement(100000, '100kB', download100kB),
            '1MB': this.createSpeedMeasurement(1000000, '1MB', download1MB),
            '10MB': this.createSpeedMeasurement(10000000, '10MB', download10MB),
          },
        },
        upload: {
          overall: uploadOverall,
          measurements: {
            '100kB': this.createSpeedMeasurement(100000, '100kB', upload100kB),
            '1MB': this.createSpeedMeasurement(1000000, '1MB', upload1MB),
            '10MB': this.createSpeedMeasurement(10000000, '10MB', upload10MB),
          },
        },
        latency: {
          unloaded: unloadedLatency,
          duringDownload: {
            average: latencyDuringDownloadAvg,
            min: latencyDuringDownload.length > 0 ? Math.min(...latencyDuringDownload) : unloadedLatency.min,
            max: latencyDuringDownload.length > 0 ? Math.max(...latencyDuringDownload) : unloadedLatency.max,
            measurements: latencyDuringDownload,
          },
          duringUpload: {
            average: latencyDuringUploadAvg,
            min: latencyDuringUpload.length > 0 ? Math.min(...latencyDuringUpload) : unloadedLatency.min,
            max: latencyDuringUpload.length > 0 ? Math.max(...latencyDuringUpload) : unloadedLatency.max,
            measurements: latencyDuringUpload,
          },
        },
        jitter,
        packetLoss: {
          percentage: Math.max(0, Math.min(100, packetLoss)),
          packetsSent: totalRequests,
          packetsReceived: successfulRequests,
        },
        networkQualityScore,
        unit: 'Mbps',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Speed test error:', error);
      // Fallback to simple speed test if comprehensive test fails
      return await this.performSimpleSpeedTest();
    }
  }

  /**
   * Perform a simple speed test as fallback
   * This is faster and more reliable when comprehensive test fails
   */
  private async performSimpleSpeedTest(): Promise<SpeedTestResult | null> {
    try {
      // Quick latency measurement
      const unloadedLatencies = await this.measureLatency(5);
      if (unloadedLatencies.length === 0) {
        return null;
      }
      
      const unloadedLatency = {
        average: unloadedLatencies.reduce((a, b) => a + b, 0) / unloadedLatencies.length,
        min: Math.min(...unloadedLatencies),
        max: Math.max(...unloadedLatencies),
        measurements: unloadedLatencies,
      };
      
      // Single download test (1MB)
      const download1MB = await this.measureDownloadSpeed(1000000, 3);
      if (download1MB.length === 0) {
        return null;
      }
      
      // Single upload test (100kB)
      const upload100kB = await this.measureUploadSpeed(100000, 3);
      
      const downloadOverall = {
        speed: download1MB.reduce((a, b) => a + b, 0) / download1MB.length,
        max: Math.max(...download1MB),
        min: Math.min(...download1MB),
      };
      
      const uploadOverall = upload100kB.length > 0 ? {
        speed: upload100kB.reduce((a, b) => a + b, 0) / upload100kB.length,
        max: Math.max(...upload100kB),
        min: Math.min(...upload100kB),
      } : { speed: 0, max: 0, min: 0 };
      
      const jitter = this.calculateJitter(unloadedLatencies);
      
      const totalRequests = 5 + 3 + 3; // latency + download + upload
      const successfulRequests = unloadedLatencies.length + download1MB.length + upload100kB.length;
      const packetLoss = ((totalRequests - successfulRequests) / totalRequests) * 100;
      
      const networkQualityScore = this.calculateNetworkQualityScore(
        downloadOverall.speed,
        uploadOverall.speed,
        unloadedLatency.average,
        jitter.average,
        packetLoss
      );
      
      return {
        download: {
          overall: downloadOverall,
          measurements: {
            '100kB': null,
            '1MB': this.createSpeedMeasurement(1000000, '1MB', download1MB),
            '10MB': null,
          },
        },
        upload: {
          overall: uploadOverall,
          measurements: {
            '100kB': upload100kB.length > 0 ? this.createSpeedMeasurement(100000, '100kB', upload100kB) : null,
            '1MB': null,
            '10MB': null,
          },
        },
        latency: {
          unloaded: unloadedLatency,
          duringDownload: {
            average: unloadedLatency.average,
            min: unloadedLatency.min,
            max: unloadedLatency.max,
            measurements: [],
          },
          duringUpload: {
            average: unloadedLatency.average,
            min: unloadedLatency.min,
            max: unloadedLatency.max,
            measurements: [],
          },
        },
        jitter,
        packetLoss: {
          percentage: Math.max(0, Math.min(100, packetLoss)),
          packetsSent: totalRequests,
          packetsReceived: successfulRequests,
        },
        networkQualityScore,
        unit: 'Mbps',
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Simple speed test error:', error);
      return null;
    }
  }

  private async gatherNetworkDetails(): Promise<{
    dns: string | null;
    ip: string | null;
    location: { country: string; city?: string; region?: string; timezone?: string } | null;
    vpn: boolean | null;
    connectionType: string | null;
  }> {
    try {
      // Get IP and location info from Cloudflare with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      let ip: string | null = null;
      let location: { country: string; city?: string; region?: string; timezone?: string } | null = null;
      let dns: string | null = null;
      let vpn: boolean | null = null;

      try {
        const ipResponse = await fetch('https://cloudflare.com/cdn-cgi/trace', {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });
        clearTimeout(timeoutId);

        if (ipResponse.ok) {
          const text = await ipResponse.text();
          const lines = text.split('\n');
          
          const data: Record<string, string> = {};
          lines.forEach(line => {
            const [key, ...valueParts] = line.split('=');
            if (key && valueParts.length > 0) {
              data[key.trim()] = valueParts.join('=').trim();
            }
          });

          ip = data.ip || null;
          
          if (data.loc) {
            location = {
              country: data.loc || 'Unknown',
            };
          }

          // DNS detection from Cloudflare trace
          if (data.h) {
            dns = data.h;
          }

          // VPN detection - check if IP is from known VPN/proxy providers
          vpn = this.detectVPN(ip, data);

          // Try to get more detailed location info from ipinfo.io as fallback
          if (ip && !location?.city) {
            try {
              const locationController = new AbortController();
              const locationTimeout = setTimeout(() => locationController.abort(), 5000);
              
              const locationResponse = await fetch(`https://ipinfo.io/${ip}/json`, {
                method: 'GET',
                signal: locationController.signal,
                cache: 'no-store',
              });
              clearTimeout(locationTimeout);
              
              if (locationResponse.ok) {
                const locationData = await locationResponse.json();
                location = {
                  country: locationData.country || location?.country || 'Unknown',
                  city: locationData.city,
                  region: locationData.region,
                  timezone: locationData.timezone,
                };
              }
            } catch (error) {
              // Fallback failed, use basic location from Cloudflare
              // Silently continue with Cloudflare location data
            }
          }
        }
      } catch (error) {
        clearTimeout(timeoutId);
        // Continue with null values if Cloudflare trace fails
      }

      // Try to get connection type from device
      let connectionType: string | null = null;
      try {
        // @ts-ignore - dynamic import
        const Network = await import('expo-network');
        if (Network?.getNetworkStateAsync) {
          const state = await Network.getNetworkStateAsync();
          connectionType = state.type || null;
        }
      } catch {
        // expo-network not available, try alternative
        try {
          // @ts-ignore - dynamic import
          const NetInfo = await import('@react-native-community/netinfo');
          if (NetInfo?.default) {
            const state = await NetInfo.default.fetch();
            connectionType = state.type || null;
          }
        } catch {
          // NetInfo not available
        }
      }

      return {
        dns,
        ip,
        location,
        vpn,
        connectionType,
      };
    } catch (error) {
      console.error('Network details error:', error);
      return {
        dns: null,
        ip: null,
        location: null,
        vpn: null,
        connectionType: null,
      };
    }
  }

  private detectVPN(ip: string | null, traceData: Record<string, string>): boolean | null {
    if (!ip) return null;

    // Basic VPN detection heuristics
    // 1. Check if IP is from known datacenter ranges (simplified)
    // 2. Check Cloudflare trace data for proxy indicators
    
    // Check for proxy indicators in Cloudflare trace
    if (traceData.flags) {
      // Cloudflare may indicate proxy/VPN in flags
      const flags = traceData.flags.toLowerCase();
      if (flags.includes('proxy') || flags.includes('vpn')) {
        return true;
      }
    }

    // Additional checks can be added here
    // For production, consider using a dedicated VPN detection service
    
    return null; // Unknown
  }

  private updateNetworkInfo(info: NetworkInfo): void {
    const wasOnline = this.networkInfo.isOnline;
    this.networkInfo = info;
    
    // Notify listeners if status changed
    if (wasOnline !== info.isOnline) {
      this.listeners.forEach(listener => {
        try {
          listener(info.isOnline ?? false, info);
        } catch (error) {
          console.error('Network listener error:', error);
        }
      });
    }
  }

  private showOfflineAlert(): void {
    if (this.alertVisible) return;
    this.alertVisible = true;
    
    Alert.alert(
      'İnternet Bağlantısı Kesildi',
      'İnternet bağlantınızda bir kesinti tespit edildi. Lütfen bağlantınızı kontrol edin.',
      [
        {
          text: 'Ayarlar',
          onPress: async () => {
            try {
              if (typeof Linking.openSettings === 'function') {
                await Linking.openSettings();
              } else if (Platform.OS === 'ios') {
                await Linking.openURL('app-settings:');
              } else if (Platform.OS === 'android') {
                await Linking.openURL('android.settings.WIFI_SETTINGS');
              }
            } catch (error) {
              console.error('Failed to open settings:', error);
            }
            this.alertVisible = false;
          },
        },
        {
          text: 'Tekrar Dene',
          onPress: async () => {
            const isOnline = await this.checkNow();
            this.alertVisible = false;
            if (!isOnline) {
              // Retry after a short delay
              setTimeout(() => {
                if (!this.networkInfo.isOnline) {
                  this.showOfflineAlert();
                }
              }, 2000);
            }
          },
        },
        {
          text: 'Tamam',
          style: 'cancel',
          onPress: () => {
            this.alertVisible = false;
          },
        },
      ],
      { cancelable: false }
    );
  }

  private handleAppStateChange(nextState: AppStateStatus): void {
    const prev = this.appState;
    this.appState = nextState;
    
    if (nextState === 'active') {
      // Resume polling when app becomes active
      this.beginPolling(30000);
    } else if (prev === 'active' && (nextState === 'background' || nextState === 'inactive')) {
      // Pause polling when app goes to background
      this.endPolling();
      this.alertVisible = false;
    }
  }
}

// Export singleton instance
export const networkHelper = NetworkHelper.getInstance();

// Export class for advanced usage
export { NetworkHelper };



