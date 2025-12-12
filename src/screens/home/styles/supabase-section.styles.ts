import { StyleSheet } from 'react-native';

export const supabaseSectionStyles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  header: {
    marginBottom: 12,
  },
  logoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'nowrap',
  },
  logo: {
    width: 32,
    height: 32,
    marginRight: 10,
    flexShrink: 0,
  },
  headerText: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexShrink: 1,
    flexWrap: 'nowrap',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusDotContainer: {
    position: 'relative',
    width: 12,
    height: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  statusDotPulse: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
  },
  signedInCard: {
    marginTop: 8,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  signedInRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  signedInText: {
    fontSize: 13,
    fontWeight: '500',
  },
  sectionDescription: {
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 18,
  },
  actionsList: {
    flexDirection: 'column',
    gap: 8,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  iconImage: {
    width: 24,
    height: 24,
  },
  iconText: {
    fontSize: 20,
  },
  actionContent: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    opacity: 0.7,
  },
  footer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(62, 207, 142, 0.1)',
  },
  footerParagraph: {
    fontSize: 14,
    lineHeight: 20,
    opacity: 0.8,
    marginBottom: 8,
  },
  footerSlogan: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    opacity: 0.9,
  },
});

