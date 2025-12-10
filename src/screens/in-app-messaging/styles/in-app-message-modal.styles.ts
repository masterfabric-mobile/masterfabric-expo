import { StyleSheet } from 'react-native';

export const inAppMessageModalStyles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    zIndex: 1000,
  },
  containerCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    maxWidth: '100%',
  },
  modalCenter: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
    maxWidth: 400,
    width: '100%',
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: '#F5F5F5',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  content: {
    padding: 20,
  },
  contentCenter: {
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 12,
  },
  titleCenter: {
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 28,
    letterSpacing: -0.3,
    flex: 1,
    marginRight: 12,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    fontSize: 18,
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    letterSpacing: -0.1,
    marginBottom: 20,
    opacity: 0.85,
  },
  messageCenter: {
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.1,
    marginBottom: 24,
    opacity: 0.85,
  },
  button: {
    width: '100%',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 4,
  },
  buttonHalf: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
});

// Dark mode styles (will be applied conditionally)
export const inAppMessageModalDarkStyles = StyleSheet.create({
  modal: {
    backgroundColor: '#1C1C1E',
  },
  imageContainer: {
    backgroundColor: '#2C2C2E',
  },
  title: {
    color: '#FFFFFF',
  },
  message: {
    color: '#E5E5EA',
  },
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

