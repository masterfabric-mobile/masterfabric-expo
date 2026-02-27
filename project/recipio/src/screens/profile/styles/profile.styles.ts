import { StyleSheet } from 'react-native';
import { RecipioColors } from '@/shared/constants/recipio-colors';

export const profileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: RecipioColors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: RecipioColors.border,
  },
  headerSide: {
    minWidth: 40,
    alignItems: 'flex-start',
  },
  headerSideRight: {
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: RecipioColors.text,
  },
  headerButton: {
    padding: 8,
  },
  // User info section
  userSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: RecipioColors.cardBackground,
    borderWidth: 1,
    borderColor: RecipioColors.border,
  },
  avatarEditBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: RecipioColors.primaryAccent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: RecipioColors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
  },
  guestSubtext: {
    fontSize: 14,
    color: RecipioColors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 24,
  },
  // Stats section
  statsSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: RecipioColors.primaryAccent,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: RecipioColors.text,
    marginTop: 4,
    letterSpacing: 0.3,
  },
  // Kitchen Pro
  kitchenProSection: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  kitchenProCard: {
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    overflow: 'hidden',
    flexDirection: 'row',
    padding: 16,
    minHeight: 120,
  },
  kitchenProContent: {
    flex: 1,
    justifyContent: 'space-between',
  },
  kitchenProTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  kitchenProTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: RecipioColors.text,
  },
  kitchenProDescription: {
    fontSize: 13,
    color: RecipioColors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  kitchenProButton: {
    backgroundColor: RecipioColors.primaryAccent,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  kitchenProButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  kitchenProImage: {
    width: 100,
    height: 88,
    borderRadius: 12,
    backgroundColor: RecipioColors.border,
  },
  accountSectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: RecipioColors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  // Settings section
  settingsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  settingsCard: {
    backgroundColor: RecipioColors.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: RecipioColors.border,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: RecipioColors.border,
    gap: 12,
  },
  settingsRowLast: {
    borderBottomWidth: 0,
  },
  settingsRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingsRowIcon: {
    width: 24,
    alignItems: 'center',
  },
  settingsRowLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: RecipioColors.text,
  },
  settingsRowLabelLogout: {
    fontSize: 16,
    fontWeight: '500',
    color: RecipioColors.primaryAccent,
  },
  settingsRowValue: {
    fontSize: 15,
    color: RecipioColors.textSecondary,
  },
  // Sign in (guest)
  actionsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  signInButton: {
    backgroundColor: RecipioColors.primaryAccent,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  signInButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
