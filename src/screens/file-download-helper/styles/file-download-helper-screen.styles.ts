import { Sizing, typographyHelper } from 'masterfabric-expo-core';
import {
    Platform,
    StyleSheet,
    type TextStyle,
    type ViewStyle,
} from 'react-native';
import {
    BUTTON_DISABLED_OPACITY,
    INPUT_MULTILINE_MIN_HEIGHT,
    LABEL_OPACITY,
    PROGRESS_BAR_BORDER_RADIUS,
    PROGRESS_BAR_HEIGHT,
    RESULT_LINE_HEIGHT,
} from '../constants/file-download-helper.constants';

export const fileDownloadHelperScreenStyles = StyleSheet.create({
  container: {
    flex: Sizing.flexNumber.full,
  } as ViewStyle,
  scrollView: {
    flex: Sizing.flexNumber.full,
  } as ViewStyle,
  scrollContent: {
    padding: Sizing.padding.l,
    paddingBottom: Sizing.padding.xxl,
  } as ViewStyle,
  resultsTitle: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'xl',
      'semibold',
      'normal'
    ) as TextStyle),
    marginTop: Sizing.padding.xl,
    marginBottom: Sizing.padding.m,
  },
  card: {
    paddingVertical: Sizing.padding.m,
    paddingHorizontal: Sizing.padding.l,
    borderRadius: Sizing.card.borderRadius.m,
    marginBottom: Sizing.padding.m,
    borderWidth: Sizing.borderWidth.m,
  } as ViewStyle,
  cardTitle: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'm',
      'semibold',
      'normal'
    ) as TextStyle),
    marginBottom: Sizing.padding.m,
  },
  section: {
    marginBottom: Sizing.padding.m,
    gap: Sizing.spacing.xxs,
  } as ViewStyle,
  sectionGap: {
    marginBottom: Sizing.padding.m,
  } as ViewStyle,
  label: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'xs',
      'medium',
      'normal'
    ) as TextStyle),
    marginBottom: Sizing.spacing.xxs,
    opacity: LABEL_OPACITY,
  },
  input: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.input.borderRadius.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.xs,
    minHeight: Sizing.button.height.medium,
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'm',
      'normal',
      'normal'
    ) as TextStyle),
  },
  inputMultiline: {
    borderWidth: Sizing.borderWidth.s,
    borderRadius: Sizing.input.borderRadius.s,
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.xs,
    minHeight: INPUT_MULTILINE_MIN_HEIGHT,
    textAlignVertical: 'top',
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'm',
      'normal',
      'normal'
    ) as TextStyle),
  },
  pathPreview: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'xs',
      'normal',
      'normal'
    ) as TextStyle),
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginTop: Sizing.spacing.xxs,
    opacity: Sizing.opacity.xl,
  },
  dropdownRow: {
    flexDirection: 'row',
    gap: Sizing.gap.s,
  } as ViewStyle,
  chip: {
    flex: 1,
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    borderRadius: Sizing.input.borderRadius.s,
    borderWidth: Sizing.borderWidth.s,
    minHeight: Sizing.button.height.medium,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  runButtonWrap: {
    marginTop: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
  } as ViewStyle,
  sectionOverline: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'xs',
      'semibold',
      'normal'
    ) as TextStyle),
    textTransform: 'uppercase',
    marginBottom: Sizing.spacing.xxs,
    opacity: Sizing.opacity.xl,
  },
  progressWrap: {
    marginTop: Sizing.padding.m,
    gap: Sizing.gap.s,
  } as ViewStyle,
  statusText: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      's',
      'medium',
      'normal'
    ) as TextStyle),
  },
  statusPill: {
    paddingHorizontal: Sizing.padding.s,
    paddingVertical: Sizing.padding.xs,
    borderRadius: Sizing.input.borderRadius.s,
    alignSelf: 'flex-start',
    marginTop: Sizing.padding.xs,
  } as ViewStyle,
  progressBar: {
    height: PROGRESS_BAR_HEIGHT,
    borderRadius: PROGRESS_BAR_BORDER_RADIUS,
    overflow: 'hidden',
  } as ViewStyle,
  progressFill: {
    height: '100%',
  } as ViewStyle,
  progressStats: {
    marginTop: Sizing.padding.s,
    gap: Sizing.spacing.xxs,
  } as ViewStyle,
  progressStatLine: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'xs',
      'normal',
      'normal'
    ) as TextStyle),
    opacity: Sizing.opacity.xl,
  },
  resultSection: {
    padding: Sizing.padding.m,
    borderRadius: Sizing.card.borderRadius.m,
    marginBottom: Sizing.padding.m,
    gap: Sizing.padding.s,
    borderWidth: Sizing.borderWidth.m,
  } as ViewStyle,
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  } as ViewStyle,
  resultLabel: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      'xs',
      'semibold',
      'normal'
    ) as TextStyle),
    textTransform: 'uppercase',
    opacity: LABEL_OPACITY,
  },
  clearLink: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      's',
      'normal',
      'normal'
    ) as TextStyle),
    opacity: Sizing.opacity.xl,
  },
  resultText: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      's',
      'normal',
      'normal'
    ) as TextStyle),
    lineHeight: RESULT_LINE_HEIGHT,
  },
  errorText: {
    ...(typographyHelper.fromSizing.createStyle(
      Sizing,
      's',
      'normal',
      'normal'
    ) as TextStyle),
    lineHeight: RESULT_LINE_HEIGHT,
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Sizing.padding.s,
    marginTop: Sizing.padding.s,
  } as ViewStyle,
  buttonSecondary: {
    paddingVertical: Sizing.padding.s,
    paddingHorizontal: Sizing.padding.m,
    borderRadius: Sizing.input.borderRadius.s,
    minHeight: Sizing.button.height.medium,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Sizing.padding.s,
  } as ViewStyle,
  buttonDisabled: {
    opacity: BUTTON_DISABLED_OPACITY,
  } as ViewStyle,
  clearCacheSection: {
    marginTop: Sizing.padding.l,
    marginBottom: Sizing.padding.xxl,
  } as ViewStyle,
});
