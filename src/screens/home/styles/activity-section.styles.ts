import { StyleSheet } from 'react-native';

export const activitySectionStyles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  activityCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  activityItem: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityText: {
    fontSize: 16,
    opacity: 0.7,
    textAlign: 'center',
    paddingVertical: 12,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  activityDescription: {
    fontSize: 14,
    lineHeight: 18,
    marginTop: 2,
    opacity: 0.8,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  activityDivider: {
    height: 1,
    marginLeft: 64,
    marginRight: 16,
  },
  emptyStateContainer: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateIcon: {
    marginBottom: 8,
    opacity: 0.6,
  },
});
