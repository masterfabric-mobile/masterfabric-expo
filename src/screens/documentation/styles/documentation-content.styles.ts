import { StyleSheet } from 'react-native';

export const documentationContentStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  sectionTitleContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 15,
    lineHeight: 20,
  },
  itemsContainer: {
    gap: 12,
  },
  itemCard: {
    borderRadius: 12,
    padding: 16,
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
});
