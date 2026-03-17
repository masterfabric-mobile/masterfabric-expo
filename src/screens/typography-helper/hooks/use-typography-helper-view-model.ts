import { useScreenDimensions } from '@/src/shared/hooks/use-screen-dimensions';
import { useTypography } from '@/src/shared/hooks/use-typography';
import { t } from '@/src/shared/i18n';
import { isBoldFontWeight, isValidFontWeight, normalizeFontSize, normalizeLetterSpacing } from 'masterfabric-expo-core';
import { useCallback, useEffect } from 'react';
import { TypographyPreview, TypographyTestInput, TypographyTestResult } from '../models/typography-helper-models';
import { useTypographyHelperStore } from '../store/typography-helper-store';

export function useTypographyHelperViewModel() {
  const {
    testInput,
    testResults,
    isLoading,
    preview,
    deviceInfo,
    setTestInput,
    setTestResults,
    setIsLoading,
    setPreview,
    setDeviceInfo,
  } = useTypographyHelperStore();

  const screenData = useScreenDimensions();
  const {
    fontScale,
    screenWidth,
    scaleFontSize,
    scaleFontSizeByScreen,
    calculateAccessibleFontSize,
    calculateLineHeight,
    calculateTightLineHeight,
    calculateNormalLineHeight,
    calculateRelaxedLineHeight,
    calculateLetterSpacing,
    convertFontWeightToNumeric,
    convertFontWeightToString,
    normalizeFontWeight,
  } = useTypography();

  // Update device info when screen dimensions or font scale changes
  useEffect(() => {
    setDeviceInfo({
      fontScale,
      screenWidth,
      screenHeight: screenData.height,
    });
  }, [fontScale, screenWidth, screenData.height, setDeviceInfo]);

  // Update preview when test input changes
  useEffect(() => {
    const scaledFontSize = scaleFontSize(testInput.fontSize, testInput.fontScale || fontScale);
    const lineHeight = calculateLineHeight(scaledFontSize, testInput.lineHeightMultiplier || 1.5);
    const letterSpacing = testInput.letterSpacing !== undefined
      ? calculateLetterSpacing(scaledFontSize, testInput.letterSpacing)
      : 0;

    const fontWeight = normalizeFontWeight((testInput.fontWeight as any) ?? '400');
    const textDecoration = testInput.textDecoration?.join(' ') || 'none';

    const previewData: TypographyPreview = {
      fontSize: scaledFontSize,
      lineHeight,
      letterSpacing,
      fontWeight: fontWeight as any,
      fontStyle: testInput.fontStyle || 'normal',
      fontFamily: testInput.fontFamily || 'System',
      textDecoration,
      textTransform: testInput.textTransform || 'none',
      previewText: testInput.text || 'The quick brown fox jumps over the lazy dog',
      textColor: testInput.textColor || '#000000',
      completeStyle: {
        fontSize: scaledFontSize,
        lineHeight,
        letterSpacing,
        fontWeight: fontWeight as any,
        fontStyle: testInput.fontStyle || 'normal',
        fontFamily: testInput.fontFamily,
        textDecorationLine: textDecoration === 'none' ? 'none' : textDecoration as any,
        textTransform: testInput.textTransform || 'none',
      },
    };

    setPreview(previewData);
  }, [testInput, fontScale, scaleFontSize, calculateLineHeight, calculateLetterSpacing, normalizeFontWeight, setPreview]);

  const runAllTests = useCallback(() => {
    setIsLoading(true);

    const results: TypographyTestResult[] = [];
    const {
      fontSize,
      fontScale: customFontScale = fontScale,
      lineHeightMultiplier = 1.5,
      letterSpacing = 0,
      fontWeight = 400,
    } = testInput;

    try {
      // Font Scaling Functions
      results.push({
        id: 'scaleFontSize',
        functionName: 'scaleFontSize',
        input: `fontSize: ${fontSize}, fontScale: ${customFontScale}`,
        output: scaleFontSize(fontSize, customFontScale),
        description: t('helpers.typographyHelper.scaleFontSize'),
      });

      results.push({
        id: 'scaleFontSizeByScreen',
        functionName: 'scaleFontSizeByScreen',
        input: `fontSize: ${fontSize}, designWidth: 375, screenWidth: ${screenWidth}`,
        output: scaleFontSizeByScreen(fontSize, 375),
        description: t('helpers.typographyHelper.scaleFontSizeByScreen'),
      });

      results.push({
        id: 'normalizeFontSize',
        functionName: 'normalizeFontSize',
        input: `fontSize: ${fontSize * 1.5}, min: 12, max: 48`,
        output: normalizeFontSize(fontSize * 1.5, 12, 48),
        description: t('helpers.typographyHelper.normalizeFontSize'),
      });

      results.push({
        id: 'calculateAccessibleFontSize',
        functionName: 'calculateAccessibleFontSize',
        input: `fontSize: ${fontSize}, fontScale: ${customFontScale}, min: 12, max: 48`,
        output: calculateAccessibleFontSize(fontSize, customFontScale, 12, 48),
        description: t('helpers.typographyHelper.calculateAccessibleFontSize'),
      });

      // Line Height Calculations
      results.push({
        id: 'calculateLineHeight',
        functionName: 'calculateLineHeight',
        input: `fontSize: ${fontSize}, multiplier: ${lineHeightMultiplier}`,
        output: calculateLineHeight(fontSize, lineHeightMultiplier),
        description: t('helpers.typographyHelper.calculateLineHeight'),
      });

      results.push({
        id: 'calculateTightLineHeight',
        functionName: 'calculateTightLineHeight',
        input: `fontSize: ${fontSize}`,
        output: calculateTightLineHeight(fontSize),
        description: t('helpers.typographyHelper.calculateTightLineHeight'),
      });

      results.push({
        id: 'calculateNormalLineHeight',
        functionName: 'calculateNormalLineHeight',
        input: `fontSize: ${fontSize}`,
        output: calculateNormalLineHeight(fontSize),
        description: t('helpers.typographyHelper.calculateNormalLineHeight'),
      });

      results.push({
        id: 'calculateRelaxedLineHeight',
        functionName: 'calculateRelaxedLineHeight',
        input: `fontSize: ${fontSize}`,
        output: calculateRelaxedLineHeight(fontSize),
        description: t('helpers.typographyHelper.calculateRelaxedLineHeight'),
      });

      // Letter Spacing Functions
      results.push({
        id: 'calculateLetterSpacing',
        functionName: 'calculateLetterSpacing',
        input: `fontSize: ${fontSize}, tracking: ${letterSpacing}`,
        output: calculateLetterSpacing(fontSize, letterSpacing).toFixed(2),
        description: t('helpers.typographyHelper.calculateLetterSpacing'),
      });

      results.push({
        id: 'normalizeLetterSpacing',
        functionName: 'normalizeLetterSpacing',
        input: `tracking: ${letterSpacing}`,
        output: normalizeLetterSpacing(letterSpacing),
        description: t('helpers.typographyHelper.normalizeLetterSpacing'),
      });

      // Font Weight Utilities
      results.push({
        id: 'convertFontWeightToNumeric',
        functionName: 'convertFontWeightToNumeric',
        input: `fontWeight: "${fontWeight}"`,
        output: convertFontWeightToNumeric(fontWeight),
        description: t('helpers.typographyHelper.convertFontWeightToNumeric'),
      });

      results.push({
        id: 'convertFontWeightToString',
        functionName: 'convertFontWeightToString',
        input: `fontWeight: ${convertFontWeightToNumeric(fontWeight)}`,
        output: convertFontWeightToString(convertFontWeightToNumeric(fontWeight)),
        description: t('helpers.typographyHelper.convertFontWeightToString'),
      });

      results.push({
        id: 'isValidFontWeight',
        functionName: 'isValidFontWeight',
        input: `fontWeight: "${fontWeight}"`,
        output: isValidFontWeight(fontWeight) ? 'true' : 'false',
        description: t('helpers.typographyHelper.isValidFontWeight'),
      });

      results.push({
        id: 'normalizeFontWeight',
        functionName: 'normalizeFontWeight',
        input: `fontWeight: "${fontWeight}"`,
        output: normalizeFontWeight(fontWeight),
        description: t('helpers.typographyHelper.normalizeFontWeight'),
      });

      results.push({
        id: 'isBoldFontWeight',
        functionName: 'isBoldFontWeight',
        input: `fontWeight: "${fontWeight}"`,
        output: isBoldFontWeight(fontWeight) ? 'true' : 'false',
        description: t('helpers.typographyHelper.isBoldFontWeight'),
      });

    } catch (error) {
      console.error('Error running typography helper tests:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  }, [
    testInput,
    fontScale,
    screenWidth,
    scaleFontSize,
    scaleFontSizeByScreen,
    calculateAccessibleFontSize,
    calculateLineHeight,
    calculateTightLineHeight,
    calculateNormalLineHeight,
    calculateRelaxedLineHeight,
    calculateLetterSpacing,
    convertFontWeightToNumeric,
    convertFontWeightToString,
    normalizeFontWeight,
    setTestResults,
    setIsLoading,
  ]);

  const updateTestInput = useCallback((updates: Partial<TypographyTestInput>) => {
    setTestInput({ ...testInput, ...updates });
  }, [testInput, setTestInput]);

  return {
    testInput,
    testResults,
    isLoading,
    preview,
    deviceInfo,
    runAllTests,
    updateTestInput,
  };
}

