import { StyleSheet } from 'react-native';

export const onboardingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
  },
  skipContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipButtonText: {
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.6,
  },
  stepContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  controlsContainer: {
    width: '100%',
    paddingBottom: 20,
  },
});
