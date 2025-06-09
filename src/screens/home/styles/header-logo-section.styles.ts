import { StyleSheet } from 'react-native';

export const headerLogoSectionStyles = StyleSheet.create({
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 32,
    height: 32,
  },
  textContainer: {
    marginLeft: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appName: {
    fontSize: 18,
    fontWeight: '600',
  },
  divider: {
    width: 1,
    height: 16,
    opacity: 0.6,
  },
  typewriterText: {
    fontFamily: 'Courier New',
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  cursor: {
    fontFamily: 'Courier New',
    opacity: 1,
  },
});
