import { StyleSheet } from 'react-native';
import { Sizing, typographyHelper } from 'masterfabric-expo-core';

const getTypographyStyle = (fontSize: string, fontWeight: string, lineHeight: string = 'normal') => 
  (typographyHelper as any).fromSizing?.createStyle(Sizing, fontSize, fontWeight, lineHeight) || {};

export const firebaseHelperScreenStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Sizing.padding.m,
    paddingBottom: Sizing.padding.xxl,
    gap: Sizing.gap.m,
  },
  section: {
    gap: Sizing.gap.s,
  },
  card: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.card.borderRadius.m,
    padding: Sizing.padding.s,
    backgroundColor: 'transparent',
  },
  input: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.borderRadius.small,
    padding: Sizing.padding.s,
  },
  divider: {
    height: Sizing.borderWidth.s,
    marginVertical: Sizing.spacing.s,
  },
});


