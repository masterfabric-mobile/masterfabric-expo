import { StyleSheet } from 'react-native';

export const helperCategoryCardStyles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 0.6,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
    marginVertical: 6,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    borderWidth: 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  comingSoonContainer: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255, 149, 0, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 0.6,
    borderColor: 'rgba(255, 149, 0, 0.2)',
    marginTop: 8,
  },
  comingSoonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FF9500',
  },
  arrowContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});