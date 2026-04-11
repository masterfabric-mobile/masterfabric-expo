import { Platform, StyleSheet } from 'react-native';

const cardShadow = Platform.select({
  web: { boxShadow: '0px 2px 8px rgba(0,0,0,0.05)' },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
});

export const hapticHelperViewStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
    gap: 20,
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  unsupportedCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    gap: 16,
    ...cardShadow,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  unsupportedTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  unsupportedText: {
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    gap: 12,
    ...cardShadow,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
    marginTop: 4,
  },
  statusDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  currentHapticBadge: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  currentHapticText: {
    fontSize: 14,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  toggleContent: {
    flex: 1,
    gap: 8,
  },
  toggleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  toggleIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  toggleTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  toggleDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  optionsContainer: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  hapticCardsContainer: {
    gap: 12,
  },
  hapticCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    ...cardShadow,
    position: 'relative',
  },
  hapticPreviewContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  hapticCardContent: {
    flex: 1,
    gap: 4,
  },
  hapticCardTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  hapticCardDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  selectedBadge: {
    marginLeft: 'auto',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  testAllButton: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...cardShadow,
  },
  testAllButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  infoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  infoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

