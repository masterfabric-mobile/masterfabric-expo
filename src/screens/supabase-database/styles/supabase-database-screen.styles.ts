import { StyleSheet } from 'react-native';

export const supabaseDatabaseScreenStyles = StyleSheet.create({
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  section: {
    gap: 12,
  },
  input: {
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
    fontSize: 14,
    minHeight: 100,
    fontFamily: 'monospace',
    textAlignVertical: 'top',
  },
  inputSingleLine: {
    minHeight: 48,
    textAlignVertical: 'center',
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
  statusText: {
    fontSize: 14,
    marginTop: 4,
  },
  tableList: {
    gap: 8,
  },
  tableItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  tableItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
  },
  queryResultContainer: {
    maxHeight: 300,
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
  },
  queryResultText: {
    fontSize: 12,
    fontFamily: 'monospace',
  },
  tableDataContainer: {
    maxHeight: 400,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  tableCell: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'monospace',
  },
  tableHeader: {
    fontWeight: '600',
    backgroundColor: 'rgba(62, 207, 142, 0.1)',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  crudForm: {
    gap: 12,
  },
  formField: {
    gap: 6,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  formInput: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1.5,
    fontSize: 14,
    minHeight: 44,
  },
  errorText: {
    fontSize: 13,
    color: '#ef4444',
    marginTop: 4,
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});

