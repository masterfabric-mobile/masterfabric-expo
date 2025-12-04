import { StyleSheet } from 'react-native';

export const supabaseAuthScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  logoSubtitle: {
    fontSize: 16,
    opacity: 0.8,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  section: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
    fontSize: 16,
    minHeight: 48,
  },
  inputError: {
    borderWidth: 2,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
    marginTop: 4,
  },
  helperText: {
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  button: {
    borderRadius: 10,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  buttonPrimary: {
    shadowColor: '#3ECF8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonSecondary: {
    borderWidth: 2,
  },
  buttonDisabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextSecondary: {
    fontSize: 16,
    fontWeight: '600',
  },
  envCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  envBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  envBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  envRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    gap: 12,
  },
  envLabel: {
    flex: 1,
    fontSize: 14,
  },
  envValue: {
    flex: 2,
    fontSize: 13,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.1)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalEnvRow: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  modalEnvLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  modalEnvValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  modalEnvValueContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
  },
  modalEnvValue: {
    fontSize: 13,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  copyButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginTop: 4,
  },
  userInfo: {
    marginTop: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
  },
  userInfoText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.3,
  },
});

