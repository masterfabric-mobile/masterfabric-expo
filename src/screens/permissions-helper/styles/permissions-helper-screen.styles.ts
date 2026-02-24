import type { ThemeColors } from 'masterfabric-expo-core';
import { StyleSheet, type ViewStyle } from 'react-native';

export const permissionsHelperScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  topButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 8,
  },
  hintText: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
    fontStyle: 'italic',
  },
  settingsBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  settingsBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardContainer: {
    marginBottom: 10,
  },
  card: {
    borderRadius: 12,
    padding: 16,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  cardLabelBlock: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  statusColumn: {
    gap: 2,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusSubtext: {
    fontSize: 11,
    marginLeft: 12,
    opacity: 0.9,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 13,
  },
  locationInfoBlock: {
    gap: 4,
  },
  locationStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  locationInfoText: {
    fontSize: 12,
  },
  requestBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestBtnText: {
    fontSize: 14,
    fontWeight: '600',
  },
  configSection: {
    marginTop: 20,
  },
  configTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  configBlock: {
    padding: 12,
    borderRadius: 8,
  },
  configCode: {
    fontFamily: 'monospace',
    fontSize: 11,
  },
});

/** Style maps for subcomponents (ConfigPreviewSection, LocationPermissionDetail, PermissionCard). */
export const configPreviewSectionStyles = {
  section: permissionsHelperScreenStyles.configSection,
  title: permissionsHelperScreenStyles.configTitle,
  block: permissionsHelperScreenStyles.configBlock,
  code: permissionsHelperScreenStyles.configCode,
};

export const locationDetailStyles = {
  block: permissionsHelperScreenStyles.locationInfoBlock,
  row: permissionsHelperScreenStyles.locationStatusRow,
  labelText: permissionsHelperScreenStyles.locationInfoText,
  statusText: permissionsHelperScreenStyles.locationInfoText,
};

export const permissionCardStyles = {
  cardContainer: permissionsHelperScreenStyles.cardContainer,
  card: permissionsHelperScreenStyles.card,
  cardRow: permissionsHelperScreenStyles.cardRow,
  cardLabelBlock: permissionsHelperScreenStyles.cardLabelBlock,
  sectionTitle: permissionsHelperScreenStyles.sectionTitle,
  statusColumn: permissionsHelperScreenStyles.statusColumn,
  statusRow: permissionsHelperScreenStyles.statusRow,
  statusSubtext: permissionsHelperScreenStyles.statusSubtext,
  statusDot: permissionsHelperScreenStyles.statusDot,
  statusText: permissionsHelperScreenStyles.statusText,
  requestBtn: permissionsHelperScreenStyles.requestBtn,
  requestBtnText: permissionsHelperScreenStyles.requestBtnText,
};

/** Theme-dependent styles (light/dark). Use with permissionsHelperScreenStyles. */
export function getPermissionsHelperScreenDynamicStyles(colors: ThemeColors): {
  container: ViewStyle;
  scrollView: ViewStyle;
  card: ViewStyle;
  configBlock: ViewStyle;
  requestBtn: ViewStyle;
  primaryBtnTextColor: string;
} {
  return {
    container: { backgroundColor: colors.background },
    scrollView: { backgroundColor: colors.background },
    card: {
      backgroundColor: colors.cardBackground,
      borderWidth: 1,
      borderColor: colors.surfaceBorder,
    },
    configBlock: { backgroundColor: colors.cardBackground },
    requestBtn: { backgroundColor: colors.activeButton },
    primaryBtnTextColor: colors.activeButtonText,
  };
}
