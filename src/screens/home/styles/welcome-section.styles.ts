import { StyleSheet } from 'react-native';

export const welcomeSectionStyles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 4,
    marginBottom: 16,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  developerText: {
    fontSize: 18,
    fontWeight: '600',
    opacity: 0.8,
    marginBottom: 12,
    lineHeight: 22,
    letterSpacing: 0.2,
  },
  userName: {
    fontSize: 16,
    opacity: 0.7,
    fontWeight: '500',
    lineHeight: 20,
  },
});
