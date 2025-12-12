// Component Props Interfaces
import type { ReactNode } from 'react';

export interface UrlLaunchResult {
  id: string;
  functionName: string;
  input: string;
  output: string;
  success: boolean;
  description: string;
  timestamp: number;
}

export interface QueryParameter {
  key: string;
  value: string;
}

export interface UrlTestInput {
  url: string;
  email?: string;
  emailSubject?: string;
  emailBody?: string;
  emailCc?: string;
  emailBcc?: string;
  phone?: string;
  smsRecipients?: string;
  smsBody?: string;
  mapAddress?: string;
  mapLatitude?: number;
  mapLongitude?: number;
  mapLabel?: string;
  appStoreId?: string;
  appStoreReview?: boolean;
  settingsSection?: 'general' | 'app' | 'privacy' | 'wifi' | 'bluetooth' | 'cellular';
  deepLinkUrl?: string;
  fallbackUrl?: string;
  queryParameters?: QueryParameter[];
}

export interface UrlLauncherHelperState {
  testInput: UrlTestInput;
  testResults: UrlLaunchResult[];
  isLoading: boolean;
  history: UrlLaunchResult[];
}

export interface UrlInputFieldProps {
  testInput: UrlTestInput;
  onInputChange: (updates: Partial<UrlTestInput>) => void;
  onRunTests: () => void;
  onLaunchUrl: (url: string) => void;
  onLaunchEmail: () => void;
  onLaunchPhone: () => void;
  onLaunchSMS: () => void;
  onLaunchMap: () => void;
  onLaunchInBrowser?: () => void;
  onLaunchAppStore?: () => void;
  onLaunchSettings?: () => void;
  onLaunchDeepLink?: () => void;
  isLoading: boolean;
}

export interface UrlResultCardProps {
  result: UrlLaunchResult;
  showTimestamp?: boolean;
  onReLaunch?: (result: UrlLaunchResult) => void;
  showActions?: boolean;
}

export interface UrlLauncherAccordionProps {
  title: string;
  defaultExpanded?: boolean;
  children: ReactNode;
}

