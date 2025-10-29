import { I18nManager, StyleSheet } from 'react-native';

const isRTL = I18nManager.isRTL;

export const toastStyles = StyleSheet.create({
  toast: {
    padding: 16,
    paddingRight: isRTL ? 16 : 40,
    paddingLeft: isRTL ? 40 : 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    maxWidth: '100%',
    alignSelf: 'stretch',
  },
  contentContainer: {
    flexDirection: isRTL ? 'row-reverse' : 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  messageContainer: {
    flex: 1,
    gap: 8,
  },
  toastText: {
    color: '#fff',
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
    flexWrap: 'wrap',
  },
  icon: {
    marginRight: isRTL ? 0 : 12,
    marginLeft: isRTL ? 12 : 0,
    alignSelf: 'flex-start',
  },
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  closeButton: {
    position: 'absolute',
    [isRTL ? 'left' : 'right']: 8,
    top: 8,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
    lineHeight: 20,
    textAlign: 'center',
  },
});
