import { useWindowDimensions } from 'react-native';
import { Sizing } from '../constants/Sizing';

export const useResponsive = () => {
  const { width } = useWindowDimensions();
  
  const isPhone = width < Sizing.breakpoints.tablet.small;
  const isTablet = width >= Sizing.breakpoints.tablet.small && 
                   width < Sizing.breakpoints.desktop.small;
  const isDesktop = width >= Sizing.breakpoints.desktop.small;
  
  const getSpacing = (phone: number, tablet?: number, desktop?: number) => {
    if (isDesktop && desktop !== undefined) return desktop;
    if (isTablet && tablet !== undefined) return tablet;
    return phone;
  };
  
  return {
    width,
    isPhone,
    isTablet,
    isDesktop,
    getSpacing,
  };
};

