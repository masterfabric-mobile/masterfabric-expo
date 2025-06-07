import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

interface ScreenData {
  width: number;
  height: number;
  isLandscape: boolean;
  isTablet: boolean;
}

export function useScreenDimensions(): ScreenData {
  const { width, height } = useWindowDimensions();
  
  const screenData = useMemo(() => ({
    width,
    height,
    isLandscape: width > height,
    isTablet: Math.min(width, height) >= 768,
  }), [width, height]);

  return screenData;
}
