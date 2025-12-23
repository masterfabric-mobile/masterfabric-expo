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

// Use performance.now() if available, otherwise fallback to Date.now()
const getHighPrecisionTime = (): number => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
};
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
    // Try comprehensive test first (Cloudflare style), fallback to simple if it fails
    console.log('Starting network check: performing speed test and gathering network details...');
    
    let finalSpeedTest: SpeedTestResult | null = null;
    try {
      // Try comprehensive test first (60 seconds timeout for full Cloudflare test)
      console.log('Trying comprehensive speed test first (Cloudflare style)...');
      finalSpeedTest = await Promise.race([
        this.performSpeedTest(),
        new Promise<null>((resolve) => setTimeout(() => {
          console.warn('Comprehensive speed test timeout after 60 seconds');
          resolve(null);
        }, 60000)), // 60 seconds for comprehensive test
      ]);
      
      if (finalSpeedTest) {
        console.log('Comprehensive speed test completed successfully:', {
          downloadSpeed: finalSpeedTest.download.overall.speed.toFixed(2) + ' Mbps',
          uploadSpeed: finalSpeedTest.upload.overall.speed.toFixed(2) + ' Mbps',
          latency: finalSpeedTest.latency.unloaded.average.toFixed(2) + ' ms',
        });
      } else {
        console.warn('Comprehensive speed test returned null, trying simple test as fallback...');
        // If comprehensive test fails, try simple test (20 seconds timeout)
        finalSpeedTest = await Promise.race([
          this.performSimpleSpeedTest(),
          new Promise<null>((resolve) => setTimeout(() => {
            console.warn('Simple speed test timeout after 20 seconds');
            resolve(null);
          }, 20000)),
        ]);
        
        if (finalSpeedTest) {
          console.log('Simple speed test completed successfully:', {
            downloadSpeed: finalSpeedTest.download.overall.speed.toFixed(2) + ' Mbps',
            uploadSpeed: finalSpeedTest.upload.overall.speed.toFixed(2) + ' Mbps',
            latency: finalSpeedTest.latency.unloaded.average.toFixed(2) + ' ms',
          });
        }
      }
    } catch (error) {
      console.error('Speed test error:', error);
      finalSpeedTest = null;
    }
    
    // Gather network details in parallel
    const [networkDetails] = await Promise.allSettled([
      this.gatherNetworkDetails(),
    ]);
    
    const details = networkDetails.status === 'fulfilled' ? networkDetails.value : {};
    
    if (!finalSpeedTest) {
      console.warn('All speed tests failed, network info will be shown without speed test results');
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
        const startTime = getHighPrecisionTime();
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        
        // Use GET instead of HEAD for better compatibility (some environments don't support HEAD)
        // Download a small file (1KB) to measure latency
        const response = await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
          method: 'GET', // Changed from HEAD to GET for better compatibility
          signal: controller.signal,
          cache: 'no-store',
        });
        
        clearTimeout(timeoutId);
        
        // For GET requests, we need to read the response body to ensure the request is complete
        // This gives us accurate latency measurement
        if (response.ok) {
          // Read the response body (small 1KB file) to ensure request completion
          await response.blob();
        }
        
        const endTime = getHighPrecisionTime();
        
        if (response.ok) {
          const latency = endTime - startTime;
          if (latency > 0 && latency < 10000) { // Valid latency between 0-10s
            latencies.push(latency);
          }
        }
        
        // Small delay between measurements
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
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
    
    // Calculate timeout based on size (more time for larger files)
    const timeoutMs = Math.min(60000, Math.max(10000, (size / 100000) * 5000));
    
    for (let i = 0; i < runs; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.warn(`Download speed test timeout for size ${size}, run ${i + 1}`);
        }, timeoutMs);
        
        // Start timing right before fetch (includes DNS lookup, connection, etc.)
        const startTime = getHighPrecisionTime();
        const response = await fetch(`https://speed.cloudflare.com/__down?bytes=${size}`, {
          method: 'GET',
          signal: controller.signal,
          cache: 'no-store',
        });
        
        if (!response.ok) {
          clearTimeout(timeoutId);
          console.warn(`Download speed test failed: HTTP ${response.status} for size ${size}, run ${i + 1}`);
          continue;
        }
        
        const contentLength = response.headers.get('content-length');
        const expectedSize = contentLength ? parseInt(contentLength, 10) : size;
        
        // Read the blob completely (this is where actual download happens)
        // The timing should include the entire download process
        const blob = await response.blob();
        const endTime = getHighPrecisionTime();
        clearTimeout(timeoutId);
        
        const duration = (endTime - startTime) / 1000; // duration in seconds (convert from ms)
        const sizeInBytes = blob.size > 0 ? blob.size : expectedSize;
        
        // Validate that we got the expected size (Cloudflare may return slightly different sizes)
        if (Math.abs(sizeInBytes - expectedSize) > expectedSize * 0.1 && expectedSize > 0) { // Allow 10% tolerance
          console.warn(`Size mismatch: expected ${expectedSize} bytes, got ${sizeInBytes} bytes`);
        }
        
        // Validate duration and size
        if (duration < 0.01 || duration > 300 || sizeInBytes <= 0) { // Max 5 minutes
          console.warn(`Invalid duration or size: duration=${duration}s, size=${sizeInBytes} bytes, skipping`);
          continue;
        }
        
        // Calculate speed: (bytes * 8 bits/byte) / (seconds * 1,000,000 bits/Mbps)
        // Formula: Mbps = (bytes * 8) / (seconds * 1,000,000)
        // Example: 1MB (1,048,576 bytes) in 1 second = (1,048,576 * 8) / (1 * 1,000,000) = 8.39 Mbps
        // Example: 1MB (1,000,000 bytes) in 1 second = (1,000,000 * 8) / (1 * 1,000,000) = 8.00 Mbps
        const bitsTransferred = sizeInBytes * 8;
        const bitsPerSecond = bitsTransferred / duration;
        const speedMbps = bitsPerSecond / 1000000; // Convert to Mbps
        
        // Log detailed calculation for debugging
        console.log(`Download calculation: size=${sizeInBytes} bytes (${(sizeInBytes / 1024 / 1024).toFixed(2)} MB), duration=${duration.toFixed(3)}s, bits=${bitsTransferred}, bps=${bitsPerSecond.toFixed(0)}, speed=${speedMbps.toFixed(2)} Mbps`);
        
        // Validate speed result (reasonable range: 0.01 Mbps to 10,000 Mbps)
        if (speedMbps > 0.01 && speedMbps < 10000 && !isNaN(speedMbps) && isFinite(speedMbps)) {
          speeds.push(speedMbps);
          console.log(`Download speed test success: ${speedMbps.toFixed(2)} Mbps for size ${size}, run ${i + 1}`);
        } else {
          console.warn(`Invalid speed calculation: ${speedMbps} Mbps, duration: ${duration}s, size: ${sizeInBytes} bytes`);
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error(`Download speed test error for size ${size}, run ${i + 1}:`, error);
        }
        continue;
      }
    }
    
    console.log(`Download speed test completed: ${speeds.length}/${runs} successful for size ${size}`);
    return speeds;
  }

  /**
   * Measure upload speed for a specific size with multiple runs
   */
  private async measureUploadSpeed(size: number, runs: number = 8): Promise<number[]> {
    const speeds: number[] = [];
    
    // Calculate timeout based on size (more time for larger files)
    // Increased timeout for slower connections - minimum 30 seconds, maximum 120 seconds
    const timeoutMs = Math.min(120000, Math.max(30000, (size / 100000) * 10000));
    
    for (let i = 0; i < runs; i++) {
      try {
        // Create test data for each run
        // Try different methods for React Native compatibility
        let body: Blob | ArrayBuffer | string;
        let bodyType = 'unknown';
        
        try {
          // Method 1: Try Blob first (works in web and some React Native versions)
          const testData = new Uint8Array(size);
          for (let j = 0; j < size; j++) {
            testData[j] = Math.floor(Math.random() * 256);
          }
          body = new Blob([testData]);
          bodyType = 'Blob';
          console.log(`Upload test: Using Blob method for size ${size}, run ${i + 1}`);
        } catch (blobError) {
          // Method 2: Fallback to ArrayBuffer if Blob fails
          console.warn(`Blob creation failed, trying ArrayBuffer:`, blobError);
          const testData = new Uint8Array(size);
          for (let j = 0; j < size; j++) {
            testData[j] = Math.floor(Math.random() * 256);
          }
          body = testData.buffer;
          bodyType = 'ArrayBuffer';
          console.log(`Upload test: Using ArrayBuffer method for size ${size}, run ${i + 1}`);
        }
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.warn(`Upload speed test timeout for size ${size}, run ${i + 1}`);
        }, timeoutMs);
        
        // Start timing right before fetch (includes network overhead)
        // For upload, we measure from when we start sending data to when we get response
        const startTime = getHighPrecisionTime();
        
        let response: Response;
        try {
          // Prepare headers - FormData doesn't need Content-Type (browser sets it automatically)
          const headers: Record<string, string> = {};
          if (bodyType !== 'FormData') {
            headers['Content-Type'] = 'application/octet-stream';
          }
          
          // Try POST (standard method)
          // Cloudflare's __up endpoint accepts POST with binary data
          response = await fetch(`https://speed.cloudflare.com/__up?bytes=${size}`, {
            method: 'POST',
            headers: headers,
            body: body as any,
            signal: controller.signal,
          });
        } catch (fetchError) {
          clearTimeout(timeoutId);
          console.error(`Upload POST failed for size ${size}, run ${i + 1}:`, fetchError);
          // POST failed, skip this run
          continue;
        }
        
        // Wait for response body to be fully received (ensures upload is complete)
        // The upload is complete when we receive the response
        let responseText: string;
        try {
          responseText = await response.text();
        } catch (textError) {
          clearTimeout(timeoutId);
          console.error(`Upload response read failed for size ${size}, run ${i + 1}:`, textError);
          continue;
        }
        
        const endTime = getHighPrecisionTime();
        clearTimeout(timeoutId);
        
        console.log(`Upload test response: status=${response.status}, ok=${response.ok}, size=${size}, run=${i + 1}, responseLength=${responseText?.length || 0}`);
        
        if (response.ok) {
          const duration = (endTime - startTime) / 1000; // duration in seconds (convert from ms)
          
          // Validate duration
          if (duration < 0.01 || duration > 300) { // Max 5 minutes
            console.warn(`Invalid duration: ${duration}s, skipping`);
            continue;
          }
          
          // Calculate speed: (bytes * 8 bits/byte) / (seconds * 1,000,000 bits/Mbps)
          // Formula: Mbps = (bytes * 8) / (seconds * 1,000,000)
          const bitsTransferred = size * 8;
          const bitsPerSecond = bitsTransferred / duration;
          const speedMbps = bitsPerSecond / 1000000; // Convert to Mbps
          
          // Log detailed calculation for debugging
          console.log(`Upload calculation: size=${size} bytes (${(size / 1024 / 1024).toFixed(2)} MB), duration=${duration.toFixed(3)}s, bits=${bitsTransferred}, bps=${bitsPerSecond.toFixed(0)}, speed=${speedMbps.toFixed(2)} Mbps`);
          
          // Validate speed result (reasonable range: 0.01 Mbps to 10,000 Mbps)
          if (speedMbps > 0.01 && speedMbps < 10000 && !isNaN(speedMbps) && isFinite(speedMbps)) {
            speeds.push(speedMbps);
            console.log(`Upload speed test success: ${speedMbps.toFixed(2)} Mbps for size ${size}, run ${i + 1}`);
          } else {
            console.warn(`Invalid speed calculation: ${speedMbps} Mbps, duration: ${duration}s, size: ${size} bytes`);
          }
        } else {
          console.warn(`Upload speed test failed: HTTP ${response.status} for size ${size}, run ${i + 1}`);
        }
        
        // Small delay between upload tests
        if (i < runs - 1) {
          await new Promise(resolve => setTimeout(resolve, 200));
        }
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error(`Upload speed test error for size ${size}, run ${i + 1}:`, error);
        }
        continue;
      }
    }
    
    console.log(`Upload speed test completed: ${speeds.length}/${runs} successful for size ${size}`);
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
   * Calculate jitter from latency measurements (Cloudflare style)
   * Jitter is the variation in latency between consecutive measurements
   * Formula: Jitter = average of |latency[i] - latency[i-1]|
   */
  private calculateJitter(latencies: number[]): { average: number; min: number; max: number; measurements: number[] } {
    if (latencies.length < 2) {
      console.warn('calculateJitter: Not enough latency measurements (need at least 2, got ' + latencies.length + ')');
      return { average: 0, min: 0, max: 0, measurements: [] };
    }
    
    const jitters: number[] = [];
    for (let i = 1; i < latencies.length; i++) {
      // Calculate absolute difference between consecutive latencies
      const jitter = Math.abs(latencies[i] - latencies[i - 1]);
      jitters.push(jitter);
    }
    
    if (jitters.length === 0) {
      return { average: 0, min: 0, max: 0, measurements: [] };
    }
    
    const sorted = [...jitters].sort((a, b) => a - b);
    const average = jitters.reduce((a, b) => a + b, 0) / jitters.length;
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    console.log(`calculateJitter: Calculated from ${latencies.length} latencies, ${jitters.length} jitter values, average: ${average.toFixed(2)} ms`);
    
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
      console.log('Starting comprehensive speed test...');
      // Step 1: Measure unloaded latency (Cloudflare uses 20 measurements)
      console.log('Step 1: Measuring unloaded latency (20 measurements like Cloudflare)...');
      const unloadedLatencies = await Promise.race([
        this.measureLatency(20), // Cloudflare uses 20 measurements
        new Promise<number[]>((resolve) => setTimeout(() => {
          console.warn('Latency measurement timeout');
          resolve([]);
        }, 30000)), // Increased timeout for 20 measurements
      ]);
      console.log(`Unloaded latency measurements: ${unloadedLatencies.length}/20 successful`);
      if (unloadedLatencies.length === 0) {
        console.warn('No latency measurements successful, returning null');
        return null;
      }
      
      const unloadedLatency = {
        average: unloadedLatencies.reduce((a, b) => a + b, 0) / unloadedLatencies.length,
        min: Math.min(...unloadedLatencies),
        max: Math.max(...unloadedLatencies),
        measurements: unloadedLatencies,
      };
      
      // Step 2: Download speed tests (Cloudflare style: 100kB=10 runs, 1MB=8 runs, 10MB=6 runs)
      console.log('Step 2: Measuring download speeds (Cloudflare style)...');
      const [download100kB, download1MB] = await Promise.all([
        this.measureDownloadSpeed(100000, 10), // Cloudflare uses 10 runs for 100kB
        this.measureDownloadSpeed(1000000, 8), // Cloudflare uses 8 runs for 1MB
      ]);
      console.log(`Download speeds - 100kB: ${download100kB.length}/10, 1MB: ${download1MB.length}/8`);
      // 10MB test separately (Cloudflare uses 6 runs)
      console.log('Step 2b: Measuring download speed (10MB, 6 runs)...');
      const download10MB = await this.measureDownloadSpeed(10000000, 6); // Cloudflare uses 6 runs for 10MB
      console.log(`Download speed - 10MB: ${download10MB.length}/6`);
      
      // Step 3: Upload speed tests (Cloudflare style: 100kB=8 runs, 1MB=6 runs, 10MB=4 runs)
      console.log('Step 3: Measuring upload speeds (Cloudflare style)...');
      const [upload100kB, upload1MB] = await Promise.all([
        this.measureUploadSpeed(100000, 8), // Cloudflare uses 8 runs for 100kB
        this.measureUploadSpeed(1000000, 6), // Cloudflare uses 6 runs for 1MB
      ]);
      console.log(`Upload speeds - 100kB: ${upload100kB.length}/8, 1MB: ${upload1MB.length}/6`);
      // 10MB upload test separately (Cloudflare uses 4 runs)
      console.log('Step 3b: Measuring upload speed (10MB, 4 runs)...');
      const upload10MB = await this.measureUploadSpeed(10000000, 4); // Cloudflare uses 4 runs for 10MB
      console.log(`Upload speed - 10MB: ${upload10MB.length}/4`);
      
      // Measure latency during download (Cloudflare uses 13 measurements)
      const latencyDuringDownload: number[] = [];
      const downloadLoadPromise = this.measureDownloadSpeed(1000000, 3).catch(() => []);
      
      // Measure latency while download is running (Cloudflare uses 13 measurements)
      const downloadLatencyPromises = Array.from({ length: 13 }, async () => {
        try {
          const startTime = getHighPrecisionTime();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
            method: 'GET', // Changed from HEAD to GET for better compatibility
            signal: controller.signal,
            cache: 'no-store',
          });
          // Read response body to ensure request completion
          if (response.ok) {
            await response.blob();
          }
          clearTimeout(timeoutId);
          const latency = getHighPrecisionTime() - startTime;
          if (latency > 0 && latency < 10000) {
            latencyDuringDownload.push(latency);
          }
        } catch {
          // Ignore errors
        }
      });
      
      await Promise.all([downloadLoadPromise, ...downloadLatencyPromises]);
      
      // Measure latency during upload (Cloudflare uses 20 measurements)
      const latencyDuringUpload: number[] = [];
      const uploadLoadPromise = this.measureUploadSpeed(1000000, 3).catch(() => []);
      
      // Measure latency while upload is running (Cloudflare uses 20 measurements)
      const uploadLatencyPromises = Array.from({ length: 20 }, async () => {
        try {
          const startTime = getHighPrecisionTime();
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          const response = await fetch('https://speed.cloudflare.com/__down?bytes=1000', {
            method: 'GET', // Changed from HEAD to GET for better compatibility
            signal: controller.signal,
            cache: 'no-store',
          });
          // Read response body to ensure request completion
          if (response.ok) {
            await response.blob();
          }
          clearTimeout(timeoutId);
          const latency = getHighPrecisionTime() - startTime;
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
      
      // Calculate upload statistics (ensure we have results)
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
      
      console.log(`Upload overall: ${uploadOverall.speed.toFixed(2)} Mbps (min: ${uploadOverall.min.toFixed(2)}, max: ${uploadOverall.max.toFixed(2)}) from ${allUploadSpeeds.length} measurements`);
      
      if (allUploadSpeeds.length === 0) {
        console.warn('No upload speed measurements available in comprehensive test!');
      }
      
      // Calculate latency statistics
      const latencyDuringDownloadAvg = latencyDuringDownload.length > 0
        ? latencyDuringDownload.reduce((a, b) => a + b, 0) / latencyDuringDownload.length
        : unloadedLatency.average;
      
      const latencyDuringUploadAvg = latencyDuringUpload.length > 0
        ? latencyDuringUpload.reduce((a, b) => a + b, 0) / latencyDuringUpload.length
        : unloadedLatency.average;
      
      // Calculate jitter (Cloudflare style - variation in latency)
      const jitter = this.calculateJitter(unloadedLatencies);
      console.log(`Jitter: ${jitter.average.toFixed(2)} ms (min: ${jitter.min.toFixed(2)} ms, max: ${jitter.max.toFixed(2)} ms) from ${jitter.measurements.length} measurements`);
      
      // Calculate packet loss (simplified estimation)
      // In a real implementation, this would use ICMP ping, but React Native doesn't support that
      // We estimate based on failed requests vs total requests (Cloudflare style)
      const totalLatencyRequests = 20; // Unloaded latency measurements
      const totalDownloadRequests = 10 + 8 + 6; // 100kB (10 runs) + 1MB (8 runs) + 10MB (6 runs)
      const totalUploadRequests = 8 + 6 + 4; // 100kB (8 runs) + 1MB (6 runs) + 10MB (4 runs)
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
      console.log('performSimpleSpeedTest: Starting simple speed test...');
      
      // Try latency measurement (must succeed for valid test)
      let unloadedLatencies: number[] = [];
      try {
        console.log('performSimpleSpeedTest: Measuring latency (5 measurements)...');
        unloadedLatencies = await Promise.race([
          this.measureLatency(5), // Increased to 5 for better accuracy
          new Promise<number[]>((resolve) => setTimeout(() => {
            console.warn('performSimpleSpeedTest: Latency measurement timeout');
            resolve([]);
          }, 15000)), // Increased timeout
        ]);
        console.log(`performSimpleSpeedTest: Latency measurements: ${unloadedLatencies.length}/5`);
      } catch (error) {
        console.error('performSimpleSpeedTest: Latency measurement failed:', error);
      }
      
      // If latency measurement failed, use a reasonable default but still proceed
      // We'll still try to get speed measurements which are more important
      const unloadedLatency = unloadedLatencies.length > 0 ? {
        average: unloadedLatencies.reduce((a, b) => a + b, 0) / unloadedLatencies.length,
        min: Math.min(...unloadedLatencies),
        max: Math.max(...unloadedLatencies),
        measurements: unloadedLatencies,
      } : {
        average: 0, // Will be calculated later if we get any latency data
        min: 0,
        max: 0,
        measurements: [],
      };
      
      if (unloadedLatencies.length === 0) {
        console.warn('performSimpleSpeedTest: No latency measurements, but continuing with speed tests...');
      }
      
      // Single download test (500KB - smaller for faster completion)
      console.log('performSimpleSpeedTest: Measuring download speed (500KB, 2 runs)...');
      let download500kB: number[] = [];
      try {
        download500kB = await Promise.race([
          this.measureDownloadSpeed(500000, 2),
          new Promise<number[]>((resolve) => setTimeout(() => {
            console.warn('performSimpleSpeedTest: Download speed measurement timeout');
            resolve([]);
          }, 15000)),
        ]);
        console.log(`performSimpleSpeedTest: Download speed measurements: ${download500kB.length}/2`);
      } catch (error) {
        console.error('performSimpleSpeedTest: Download speed measurement failed:', error);
      }
      
      if (download500kB.length === 0) {
        console.warn('performSimpleSpeedTest: No download speed measurements');
        // Still try to return something if we have upload or latency data
        if (upload100kB.length === 0 && unloadedLatencies.length === 0) {
          console.error('performSimpleSpeedTest: No measurements at all, returning null');
          return null;
        }
        // Continue with upload test even if download failed
      }
      
      // Single upload test (100kB) - ensure we get results
      console.log('performSimpleSpeedTest: Measuring upload speed (100kB, 3 runs)...');
      let upload100kB: number[] = [];
      try {
        upload100kB = await Promise.race([
          this.measureUploadSpeed(100000, 3), // 3 runs for better accuracy
          new Promise<number[]>((resolve) => setTimeout(() => {
            console.warn('performSimpleSpeedTest: Upload speed measurement timeout');
            resolve([]);
          }, 30000)), // Increased timeout for upload (30 seconds)
        ]);
        console.log(`performSimpleSpeedTest: Upload speed measurements: ${upload100kB.length}/3`);
        
        if (upload100kB.length === 0) {
          console.warn('performSimpleSpeedTest: Upload test returned no results, trying again with smaller size...');
          // Try with smaller size if first attempt fails
          upload100kB = await Promise.race([
            this.measureUploadSpeed(50000, 2), // 50kB, 2 runs
            new Promise<number[]>((resolve) => setTimeout(() => {
              console.warn('performSimpleSpeedTest: Second upload speed measurement timeout');
              resolve([]);
            }, 20000)),
          ]);
          console.log(`performSimpleSpeedTest: Second upload speed measurements: ${upload100kB.length}/2`);
        }
        
        if (upload100kB.length === 0) {
          console.error('performSimpleSpeedTest: All upload tests failed!');
        }
      } catch (error) {
        console.error('performSimpleSpeedTest: Upload speed measurement failed:', error);
      }
      
      // Calculate download statistics
      const downloadOverall = download500kB.length > 0 ? {
        speed: download500kB.reduce((a, b) => a + b, 0) / download500kB.length,
        max: Math.max(...download500kB),
        min: Math.min(...download500kB),
      } : { speed: 0, max: 0, min: 0 };
      
      // Calculate upload statistics - ensure we have valid results
      const uploadOverall = upload100kB.length > 0 ? {
        speed: upload100kB.reduce((a, b) => a + b, 0) / upload100kB.length,
        max: Math.max(...upload100kB),
        min: Math.min(...upload100kB),
      } : { speed: 0, max: 0, min: 0 };
      
      // If we have no measurements at all, return null
      if (download500kB.length === 0 && upload100kB.length === 0 && unloadedLatencies.length === 0) {
        console.error('performSimpleSpeedTest: No measurements at all, returning null');
        return null;
      }
      
      // If we don't have latency but have speed, use a default latency for display
      if (unloadedLatencies.length === 0 && (download500kB.length > 0 || upload100kB.length > 0)) {
        console.warn('performSimpleSpeedTest: No latency data, but have speed data. Using estimated latency.');
        // Estimate latency based on speed (rough approximation)
        const estimatedLatency = download500kB.length > 0 ? 30 : 50; // Rough estimate
        unloadedLatency.average = estimatedLatency;
        unloadedLatency.min = estimatedLatency;
        unloadedLatency.max = estimatedLatency;
      }
      
      // Calculate jitter from latency measurements (Cloudflare style)
      // Jitter is the variation in latency between consecutive measurements
      // Only calculate if we have real latency measurements
      let jitter;
      if (unloadedLatencies.length >= 2) {
        jitter = this.calculateJitter(unloadedLatencies);
        console.log(`performSimpleSpeedTest: Jitter calculated from ${unloadedLatencies.length} latencies: ${jitter.average.toFixed(2)} ms (min: ${jitter.min.toFixed(2)} ms, max: ${jitter.max.toFixed(2)} ms)`);
      } else if (unloadedLatencies.length === 1) {
        // Single latency measurement - jitter is 0
        jitter = { average: 0, min: 0, max: 0, measurements: [] };
        console.log(`performSimpleSpeedTest: Only 1 latency measurement, jitter is 0`);
      } else {
        // No latency measurements - jitter is 0 (but this is not ideal)
        jitter = { average: 0, min: 0, max: 0, measurements: [] };
        console.warn(`performSimpleSpeedTest: No latency measurements for jitter calculation`);
      }
      
      // Calculate packet loss correctly
      // Only count tests that were actually attempted and completed (successful or failed)
      // For latency: we attempted 5, got unloadedLatencies.length successful
      // For download: we attempted 2, got download500kB.length successful  
      // For upload: we attempted 3 (or 3+2=5 if fallback was used), got upload100kB.length successful
      
      const totalLatencyAttempted = 5; // We attempted 5 latency measurements
      const totalDownloadAttempted = 2; // We attempted 2 download tests
      
      // Calculate upload attempts: if upload100kB has results, we tried 3. If empty, we might have tried 3+2=5
      // But we need to track if fallback was actually attempted
      // For now, assume: if upload100kB.length > 0, we tried 3. If 0, we tried 3+2=5
      const totalUploadAttempted = upload100kB.length > 0 ? 3 : 5; // 3 for 100kB, or 5 if fallback was used
      
      const totalRequests = totalLatencyAttempted + totalDownloadAttempted + totalUploadAttempted;
      
      const successfulLatency = unloadedLatencies.length;
      const successfulDownload = download500kB.length;
      const successfulUpload = upload100kB.length;
      const successfulRequests = successfulLatency + successfulDownload + successfulUpload;
      
      // Packet loss = (failed requests / total requests) * 100
      const failedRequests = totalRequests - successfulRequests;
      const packetLoss = totalRequests > 0 
        ? (failedRequests / totalRequests) * 100 
        : 0;
      
      console.log(`performSimpleSpeedTest: Packet loss calculation:`);
      console.log(`  - Latency: ${successfulLatency}/${totalLatencyAttempted} successful`);
      console.log(`  - Download: ${successfulDownload}/${totalDownloadAttempted} successful`);
      console.log(`  - Upload: ${successfulUpload}/${totalUploadAttempted} successful`);
      console.log(`  - Total: ${successfulRequests}/${totalRequests} successful, ${failedRequests} failed`);
      console.log(`  - Packet Loss: ${packetLoss.toFixed(2)}%`);
      
      const networkQualityScore = this.calculateNetworkQualityScore(
        downloadOverall.speed,
        uploadOverall.speed,
        unloadedLatency.average,
        jitter.average,
        packetLoss
      );
      
      console.log('performSimpleSpeedTest: Speed test completed successfully:', {
        downloadSpeed: downloadOverall.speed.toFixed(2) + ' Mbps',
        uploadSpeed: uploadOverall.speed.toFixed(2) + ' Mbps',
        latency: unloadedLatency.average.toFixed(2) + ' ms',
      });
      
      return {
        download: {
          overall: downloadOverall,
          measurements: {
            '100kB': null,
            '1MB': this.createSpeedMeasurement(500000, '500kB', download500kB), // Using 500kB but labeled as 1MB for UI compatibility
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



