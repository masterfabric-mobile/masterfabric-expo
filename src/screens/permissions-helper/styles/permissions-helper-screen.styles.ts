import { StyleSheet } from 'react-native';

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
    marginBottom: 16,
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
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
    gap: 2,
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
    color: '#FFFFFF',
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
