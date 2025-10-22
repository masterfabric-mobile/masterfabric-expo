import { StyleSheet } from 'react-native';

export const accordionStyles = StyleSheet.create({
  container: {
    paddingTop: 8,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    borderRadius: 12,
    padding: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    lineHeight: 18,
  },
  sectionContent: {
    paddingLeft: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  itemCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 13,
    lineHeight: 16,
  },
});
