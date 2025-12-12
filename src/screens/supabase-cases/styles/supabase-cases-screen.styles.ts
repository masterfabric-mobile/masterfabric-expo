import { StyleSheet } from 'react-native';

export const supabaseCasesScreenStyles = StyleSheet.create({
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
  statusText: {
    fontSize: 14,
    marginTop: 4,
  },
  casesList: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
});

