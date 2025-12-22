/**
 * Network Helper Types
 * 
 * Type definitions for network monitoring and diagnostics.
 */

/**
 * Latency measurement result
 */
export interface LatencyMeasurement {
  unloaded: {
    average: number; // Average latency in ms
    min: number; // Minimum latency in ms
    max: number; // Maximum latency in ms
    measurements: number[]; // All latency measurements
  };
  duringDownload: {
    average: number;
    min: number;
    max: number;
    measurements: number[];
  };
  duringUpload: {
    average: number;
    min: number;
    max: number;
    measurements: number[];
  };
}

/**
 * Speed test measurement for a specific size
 */
export interface SpeedTestMeasurement {
  size: number; // Size in bytes
  sizeLabel: string; // e.g., "100kB", "1MB", "10MB"
  speeds: number[]; // All speed measurements in Mbps
  average: number; // Average speed in Mbps
  median: number; // Median speed in Mbps
  min: number; // Minimum speed in Mbps
  max: number; // Maximum speed in Mbps
  percentile25: number; // 25th percentile
  percentile75: number; // 75th percentile
}

/**
 * Comprehensive speed test result from Cloudflare Speed Test API
 */
export interface SpeedTestResult {
  download: {
    overall: {
      speed: number; // Overall average download speed in Mbps
      max: number;
      min: number;
    };
    measurements: {
      '100kB': SpeedTestMeasurement | null;
      '1MB': SpeedTestMeasurement | null;
      '10MB': SpeedTestMeasurement | null;
    };
  };
  upload: {
    overall: {
      speed: number; // Overall average upload speed in Mbps
      max: number;
      min: number;
    };
    measurements: {
      '100kB': SpeedTestMeasurement | null;
      '1MB': SpeedTestMeasurement | null;
      '10MB': SpeedTestMeasurement | null;
    };
  };
  latency: LatencyMeasurement;
  jitter: {
    average: number; // Average jitter in ms
    min: number;
    max: number;
    measurements: number[];
  };
  packetLoss: {
    percentage: number; // Packet loss percentage (0-100)
    packetsSent: number;
    packetsReceived: number;
  };
  networkQualityScore: number | null; // Score from 0-100, null if not calculated
  unit: 'Mbps' | 'Kbps' | 'Gbps';
  timestamp: Date;
}

/**
 * Location information from IP geolocation
 */
export interface LocationInfo {
  country: string;
  city?: string;
  region?: string;
  timezone?: string;
}

/**
 * Complete network information
 */
export interface NetworkInfo {
  isOnline: boolean | null;
  lastChecked: Date | null;
  speedTest: SpeedTestResult | null;
  dns: string | null;
  ip: string | null;
  location: LocationInfo | null;
  vpn: boolean | null; // true = VPN detected, false = no VPN, null = unknown
  connectionType: string | null; // 'wifi', 'cellular', 'ethernet', etc.
}

/**
 * Network status summary
 */
export interface NetworkStatus {
  isOnline: boolean;
  lastChecked: Date | null;
  connectionType: string | null;
}

/**
 * Network status change listener
 * @param isOnline - Whether the device is currently online
 * @param networkInfo - Complete network information
 */
export type NetworkListener = (isOnline: boolean, networkInfo: NetworkInfo) => void;



