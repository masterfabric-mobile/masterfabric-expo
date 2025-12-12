import { useScreenDimensions } from '@/src/shared/hooks/use-screen-dimensions';
import { t } from '@/src/shared/i18n';
import {
  Sizing,
  uiSizeHelper,
  useResponsive
} from 'masterfabric-expo-core';
import { useCallback, useEffect } from 'react';
import { UISizePreview, UISizeTestInput, UISizeTestResult } from '../models/ui-size-helper-models';
import { useUISizeHelperStore } from '../store/ui-size-helper-store';

export function useUISizeHelperViewModel() {
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
  } = useUISizeHelperStore();

  const screenData = useScreenDimensions();
  const { isPhone, isTablet, isDesktop } = useResponsive();

  // Update device info when screen dimensions change
  useEffect(() => {
    const deviceType = isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop';
    const width = uiSizeHelper.getScreenWidth();
    const columns = uiSizeHelper.getGridColumnsAuto();
    const baseUnit = uiSizeHelper.getBaseUnit();

    setDeviceInfo({
      deviceType,
      screenWidth: width,
      screenHeight: screenData.height,
      columns,
      baseUnit,
    });
  }, [isPhone, isTablet, isDesktop, screenData.height, setDeviceInfo]);

  // Update preview when test input changes
  useEffect(() => {
    const deviceType = isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop';
    const columns = uiSizeHelper.getGridColumnsAuto();
    const baseUnit = uiSizeHelper.getBaseUnit();

    const previewData: UISizePreview = {
      spacing: Sizing.spacing[testInput.spacingSize],
      padding: Sizing.padding[testInput.paddingSize],
      margin: Sizing.margin[testInput.marginSize],
      gap: Sizing.gap[testInput.gapSize],
      borderRadius: Sizing.borderRadius[testInput.borderRadius],
      borderWidth: Sizing.borderWidth[testInput.borderWidth],
      buttonHeight: Sizing.button.height[testInput.buttonHeight],
      inputHeight: Sizing.input.height[testInput.inputHeight],
      cardPadding: Sizing.card.padding[testInput.cardPadding],
      scrollPadding: Sizing.scroll.padding[testInput.scrollPadding],
      scrollMargin: Sizing.scroll.margin[testInput.scrollMargin],
      deviceType,
      columns,
      baseUnit,
    };

    setPreview(previewData);
  }, [
    testInput.spacingSize,
    testInput.paddingSize,
    testInput.marginSize,
    testInput.gapSize,
    testInput.borderRadius,
    testInput.borderWidth,
    testInput.buttonHeight,
    testInput.inputHeight,
    testInput.cardPadding,
    testInput.scrollPadding,
    testInput.scrollMargin,
    isPhone,
    isTablet,
    isDesktop,
    setPreview,
  ]);

  const runAllTests = useCallback(() => {
    setIsLoading(true);

    const results: UISizeTestResult[] = [];
    const deviceType = isPhone ? 'phone' : isTablet ? 'tablet' : 'desktop';
    const width = uiSizeHelper.getScreenWidth();
    const baseUnit = uiSizeHelper.getBaseUnit();
    const columns = uiSizeHelper.getGridColumnsAuto();

    try {
      // Spacing Functions
      results.push({
        id: 'getSpacing',
        functionName: 'getSpacing',
        input: `size: '${testInput.spacingSize}'`,
        output: uiSizeHelper.getSpacing(testInput.spacingSize),
        description: t('helpers.uiSizeHelper.getSpacing'),
        category: 'spacing',
      });

      results.push({
        id: 'getPadding',
        functionName: 'getPadding',
        input: `size: '${testInput.paddingSize}'`,
        output: uiSizeHelper.getPadding(testInput.paddingSize),
        description: t('helpers.uiSizeHelper.getPadding'),
        category: 'spacing',
      });

      results.push({
        id: 'getMargin',
        functionName: 'getMargin',
        input: `size: '${testInput.marginSize}'`,
        output: uiSizeHelper.getMargin(testInput.marginSize),
        description: t('helpers.uiSizeHelper.getMargin'),
        category: 'spacing',
      });

      // Calculation Functions
      results.push({
        id: 'calculateSpacing',
        functionName: 'calculateSpacing',
        input: `multiplier: 3`,
        output: uiSizeHelper.calculateSpacing(3),
        description: t('helpers.uiSizeHelper.calculateSpacing'),
        category: 'calculation',
      });

      results.push({
        id: 'getBaseUnit',
        functionName: 'getBaseUnit',
        input: '',
        output: baseUnit,
        description: t('helpers.uiSizeHelper.getBaseUnit'),
        category: 'calculation',
      });

      // Responsive Functions
      results.push({
        id: 'getScreenWidth',
        functionName: 'getScreenWidth',
        input: '',
        output: width,
        description: t('helpers.uiSizeHelper.getScreenWidth'),
        category: 'responsive',
      });

      results.push({
        id: 'getDeviceTypeAuto',
        functionName: 'getDeviceTypeAuto',
        input: '',
        output: deviceType,
        description: t('helpers.uiSizeHelper.getDeviceTypeAuto'),
        category: 'device',
      });

      results.push({
        id: 'getGridColumnsAuto',
        functionName: 'getGridColumnsAuto',
        input: '',
        output: columns,
        description: t('helpers.uiSizeHelper.getGridColumnsAuto'),
        category: 'responsive',
      });

      results.push({
        id: 'getResponsiveSpacing',
        functionName: 'getResponsiveSpacing',
        input: `width: ${width}, phone: ${Sizing.padding.m}, tablet: ${Sizing.padding.l}, desktop: ${Sizing.padding.xl}`,
        output: uiSizeHelper.getResponsiveSpacing(width, {
          phone: Sizing.padding.m,
          tablet: Sizing.padding.l,
          desktop: Sizing.padding.xl,
        }),
        description: t('helpers.uiSizeHelper.getResponsiveSpacing'),
        category: 'responsive',
      });

      // Component Sizes
      results.push({
        id: 'getButtonHeight',
        functionName: 'getButtonHeight',
        input: `size: '${testInput.buttonHeight}'`,
        output: Sizing.button.height[testInput.buttonHeight],
        description: t('helpers.uiSizeHelper.getButtonHeight'),
        category: 'spacing',
      });

      results.push({
        id: 'getInputHeight',
        functionName: 'getInputHeight',
        input: `size: '${testInput.inputHeight}'`,
        output: Sizing.input.height[testInput.inputHeight],
        description: t('helpers.uiSizeHelper.getInputHeight'),
        category: 'spacing',
      });

      results.push({
        id: 'getCardPadding',
        functionName: 'getCardPadding',
        input: `size: '${testInput.cardPadding}'`,
        output: Sizing.card.padding[testInput.cardPadding],
        description: t('helpers.uiSizeHelper.getCardPadding'),
        category: 'spacing',
      });
    } catch (error) {
      console.error('Error running UI size helper tests:', error);
    }

    setTestResults(results);
    setIsLoading(false);
  }, [
    testInput,
    isPhone,
    isTablet,
    isDesktop,
    setTestResults,
    setIsLoading,
  ]);

  // Make the test area live: recompute results automatically when inputs change
  useEffect(() => {
    runAllTests();
  }, [runAllTests]);

  const updateTestInput = useCallback((updates: Partial<UISizeTestInput>) => {
    setTestInput((prev) => ({ ...prev, ...updates }));
  }, [setTestInput]);

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

