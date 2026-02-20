import type { ReactNode } from 'react';
import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import type { PermissionStatus } from 'masterfabric-expo-core';
import type { PermissionKey } from '../constants/permissions-helper.constants';

/** State for a single permission row (status + loading). */
export interface PermissionRowState {
  status: PermissionStatus | null;
  loading: boolean;
}

/** Full screen state: statuses and loading per permission key. */
export type PermissionsHelperState = Record<PermissionKey, PermissionRowState>;

/** Location permission breakdown (foreground, background, precise). */
export interface LocationPermissionInfo {
  foreground: 'granted' | 'denied' | 'unavailable';
  background: 'granted' | 'denied' | 'unavailable';
  precise: boolean;
}

/** Props for the permissions helper screen. Reserved for future use (e.g. initialPermissionKeys, onResult). */
export interface PermissionsHelperScreenProps {
  // optional: initialPermissionKeys?, onResult?
}

/** Styles map for ConfigPreviewSection. */
export interface ConfigPreviewSectionStyles {
  section: StyleProp<ViewStyle>;
  title: StyleProp<TextStyle>;
  block: StyleProp<ViewStyle>;
  code: StyleProp<TextStyle>;
}

/** Props for ConfigPreviewSection component. */
export interface ConfigPreviewSectionProps {
  title: string;
  content: string;
  titleStyle?: StyleProp<TextStyle>;
  blockStyle?: StyleProp<ViewStyle>;
  codeStyle?: StyleProp<TextStyle>;
  styles: ConfigPreviewSectionStyles;
}

/** Labels for LocationPermissionDetail (foreground/background/precise). */
export interface LocationPermissionDetailLabels {
  foregroundLabel: string;
  backgroundLabel: string;
  preciseLabel: string;
  foregroundStatus: string;
  backgroundStatus: string;
  preciseStatus: string;
}

/** Styles map for LocationPermissionDetail. */
export interface LocationPermissionDetailStyles {
  block: StyleProp<ViewStyle>;
  row: StyleProp<ViewStyle>;
  labelText: StyleProp<TextStyle>;
  statusText: StyleProp<TextStyle>;
}

/** Props for LocationPermissionDetail component. */
export interface LocationPermissionDetailProps {
  info: LocationPermissionInfo;
  labels: LocationPermissionDetailLabels;
  styles: LocationPermissionDetailStyles;
  labelStyle?: StyleProp<TextStyle>;
  foregroundStatusStyle?: StyleProp<TextStyle>;
  backgroundStatusStyle?: StyleProp<TextStyle>;
  preciseStatusStyle?: StyleProp<TextStyle>;
}

/** Styles map for PermissionCard. */
export interface PermissionCardStyles {
  cardContainer: StyleProp<ViewStyle>;
  card: StyleProp<ViewStyle>;
  cardRow: StyleProp<ViewStyle>;
  cardLabelBlock: StyleProp<ViewStyle>;
  sectionTitle: StyleProp<TextStyle>;
  statusRow: StyleProp<ViewStyle>;
  statusDot: StyleProp<ViewStyle>;
  statusText: StyleProp<TextStyle>;
  requestBtn: StyleProp<ViewStyle>;
  requestBtnText: StyleProp<TextStyle>;
}

/** Props for PermissionCard component. */
export interface PermissionCardProps {
  label: string;
  labelStyle?: StyleProp<TextStyle>;
  statusContent: ReactNode;
  requestButtonLabel: string;
  isLoad: boolean;
  isAnyLoading: boolean;
  onRequest: () => void;
  cardStyle: ViewStyle;
  requestBtnStyle: ViewStyle;
  primaryBtnTextColor: string;
  styles: PermissionCardStyles;
}

export type { PermissionKey } from '../constants/permissions-helper.constants';
