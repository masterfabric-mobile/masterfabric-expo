import { StyleSheet } from 'react-native';

export const stepContentStyles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  container: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 24,
    opacity: 0.8,
  },
  descriptionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  paragraphContainer: {
    padding: 16,
    borderRadius: 12,
    width: '100%',
    maxWidth: 400,
    borderLeftWidth: 3,
  },
  paragraphText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'left',
  },
  // Legacy styles kept for compatibility
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 12,
    marginTop: 8,
  },
  descriptionText: {
    fontSize: 16,
    lineHeight: 24,
    flex: 1,
  },
  paragraphItem: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#007AFF',
    width: '90%',
  },
});
