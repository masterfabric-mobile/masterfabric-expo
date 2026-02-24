import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';
import { Platform } from 'react-native';

export const enterIngredientsStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'web' ? 12 : 44,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: RecipioColors.border,
  },
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: RecipioColors.text,
  },
  clearBtn: {
    padding: 8,
  },
  clearBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: RecipioColors.primaryAccent,
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  hint: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    paddingHorizontal: 16,
    fontSize: 16,
    color: RecipioColors.text,
  },
  addBtn: {
    height: 48,
    paddingHorizontal: 20,
    backgroundColor: RecipioColors.primaryAccent,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  ingredientsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ingredientsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 0.5,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 32,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 20,
    paddingVertical: 8,
    paddingLeft: 14,
    paddingRight: 8,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    gap: 6,
  },
  tagText: {
    fontSize: 14,
    color: RecipioColors.text,
    fontWeight: '500',
  },
  tagRemove: {
    padding: 4,
  },
  cta: {
    height: 52,
    backgroundColor: RecipioColors.primaryAccent,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyListHint: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  suggestionSection: {
    marginBottom: 28,
  },
  suggestionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  suggestionChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  suggestionChipText: {
    fontSize: 14,
    color: RecipioColors.text,
    fontWeight: '500',
  },
});
