import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';

export const dietaryPreferencesStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: RecipioColors.border,
  },
  headerSide: {
    minWidth: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: RecipioColors.text,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: RecipioColors.text,
    letterSpacing: 0.5,
  },
  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: RecipioColors.cardBackground,
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  pillSelected: {
    backgroundColor: RecipioColors.primaryAccent,
    borderColor: RecipioColors.primaryAccent,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '500',
    color: RecipioColors.text,
  },
  pillTextSelected: {
    color: '#FFFFFF',
  },
  addRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: RecipioColors.cardBackground,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    paddingHorizontal: 14,
    fontSize: 15,
    color: RecipioColors.text,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: RecipioColors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoBox: {
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: RecipioColors.cardBackground,
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  infoText: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
    lineHeight: 20,
  },
  saveButton: {
    marginTop: 28,
    height: 52,
    borderRadius: 12,
    backgroundColor: RecipioColors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
