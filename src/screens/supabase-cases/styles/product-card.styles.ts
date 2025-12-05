import { StyleSheet } from 'react-native';

export const productCardStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  imagePlaceholder: {
    fontSize: 48,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  header: {
    gap: 4,
  },
  brand: {
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.7,
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 22,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    opacity: 0.7,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
  },
  stockContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stockBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: '600',
  },
  category: {
    fontSize: 11,
    fontWeight: '600',
    opacity: 0.6,
    marginTop: 4,
  },
});

