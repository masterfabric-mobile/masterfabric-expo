import { StyleSheet } from 'react-native';

export const onboardingScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  stepContainer: {
    flex: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  controlsContainer: {
    flex: 0.3,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingBottom: 40,
  },
});
